"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Contador animado para métricas: parte de 0 y sube con un spring al entrar
 * en pantalla (IntersectionObserver propio + arranque inmediato si ya es
 * visible al montar). Respeta prefers-reduced-motion.
 * El padre debe llevar tabular-nums para que el ancho no baile.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 90, damping: 32 });
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(value);
      return;
    }
    const start = () => {
      if (fired.current) return;
      fired.current = true;
      raw.set(value);
    };
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) start();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -36px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduce, raw]);

  useEffect(() => {
    if (reduce) return;
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(Math.round(v));
    });
    return () => unsub();
  }, [spring, reduce]);

  return <span ref={ref} className={className}>{reduce ? value : 0}</span>;
}
