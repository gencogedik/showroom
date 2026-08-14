import IntroAnimation from "@/components/ui/scroll-morph-hero";
import { Header } from "@/components/ui/header";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Header />
            <div className="w-full h-screen overflow-hidden relative bg-[#e5e5e5]">
                <IntroAnimation />
            </div>
        </main>
    );
}
