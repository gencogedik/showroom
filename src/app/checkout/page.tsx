"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Footer } from "@/components/ui/footer";

export default function CheckoutPage() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: ""
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Post order data to our backend to get PayTR token
            const response = await fetch("/api/paytr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    total: getTotalPrice(),
                    user: formData
                })
            });

            const data = await response.json();

            if (data.status === "success" && data.token) {
                // Redirect to payment page with the token
                router.push(`/payment?token=${data.token}`);
            } else {
                alert("Ödeme başlatılamadı: " + (data.reason || "Bilinmeyen hata"));
                setLoading(false);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Bir bağlantı hatası oluştu.");
            setLoading(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono pb-24" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#e5e5e5] border-b-4 border-black p-4 md:px-8 flex items-center justify-between shadow-[0_8px_0_0_rgba(0,0,0,0.1)]">
                <Link href="/shop" className="font-bold uppercase tracking-widest text-sm hover:underline underline-offset-4 decoration-2">
                    &lt; Mağazaya Dön
                </Link>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-black">
                    ÖDEME (CHECKOUT)
                </h1>
            </header>

            <main className="max-w-6xl mx-auto px-4 pt-12 flex flex-col lg:flex-row gap-8">
                
                {/* Form Section */}
                <div className="w-full lg:w-2/3 bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_0_#000]">
                    <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">Teslimat Bilgileri</h2>
                    
                    <form id="checkout-form" onSubmit={handleCheckout} className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 flex flex-col">
                                <label className="font-bold uppercase mb-2">Ad Soyad</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-red-500 bg-[#e5e5e5]" type="text" placeholder="Adınız Soyadınız" />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className="font-bold uppercase mb-2">Telefon</label>
                                <input required name="phone" value={formData.phone} onChange={handleChange} className="border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-red-500 bg-[#e5e5e5]" type="tel" placeholder="05XX XXX XX XX" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold uppercase mb-2">E-Posta</label>
                            <input required name="email" value={formData.email} onChange={handleChange} className="border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-red-500 bg-[#e5e5e5]" type="email" placeholder="ornek@mail.com" />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold uppercase mb-2">Şehir</label>
                            <input required name="city" value={formData.city} onChange={handleChange} className="border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-red-500 bg-[#e5e5e5]" type="text" placeholder="Örn: İstanbul" />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold uppercase mb-2">Açık Adres</label>
                            <textarea required name="address" value={formData.address} onChange={handleChange} className="border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-red-500 bg-[#e5e5e5] h-32 resize-none" placeholder="Mahalle, Sokak, No, Daire..." />
                        </div>
                    </form>
                </div>

                {/* Cart Summary Section */}
                <div className="w-full lg:w-1/3 flex flex-col gap-8">
                    <div className="bg-[#c0c0c0] border-4 border-black p-6 shadow-[8px_8px_0_0_#ff0000]">
                        <h2 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Sepet Özeti</h2>
                        
                        {items.length === 0 ? (
                            <p className="py-4 font-bold">Sepetiniz boş.</p>
                        ) : (
                            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white border-2 border-black p-2">
                                        <img src={item.imageSrc} alt={item.title} className="w-16 h-16 object-cover border-2 border-black" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                                            <p className="text-sm">₺{item.price.toFixed(2)}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border-2 border-black font-bold active:bg-black active:text-white">-</button>
                                                <span className="text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border-2 border-black font-bold active:bg-black active:text-white">+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-red-500 font-bold px-2 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-black transition-colors">
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xl font-black uppercase border-t-2 border-black pt-4">
                            <span>Toplam:</span>
                            <span>₺{getTotalPrice().toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        form="checkout-form"
                        type="submit"
                        disabled={items.length === 0 || loading}
                        className="w-full bg-black text-white py-4 text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-red-500 transition-colors shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "İŞLENİYOR..." : "GÜVENLİ ÖDEME (PAYTR)"}
                    </button>
                </div>
            </main>
            
            <div className="mt-24">
                <Footer />
            </div>
        </div>
    );
}
