"use client";

import { useEffect, useRef, useState } from "react";

const isBrowser = typeof window !== "undefined";
const IntersectionObserverConstructor = isBrowser ? window.IntersectionObserver : undefined;

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isBrowser || !IntersectionObserverConstructor) {
      setIsInView(true); // SSR fallback: show immediately
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserverConstructor(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "-60px 0px", threshold: 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold]);

  return { ref, isInView };
}

export function useStaggeredInView(count: number, options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isBrowser || !IntersectionObserverConstructor) {
      // SSR fallback: show all immediately
      setVisibleIndices(new Set(Array.from({ length: count }, (_, i) => i)));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserverConstructor(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < count; i++) {
            setTimeout(() => setVisibleIndices((prev) => new Set(prev).add(i)), i * 40);
          }
          observer.unobserve(el);
        }
      },
      { rootMargin: "-60px 0px", threshold: 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count, options?.rootMargin, options?.threshold]);

  return { ref, visibleIndices };
}