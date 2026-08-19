"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const cartCount = useCartStore((state) => state.getTotalItems());
    const [isClient, setIsClient] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Kapalıysa body scroll'u aç, açıksa kapat
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    return (
        <>
            <header className={
                isHome 
                    ? "absolute top-0 left-0 w-full h-[70px] md:h-[100px] z-50 border-b-4 border-black flex items-center justify-between px-4 md:px-8"
                    : "sticky top-0 z-50 bg-[#e5e5e5] border-b-4 border-black h-[70px] md:h-[100px] flex items-center justify-between px-4 md:px-8 shadow-[0_8px_0_0_rgba(0,0,0,0.1)] backdrop-blur-md bg-opacity-90"
            }>
                {isHome && (
                    <div className="absolute inset-0 -z-10 bg-[#c0c0c0]">
                        <Image src="/banner.jpg" alt="Top Banner" fill className="object-cover opacity-80 mix-blend-multiply" />
                    </div>
                )}

                {/* Left: Hamburger (Mobile) + Logo */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden w-10 h-10 border-2 border-black bg-white flex flex-col justify-center items-center gap-1.5 shadow-[2px_2px_0_0_#000]"
                    >
                        <div className="w-5 h-0.5 bg-black"></div>
                        <div className="w-5 h-0.5 bg-black"></div>
                        <div className="w-5 h-0.5 bg-black"></div>
                    </button>

                    <Link href="/" className="hover:scale-105 transition-transform flex items-center h-10 md:h-16 relative w-24 md:w-48">
                        <Image src="/logo.png" alt="Shuffle Case" fill className={`object-contain ${!isHome ? 'invert drop-shadow-[2px_2px_0_rgba(192,192,192,1)]' : 'invert drop-shadow-[2px_2px_0_rgba(0,0,0,1)]'}`} />
                    </Link>
                </div>

                {/* Center: Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-12 font-mono bg-white/90 px-8 py-3 border-2 border-black shadow-[4px_4px_0_0_#000] backdrop-blur-sm">
                    <Link href="/shuffle-match" className="font-black uppercase tracking-widest text-base text-red-500 hover:text-black hover:scale-105 hover:underline underline-offset-4 decoration-2 transition-all flex items-center gap-1">🔥 SHUFFLE MATCH</Link>
                    <Link href="/shop" className="font-black uppercase tracking-widest text-base hover:text-red-500 hover:scale-105 hover:underline underline-offset-4 decoration-2 transition-all">Mağaza</Link>
                    <Link href="/kargo-takip" className="font-black uppercase tracking-widest text-base hover:text-red-500 hover:scale-105 hover:underline underline-offset-4 decoration-2 transition-all">Kargo Takip</Link>
                    <Link href="/hakkimizda" className="font-black uppercase tracking-widest text-base hover:text-red-500 hover:scale-105 hover:underline underline-offset-4 decoration-2 transition-all">Hakkımızda</Link>
                    <Link href="/sss" className="font-black uppercase tracking-widest text-base hover:text-red-500 hover:scale-105 hover:underline underline-offset-4 decoration-2 transition-all">SSS</Link>
                </nav>

                {/* Right: Cart Button */}
                <div className="flex items-center font-mono">
                    <button 
                        onClick={() => useCartStore.getState().openCart()}
                        className="bg-black text-white px-3 md:px-6 py-2 border-2 md:border-4 border-black font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0_0_#ff0000] active:translate-y-1 active:translate-x-1 active:shadow-none"
                    >
                        <span className="hidden md:inline uppercase tracking-widest">Sepet</span>
                        <span className="md:hidden text-lg">🛒</span>
                        <span className="bg-white text-black px-2 py-0.5 rounded-full text-xs border-2 border-black">{isClient ? cartCount : 0}</span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm md:hidden">
                    <div className="absolute top-0 left-0 w-[80%] max-w-[300px] h-full bg-[#e5e5e5] border-r-4 border-black p-6 flex flex-col font-mono" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-red-500">MENÜ</h2>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="w-10 h-10 border-4 border-black bg-white text-black font-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                            >
                                X
                            </button>
                        </div>
                        
                        <nav className="flex flex-col gap-6 text-xl font-black uppercase tracking-widest">
                            <Link href="/shuffle-match" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-black pb-2 text-red-500 hover:text-black flex items-center gap-2">🔥 SHUFFLE MATCH</Link>
                            <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-black pb-2 hover:text-red-500">Mağaza</Link>
                            <Link href="/kargo-takip" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-black pb-2 hover:text-red-500">Kargo Takip</Link>
                            <Link href="/hakkimizda" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-black pb-2 hover:text-red-500">Hakkımızda</Link>
                            <Link href="/sss" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-black pb-2 hover:text-red-500">SSS</Link>
                            <Link href="/iletisim" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-black pb-2 hover:text-red-500">İletişim</Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
