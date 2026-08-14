"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ACCESSORIES } from "@/lib/products";
import { useToastStore } from "@/store/toastStore";

export function CartDrawer() {
    const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, addItem, luckyProductId, luckyDiscountExpiry, getDiscountAmount, globalDiscount, globalDiscountExpiry } = useCartStore();
    const triggerToast = useToastStore((state) => state.triggerToast);
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const handleAddAccessory = (acc: any) => {
        addItem({
            id: acc.id,
            title: acc.title,
            model: "Standart",
            price: acc.price,
            imageSrc: acc.imageSrc
        });
        triggerToast("SEPETE FIRLATILDI!");
    };

    const availableAccessories = ACCESSORIES.filter(acc => !items.some(item => item.id === acc.id));
    const discountAmount = getDiscountAmount();
    
    // FOMO Timer calculation
    const isLuckyTimerActive = luckyDiscountExpiry && (luckyDiscountExpiry - now) > 0 && items.some(i => i.id === luckyProductId);
    const isGlobalTimerActive = globalDiscountExpiry && (globalDiscountExpiry - now) > 0;
    
    const activeTimerExpiry = isGlobalTimerActive ? globalDiscountExpiry : (isLuckyTimerActive ? luckyDiscountExpiry : null);
    const timeRemaining = activeTimerExpiry ? activeTimerExpiry - now : 0;
    const isTimerActive = timeRemaining > 0;
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#e5e5e5] border-l-4 border-black z-[100] transform transition-transform duration-300 ease-in-out flex flex-col font-mono ${isOpen ? 'translate-x-0 shadow-[-16px_0_0_0_#ff0000]' : 'translate-x-full shadow-none'}`}
                style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            >
                {isTimerActive && (
                    <div className="bg-[#ff0000] text-white text-center py-2 font-black uppercase text-sm flex items-center justify-center gap-2 animate-pulse">
                        <span>💥 İNDİRİM FIRSATI BİTİYOR:</span>
                        <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                    </div>
                )}
                
                <div className="flex justify-between items-center p-4 border-b-4 border-black bg-white shrink-0">
                    <h2 className="text-xl font-black uppercase tracking-widest">Sepetiniz</h2>
                    <button 
                        onClick={closeCart}
                        className="w-10 h-10 border-4 border-black bg-white text-black font-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                        X
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col">
                    <div className="p-4 flex flex-col gap-4">
                        {items.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-12">
                                <span className="text-4xl mb-4">🛒</span>
                                <p className="font-bold uppercase tracking-widest">Sepetiniz Boş</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={`${item.id}-${item.model}`} className="flex gap-4 items-center bg-white border-2 border-black p-2 shadow-[4px_4px_0_0_#000]">
                                    <div className="relative w-20 h-20 shrink-0 border-2 border-black bg-[#e5e5e5]">
                                        <Image src={item.imageSrc} alt={item.title} fill sizes="80px" className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm uppercase leading-tight line-clamp-1">{item.title}</h4>
                                        <p className="text-xs font-mono text-gray-500 uppercase mt-1">Model: {item.model}</p>
                                        <p className="font-black text-red-500 mt-1">₺{item.price.toFixed(2)}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={() => updateQuantity(item.id, item.model, item.quantity - 1)} className="px-2 border-2 border-black font-bold active:bg-black active:text-white">-</button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.model, item.quantity + 1)} className="px-2 border-2 border-black font-bold active:bg-black active:text-white">+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem(item.id, item.model)} className="h-full px-2 text-gray-400 hover:text-red-500 font-bold transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Upsell Section */}
                    {items.length > 0 && availableAccessories.length > 0 && (
                        <div className="mt-auto border-t-4 border-black p-4 bg-[#c0c0c0]">
                            <h3 className="text-sm font-black uppercase mb-3">Bunları da Eklemek İster misin?</h3>
                            <div className="flex flex-col gap-2">
                                {availableAccessories.map(acc => (
                                    <div key={acc.id} className="flex items-center justify-between bg-white border-2 border-black p-2 shadow-[2px_2px_0_0_#000]">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs uppercase">{acc.title}</span>
                                            <span className="text-xs font-black text-red-500">+₺{acc.price.toFixed(2)}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleAddAccessory(acc)}
                                            className="bg-black text-white px-3 py-1 text-xs font-bold uppercase border-2 border-black hover:bg-red-500 transition-colors"
                                        >
                                            Ekle
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t-4 border-black bg-white shrink-0">
                        {discountAmount > 0 && isTimerActive && (
                            <div className="flex justify-between items-center text-sm font-bold uppercase text-red-500 mb-2">
                                <span>Karıştırma İndirimi:</span>
                                <span>-₺{discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-xl font-black uppercase mb-4">
                            <span>Toplam:</span>
                            <span>₺{getTotalPrice().toFixed(2)}</span>
                        </div>
                        <Link 
                            href="/checkout" 
                            onClick={closeCart}
                            className="block w-full bg-black text-white py-4 text-center text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-red-500 transition-colors shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
                        >
                            ÖDEMEYE GEÇ
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
