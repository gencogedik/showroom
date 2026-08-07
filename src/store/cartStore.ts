import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // e.g. "TEXTURE CASE #01"
    title: string;
    price: number; // e.g. 399
    quantity: number;
    imageSrc: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            
            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find(i => i.id === item.id);
                    if (existingItem) {
                        return {
                            items: state.items.map(i => 
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            )
                        };
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }] };
                });
            },
            
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter(i => i.id !== id)
                }));
            },
            
            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map(i => 
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    )
                }));
            },
            
            clearCart: () => set({ items: [] }),
            
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
            
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            }
        }),
        {
            name: 'shuffle-case-cart', // unique name in localStorage
        }
    )
);
