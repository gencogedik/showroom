import IntroAnimation from "@/components/ui/scroll-morph-hero";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="w-full h-screen overflow-hidden relative bg-[#e5e5e5]">
                <IntroAnimation />
            </div>
        </main>
    );
}
