"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { LiquidGlass } from "@/components/site/liquid-glass";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.92 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-5 right-5 z-40"
        >
          <LiquidGlass
            as="button"
            variant="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-guinda-700 shadow-[0_10px_30px_-8px_rgb(46_11_29/0.25)] transition-transform duration-150 hover:scale-105 active:scale-95"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Volver arriba"
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </LiquidGlass>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
