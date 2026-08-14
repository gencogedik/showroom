"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, globalDiscount } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        buyer_name: "",
        buyer_phone: "",
        buyer_address: "",
        buyer_state_id: "34", // Default Istanbul
        buyer_city_id: "828", // Default Kadikoy
    });
    
    // PayTR iframe token
    const [paytrToken, setPaytrToken] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFakeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (items.length === 0) {
            setError("SEPETİNİZ BOŞ!");
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (!formData.buyer_name || !formData.buyer_phone || !formData.buyer_address) {
            setError("LÜTFEN TÜM ALANLARI DOLDURUN!");
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const packages = items.map(item => ({
                content: `${item.quantity}x ${item.title}`,
                desi: "1"
            }));

            const response = await fetch('/api/kargo/olustur', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    packages
                })
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Sipariş oluşturulamadı!");
                setLoading(false);
                setTimeout(() => setError(null), 4000);
                return;
            }

            // Success! Clear cart (normally you'd do this, but for demo maybe not strictly necessary)
            useCartStore.getState().clearCart();
            
            setSuccessData(result.data);
            setLoading(false);
            
        } catch (err) {
            setError("Bir ağ hatası oluştu.");
            setLoading(false);
            setTimeout(() => setError(null), 4000);
        }
    };

    const handlePaytrSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            setError("SEPETİNİZ BOŞ!");
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (!formData.buyer_name || !formData.buyer_phone || !formData.buyer_address) {
            setError("LÜTFEN TÜM ALANLARI DOLDURUN!");
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const totalPrice = getTotalPrice();
            const finalPrice = globalDiscount ? totalPrice * (1 - (globalDiscount || 0) / 100) : totalPrice;
            
            const response = await fetch('/api/paytr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total: finalPrice,
                    user: {
                        name: formData.buyer_name,
                        email: "test@shufflecase.com", // Sabit veya formdan eklenebilir
                        address: formData.buyer_address,
                        city: formData.buyer_state_id, // Kargonomi İl ID'si
                        district: formData.buyer_city_id, // Kargonomi İlçe ID'si
                        phone: formData.buyer_phone
                    },
                    items: items
                })
            });

            const result = await response.json();

            if (result.status === "success" && result.token) {
                setPaytrToken(result.token);
                // PayTR iframe script'ini ekliyoruz
                setTimeout(() => {
                    const iframe = document.getElementById('paytriframe') as HTMLIFrameElement;
                    if (iframe && typeof window !== 'undefined') {
                        // script src="https://www.paytr.com/js/iframeResizer.min.js"
                        const script = document.createElement('script');
                        script.src = "https://www.paytr.com/js/iframeResizer.min.js";
                        script.onload = () => {
                            // @ts-ignore
                            if (window.iFrameResize) window.iFrameResize({}, '#paytriframe');
                        };
                        document.body.appendChild(script);
                    }
                }, 500);
            } else {
                setError(result.reason || "PayTR Başlatılamadı!");
            }
        } catch (err) {
            setError("Ödeme sistemiyle iletişim kurulamadı.");
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = getTotalPrice();
    const finalPrice = globalDiscount ? totalPrice * (1 - (globalDiscount || 0) / 100) : totalPrice;

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#e5e5e5] border-b-4 border-black p-4 flex items-center justify-between shadow-[0_8px_0_0_rgba(0,0,0,0.1)] backdrop-blur-md bg-opacity-90">
                <Link href="/" className="hover:scale-105 transition-transform">
                    <img src="/logo.png" alt="Shuffle Case" className="h-10 md:h-14 object-contain invert drop-shadow-[2px_2px_0_rgba(192,192,192,1)]" />
                </Link>
                <h1 className="text-xl font-black uppercase tracking-widest text-black">GÜVENLİ ÖDEME</h1>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12 min-h-[70vh] flex flex-col lg:flex-row gap-8">
                
                {/* Left: Form */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0_0_#000]">
                        <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-4 mb-6">Teslimat Bilgileri</h2>
                        
                        {successData ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-100 border-4 border-black p-8 text-center"
                            >
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-4xl font-black uppercase text-green-700 mb-4">SİPARİŞ ALINDI!</h3>
                                <p className="font-bold text-lg mb-6">Siparişiniz başarıyla sistemimize ve kargo firmasına iletildi.</p>
                                
                                <div className="bg-white border-4 border-black p-4 inline-block mb-8">
                                    <p className="uppercase text-sm font-bold text-gray-500">Kargo Takip Numaranız</p>
                                    <p className="text-2xl font-black font-mono tracking-widest">{successData.shipping_webservice_tracking_code || successData.id || "HAZIRLANIYOR"}</p>
                                </div>
                                
                                <br />
                                <Link href="/kargo-takip" className="inline-block bg-black text-white font-black uppercase px-8 py-4 border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] transition-all">
                                    KARGO DURUMUNU TAKİP ET
                                </Link>
                            </motion.div>
                        ) : (
                            <form className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold uppercase tracking-wider text-sm">Ad Soyad</label>
                                    <input 
                                        type="text" 
                                        name="buyer_name"
                                        placeholder="Örn: Ahmet Yılmaz" 
                                        value={formData.buyer_name}
                                        onChange={handleChange}
                                        className="w-full bg-[#e5e5e5] border-2 border-black p-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#000] transition-all"
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold uppercase tracking-wider text-sm">Telefon Numarası</label>
                                    <input 
                                        type="tel" 
                                        name="buyer_phone"
                                        placeholder="Örn: 5551234567" 
                                        value={formData.buyer_phone}
                                        onChange={handleChange}
                                        className="w-full bg-[#e5e5e5] border-2 border-black p-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#000] transition-all"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                                        <label className="font-bold uppercase tracking-wider text-sm">Şehir</label>
                                        <select 
                                            name="buyer_state_id"
                                            value={formData.buyer_state_id}
                                            onChange={handleChange}
                                            className="w-full bg-[#e5e5e5] border-2 border-black p-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#000] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="34">İstanbul</option>
                                            <option value="6">Ankara</option>
                                            <option value="35">İzmir</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                                        <label className="font-bold uppercase tracking-wider text-sm">İlçe</label>
                                        <select 
                                            name="buyer_city_id"
                                            value={formData.buyer_city_id}
                                            onChange={handleChange}
                                            className="w-full bg-[#e5e5e5] border-2 border-black p-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#000] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="828">Kadıköy</option>
                                            <option value="807">Beşiktaş</option>
                                            <option value="854">Şişli</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold uppercase tracking-wider text-sm">Açık Adres</label>
                                    <textarea 
                                        name="buyer_address"
                                        placeholder="Örn: Caferağa Mah. Moda Cad. No: 1 D: 2" 
                                        rows={3}
                                        value={formData.buyer_address}
                                        onChange={handleChange}
                                        className="w-full bg-[#e5e5e5] border-2 border-black p-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#000] transition-all resize-none"
                                    />
                                </div>

                                <div className="mt-8">
                                    <h3 className="font-black uppercase border-b-2 border-black pb-2 mb-4">Ödeme Yöntemi</h3>
                                    <div className="bg-black text-white p-4 font-bold uppercase flex items-center justify-between border-4 border-black">
                                        <span>Kapıda Ödeme / Havale</span>
                                        <span>✓</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-500 mt-2">* Kredi kartı altyapısı PayTR üzerinden 256-bit şifreleme ile sağlanır.</p>
                                </div>

                                {paytrToken ? (
                                    <div className="mt-6 border-4 border-black bg-white p-2">
                                        <h3 className="font-black uppercase text-center bg-black text-white p-2 mb-4">💳 Kart Bilgilerinizi Girin</h3>
                                        <iframe src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`} id="paytriframe" frameBorder="0" scrolling="no" style={{ width: '100%' }}></iframe>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 mt-6">
                                        <button 
                                            type="button"
                                            onClick={handlePaytrSubmit}
                                            disabled={loading || items.length === 0}
                                            className={`w-full py-6 text-2xl font-black uppercase tracking-widest border-4 border-black transition-all shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none ${loading || items.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-[#ff0000]'}`}
                                        >
                                            {loading ? 'YÜKLENİYOR...' : '💳 KART İLE ÖDE (PAYTR)'}
                                        </button>

                                        <button 
                                            type="button"
                                            onClick={handleFakeSubmit}
                                            disabled={loading || items.length === 0}
                                            className={`w-full py-4 text-xl font-bold uppercase tracking-widest border-4 border-black transition-all shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none bg-white text-black hover:bg-gray-200`}
                                        >
                                            🧪 KARGONOMİ TESTİ (SAHTE TAMAMLAMA)
                                        </button>
                                    </div>
                                )}
                                
                                <AnimatePresence>
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-red-500 text-white font-black text-center p-4 border-2 border-black mt-4 uppercase"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right: Cart Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-[#e5e5e5] border-4 border-black p-6 sticky top-24">
                        <h3 className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-4">Sipariş Özeti</h3>
                        
                        <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                            {items.length === 0 ? (
                                <p className="font-bold text-center py-4">Sepetiniz boş.</p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 bg-white border-2 border-black p-2 items-center">
                                        <div className="w-16 h-16 bg-gray-200 border-2 border-black flex-shrink-0">
                                            <img src={`/images/${item.id}.jpg`} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-sm line-clamp-1">{item.title}</p>
                                            <p className="font-bold text-xs text-gray-600">Adet: {item.quantity}</p>
                                        </div>
                                        <p className="font-black whitespace-nowrap">{(item.price * item.quantity).toLocaleString("tr-TR")} TL</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t-4 border-black pt-4 flex flex-col gap-2 font-bold uppercase">
                            <div className="flex justify-between text-gray-600">
                                <span>Ara Toplam</span>
                                <span>{totalPrice.toLocaleString("tr-TR")} TL</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Kargo</span>
                                <span>Ücretsiz</span>
                            </div>
                            
                            {globalDiscount && globalDiscount > 0 ? (
                                <div className="flex justify-between text-green-600">
                                    <span>Çark İndirimi (%{globalDiscount})</span>
                                    <span>- {((totalPrice * (globalDiscount || 0)) / 100).toLocaleString("tr-TR")} TL</span>
                                </div>
                            ) : null}
                            
                            <div className="flex justify-between text-2xl font-black mt-4 pt-4 border-t-2 border-black">
                                <span>TOPLAM</span>
                                <span>{finalPrice.toLocaleString("tr-TR")} TL</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            
            <Footer />
        </div>
    );
}
