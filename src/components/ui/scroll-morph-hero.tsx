"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
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
    phase,
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
                animate={isSelected ? { rotateY: 0 } : undefined} // Force front if selected
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden bg-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] transition-shadow duration-300"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* The Image */}
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className={`h-full w-full object-cover transition-all duration-1000 ${
                            isSelected 
                                ? "filter-none scale-100" // Pure colors when zoomed
                                : "max-md:filter-none md:blur-[1px] md:brightness-90 md:contrast-[1.1] md:group-hover:filter-none md:group-hover:scale-110" 
                        }`}
                    />
                    {/* Optional grain overlay for desktop only (CSS noise) */}
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
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
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
            if (selectedImage !== null) return; // Disable scroll when zoomed
            e.preventDefault();
            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Touch interactions
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
            
            // On mobile, horizontal swipe spins the wheel
            // Fallback to vertical swipe just in case
            const deltaX = touchStartX - touchX;
            const deltaY = touchStartY - touchY;
            
            // Use whichever delta is larger to drive the scroll, but horizontal is preferred for the wheel feel.
            const primaryDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
            
            const newScroll = Math.min(Math.max(lastScroll + primaryDelta * 3, 0), MAX_SCROLL); // multiplier for speed
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
            
            // Prevent default scrolling only if we are interacting with the wheel significantly
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

    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
    const scrollRotate = useTransform(virtualScroll, [600, 2600], [0, 360]); // End rotation earlier to leave room for logo
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });
    
    // Logo Reveal Logic
    const logoOpacity = useTransform(virtualScroll, [2600, 2900], [0, 1]);
    const logoScale = useTransform(virtualScroll, [2600, 2900], [0.5, 1]);
    const logoY = useTransform(virtualScroll, [2600, 2900], [50, 0]);
    // Fade out text when logo appears
    const introTextOpacity = useTransform(virtualScroll, [2500, 2700], [1, 0]);

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

    useEffect(() => {
        // Fast forward intro on mobile
        const isMobile = window.innerWidth < 768;
        const timer1 = setTimeout(() => setIntroPhase("line"), isMobile ? 100 : 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), isMobile ? 300 : 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    const scatterOutPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 4000,
            y: (Math.random() - 0.5) * 4000,
            rotation: (Math.random() - 0.5) * 360,
            scale: 0.5,
            opacity: 0,
        }));
    }, []);

    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    
    // Shift content up dynamically based on device size so it doesn't overlap the arc
    const textTargetY = isMobileDevice ? -50 : 0;
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, textTargetY]);
    
    // Combine content opacity with logo reveal fade out
    const finalContentOpacity = useTransform(() => {
        return contentOpacity.get() * introTextOpacity.get();
    });

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

            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 w-full px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0 } : { opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="text-4xl md:text-8xl font-black tracking-tighter text-black uppercase font-mono"
                        style={{ textShadow: '4px 4px 0px #c0c0c0' }}
                    >
                        SHUFFLE CASE
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-6 text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.4em] text-black uppercase bg-[#c0c0c0] px-4 py-1 border-2 border-black"
                    >
                        {isMobileDevice ? "Kaydırarak Keşfet" : "Aşağı Kaydırın"}
                    </motion.p>
                </div>

                {/* Arc Active Content */}
                <motion.div
                    style={{ opacity: finalContentOpacity, y: contentY }}
                    className={`absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6 w-full ${isMobileDevice ? 'top-[5%]' : 'top-[12%]'}`}
                >
                    <h2 className="text-3xl md:text-7xl font-black tracking-tighter text-black mb-2 md:mb-4 font-mono uppercase" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                        Dokuyu Hisset
                    </h2>
                    <p className="text-xs md:text-xl text-black max-w-xl font-bold bg-[#c0c0c0] p-2 border-2 border-black inline-block shadow-[4px_4px_0_0_#000]">
                        Gençler için yeni tarz, özel baskılar ve öne çıkan dokular.
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (selectedImage !== null) {
                            if (selectedImage === i) {
                                // Zoomed state (scaled differently on mobile)
                                const zoomScale = isMobileDevice ? 2.5 : 3.5;
                                target = { x: 0, y: 0, rotation: 0, scale: zoomScale, opacity: 1 };
                            } else {
                                // Scatter others out
                                target = scatterOutPositions[i];
                            }
                        } else {
                            // Normal Scroll Logic
                            if (introPhase === "scatter") {
                                target = scatterPositions[i];
                            } else if (introPhase === "line") {
                                const lineSpacing = 70;
                                const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                                const lineX = i * lineSpacing - lineTotalWidth / 2;
                                target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                            } else {
                                const minDimension = Math.min(containerSize.width, containerSize.height);
                                const circleRadius = Math.min(minDimension * 0.35, 350);
                                const circleAngle = (i / TOTAL_IMAGES) * 360;
                                const circleRad = (circleAngle * Math.PI) / 180;
                                const circlePos = {
                                    x: Math.cos(circleRad) * circleRadius,
                                    y: Math.sin(circleRad) * circleRadius,
                                    rotation: circleAngle + 90,
                                };

                                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                                const arcRadius = baseRadius * (isMobileDevice ? 1.6 : 1.1); // Flatter arc on mobile
                                
                                // Push the arc center far lower on mobile so it stays at the bottom
                                const arcApexY = containerSize.height * (isMobileDevice ? 0.45 : 0.25);
                                const arcCenterY = arcApexY + arcRadius;
                                
                                const spreadAngle = isMobileDevice ? 80 : 130;
                                const startAngle = -90 - (spreadAngle / 2);
                                const step = spreadAngle / (TOTAL_IMAGES - 1);
                                const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                                const maxRotation = spreadAngle * 0.8;
                                const boundedRotation = -scrollProgress * maxRotation;
                                const currentArcAngle = startAngle + (i * step) + boundedRotation;
                                const arcRad = (currentArcAngle * Math.PI) / 180;
                                const arcPos = {
                                    x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                    y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                    rotation: currentArcAngle + 90,
                                    scale: isMobileDevice ? 1.2 : 1.8,
                                };

                                target = {
                                    x: lerp(circlePos.x, arcPos.x, morphValue),
                                    y: lerp(circlePos.y, arcPos.y, morphValue),
                                    rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                    scale: lerp(1, arcPos.scale, morphValue),
                                    opacity: 1,
                                };
                            }
                        }

                        // Fade out images slightly when logo appears, unless selected
                        if (selectedImage === null) {
                            const currentScroll = virtualScroll.get();
                            if (currentScroll > 2600) {
                                const fadeProgress = (currentScroll - 2600) / 300; // 0 to 1
                                target.opacity = Math.max(0, 1 - fadeProgress);
                                target.scale = target.scale * (1 - fadeProgress * 0.5); // Shrink slightly
                            }
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
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
                            {/* Star shape for Y2K feel */}
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
