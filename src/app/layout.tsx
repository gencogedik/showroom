import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shuffle Case | Endüstriyel Dokular",
  description: "Sıradışı dokular, endüstriyel tasarımlar ve telefonunuz için en agresif koruma.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#e5e5e5] text-black`}
      >
        <div className="min-h-full flex flex-col">{children}</div>
      </body>
    </html>
  );
}
