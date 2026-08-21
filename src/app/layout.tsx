import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { Toast } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shuffle Case | Endüstriyel Dokular",
  description: "Endüstriyel metal ve doku detaylı, el yapımı y2k telefon kılıfları. Telefonunu bir sanat eserine dönüştür.",
  openGraph: {
    title: "Shuffle Case | Endüstriyel Dokular",
    description: "Endüstriyel metal ve doku detaylı, el yapımı y2k telefon kılıfları.",
    url: "https://shufflecase.com",
    siteName: "Shuffle Case",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        {children}
        <CartDrawer />
        <Toast />
      </body>
    </html>
  );
}
