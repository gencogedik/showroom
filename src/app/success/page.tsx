import React from "react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono flex flex-col justify-center items-center p-4 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            {/* Background brutalist elements */}
            <div className="absolute top-10 left-10 text-9xl font-black text-gray-300 opacity-20 pointer-events-none -rotate-12">SUCCESS</div>
            <div className="absolute bottom-10 right-10 text-9xl font-black text-gray-300 opacity-20 pointer-events-none rotate-12">PAID</div>
            
            <main className="bg-white border-8 border-black p-8 md:p-16 max-w-2xl w-full text-center shadow-[16px_16px_0_0_#ff0000] relative z-10">
                <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-500 shadow-[4px_4px_0_0_#ff0000]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4">SİPARİŞ ALINDI</h1>
                
                <div className="bg-black text-white p-4 font-bold my-8 uppercase text-sm border-l-4 border-red-500">
                    Ödemeniz başarıyla gerçekleşti. Kan ve metal kokulu yeni zırhınız (kılıfınız) en kısa sürede yola çıkıyor.
                </div>

                <div className="grid grid-cols-2 gap-4 text-left border-4 border-black p-4 mb-8">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Durum</p>
                        <p className="font-black text-green-600 uppercase">ÖDENDİ</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Kargo</p>
                        <p className="font-black uppercase">PTT Kargo</p>
                    </div>
                </div>

                <Link 
                    href="/shop" 
                    className="inline-block w-full bg-red-500 text-white font-black text-xl py-4 uppercase tracking-widest border-4 border-black hover:bg-black transition-colors shadow-[8px_8px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    MAĞAZAYA DÖN
                </Link>
            </main>
        </div>
    );
}
