import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-black text-white border-t-8 border-white p-8 md:p-12 font-mono">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Brand Info */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-3xl font-black uppercase tracking-widest text-red-500 mb-2">SHUFFLE CASE</h3>
                    <p className="text-sm font-bold opacity-80">
                        Sıradışı dokular, endüstriyel tasarımlar ve telefonunuz için en agresif koruma.
                    </p>
                    <div className="flex gap-4 mt-4">
                        {/* 256 BIT SSL BADGE */}
                        <div className="border-2 border-white px-3 py-1 font-bold text-xs">256-BIT SSL GÜVENCESİ</div>
                    </div>
                    <div className="flex gap-4 mt-2">
                        <a href="https://instagram.com/shuffle_case" target="_blank" rel="noreferrer" className="text-white hover:text-[#ff0000] hover:scale-110 transition-all font-bold uppercase underline">
                            [ INSTAGRAM ]
                        </a>
                        <a href="https://tiktok.com/@shufflekap" target="_blank" rel="noreferrer" className="text-white hover:text-[#ff0000] hover:scale-110 transition-all font-bold uppercase underline">
                            [ TIKTOK ]
                        </a>
                    </div>
                </div>

                {/* Legal Links */}
                <div className="flex flex-col gap-2">
                    <h4 className="text-xl font-black uppercase mb-4 border-b-2 border-white pb-2 inline-block">Yasal Metinler</h4>
                    <Link href="/satis-sozlesmesi" className="hover:text-red-500 hover:translate-x-2 transition-all font-bold text-sm uppercase">Mesafeli Satış Sözleşmesi</Link>
                    <Link href="/iptal-iade" className="hover:text-red-500 hover:translate-x-2 transition-all font-bold text-sm uppercase">İptal ve İade Koşulları</Link>
                    <Link href="/teslimat" className="hover:text-red-500 hover:translate-x-2 transition-all font-bold text-sm uppercase">Teslimat ve Kargo</Link>
                    <Link href="/kargo-takip" className="hover:text-red-500 hover:translate-x-2 transition-all font-bold text-sm uppercase">Kargo Takip</Link>
                </div>

                {/* Contact Links */}
                <div className="flex flex-col gap-2">
                    <h4 className="text-xl font-black uppercase mb-4 border-b-2 border-white pb-2 inline-block">Müşteri İlişkileri</h4>
                    <Link href="/iletisim" className="hover:text-red-500 hover:translate-x-2 transition-all font-bold text-sm uppercase">İletişim ve Adres</Link>
                    <p className="text-sm mt-4 font-bold opacity-70">
                        Tüm siparişleriniz %100 iade garantisi altındadır.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t-2 border-dashed border-gray-600 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs font-bold uppercase">&copy; {new Date().getFullYear()} Shuffle Case. Tüm hakları saklıdır.</p>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold bg-white text-black px-2 py-1">PAYTR Altyapısı</span>
                </div>
            </div>
        </footer>
    );
}
