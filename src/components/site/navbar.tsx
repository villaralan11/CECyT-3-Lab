"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Rocket } from "lucide-react";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/fisica", label: "Física" },
  { href: "/quimica", label: "Química" },
  { href: "/ingles", label: "Inglés" },
  { href: "/laboratorios", label: "Laboratorios" },
  { href: "/retos", label: "Retos" },
  { href: "/progreso", label: "Progreso" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const idx = LINKS.findIndex(
      (l) => (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href))
    );
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [pathname]);

  const handleMobileNav = () => setOpen(false);

  return (
    <header
      className={`sticky z-50 transition-all duration-300 ${
        scrolled
          ? "top-3 mx-3 sm:mx-4 lg:mx-6 rounded-2xl border border-border bg-background/85 backdrop-blur-xl shadow-lg shadow-black/[0.06]"
          : "top-0 border border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={handleMobileNav}>
            <Image
              src="/cecyt3-logo-optimized.webp"
              alt="CECyT No. 3 — Estanislao Ramírez Ruiz — IPN"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-border bg-white group-hover:scale-105 transition-transform"
              priority
            />
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-foreground">
                CECyT No. 3
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                Lab · IPN
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative">
            {/* Animated active indicator - CSS only */}
            <div
              className="absolute bottom-0 left-0 h-0.5 w-[80px] rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
              style={{
                transform: `translateX(${activeIndex * 72}px)`,
              }}
              aria-hidden="true"
            />
            {LINKS.map((l, i) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setActiveIndex(i)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors z-10 ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/fisica"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:scale-105 transition-all"
            >
              <Rocket className="h-4 w-4" />
              Explorar
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu - CSS animation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-3 space-y-1 border-t border-border">
            {LINKS.map((l, i) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={handleMobileNav}
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "bg-secondary text-foreground animate-fade-in"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}