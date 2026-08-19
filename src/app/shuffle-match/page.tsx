"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { Header } from "@/components/ui/header";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";

export default function ShuffleMatchPage() {
    const [isClient, setIsClient] = useState(false);
    
    // Tournament States
    const [pool, setPool] = useState<any[]>([]);
    const [kept, setKept] = useState<any[]>([]);
    const [eliminated, setEliminated] = useState<any[]>([]);
    const [winner, setWinner] = useState<any | null>(null);
    const [round, setRound] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

    const resultRef = useRef<HTMLDivElement>(null);

    // Initial setup
    useEffect(() => {
        setIsClient(true);
        // Shuffle the cases initially
        const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5);
        setPool(shuffled);
    }, []);

    // Trigger confetti when winner is found
    useEffect(() => {
        if (winner) {
            triggerConfetti();
        }
    }, [winner]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const handleSwipe = (direction: "left" | "right", product: any) => {
        // Remove the product from the top of the pool (which is the last item in array)
        const newPool = [...pool];
        newPool.pop();
        setPool(newPool);

        let newKept = [...kept];
        let newEliminated = [...eliminated];

        if (direction === "right") {
            // Keep
            newKept.push(product);
        } else {
            // Eliminate
            newEliminated.unshift(product); // Add to front so later eliminations rank higher
            setEliminated(newEliminated);
        }

        checkRoundEnd(newPool, newKept, newEliminated);
    };

    const checkRoundEnd = (currentPool: any[], currentKept: any[], currentEliminated: any[]) => {
        if (currentPool.length === 0) {
            if (currentKept.length === 1) {
                // We have a single absolute winner!
                setWinner(currentKept[0]);
            } else if (currentKept.length === 0) {
                // If they eliminated everything in this round, the last eliminated one becomes the winner
                const theWinner = currentEliminated[0];
                setWinner(theWinner);
                // Remove it from eliminated list
                setEliminated(currentEliminated.slice(1));
            } else {
                // Next Round
                // Shuffle the kept ones for the next round to make it unpredictable
                setPool([...currentKept].sort(() => Math.random() - 0.5));
                setKept([]);
                setRound(r => r + 1);
            }
        } else {
            setKept(currentKept);
        }
    };

    const handleManualSwipe = (direction: "left" | "right") => {
        if (pool.length === 0) return;
        const product = pool[pool.length - 1];
        handleSwipe(direction, product);
    };

    const handleDownload = async () => {
        if (!resultRef.current) return;
        setIsExporting(true);
        
        try {
            // Wait a tick for UI to update exporting state if needed
            await new Promise(res => setTimeout(res, 100));
            
            const canvas = await html2canvas(resultRef.current, {
                scale: 2,
                backgroundColor: "#e5e5e5",
                useCORS: true,
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `shuffle-match-result-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
            alert("Resim oluşturulurken bir hata oluştu.");
        } finally {
            setIsExporting(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <div className="w-full relative z-50">
                <Header />
            </div>

            <main className="max-w-md mx-auto px-4 py-8 md:py-12 min-h-[80vh] flex flex-col items-center">
                
                {/* MATCHING UI */}
                {!winner && (
                    <div className="w-full flex flex-col items-center overflow-hidden pb-12">
                        <div className="mb-6 text-center">
                            <h1 className="text-3xl font-black uppercase tracking-widest text-red-500 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                SHUFFLE MATCH
                            </h1>
                            <p className="font-bold bg-black text-white px-4 py-1 mt-2 inline-block border-2 border-white shadow-[2px_2px_0_0_#ff0000]">
                                TUR {round} / KALAN: {pool.length + kept.length}
                            </p>
                        </div>

                        <div className="relative w-[300px] h-[450px] md:w-[350px] md:h-[500px] perspective-1000 mt-4">
                            <AnimatePresence>
                                {pool.map((product, index) => {
                                    const isTop = index === pool.length - 1;
                                    return (
                                        <SwipeableCard 
                                            key={product.id} 
                                            product={product} 
                                            isTop={isTop} 
                                            onSwipe={(dir) => handleSwipe(dir, product)} 
                                            index={index}
                                        />
                                    );
                                })}
                            </AnimatePresence>
                            {pool.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white border-4 border-black shadow-[8px_8px_0_0_#000]">
                                    <p className="font-black text-2xl animate-pulse text-center px-4">SONRAKİ TUR HAZIRLANIYOR...</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-8 mt-12 z-10">
                            <button 
                                onClick={() => handleManualSwipe("left")}
                                className="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center text-4xl hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none text-black"
                            >
                                ✖
                            </button>
                            <button 
                                onClick={() => handleManualSwipe("right")}
                                className="w-20 h-20 bg-red-500 border-4 border-black rounded-full flex items-center justify-center text-4xl hover:bg-white transition-colors shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none text-white hover:text-red-500"
                            >
                                ♥
                            </button>
                        </div>
                        <p className="mt-8 font-bold text-gray-500 text-sm text-center">
                            Beğenmek için sağa (♥), elemek için sola (✖) kaydırın.
                        </p>
                    </div>
                )}

                {/* RESULT UI */}
                {winner && (
                    <div className="w-full max-w-lg flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        
                        <div ref={resultRef} className="w-full bg-[#e5e5e5] p-6 pb-12 border-8 border-black shadow-[16px_16px_0_0_#000] relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                            {/* Watermark */}
                            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
                                <span className="text-[8rem] font-black uppercase -rotate-45">SHUFFLE</span>
                            </div>

                            <div className="text-center mb-8 relative z-10">
                                <h2 className="text-4xl font-black uppercase text-red-500 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                    BENİM FAVORİM
                                </h2>
                                <p className="font-bold mt-2 bg-black text-white px-2 py-1 inline-block">
                                    #ShuffleMatch
                                </p>
                            </div>

                            {/* Podium: Winner */}
                            <div className="relative z-10 flex flex-col items-center mb-12">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 border-4 border-black flex items-center justify-center font-black text-white text-2xl rotate-12 z-20 shadow-[2px_2px_0_0_#000]">
                                    #1
                                </div>
                                <div className="w-64 h-64 bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_#ff0000] relative">
                                    <Image src={winner.imageSrc} alt={winner.title} fill className="object-cover p-2" />
                                </div>
                                <h3 className="mt-4 font-black text-2xl uppercase bg-white border-2 border-black px-4 py-1 shadow-[4px_4px_0_0_#000] text-center">
                                    {winner.title}
                                </h3>
                            </div>

                            {/* Leaderboard (Top 3 Runner-ups) */}
                            <div className="relative z-10 w-full bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_#000]">
                                <h4 className="font-black uppercase border-b-4 border-black pb-2 mb-4 text-xl">Sıralamam:</h4>
                                <div className="flex flex-col gap-3">
                                    {eliminated.slice(0, 3).map((item, idx) => (
                                        <div key={item.id} className="flex items-center gap-4 border-2 border-dashed border-gray-400 p-2 bg-[#f5f5f5]">
                                            <span className="font-black text-xl text-gray-400 w-8">#{idx + 2}</span>
                                            <div className="w-12 h-12 relative bg-white border border-black flex-shrink-0">
                                                <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <span className="font-bold text-sm uppercase truncate">{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center mt-6 font-bold text-xs">shufflecase.com'da Kendi Favorini Bul!</p>
                            </div>
                        </div>

                        {!isExporting && (
                            <div className="flex flex-col gap-4 mt-12 w-full">
                                <button 
                                    onClick={handleDownload}
                                    className="w-full py-4 text-xl font-black uppercase tracking-widest border-4 border-black transition-all shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none bg-red-500 text-white hover:bg-black hover:text-white"
                                >
                                    📸 SONUCU İNDİR
                                </button>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="w-full py-4 text-xl font-black uppercase tracking-widest border-4 border-black transition-all shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none bg-white text-black hover:bg-gray-200"
                                >
                                    ↺ TEKRAR OYNA
                                </button>
                                <Link 
                                    href={`/shop/${winner.id}`}
                                    className="w-full py-4 text-xl font-black uppercase tracking-widest border-4 border-black transition-all shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none bg-black text-white hover:text-red-500 text-center flex items-center justify-center gap-2"
                                >
                                    🛍️ KAZANANI SATIN AL
                                </Link>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}

function SwipeableCard({ product, isTop, onSwipe, index }: { product: any, isTop: boolean, onSwipe: (dir: "left" | "right") => void, index: number }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    
    // LIKE / DISLIKE STAMPS
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

    const handleDragEnd = (event: any, info: any) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onSwipe("right");
        } else if (info.offset.x < -threshold) {
            onSwipe("left");
        }
    };

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_#000] origin-bottom"
            style={{ 
                x: isTop ? x : 0, 
                rotate: isTop ? rotate : (index % 2 === 0 ? -2 : 2), 
                opacity: isTop ? opacity : 1,
                zIndex: index 
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        >
            <div className="relative w-full h-[80%] bg-[#f5f5f5] border-2 border-black overflow-hidden pointer-events-none">
                <Image src={product.imageSrc} alt={product.title} fill className="object-cover p-4" />
                
                {/* Stamps */}
                <motion.div 
                    className="absolute top-4 left-4 border-4 border-red-500 text-red-500 font-black text-4xl p-2 rotate-[-15deg] uppercase tracking-widest"
                    style={{ opacity: likeOpacity }}
                >
                    MATCH
                </motion.div>
                <motion.div 
                    className="absolute top-4 right-4 border-4 border-black text-black font-black text-4xl p-2 rotate-[15deg] uppercase tracking-widest"
                    style={{ opacity: nopeOpacity }}
                >
                    NOPE
                </motion.div>
            </div>
            
            <div className="mt-4 flex flex-col justify-between h-[20%] pointer-events-none">
                <h3 className="font-black text-xl uppercase leading-tight line-clamp-1">{product.title}</h3>
                <p className="font-bold text-gray-500 uppercase text-sm">{product.category}</p>
            </div>
        </motion.div>
    );
}
