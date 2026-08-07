import React from "react";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export default function ContactPage() {
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
                    <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">İletişim ve Adres Bilgileri</h1>
                    
                    <div className="flex flex-col gap-8 text-lg">
                        <section>
                            <h2 className="font-black text-xl mb-2 text-red-500">FİRMA ÜNVANI</h2>
                            <p className="font-bold border-l-4 border-black pl-4">
                                [FİRMA UNVANI / AD SOYAD YAZINIZ]
                            </p>
                        </section>

                        <section>
                            <h2 className="font-black text-xl mb-2 text-red-500">ADRES</h2>
                            <p className="font-bold border-l-4 border-black pl-4 whitespace-pre-line">
                                [TAM AÇIK ADRESİNİZİ YAZINIZ]
                                [İLÇE] / [İL]
                            </p>
                        </section>

                        <section>
                            <h2 className="font-black text-xl mb-2 text-red-500">MÜŞTERİ HİZMETLERİ TELEFONU</h2>
                            <p className="font-bold border-l-4 border-black pl-4">
                                [TELEFON NUMARANIZI YAZINIZ]
                            </p>
                        </section>

                        <section>
                            <h2 className="font-black text-xl mb-2 text-red-500">E-POSTA ADRESİ</h2>
                            <p className="font-bold border-l-4 border-black pl-4">
                                [E-POSTA ADRESİNİZİ YAZINIZ]
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
