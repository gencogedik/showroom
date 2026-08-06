import IntroAnimation from "@/components/ui/scroll-morph-hero";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="w-full h-[800px] border rounded-lg overflow-hidden relative">
                <IntroAnimation />
            </div>
        </main>
    );
}
