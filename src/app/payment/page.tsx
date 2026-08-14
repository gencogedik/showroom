"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

function PaymentContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isClient, setIsClient] = useState(false);
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#e5e5e5] font-mono p-4">
                <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_#ff0000] text-center max-w-md">
                    <h1 className="text-2xl font-black text-red-500 mb-4">GEÇERSİZ İŞLEM</h1>
                    <p className="mb-6 font-bold">Ödeme token'ı bulunamadı. Lütfen sepetinize dönün.</p>
                    <Link href="/checkout" className="bg-black text-white px-6 py-3 border-2 border-black font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                        Sepete Dön
                    </Link>
                </div>
            </div>
        );
    }

    const isMock = token.startsWith("MOCK_PAYTR_TOKEN_");

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono flex flex-col" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {/* Minimal Header */}
            <header className="bg-black text-white p-4 flex justify-center items-center shadow-lg">
                <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
                    <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></span>
                    GÜVENLİ ÖDEME NOKTASI
                </h1>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[16px_16px_0_0_#000] overflow-hidden flex flex-col">
                    <div className="bg-[#c0c0c0] border-b-4 border-black p-4 flex justify-between items-center">
                        <span className="font-bold uppercase text-sm">PayTR iFrame</span>
                        <span className="font-mono text-xs border border-black px-2 py-1 bg-white">SSL 256-BIT</span>
                    </div>
                    
                    {isMock ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center bg-yellow-100 min-h-[400px]">
                            <h2 className="text-3xl font-black mb-4">TEST MODU AKTİF</h2>
                            <p className="mb-8 max-w-md">Gerçek API anahtarları eklenmediği için PayTR Kredi Kartı iFrame'i şu an simüle ediliyor.</p>
                            
                            <button 
                                onClick={() => {
                                    alert("Ödeme Başarılı! (Simülasyon)");
                                    clearCart();
                                    window.location.href = "/shop";
                                }}
                                className="bg-green-500 text-black border-4 border-black font-black uppercase px-8 py-4 text-xl shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                            >
                                Ödemeyi Tamamla (MOCK)
                            </button>
                        </div>
                    ) : (
                        <iframe 
                            src={`https://www.paytr.com/odeme/guvenli/${token}`} 
                            id="paytriframe" 
                            frameBorder="0" 
                            scrolling="auto" 
                            className="w-full h-[800px]"
                        ></iframe>
                    )}
                </div>
                
                <p className="mt-8 text-sm font-bold uppercase tracking-widest text-gray-500 text-center max-w-md">
                    Ödemeniz 256-bit SSL ve 3D Secure güvencesiyle gerçekleşmektedir.
                </p>
            </main>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#e5e5e5] font-mono"><p className="font-bold text-xl">YÜKLENİYOR...</p></div>}>
            <PaymentContent />
        </Suspense>
    );
}
