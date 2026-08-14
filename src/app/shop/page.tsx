"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ui/product-card";
import { Footer } from "@/components/ui/footer";
import { useCartStore } from "@/store/cartStore";
import { PRODUCTS } from "@/lib/products";
import { Header } from "@/components/ui/header";

export default function ShopPage() {
    const addItem = useCartStore((state) => state.addItem);
    const cartCount = useCartStore((state) => state.getTotalItems());
    const [isClient, setIsClient] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Tümü");

    const filteredProducts = PRODUCTS.filter(p => 
        selectedCategory === "Tümü" || p.category === selectedCategory
    );
    // Hydration fix for zustand persist
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white pb-24" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <Header />

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
            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12 flex flex-col md:flex-row gap-8">
                
                {/* Filter Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-32">
                        <h3 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-4">KREASYON</h3>
                        <ul className="flex flex-wrap md:flex-col gap-2 pb-4 md:pb-0">
                            {["Tümü", "Metalik", "Karanlık", "Y2K Özel"].map((cat) => (
                                <li key={cat} className="flex-grow md:flex-grow-0">
                                    <button
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left font-bold uppercase text-sm px-4 py-2 border-2 border-black transition-all ${selectedCategory === cat ? 'bg-black text-white shadow-[4px_4px_0_0_#ff0000] translate-x-1' : 'bg-[#e5e5e5] text-black hover:bg-white'}`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Product Grid Container */}
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                            {selectedCategory === "Tümü" ? "Tüm Kılıflar" : selectedCategory}
                        </h2>
                        <span className="font-bold text-lg md:text-xl">
                            {filteredProducts.length} ÜRÜN
                        </span>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ProductCard
                                        id={parseInt(product.id)}
                                        title={product.title}
                                        price={`₺${product.price.toFixed(2)}`}
                                        imageSrc={product.imageSrc}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>


            <Footer />
        </div>
    );
}
