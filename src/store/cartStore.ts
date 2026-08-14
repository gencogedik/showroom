import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // e.g. "TEXTURE CASE #01"
    title: string;
    model: string; // e.g. "iPhone 15 Pro Max"
    price: number; // e.g. 399
    quantity: number;
    imageSrc: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    luckyProductId: string | null;
    luckyDiscountExpiry: number | null;
    globalDiscount: number | null;
    globalDiscountExpiry: number | null;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string, model: string) => void;
    updateQuantity: (id: string, model: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    setLuckyProduct: (id: string, expiryMs: number) => void;
    setGlobalDiscount: (percentage: number, expiryMs: number) => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getDiscountAmount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            luckyProductId: null,
            luckyDiscountExpiry: null,
            globalDiscount: null,
            globalDiscountExpiry: null,
            
            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find(i => i.id === item.id && i.model === item.model);
                    if (existingItem) {
                        return {
                            items: state.items.map(i => 
                                (i.id === item.id && i.model === item.model) ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                            isOpen: true
                        };
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true };
                });
            },
            
            removeItem: (id, model) => {
                set((state) => ({
                    items: state.items.filter(i => !(i.id === id && i.model === model))
                }));
            },
            
            updateQuantity: (id, model, quantity) => {
                set((state) => ({
                    items: state.items.map(i => 
                        (i.id === id && i.model === model) ? { ...i, quantity: Math.max(1, quantity) } : i
                    )
                }));
            },
            
            clearCart: () => set({ items: [] }),
            
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            
            setLuckyProduct: (id, expiryMs) => set({ luckyProductId: id, luckyDiscountExpiry: Date.now() + expiryMs }),
            
            setGlobalDiscount: (percentage, expiryMs) => set({ globalDiscount: percentage, globalDiscountExpiry: Date.now() + expiryMs }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
            
            getDiscountAmount: () => {
                const state = get();
                const now = Date.now();
                let discount = 0;
                
                // 1. Check Global Gamification Discount (Spin Wheel)
                if (state.globalDiscount && state.globalDiscountExpiry && now < state.globalDiscountExpiry) {
                    const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
                    return subtotal * (state.globalDiscount / 100);
                }
                
                // 2. Check Lucky Product Discount (Scroll Morph)
                if (state.luckyProductId && state.luckyDiscountExpiry && now < state.luckyDiscountExpiry) {
                    const luckyItem = state.items.find(i => i.id === state.luckyProductId);
                    if (luckyItem) {
                        return (luckyItem.price * luckyItem.quantity) * 0.15;
                    }
                }
                
                return discount;
            },

            getTotalPrice: () => {
                const subtotal = get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
                const discount = get().getDiscountAmount();
                return subtotal - discount;
            }
        }),
        {
            name: 'shuffle-case-cart', // unique name in localStorage
        }
    )
);
