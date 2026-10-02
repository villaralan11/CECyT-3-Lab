"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

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
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-border text-foreground shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/60" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
