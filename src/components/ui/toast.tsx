"use client";

import React from "react";
import { useToastStore } from "@/store/toastStore";
import { AnimatePresence, motion } from "framer-motion";

export function Toast() {
    const { show, message } = useToastStore();

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -100, opacity: 0, rotate: -2 }}
                    animate={{ y: 20, opacity: 1, rotate: 0 }}
                    exit={{ y: -100, opacity: 0, rotate: 2 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
                >
                    <div className="bg-black text-white font-mono font-black uppercase tracking-widest px-8 py-4 border-4 border-white shadow-[8px_8px_0_0_#ff0000]">
                        {message}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
