import React from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import Image from "next/image";

export const metadata = {
    title: "Hakkımızda | Shuffle Case",
    description: "Sıradışı dokular, endüstriyel tasarımlar ve telefonunuz için en agresif koruma.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#e5e5e5] font-mono selection:bg-red-500 selection:text-white pb-24" style={{ backgroundImage: 'radial-gradient(#c0c0c0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <Header />

            <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 lg:py-24">
                
                {/* Hero Section */}
                <div className="border-4 border-black bg-white shadow-[16px_16px_0_0_#000] p-8 md:p-16 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-8 leading-none" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                        DOKUYU HİSSET.
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-3xl border-l-8 border-red-500 pl-6">
                        Telefon kılıfı sadece bir koruma aracı değildir. O, sizin tarzınızın, agresifliğinizin ve yansıtmak istediğiniz kimliğin bir uzantısıdır. Shuffle Case, "sıradan" olana karşı bir isyandır.
                    </p>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="border-4 border-black bg-[#c0c0c0] p-8 shadow-[8px_8px_0_0_#000] transform -rotate-1 hover:rotate-0 transition-transform">
                        <h2 className="text-3xl font-black uppercase mb-4 border-b-4 border-black pb-2">Brutalist Felsefe</h2>
                        <p className="font-medium text-lg leading-relaxed">
                            Tasarım dilimiz, ham materyallerin güzelliğini ve işlevselliği öne çıkaran Brutalizm ve Y2K estetiğinden ilham alır. Gizlemeye çalışmıyoruz; vidaları, dokuları ve pürüzleri gururla sergiliyoruz. Asimetrik kesimler ve metalik parlamalar, her bir kılıfın karakterini belirler.
                        </p>
                    </div>

                    <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#ff0000] transform rotate-1 hover:rotate-0 transition-transform flex flex-col justify-center">
                        <h2 className="text-3xl font-black uppercase mb-4 text-red-500">Ödünsüz Koruma</h2>
                        <p className="font-bold text-lg leading-relaxed">
                            Tarzımız agresif, ancak korumamız çok daha agresif. "Military-grade" (askeri standartlarda) testlerden geçirilmiş darbe emici köşe tasarımlarımızla telefonunuz, yere düşmeyi bir zayıflık değil, bir test olarak görecek.
                        </p>
                    </div>
                </div>

                {/* Image / Vibe Section */}
                <div className="relative w-full aspect-[21/9] border-4 border-black shadow-[12px_12px_0_0_#000] overflow-hidden mb-16 bg-black flex items-center justify-center group">
                    <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                    <h2 className="relative z-20 text-4xl md:text-6xl font-black text-white mix-blend-difference tracking-widest text-center">
                        KURALLARI KARIŞTIR.
                    </h2>
                    {/* Noise Overlay */}
                    <div className="absolute inset-0 z-30 opacity-30 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
