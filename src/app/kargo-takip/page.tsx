"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "result">("idle");
    const [error, setError] = useState<string | null>(null);
    const [cargoData, setCargoData] = useState<any>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!orderId || !email) {
            setError("LÜTFEN TÜM ALANLARI DOLDURUN!");
            setTimeout(() => setError(null), 2000);
            return;
        }

        setStatus("loading");
        setError(null);

        try {
            const response = await fetch('/api/kargo/takip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, email })
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Sorgulama başarısız oldu!");
                setStatus("idle");
                setTimeout(() => setError(null), 3000);
                return;
            }

            setCargoData(result.data);
            setStatus("result");
        } catch (err) {
            setError("Bir ağ hatası oluştu.");
            setStatus("idle");
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            {/* Header */}
            <div className="w-full relative z-50">
                <Header />
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-16 md:py-24 min-h-[70vh]">
                <div className="bg-white border-4 border-black p-6 md:p-12 shadow-[12px_12px_0_0_#000]">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center">
                        KARGOM NEREDE?
                    </h2>
                    <p className="text-center font-bold text-gray-600 mb-8 max-w-lg mx-auto">
                        Sipariş numaranızı ve e-posta adresinizi girerek kargonuzun güncel durumunu öğrenebilirsiniz.
                    </p>

                    <form onSubmit={handleTrack} className="flex flex-col gap-6 max-w-md mx-auto relative">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold uppercase tracking-wider text-sm">Sipariş Numarası</label>
                            <input 
                                type="text" 
                                placeholder="Örn: PAYTR-12345" 
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full bg-[#e5e5e5] border-2 border-black p-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#000] transition-all"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="font-bold uppercase tracking-wider text-sm">E-Posta Adresi</label>
                            <input 
                                type="email" 
                                placeholder="Örn: hello@shufflecase.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#e5e5e5] border-2 border-black p-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#000] transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={status === "loading"}
                            className={`w-full py-4 text-xl font-black uppercase tracking-widest border-2 border-black transition-all shadow-[6px_6px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none mt-4 ${error ? 'bg-red-500 text-white animate-shake' : 'bg-black text-white hover:bg-[#ff0000]'}`}
                        >
                            {status === "loading" ? "SORGULANIYOR..." : "SORGULA"}
                        </button>
                        
                        {error && (
                            <p className="text-red-500 font-bold text-center mt-2 absolute -bottom-8 w-full uppercase">{error}</p>
                        )}
                    </form>

                    {/* Result Mock Section */}
                    <AnimatePresence>
                        {status === "result" && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-16 border-t-4 border-black pt-12 overflow-hidden"
                            >
                                <div className="bg-[#e5e5e5] border-2 border-black p-6 mb-8 relative">
                                    <div className="absolute -top-3 left-6 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-widest">
                                        Durum
                                    </div>
                                    <h3 className="text-2xl font-black uppercase text-green-600 mb-2">{cargoData?.status_label || "BİLİNMİYOR"}</h3>
                                    <p className="font-bold">Takip No: <span className="font-mono bg-white px-2 py-1 border border-black ml-2">{cargoData?.shipping_webservice_tracking_code || "-"}</span></p>
                                    <p className="text-sm mt-2 font-bold text-gray-500">Firma: {cargoData?.shipping_provider_name || "Kargonomi"}</p>
                                    
                                    {cargoData?.shipping_webservice_tracking_code && (
                                        <a href={cargoData.shipping_tracking_url || `https://www.google.com/search?q=${encodeURIComponent(cargoData.shipping_provider_name || 'Kargo')}+takip+${cargoData.shipping_webservice_tracking_code}`} target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm font-bold bg-white border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors uppercase tracking-wider">
                                            Kargo Firması Sayfasında Gör ↗
                                        </a>
                                    )}
                                </div>

                                {/* Timeline */}
                                <div className="flex flex-col gap-8 md:flex-row md:justify-between relative mt-12 mb-8">
                                    {/* Line connecting steps */}
                                    <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-black z-0"></div>
                                    <div className="md:hidden absolute left-6 top-8 bottom-8 w-1 bg-black z-0"></div>

                                    {/* Step 1 */}
                                    <div className="flex flex-row md:flex-col items-center md:items-center gap-4 z-10 w-full md:w-1/3">
                                        <div className="w-12 h-12 bg-black text-white border-4 border-black flex items-center justify-center font-bold">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-black uppercase text-left md:text-center mt-2">Sipariş Alındı</p>
                                            <p className="text-xs font-bold text-gray-500 text-left md:text-center">
                                                {cargoData?.created_at ? new Date(cargoData.created_at).toLocaleDateString("tr-TR") : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex flex-row md:flex-col items-center md:items-center gap-4 z-10 w-full md:w-1/3">
                                        <div className={`w-12 h-12 ${cargoData?.status === 'draft' ? 'bg-white text-black' : 'bg-black text-white'} border-4 border-black flex items-center justify-center font-bold`}>
                                            {cargoData?.status === 'draft' ? '2' : '✓'}
                                        </div>
                                        <div>
                                            <p className="font-black uppercase text-left md:text-center mt-2">Hazırlanıyor</p>
                                        </div>
                                    </div>

                                    {/* Step 3 (Current) */}
                                    <div className="flex flex-row md:flex-col items-center md:items-center gap-4 z-10 w-full md:w-1/3">
                                        <div className={`w-12 h-12 ${['shipped', 'delivered', 'in_transit'].includes(cargoData?.status) ? 'bg-green-500 text-black animate-pulse' : 'bg-white text-black'} border-4 border-black flex items-center justify-center font-black`}>
                                            {cargoData?.status === 'delivered' ? '✓' : '3'}
                                        </div>
                                        <div>
                                            <p className={`font-black uppercase ${['shipped', 'delivered', 'in_transit'].includes(cargoData?.status) ? 'text-green-600' : 'text-gray-400'} text-left md:text-center mt-2`}>
                                                Kargoya Verildi
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </main>
            
            <Footer />
        </div>
    );
}
