import { Metadata } from "next";
import { getProductById, ALL_PRODUCTS } from "@/lib/products";
import { ProductDetailClient } from "./product-detail-client";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const resolvedParams = await params;
    const product = getProductById(resolvedParams.id);

    if (!product) {
        return {
            title: "Ürün Bulunamadı | Shuffle Case",
            description: "Aradığınız kılıf bulunamadı."
        };
    }

    return {
        title: `${product.title} | Shuffle Case`,
        description: product.description,
        openGraph: {
            title: `${product.title} | Shuffle Case`,
            description: product.description,
            images: [product.imageSrc],
        },
    };
}

// SSG for all products
export async function generateStaticParams() {
    return ALL_PRODUCTS.map((product) => ({
        id: product.id,
    }));
}

export default async function ProductPage({ params }: Props) {
    const resolvedParams = await params;
    const product = getProductById(resolvedParams.id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#e5e5e5] font-mono">
                <h1 className="text-4xl font-black mb-4 text-black">ÜRÜN BULUNAMADI</h1>
                <a href="/shop" className="bg-black text-white px-8 py-4 font-bold border-2 border-black hover:bg-white hover:text-black transition-colors shadow-[8px_8px_0_0_#ff0000]">
                    MAĞAZAYA DÖN
                </a>
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}
