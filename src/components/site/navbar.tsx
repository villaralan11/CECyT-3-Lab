"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom, Menu, X, Rocket } from "lucide-react";

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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Helper to close menu (used by mobile link clicks)
  const handleMobileNav = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={handleMobileNav}>
            <img src="/cecyt3-logo.png" alt="CECyT No. 3 — Estanislao Ramírez Ruiz — IPN" width={40} height={40} className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-border bg-white group-hover:scale-105 transition-transform" />
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
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
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
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-3 space-y-1 border-t border-border">
                {LINKS.map((l) => {
                  const active =
                    l.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={handleMobileNav}
                      className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                        active
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
