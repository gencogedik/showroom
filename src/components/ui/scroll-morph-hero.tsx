"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const TOTAL_IMAGES = 20;
const IMAGES = Array.from({ length: 20 }, (_, i) => `/images/${i + 1}.png`);

export default function IntroAnimation() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const rotation = useMotionValue(0);
    const [wonDiscount, setWonDiscount] = useState<number | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const radius = isMobile ? 400 : 700;
    const cardWidth = isMobile ? 120 : 180;
    const cardHeight = isMobile ? 170 : 260;
    const anglePerItem = 360 / TOTAL_IMAGES;

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWonDiscount(null);

        const targetIndex = Math.floor(Math.random() * TOTAL_IMAGES);
        const extraSpins = 5; 
        const currentRotation = rotation.get();
        const baseRotation = currentRotation - (currentRotation % 360);
        
        // We want item 'targetIndex' to be at 0 degrees relative to camera.
        // Item i is placed at i * anglePerItem.
        // So container needs to be at - (targetIndex * anglePerItem)
        const targetRotation = baseRotation - (360 * extraSpins) - (targetIndex * anglePerItem);

        animate(rotation, targetRotation, {
            type: "spring",
            stiffness: 30,
            damping: 15,
            mass: 2,
            onComplete: () => {
                const discount = 20;
                useCartStore.getState().setGlobalDiscount(discount, 15 * 60 * 1000);
                setWonDiscount(discount);

                setTimeout(() => {
                    setIsSpinning(false);
                    router.push(`/shop/${targetIndex + 1}`);
                }, 1500);
            }
        });
    };

    // Pan (Drag) logic
    const handlePan = (e: any, info: any) => {
        if (isSpinning) return;
        rotation.set(rotation.get() + info.delta.x * 0.5);
    };

    // Robot Mascot Animation
    // We map the rotation to a horizontal movement for the robot
    const robotX = useTransform(rotation, v => {
        const normalized = ((Math.abs(v) % 360) / 360); // 0 to 1
        // Move robot back and forth between -100px and 100px
        return Math.sin(normalized * Math.PI * 2) * (isMobile ? 100 : 250);
    });

    return (
        <div 
            ref={containerRef} 
            className="relative w-full h-screen bg-[#e5e5e5] overflow-hidden flex flex-col items-center justify-between font-mono" 
            style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
            {/* Top Area: Spin Button */}
            <div className="z-50 mt-24 md:mt-32 flex flex-col items-center pointer-events-auto">
                <button 
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className={`px-8 py-4 text-3xl md:text-5xl font-black uppercase tracking-widest border-4 border-black shadow-[8px_8px_0_0_#000] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none ${isSpinning ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-black hover:text-white'}`}
                >
                    {isSpinning ? 'KARIŞIYOR...' : 'ÇARKI ÇEVİR'}
                </button>
                {wonDiscount !== null && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-black text-white px-6 py-2 border-2 border-black font-bold text-xl uppercase animate-bounce"
                    >
                        {wonDiscount > 0 ? `🎉 %${wonDiscount} İNDİRİM KAZANDIN! 🎉` : 'MAALESEF BOŞ ÇIKTI!'}
                    </motion.div>
                )}
            </div>

            {/* Middle Area: 3D Cylinder Carousel */}
            <div className="flex-1 w-full flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
                <motion.div
                    className="relative pointer-events-auto cursor-grab active:cursor-grabbing"
                    style={{ 
                        transformStyle: 'preserve-3d', 
                        rotateY: rotation,
                        width: cardWidth,
                        height: cardHeight
                    }}
                    onPan={handlePan}
                >
                    {IMAGES.map((src, i) => {
                        const itemAngle = i * anglePerItem;
                        return (
                            <div 
                                key={i}
                                className="absolute top-0 left-0 border-4 border-black bg-white shadow-[4px_4px_0_0_#000] overflow-hidden"
                                style={{
                                    width: cardWidth,
                                    height: cardHeight,
                                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                                    backfaceVisibility: 'hidden'
                                }}
                            >
                                <Image 
                                    src={src} 
                                    alt={`Case ${i+1}`} 
                                    fill 
                                    sizes="(max-width: 768px) 120px, 180px"
                                    className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Bottom Area: Mascot and Line */}
            <div className="w-full h-32 relative flex flex-col justify-end pb-8 overflow-hidden pointer-events-none">
                {/* Horizontal Line */}
                <div className="w-full h-1 bg-black absolute bottom-8 left-0"></div>
                
                {/* Mascot */}
                <motion.div 
                    className="absolute bottom-8 left-1/2 -ml-6 w-12 h-12 flex flex-col items-center justify-end"
                    style={{ x: robotX }}
                >
                    {/* Tiny Brutalist SVG Robot */}
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="12" y="16" width="24" height="24" fill="black" />
                        <rect x="16" y="20" width="16" height="8" fill="white" />
                        <circle cx="20" cy="24" r="2" fill="black" className={isSpinning ? "animate-ping" : ""} />
                        <circle cx="28" cy="24" r="2" fill="black" className={isSpinning ? "animate-ping" : ""} />
                        {/* Antenna */}
                        <line x1="24" y1="16" x2="24" y2="8" stroke="black" strokeWidth="2" />
                        <circle cx="24" cy="6" r="3" fill="#ff0000" className={isSpinning ? "animate-pulse" : ""} />
                        {/* Wheels */}
                        <circle cx="16" cy="42" r="4" fill="black" />
                        <circle cx="32" cy="42" r="4" fill="black" />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}
