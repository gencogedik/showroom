"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
    id: number;
    title: string;
    price: string;
    imageSrc: string;
    onAddToCart: () => void;
}

export function ProductCard({ id, title, price, imageSrc, onAddToCart }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="group relative flex flex-col bg-white border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#ff0000] transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#e5e5e5] border-b-4 border-black p-4 flex items-center justify-center">
                <img 
                    src={imageSrc} 
                    alt={title} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Noise overlay for texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                
                {/* ID Badge */}
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 font-mono text-xs font-bold border-2 border-white">
                    #{id.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Info Section */}
            <div className="p-4 flex flex-col flex-grow bg-[#c0c0c0]">
                <h3 className="font-mono font-black text-xl uppercase tracking-tighter text-black line-clamp-1 mb-1">
                    {title}
                </h3>
                <p className="font-mono text-lg font-bold text-black mb-4">
                    {price}
                </p>
                
                <div className="mt-auto">
                    <button 
                        onClick={onAddToCart}
                        className="w-full bg-black text-white py-3 font-mono font-bold uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-colors active:scale-95"
                    >
                        Sepete Ekle
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
