import React from "react";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export default function SalesAgreementPage() {
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
                    <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Mesafeli Satış Sözleşmesi</h1>
                    
                    <div className="prose prose-sm prose-p:font-bold prose-h3:font-black prose-h3:uppercase prose-h3:mt-6 max-w-none">
                        <h3>MADDE 1 - TARAFLAR</h3>
                        <p><strong>SATICI:</strong></p>
                        <ul className="list-disc pl-5 font-bold mb-4">
                            <li>Unvanı: Shuffle Case</li>
                            <li>Adresi: Elmalıkent, Adem Yavuz Cd. No: 17 B, 34764 Ümraniye / İstanbul</li>
                            <li>Telefon: +90 541 192 52 06</li>
                            <li>Email: shufflekap@gmail.com</li>
                        </ul>
                        
                        <p><strong>ALICI (TÜKETİCİ):</strong></p>
                        <p>Sipariş veren kişinin, sipariş ekranında beyan ettiği Ad, Soyad, Adres ve İletişim bilgileri esas alınır.</p>

                        <h3>MADDE 2 - KONU</h3>
                        <p>
                            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                        </p>

                        <h3>MADDE 3 - SÖZLEŞME KONUSU ÜRÜN, ÖDEME VE TESLİMAT</h3>
                        <p>
                            Ürünlerin cinsi ve türü, miktarı, marka/modeli, rengi, vergiler dahil satış bedeli, ödeme şekli ve teslimat bilgileri siparişin sonlandığı andaki bilgilerden oluşmaktadır. Ödeme PAYTR altyapısı ile kredi kartı/banka kartı aracılığıyla tahsil edilir.
                        </p>

                        <h3>MADDE 4 - GENEL HÜKÜMLER</h3>
                        <p>
                            4.1. ALICI, internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
                        </p>
                        <p>
                            4.2. Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler kısmında açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
                        </p>

                        <h3>MADDE 5 - CAYMA HAKKI</h3>
                        <p>
                            ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (on dört) gün içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir. Özel üretim veya kişiselleştirilmiş ürünlerde cayma hakkı kullanılamaz.
                        </p>

                        <p className="mt-8 opacity-70 italic text-xs">
                            * İşbu sözleşme ALICI tarafından elektronik olarak onaylandığı tarihte yürürlüğe girer.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
