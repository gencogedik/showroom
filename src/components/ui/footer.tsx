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
                        <div className="border-2 border-white px-3 py-1 font-bold text-xs flex items-center gap-2">
                            <span>🔒</span> 256-BIT SSL GÜVENCESİ
                        </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                        <a href="https://instagram.com/shuffle_case" target="_blank" rel="noreferrer" className="text-white hover:text-[#ff0000] hover:scale-110 transition-all" title="Instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                            </svg>
                        </a>
                        <a href="https://tiktok.com/@shufflekap" target="_blank" rel="noreferrer" className="text-white hover:text-[#ff0000] hover:scale-110 transition-all" title="TikTok">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                            </svg>
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
