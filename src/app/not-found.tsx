"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div 
            className="min-h-screen bg-black text-[#00ff00] flex flex-col items-center justify-center font-mono overflow-hidden relative"
            style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        >
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>

            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center z-10 p-8 border-4 border-[#00ff00] bg-black/80 shadow-[0_0_30px_rgba(0,255,0,0.3)] max-w-2xl w-full mx-4"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-24 h-24 border-8 border-dashed border-[#00ff00] rounded-full mx-auto mb-8 flex items-center justify-center"
                >
                    <span className="text-4xl font-black">?</span>
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">404</h1>
                <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-widest bg-[#00ff00] text-black inline-block px-4 py-1">
                    HEDEF BULUNAMADI
                </h2>
                
                <p className="text-lg md:text-xl mb-12 opacity-80 leading-relaxed">
                    Aradığınız sinyal kayboldu veya evrenin başka bir köşesine taşındı. 
                    Lütfen radar koordinatlarınızı kontrol edin.
                </p>

                <Link 
                    href="/"
                    className="inline-block border-4 border-[#00ff00] px-8 py-4 text-xl font-black uppercase hover:bg-[#00ff00] hover:text-black transition-colors"
                >
                    [ ANA ÜSSE DÖN ]
                </Link>
            </motion.div>
        </div>
    );
}
