"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

const SEGMENTS = [
    { label: "ŞANSINA KÜSTÜN", color: "#c0c0c0", discount: 0 },
    { label: "%15 İNDİRİM", color: "#ff0000", discount: 15 },
    { label: "%10 İNDİRİM", color: "#ffffff", discount: 10 },
    { label: "ŞANSINA KÜSTÜN", color: "#c0c0c0", discount: 0 },
    { label: "%20 İNDİRİM", color: "#ff0000", discount: 20 },
    { label: "KARGO BEDAVA", color: "#ffffff", discount: 10 } // simplified to 10% for now
];

export function SpinWheel() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<typeof SEGMENTS[0] | null>(null);
    const setGlobalDiscount = useCartStore(state => state.setGlobalDiscount);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Persist spin state locally so they can't just refresh
    useEffect(() => {
        const spun = localStorage.getItem('shuffle_has_spun');
        if (spun === 'true') {
            setHasSpun(true);
        }
    }, []);

    const spin = () => {
        if (isSpinning || hasSpun) return;
        setIsSpinning(true);
        
        // Ses efektini çal
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e: any) => console.error("Audio failed:", e));
        }
        
        // Rig the wheel to ALWAYS land on 20% (index 4)
        const segmentIndex = 4;
        const segmentAngle = 360 / SEGMENTS.length;
        
        // Calculate rotation needed to land on segmentIndex.
        // The pointer is at the top (0 degrees). We rotate the wheel so the middle of the segment is at the top.
        // We add extra spins (e.g., 5 full spins = 1800 degrees) for effect.
        const extraSpins = 5 * 360;
        const targetRotation = extraSpins + (360 - (segmentIndex * segmentAngle)) - (segmentAngle / 2);
        
        setRotation(prev => prev + targetRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setHasSpun(true);
            setResult(SEGMENTS[segmentIndex]);
            localStorage.setItem('shuffle_has_spun', 'true');
            
            if (SEGMENTS[segmentIndex].discount > 0) {
                setGlobalDiscount(SEGMENTS[segmentIndex].discount, 15 * 60 * 1000); // 15 mins
            }
        }, 5000); // 5s spin duration
    };

    if (hasSpun && !isOpen) return null; // Don't show FAB if already spun

    return (
        <>
            <audio ref={audioRef} src="/sounds/spin-sound.mp3" preload="auto" />
            
            {/* FAB */}
            {!isOpen && !hasSpun && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-red-500 text-white p-4 rounded-full border-4 border-black shadow-[8px_8px_0_0_#000] hover:scale-110 active:scale-95 transition-transform flex items-center justify-center animate-bounce"
                >
                    <span className="text-3xl">🎁</span>
                </button>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="bg-[#e5e5e5] w-full max-w-lg border-4 border-black shadow-[16px_16px_0_0_#ff0000] p-8 relative flex flex-col items-center" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                            <button 
                                onClick={() => !isSpinning && setIsOpen(false)}
                                className="absolute top-4 right-4 text-3xl font-black hover:text-red-500"
                            >
                                &times;
                            </button>
                            
                            <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-2 leading-tight">ŞANSINI DENE</h2>
                            <p className="text-center font-bold mb-8 bg-black text-white px-2 py-1">Çevir ve 15 dakikalık gizli indirimi kazan!</p>

                            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
                                {/* Pointer */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-black drop-shadow-[2px_2px_0_#ff0000]"></div>
                                
                                {/* Wheel */}
                                <div 
                                    className="w-full h-full rounded-full border-8 border-black overflow-hidden relative shadow-[8px_8px_0_0_#000]"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        transition: 'transform 5s cubic-bezier(0.25, 0.1, 0.15, 1)'
                                    }}
                                >
                                    {/* Slices */}
                                    {SEGMENTS.map((segment, i) => {
                                        const angle = 360 / SEGMENTS.length;
                                        const skewY = 90 - angle;
                                        return (
                                            <div 
                                                key={`slice-${i}`}
                                                className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left border border-black"
                                                style={{
                                                    backgroundColor: segment.color,
                                                    transform: `rotate(${i * angle}deg) skewY(${skewY}deg)`
                                                }}
                                            />
                                        );
                                    })}
                                    
                                    {/* Labels */}
                                    {SEGMENTS.map((segment, i) => {
                                        const angle = 360 / SEGMENTS.length;
                                        // The right edge (3 o'clock) points to the center of the slice
                                        const rotation = (i * angle) + (angle / 2) - 90;
                                        return (
                                            <div 
                                                key={`label-${i}`}
                                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                                style={{ transform: `rotate(${rotation}deg)` }}
                                            >
                                                <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2">
                                                    <span 
                                                        className="font-black text-[10px] md:text-[11px] uppercase tracking-tighter"
                                                        style={{
                                                            color: segment.color === '#000000' || segment.color === '#ff0000' ? 'white' : 'black',
                                                        }}
                                                    >
                                                        {segment.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {result ? (
                                <div className="text-center animate-bounce">
                                    <h3 className="text-2xl font-black uppercase text-red-500 mb-2">{result.label}</h3>
                                    {result.discount > 0 ? (
                                        <p className="font-bold">Süper! İndirimin sepette 15 dakika boyunca geçerli.</p>
                                    ) : (
                                        <p className="font-bold">Maalesef bu kez olmadı.</p>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={spin}
                                    disabled={isSpinning}
                                    className={`w-full py-4 text-2xl font-black uppercase tracking-widest border-4 border-black transition-all shadow-[8px_8px_0_0_#000] ${isSpinning ? 'bg-gray-400 text-gray-600' : 'bg-black text-white hover:bg-[#ff0000] active:translate-y-1 active:translate-x-1 active:shadow-none'}`}
                                >
                                    {isSpinning ? 'DÖNÜYOR...' : 'ÇARK KARIŞTIR'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
