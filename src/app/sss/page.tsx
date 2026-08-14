"use client";

import React, { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const FAQ_DATA = [
    {
        question: "Kılıflarınız hangi materyallerden üretiliyor?",
        answer: "Tasarım serimize göre değişiklik göstermekle birlikte genel olarak yüksek dayanımlı polikarbonat arka yüzey ve darbe emici TPU (Termoplastik Poliüretan) kenarlıklardan üretilir. Y2K ve Metalik serilerimizde özel dokulu kaplamalar bulunmaktadır."
    },
    {
        question: "Sipariş verdim, kargom ne zaman ulaşır?",
        answer: "Standart teslimat süremiz 1-3 iş günüdür. Siparişiniz kargoya verildiğinde size takip numarası içeren bir SMS/E-posta gönderilir. Ayrıca üst menüdeki 'Kargo Takip' sayfasından da durumunu öğrenebilirsiniz."
    },
    {
        question: "Kılıflar MagSafe uyumlu mu?",
        answer: "Yeni nesil (iPhone 12 ve sonrası) tüm cihaz kılıflarımız MagSafe şarj ve aksesuarlarıyla tam uyumludur. İç kısımdaki güçlü mıknatıs halkası sayesinde şarj kesintisi yaşamazsınız."
    },
    {
        question: "Beğenmezsem iade edebilir miyim?",
        answer: "Elbette. Siparişinizi teslim aldıktan sonraki 14 gün içerisinde, ürün kullanılmamış ve ambalajı zarar görmemiş olması şartıyla koşulsuz şartsız iade edebilirsiniz."
    },
    {
        question: "Telefon ekranını ve kamerasını koruyor mu?",
        answer: "Evet. Tüm Shuffle Case kılıflarında ekran ve kamera çerçevesi 1.5mm yüksekliğinde tasarlanmıştır. Telefonunuzu düz bir zemine koyduğunuzda lensleriniz veya ekranınız yüzeye temas etmez."
    },
    {
        question: "Karıştırma İndirimi (Şanslı Ürün) nedir?",
        answer: "Anasayfamızdaki 'Karıştır' çarkını çevirdiğinizde sistem rastgele bir ürünü seçer. Eğer bu ürünü 15 dakika içerisinde sepetinize eklerseniz otomatik olarak %15 özel indirim kazanırsınız. Fırsatı kaçırmayın!"
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white pb-24" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <Header />

            <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 lg:py-24">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-4">
                        SIKÇA SORULAN SORULAR
                    </h1>
                    <p className="text-xl font-bold bg-black text-white p-2 inline-block">
                        Aklınıza takılan her şeyin cevabı burada.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {FAQ_DATA.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`border-4 border-black bg-white transition-all duration-300 ${isOpen ? 'shadow-[8px_8px_0_0_#ff0000] -translate-y-1 -translate-x-1' : 'shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                                >
                                    <h3 className={`text-lg md:text-xl font-black uppercase pr-4 ${isOpen ? 'text-red-500' : 'text-black'}`}>
                                        {faq.question}
                                    </h3>
                                    <span className="text-3xl font-black font-mono w-8 text-center transition-transform duration-300 flex-shrink-0" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
                                        +
                                    </span>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 border-t-4 border-black' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="p-6 text-base md:text-lg font-medium leading-relaxed bg-[#f0f0f0]">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-16 p-8 border-4 border-black bg-white shadow-[8px_8px_0_0_#000] text-center">
                    <h2 className="text-2xl font-black uppercase mb-4">Aradığınız cevabı bulamadınız mı?</h2>
                    <p className="mb-6 font-bold">Destek ekibimiz sizin için burada.</p>
                    <a href="/iletisim" className="inline-block bg-black text-white px-8 py-4 font-black uppercase tracking-widest border-2 border-black hover:bg-red-500 transition-colors">
                        BİZE ULAŞIN
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
