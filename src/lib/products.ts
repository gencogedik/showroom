export type ProductCategory = "Metalik" | "Karanlık" | "Y2K Özel" | "Aksesuar";

const uniqueCases = [
    { id: "1", title: "TITANIUM GHOST", category: "Metalik" },
    { id: "2", title: "OBSIDIAN ARMOR", category: "Karanlık" },
    { id: "3", title: "CHROME HEART", category: "Y2K Özel" },
    { id: "4", title: "CYBER CORE", category: "Metalik" },
    { id: "5", title: "ACID WASH", category: "Y2K Özel" },
    { id: "6", title: "LIQUID METAL", category: "Metalik" },
    { id: "7", title: "MECHA SHIELD", category: "Karanlık" },
    { id: "8", title: "TOKYO NIGHTS", category: "Y2K Özel" },
    { id: "9", title: "MINECRAFT LOAF", category: "Y2K Özel" },
    { id: "10", title: "SPONGE CLOUDS", category: "Y2K Özel" },
    { id: "11", title: "JAZZ SOUL", category: "Y2K Özel" },
    { id: "12", title: "VINYL MEMORIES", category: "Y2K Özel" },
    { id: "13", title: "SURREAL FISH", category: "Y2K Özel" },
];

export const PRODUCTS = uniqueCases.map((c) => ({
    id: c.id,
    title: c.title,
    price: 399,
    imageSrc: `/images/${c.id}.png`,
    category: c.category as ProductCategory,
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
