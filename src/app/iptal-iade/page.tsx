import React from "react";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export default function ReturnPolicyPage() {
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
                <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#ff0000]">
                    <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 text-red-500">İptal ve İade Koşulları</h1>
                    
                    <div className="prose prose-lg prose-p:font-bold prose-h2:font-black prose-h2:text-2xl prose-h2:uppercase prose-h2:mt-8 max-w-none">
                        <h2>14 Günlük İade Hakkı</h2>
                        <p>
                            Alıcı, satın aldığı ürünü teslim aldığı günden itibaren 14 (on dört) gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içerisinde tarafımıza e-posta veya telefon ile bildirimde bulunulması şarttır.
                        </p>

                        <h2>İade Edilemeyecek Ürünler</h2>
                        <p>
                            Alıcının isteği veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan (isim yazılı, özel baskılı kılıflar vb.) ürünler iade edilemez. Ürünün orijinal ambalajı zarar görmüş, kullanılmış veya tekrar satılabilirliği bozulmuş ise iade kabul edilmeyebilir.
                        </p>

                        <h2>İade Prosedürü</h2>
                        <ul className="list-disc pl-5 font-bold mb-4">
                            <li>İade talebinizi sipariş numaranız ile birlikte <strong>shufflekap@gmail.com</strong> adresine iletiniz.</li>
                            <li>Tarafınıza verilecek kargo iade kodu ile ürünü faturasıyla birlikte anlaşmalı kargomuza teslim ediniz.</li>
                            <li>Ürün tarafımıza ulaşıp incelendikten sonra, iade koşullarına uygunsa 3 ila 7 iş günü içerisinde ödeme yaptığınız kredi/banka kartınıza tutar iade edilir.</li>
                        </ul>

                        <h2>Sipariş İptali</h2>
                        <p>
                            Siparişiniz henüz kargoya verilmediyse, iptal talebinizi anında işleme alıp ücret iadesini gerçekleştirebiliriz. Kargoya teslim edilmiş paketler için iptal yapılamaz, ancak ürün size ulaştığında "İade Prosedürü"nü izleyerek iade edebilirsiniz.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
