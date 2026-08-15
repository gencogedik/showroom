"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/header';

export default function AboutPage() {
    return (
        <div 
            className="min-h-screen bg-[#e5e5e5] text-black pt-0 pb-24 overflow-hidden relative"
            style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
            <div className="w-full relative z-50 mb-16">
                <Header />
            </div>
            {/* Background Marquee Text */}
            <div className="absolute top-1/4 left-0 w-[200vw] -translate-y-1/2 pointer-events-none opacity-10 whitespace-nowrap overflow-hidden">
                <motion.div 
                    className="text-[20vw] font-black leading-none uppercase tracking-tighter"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    SHUFFLE CASE // KILIF DEĞİL ZIRH // Y2K VIBES //
                </motion.div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="max-w-4xl mx-auto border-8 border-black bg-white p-8 md:p-16 shadow-[16px_16px_0_0_#000]"
                >
                    <div className="bg-black text-white w-fit px-4 py-2 mb-8 border-2 border-black font-mono font-bold tracking-widest uppercase">
                        Sistem Başlatıldı: 2024
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-12">
                        TELEFONUNU <br />
                        <span className="text-red-500">SIRADANLIKTAN</span><br />
                        KURTAR.
                    </h1>

                    <div className="space-y-8 font-mono text-lg md:text-2xl font-bold leading-relaxed">
                        <p>
                            Biz, telefon kılıfının sadece bir "koruyucu" olduğuna inanmıyoruz. O, senin zırhın, senin karakterin ve senin yansımandır.
                        </p>
                        
                        <div className="border-l-8 border-red-500 pl-6 my-12 bg-[#e5e5e5] p-6 shadow-[4px_4px_0_0_#000]">
                            "Y2K estetiğini brutalist tasarım ile harmanlıyor, teknolojiyi nostaljiyle buluşturuyoruz."
                        </div>

                        <p>
                            Geleceğin dokusunu geçmişin ruhuyla birleştiren tasarımlarımız, sıradanlığa açılmış bir savaştır. 
                            Plastik yığınlarından sıkılanlar, metalik soğukluğu ve cesur renkleri arayanlar için buradayız.
                        </p>
                    </div>

                    <div className="mt-16 flex flex-wrap gap-4 font-black text-xl">
                        <span className="border-4 border-black px-6 py-3 uppercase tracking-widest shadow-[4px_4px_0_0_#ff0000] hover:bg-black hover:text-white transition-colors cursor-default">
                            #BRUTALİZM
                        </span>
                        <span className="border-4 border-black px-6 py-3 uppercase tracking-widest shadow-[4px_4px_0_0_#ff0000] hover:bg-black hover:text-white transition-colors cursor-default">
                            #Y2K
                        </span>
                        <span className="border-4 border-black px-6 py-3 uppercase tracking-widest shadow-[4px_4px_0_0_#ff0000] hover:bg-black hover:text-white transition-colors cursor-default">
                            #ZIRH
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
