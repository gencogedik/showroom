import { create } from 'zustand';

interface ToastState {
    show: boolean;
    message: string;
    triggerToast: (msg: string) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    show: false,
    message: "",
    triggerToast: (msg) => {
        set({ show: true, message: msg });
        setTimeout(() => set({ show: false }), 3000);
    },
    hideToast: () => set({ show: false }),
}));
