"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => setStatus('sent'), 2000);
    };

    return (
        <div 
            className="min-h-screen bg-black text-[#00ff00] pt-32 pb-24 overflow-hidden relative font-mono flex items-center justify-center"
            style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        >
            {/* Radar Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
            
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl border-4 border-[#00ff00] bg-black/80 p-8 md:p-12 shadow-[0_0_20px_rgba(0,255,0,0.2)]"
                >
                    <div className="flex justify-between items-center border-b-2 border-[#00ff00] pb-4 mb-8">
                        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest">
                            {'>'} ILETISIM_PROTOKOLU
                        </h1>
                        <div className="w-4 h-4 bg-[#00ff00] animate-pulse"></div>
                    </div>

                    {status === 'sent' ? (
                        <div className="text-center py-16 animate-pulse">
                            <h2 className="text-3xl font-bold mb-4">MESAJ ILETILDI_</h2>
                            <p className="text-xl">En kisa surede donus yapilacaktir.</p>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="mt-8 border-2 border-[#00ff00] px-6 py-2 hover:bg-[#00ff00] hover:text-black transition-colors"
                            >
                                [ YENI_MESAJ_GONDER ]
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-xl">{'>'} KULLANICI_ADI :</label>
                                <input 
                                    type="text" 
                                    required
                                    disabled={status === 'sending'}
                                    className="w-full bg-transparent border-2 border-[#00ff00] text-[#00ff00] p-4 focus:outline-none focus:bg-[#00ff00]/10 transition-colors"
                                    placeholder="Isminizi girin..."
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-xl">{'>'} FREKANS (E-MAIL) :</label>
                                <input 
                                    type="email" 
                                    required
                                    disabled={status === 'sending'}
                                    className="w-full bg-transparent border-2 border-[#00ff00] text-[#00ff00] p-4 focus:outline-none focus:bg-[#00ff00]/10 transition-colors"
                                    placeholder="E-posta adresiniz..."
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-xl">{'>'} VERI_PAKETI (MESAJ) :</label>
                                <textarea 
                                    required
                                    rows={5}
                                    disabled={status === 'sending'}
                                    className="w-full bg-transparent border-2 border-[#00ff00] text-[#00ff00] p-4 focus:outline-none focus:bg-[#00ff00]/10 transition-colors resize-none"
                                    placeholder="Iletmek istediginiz mesaj..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full border-4 border-[#00ff00] bg-transparent text-[#00ff00] text-2xl font-black p-4 hover:bg-[#00ff00] hover:text-black transition-all active:scale-95 disabled:opacity-50"
                            >
                                {status === 'sending' ? '[ ILETILIYOR... ]' : '[ GONDER ]'}
                            </button>
                        </form>
                    )}
                </motion.div>

                {/* Additional Info */}
                <div className="mt-12 text-center space-y-2 opacity-70">
                    <p>{'>'} MERKEZ_USSU: Elmalikent, Adem Yavuz Cd. No17/A, Umraniye / Istanbul</p>
                    <p>{'>'} RADAR_AGI: hello@shufflecase.com</p>
                    <p>{'>'} SINYAL: +90 (555) 555 55 55</p>
                </div>
            </div>
        </div>
    );
}
