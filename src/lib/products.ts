export type ProductCategory = "Metalik" | "Karanlık" | "Y2K Özel" | "Aksesuar";

const TOTAL_PRODUCTS = 20;

const CATEGORIES: ProductCategory[] = ["Metalik", "Karanlık", "Y2K Özel"];

export const PRODUCTS = Array.from({ length: TOTAL_PRODUCTS }, (_, i) => ({
    id: (i + 1).toString(),
    title: `TEXTURE CASE #${(i + 1).toString().padStart(2, '0')}`,
    price: 399,
    imageSrc: `/images/${i + 1}.jpg`,
    category: CATEGORIES[i % CATEGORIES.length],
    isAccessory: false,
    description: "Endüstriyel metal ve doku detaylı, el yapımı y2k telefon kılıfı. Darbe emici silikon iç katman ve paslanmaz çelik hissiyatlı dış yüzey ile telefonunuzu sanatsal bir zırha dönüştürür."
}));

// Aksesuarlar (Upsell için)
export const ACCESSORIES = [
    {
        id: "acc-1",
        title: "Kırılmaz Cam Ekran Koruyucu",
        price: 100,
        imageSrc: "/logo.png", // Şimdilik logo kullanıyoruz
        category: "Aksesuar" as ProductCategory,
        isAccessory: true,
        description: "Ekranınızı darbelere karşı zırh gibi korur."
    },
    {
        id: "acc-2",
        title: "20W Hızlı Şarj Aleti",
        price: 250,
        imageSrc: "/logo.png", // Şimdilik logo kullanıyoruz
        category: "Aksesuar" as ProductCategory,
        isAccessory: true,
        description: "Telefonunuzu anında şarj eden güçlü adaptör."
    }
];

export const ALL_PRODUCTS = [...PRODUCTS, ...ACCESSORIES];

export function getProductById(id: string) {
    return ALL_PRODUCTS.find(p => p.id === id);
}
