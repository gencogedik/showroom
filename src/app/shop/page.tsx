"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ui/product-card";

const TOTAL_PRODUCTS = 20;
const PRODUCTS = Array.from({ length: TOTAL_PRODUCTS }, (_, i) => ({
    id: i + 1,
    title: `TEXTURE CASE #${(i + 1).toString().padStart(2, '0')}`,
    price: "₺399.00",
    imageSrc: `/images/${i + 1}.jpg`
}));

export default function ShopPage() {
    const [cartCount, setCartCount] = useState(0);
    const [lastAdded, setLastAdded] = useState<string | null>(null);

    const handleAddToCart = (title: string) => {
        setCartCount(prev => prev + 1);
        setLastAdded(title);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            setLastAdded(null);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white pb-24" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#e5e5e5] border-b-4 border-black p-4 md:px-8 flex items-center justify-between shadow-[0_8px_0_0_rgba(0,0,0,0.1)] backdrop-blur-md bg-opacity-90">
                <div className="flex items-center gap-4">
                    <Link href="/" className="hover:scale-105 transition-transform">
                        <img src="/logo.png" alt="Shuffle Case" className="h-10 md:h-14 object-contain invert drop-shadow-[2px_2px_0_rgba(192,192,192,1)]" />
                    </Link>
                </div>
                
                <h1 className="hidden md:block text-2xl font-black uppercase tracking-widest text-black">
                    MAĞAZA
                </h1>

                <div className="flex items-center gap-4">
                    <Link href="/" className="hidden md:block font-bold uppercase tracking-widest text-sm hover:underline underline-offset-4 decoration-2">
                        Geri Dön
                    </Link>
                    <button className="bg-black text-white px-4 py-2 border-2 border-black font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0_0_#ff0000] active:translate-y-1 active:translate-x-1 active:shadow-none">
                        <span>SEPET</span>
                        <span className="bg-white text-black px-2 py-0.5 rounded-full text-xs">{cartCount}</span>
                    </button>
                </div>
            </header>

            {/* Marquee */}
            <div className="w-full overflow-hidden bg-black text-white border-b-4 border-black py-3 relative flex items-center">
                <motion.div 
                    className="flex whitespace-nowrap gap-8"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                >
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="text-xl font-black uppercase tracking-[0.2em]">
                            YENİ KOLEKSİYON // DOKUYU HİSSET // ŞİMDİ SATIŞTA // 
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
                <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                        Tüm Kılıflar
                    </h2>
                    <span className="font-bold text-lg md:text-xl">
                        {TOTAL_PRODUCTS} ÜRÜN
                    </span>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {PRODUCTS.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            imageSrc={product.imageSrc}
                            onAddToCart={() => handleAddToCart(product.title)}
                        />
                    ))}
                </div>
            </main>

            {/* Toast Notification for Cart */}
            <AnimatePresence>
                {lastAdded && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 z-50 bg-black text-white p-4 border-4 border-white shadow-[8px_8px_0_0_#ff0000] max-w-sm"
                    >
                        <p className="font-mono font-bold uppercase text-sm">
                            <span className="text-[#ff0000]">Eklendi:</span> {lastAdded}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
