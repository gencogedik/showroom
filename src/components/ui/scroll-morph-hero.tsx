"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
    onClick: () => void;
    isSelected: boolean;
    isAnySelected: boolean;
}

const IMG_WIDTH = 120;
const IMG_HEIGHT = 170;

function FlipCard({
    src,
    index,
    total,
    target,
    onClick,
    isSelected,
    isAnySelected
}: FlipCardProps) {
    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
                zIndex: isSelected ? 50 : 10,
            }}
            transition={{
                type: "spring",
                stiffness: isSelected ? 60 : 40,
                damping: isSelected ? 12 : 15,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="cursor-pointer group"
            onClick={onClick}
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={!isAnySelected ? { rotateY: 180 } : undefined}
                animate={isSelected ? { rotateY: 0 } : undefined}
            >
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden bg-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] transition-shadow duration-300 flex items-center justify-center"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className={`h-full w-full object-cover transition-all duration-1000 ${
                            isSelected 
                                ? "filter-none scale-100" 
                                : "max-md:filter-none md:blur-[1px] md:brightness-90 md:contrast-[1.1] md:group-hover:filter-none md:group-hover:scale-110" 
                        }`}
                    />
                    {!isSelected && (
                        <div className="absolute inset-0 opacity-20 md:opacity-40 pointer-events-none hidden md:block" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                    )}
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden bg-[#c0c0c0] flex flex-col items-center justify-center p-4 border-2 border-black shadow-[4px_4px_0_0_#000]"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-xs font-black text-black uppercase tracking-widest font-mono">TEXTURE</p>
                        <div className="w-full h-[2px] bg-black my-2" />
                        <p className="text-[10px] font-bold text-black uppercase font-mono tracking-tighter">İncele</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;
const IMAGES = Array.from({ length: 20 }, (_, i) => `/images/${i + 1}.jpg`);

export default function IntroAnimation() {
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setContainerSize({ width, height: entry.contentRect.height });
                setIsMobileDevice(width < 768);
            }
        };
        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);
        const initialWidth = containerRef.current.offsetWidth;
        setContainerSize({
            width: initialWidth,
            height: containerRef.current.offsetHeight,
        });
        setIsMobileDevice(initialWidth < 768);
        return () => observer.disconnect();
    }, []);

    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (selectedImage !== null) return; 
            e.preventDefault();
            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        let touchStartX = 0;
        let touchStartY = 0;
        let lastScroll = 0;
        
        const handleTouchStart = (e: TouchEvent) => {
            if (selectedImage !== null) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            lastScroll = scrollRef.current;
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (selectedImage !== null) return;
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchStartX - touchX;
            const deltaY = touchStartY - touchY;
            
            const primaryDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
            
            // Slow down the touch scroll drastically for a heavy wheel feel
            const newScroll = Math.min(Math.max(lastScroll + primaryDelta * 0.8, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
            
            if (Math.abs(primaryDelta) > 5) {
                e.preventDefault();
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll, selectedImage]);

    // Map scroll strictly from 0 to 2500 to a normalized progress 0 to 1
    const scrollProgress = useTransform(virtualScroll, [0, 2500], [0, 1]); 
    const smoothScrollProgress = useSpring(scrollProgress, { stiffness: 40, damping: 20 });
    
    // Logo Reveal Logic exactly after rotation finishes (2500)
    const logoOpacity = useTransform(virtualScroll, [2500, 2800], [0, 1]);
    const logoScale = useTransform(virtualScroll, [2500, 2800], [0.5, 1]);
    const logoY = useTransform(virtualScroll, [2500, 2800], [50, 0]);
    // Fade out text gradually as we scroll towards the end
    const introTextOpacity = useTransform(virtualScroll, [1500, 2500], [1, 0]);

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    const scatterOutPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 4000,
            y: (Math.random() - 0.5) * 4000,
            rotation: (Math.random() - 0.5) * 360,
            scale: 0.5,
            opacity: 0,
        }));
    }, []);

    const [progressValue, setProgressValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeRotate = smoothScrollProgress.on("change", setProgressValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothScrollProgress, smoothMouseX]);

    const handleImageClick = (index: number) => {
        setSelectedImage(prev => prev === index ? null : index);
    };

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[#e5e5e5] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            {/* Background Overlay when zoomed */}
            {selectedImage !== null && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-40 bg-white/60 backdrop-blur-md cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                />
            )}

            {/* Vertical Scroll Indicators */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
                <p className="text-black font-black font-mono tracking-[0.5em] text-xs" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    AŞAĞI KAYDIRIN
                </p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
                <p className="text-black font-black font-mono tracking-[0.5em] text-xs" style={{ writingMode: 'vertical-rl' }}>
                    AŞAĞI KAYDIRIN
                </p>
            </div>

            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text (Fades out when scrolling down) */}
                <motion.div
                    style={{ opacity: introTextOpacity }}
                    className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 w-full px-6"
                >
                    <div className="flex justify-center items-center mb-6">
                        <img src="/logo.png" alt="Shuffle Case Logo" className="h-24 md:h-48 object-contain drop-shadow-[4px_4px_0_rgba(192,192,192,1)] invert" />
                    </div>
                    
                    <h2 className="text-3xl md:text-7xl font-black tracking-tighter text-black mb-2 md:mb-4 font-mono uppercase" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                        Dokuyu Hisset
                    </h2>
                    <p className="text-xs md:text-xl text-black max-w-xl font-bold bg-[#c0c0c0] p-2 border-2 border-black inline-block shadow-[4px_4px_0_0_#000]">
                        Gençler için yeni tarz, özel baskılar ve öne çıkan dokular.
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full mt-32 md:mt-0">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (selectedImage !== null) {
                            if (selectedImage === i) {
                                // Zoomed state
                                const zoomScale = isMobileDevice ? 2.5 : 3.5;
                                target = { x: 0, y: 0, rotation: 0, scale: zoomScale, opacity: 1 };
                            } else {
                                // Scatter others out
                                target = scatterOutPositions[i];
                            }
                        } else {
                            // Immediate Arc Logic (No intro phase)
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            // Adjusted radius for better vertical screen coverage (approx 80% view)
                            const arcRadius = baseRadius * (isMobileDevice ? 1.5 : 1.1); 
                            
                            // Move apex higher to center the arc more vertically on mobile
                            const arcApexY = containerSize.height * (isMobileDevice ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;
                            
                            // Spread items wide on mobile so only a few fit in the screen viewport
                            const spreadAngle = isMobileDevice ? 240 : 130;
                            // Apex is at -90. The first item should start at apex.
                            const startAngle = -90;
                            const step = spreadAngle / (TOTAL_IMAGES - 1);
                            
                            // Math lock: Progress goes 0 -> 1. Rotation strictly goes 0 -> spreadAngle.
                            // This ensures item 20 stops exactly at the apex.
                            const boundedRotation = progressValue * spreadAngle; 
                            
                            // Subtract boundedRotation so we slide leftwards and bring rightmost items to apex
                            let currentArcAngle = startAngle + (i * step) - boundedRotation;
                            
                            const arcRad = (currentArcAngle * Math.PI) / 180;
                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                // Massive scale on mobile so they appear huge and clear
                                scale: isMobileDevice ? 2.5 : 1.8,
                            };

                            target = {
                                x: arcPos.x,
                                y: arcPos.y,
                                rotation: arcPos.rotation,
                                scale: arcPos.scale,
                                opacity: 1,
                            };
                        }

                        // Fade out images slightly when logo appears
                        if (selectedImage === null) {
                            const currentScroll = virtualScroll.get();
                            if (currentScroll > 2600) {
                                const fadeProgress = (currentScroll - 2600) / 300; 
                                target.opacity = Math.max(0, 1 - fadeProgress);
                                target.scale = target.scale * (1 - fadeProgress * 0.5); 
                            }
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                target={target}
                                onClick={() => handleImageClick(i)}
                                isSelected={selectedImage === i}
                                isAnySelected={selectedImage !== null}
                            />
                        );
                    })}
                </div>

                {/* End of Scroll Logo Reveal */}
                <motion.div
                    style={{ opacity: logoOpacity, scale: logoScale, y: logoY }}
                    className="absolute z-20 flex flex-col items-center justify-center pointer-events-auto"
                >
                    <Link href="/shop" className="group flex flex-col items-center transition-transform hover:scale-110 active:scale-95">
                        <div className="w-40 h-40 md:w-64 md:h-64 bg-[#c0c0c0] rounded-full border-4 border-black flex items-center justify-center shadow-[8px_8px_0_0_#000] relative overflow-hidden">
                            <svg className="w-24 h-24 md:w-32 md:h-32 text-black animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
                            </svg>
                            <span className="absolute text-xl md:text-3xl font-black text-white mix-blend-difference uppercase font-mono tracking-tighter">
                                ENTER
                            </span>
                        </div>
                        <div className="mt-8 bg-black text-white px-8 py-3 font-mono font-bold uppercase tracking-widest text-lg md:text-xl group-hover:bg-[#ff0000] transition-colors border-2 border-black">
                            Mağazaya Git
                        </div>
                    </Link>
                </motion.div>
                
            </div>
        </div>
    );
}
