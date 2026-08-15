"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    {
        question: "KILIFLAR GERÇEKTEN KORUYUCU MU?",
        answer: "Kesinlikle. Tasarımlarımız sadece estetik değil, aynı zamanda cihazınızı darbelere karşı koruyacak zırh niteliğinde sert ve dayanıklı materyallerden üretilir."
    },
    {
        question: "KARGO SÜRECİ NASIL İŞLİYOR?",
        answer: "Siparişinizi tamamladığınız an otopilot sistemimiz devreye girer. Kargonuz anında hazırlanır ve Kargonomi güvencesiyle en kısa sürede kapınıza ulaşır. Kargo Takip sayfasından durumunu anlık izleyebilirsiniz."
    },
    {
        question: "İADE VE DEĞİŞİM ŞARTLARI NELERDİR?",
        answer: "Kullanılmamış ve ambalajı zarar görmemiş ürünleri teslim aldıktan sonraki 14 gün içinde koşulsuz şartsız iade edebilir veya değiştirebilirsiniz."
    },
    {
        question: "Y2K / BRUTALİST NE DEMEK?",
        answer: "Y2K, 2000'lerin başındaki retro-fütüristik estetiği temsil eder. Brutalizm ise web tasarımında işlevselliği, hamliği ve kalın çizgileri vurgulayan bir sanat akımıdır. Biz bu ikisini telefon kılıflarında birleştiriyoruz."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div 
            className="min-h-screen bg-white text-black pt-32 pb-24 relative overflow-hidden"
            style={{ backgroundImage: 'linear-gradient(90deg, black 2px, transparent 2px)', backgroundSize: '100% 100%, 10vw 100%' }}
        >
            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 border-b-8 border-black pb-8"
                >
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
                        S.S.S. <br/>
                        <span className="text-3xl md:text-5xl text-gray-400">SIKÇA SORULAN SORULAR</span>
                    </h1>
                </motion.div>

                <div className="space-y-6">
                    {FAQS.map((faq, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="border-4 border-black bg-[#e5e5e5] shadow-[8px_8px_0_0_#000]"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex justify-between items-center p-6 text-left hover:bg-black hover:text-white transition-colors focus:outline-none"
                            >
                                <span className="text-xl md:text-2xl font-black tracking-widest">{faq.question}</span>
                                <span className="text-3xl font-bold ml-4">
                                    {openIndex === i ? '−' : '+'}
                                </span>
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-white border-t-4 border-black"
                                    >
                                        <div className="p-6 text-lg md:text-xl font-mono font-bold leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
