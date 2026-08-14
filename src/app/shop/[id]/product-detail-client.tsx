"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const IPHONE_MODELS = [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 Mini"
];

interface ProductDetailClientProps {
    product: {
        id: string;
        title: string;
        price: number;
        imageSrc: string;
        description: string;
    };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const addItem = useCartStore((state) => state.addItem);
    const cartCount = useCartStore((state) => state.getTotalItems());
    const triggerToast = useToastStore((state) => state.triggerToast);
    const { luckyProductId, luckyDiscountExpiry } = useCartStore();
    
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [now, setNow] = useState(Date.now());

    // Mocking 3 images for the carousel using the same image for now
    const images = [product.imageSrc, product.imageSrc, product.imageSrc];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    useEffect(() => {
        setIsClient(true);
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAddToCart = () => {
        if (!selectedModel) {
            setError(true);
            setTimeout(() => setError(false), 2000);
            return;
        }

        addItem({
            id: product.id,
            title: product.title,
            model: selectedModel,
            price: product.price,
            imageSrc: product.imageSrc
        });

        triggerToast("SEPETE FIRLATILDI!");
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const timeRemaining = luckyDiscountExpiry ? luckyDiscountExpiry - now : 0;
    const isTimerActive = product.id === luckyProductId && timeRemaining > 0;
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white pb-24" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <Header />

            {isTimerActive && (
                <div className="bg-[#ff0000] text-white border-b-4 border-black text-center py-4 font-black uppercase text-xl flex items-center justify-center gap-4 animate-pulse shadow-[0_8px_0_0_rgba(0,0,0,0.2)]">
                    <span>🔥 TEBRİKLER! BU ÜRÜNE ÖZEL %15 İNDİRİM YAKALADINIZ:</span>
                    <span className="bg-white text-red-500 px-4 py-1 border-2 border-black">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                </div>
            )}

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 lg:py-24">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    
                    {/* Left: Image (Carousel) */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative group">
                            <motion.div 
                                className={`relative aspect-[3/4] w-full shadow-[16px_16px_0_0_#000] bg-white p-4 transition-transform ${shake ? 'animate-shake scale-105' : ''}`}
                            >
                                <div className="w-full h-full relative border-4 border-black bg-[#e5e5e5] overflow-hidden">
                                    <Image 
                                        src={images[currentImageIndex]} 
                                        alt={`${product.title} - Görsel ${currentImageIndex + 1}`} 
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover transition-opacity duration-300"
                                    />

                                    {/* Noise overlay for texture */}
                                    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                                </div>
                            </motion.div>
                            
                            {/* Carousel Controls */}
                            <button 
                                onClick={handlePrevImage}
                                className="absolute top-1/2 left-2 md:-left-6 -translate-y-1/2 w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center font-black text-xl hover:bg-black hover:text-white transition-colors z-20 active:translate-y-1 active:translate-x-1 active:shadow-none"
                            >
                                &lt;
                            </button>
                            <button 
                                onClick={handleNextImage}
                                className="absolute top-1/2 right-2 md:-right-6 -translate-y-1/2 w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center font-black text-xl hover:bg-black hover:text-white transition-colors z-20 active:translate-y-1 active:translate-x-1 active:shadow-none"
                            >
                                &gt;
                            </button>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {images.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-3 h-3 md:w-4 md:h-4 border-2 border-black transition-colors ${currentImageIndex === idx ? 'bg-black' : 'bg-transparent hover:bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Info & Actions */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-4 lg:pt-0">
                        <div className="border-b-4 border-black pb-6 mb-6">
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
                                    {product.title}
                                </h1>
                            </div>
                            <p className="text-3xl font-black text-red-500 mt-4">
                                {isTimerActive ? (
                                    <>
                                        <span className="line-through text-black text-xl opacity-50 mr-4">₺{product.price.toFixed(2)}</span>
                                        ₺{(product.price * 0.85).toFixed(2)}
                                    </>
                                ) : (
                                    `₺${product.price.toFixed(2)}`
                                )}
                            </p>
                        </div>

                        <p className="text-lg mb-8 font-medium leading-relaxed bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
                            {product.description}
                        </p>

                        <div className="mb-8">
                            <label className="block text-xl font-black uppercase mb-4 flex justify-between items-center">
                                <span>Cihaz Modeli Seçin</span>
                                {error && <span className="text-red-500 text-sm animate-pulse">LÜTFEN MODEL SEÇİN!</span>}
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {IPHONE_MODELS.map((model) => (
                                    <button
                                        key={model}
                                        onClick={() => setSelectedModel(model)}
                                        className={`px-2 py-3 border-2 border-black font-bold text-sm uppercase transition-all ${selectedModel === model ? 'bg-black text-white shadow-[4px_4px_0_0_#ff0000] scale-[1.02]' : 'bg-white text-black hover:bg-gray-100'}`}
                                    >
                                        {model}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            className={`w-full py-6 text-2xl font-black uppercase tracking-widest border-4 border-black transition-all shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none ${error ? 'bg-red-500 text-white' : 'bg-black text-white hover:bg-[#ff0000]'}`}
                            style={error ? { transform: 'translateX(10px)' } : {}}
                        >
                            SEPETE EKLE
                        </button>
                        
                        <div className="mt-8 flex items-center justify-between border-t-2 border-black pt-4 text-sm font-bold uppercase opacity-60">
                            <span>Kargo: 1-3 İş Günü</span>
                            <span>%100 Güvenli Ödeme</span>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
