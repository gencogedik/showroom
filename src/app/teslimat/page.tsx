import React from "react";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono flex flex-col" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <header className="bg-black text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <Link href="/" className="hover:scale-105 transition-transform">
                    <img src="/logo.png" alt="Shuffle Case" className="h-8 md:h-10 object-contain invert" />
                </Link>
                <Link href="/shop" className="font-bold uppercase tracking-widest text-sm hover:underline">
                    Mağazaya Dön
                </Link>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 pt-12 mb-24">
                <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000]">
                    <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Teslimat ve Kargo Koşulları</h1>
                    
                    <div className="prose prose-lg prose-p:font-bold prose-h2:font-black prose-h2:text-2xl prose-h2:uppercase prose-h2:mt-8 max-w-none">
                        <p>
                            Mağazamızdan verdiğiniz siparişler, yasal süre olan 30 (otuz) günlük süreyi aşmamak koşuluyla, her bir ürün için Alıcı'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesindeki ön bilgilendirme kısmında belirtilen süre zarfında teslim edilir.
                        </p>
                        
                        <h2>Kargo Ücretleri ve Anlaşmalı Firmalar</h2>
                        <p>
                            Gönderilerimiz <strong>PTT Kargo</strong> aracılığı ile yapılmaktadır. Kargo ücreti alıcıya aittir ve sipariş esnasında toplam tutara yansıtılır veya kapıda ödenir. (Kampanya dönemlerinde kargo ücretsiz olabilir).
                        </p>

                        <h2>Teslimat Süresi</h2>
                        <p>
                            Stokta bulunan ürünler iş günleri (Pazartesi - Cuma) içerisinde <strong>1-3 iş günü</strong> içerisinde kargoya teslim edilmektedir. Özel sipariş veya üretim gerektiren ürünlerde bu süre ürün detay sayfasında ayrıca belirtilir.
                        </p>

                        <h2>Kargo Teslim Alınırken Dikkat Edilmesi Gerekenler</h2>
                        <p>
                            Ürün teslim alınırken kargo paketinde yırtık, ezilme, ıslanma vb. bir sorun olup olmadığı kontrol edilmelidir. Kargo yetkilisi hasarlı paketi tutanak altına almakla yükümlüdür. Hasar tespit tutanağı tutturulmayan gönderilerde kargo firmasından tazmin işlemi yapılamadığı için sorumluluk alıcıya aittir.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
