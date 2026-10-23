"use client";

/**
 * Navegación flotante Liquid Glass.
 *
 * Jerarquía:
 *   - Marca (CECyT No. 3 · LAB IPN) — ancla identidad,uper izquierda.
 *   - Enlaces principales con píldora activa deslizante (guinda sutil).
 *   - «Explorar» abre un panel de búsqueda sobre las rutas REALES del
 *     sitio (⌘K / Ctrl K, flechas, Enter, Esc). No invierte contenido.
 *
 * Movil: botón que despliega una hoja de vidrio con los mismos
 * elementos a tamaño táctil ≥44px. La identidad Liquid Glass se
 * mantiene; la jerarquía se adapta, no se achata.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { LiquidGlass } from "@/components/site/liquid-glass";
import { SUBJECTS, TOPICS, SECTIONS, SUBJECT_STYLE, type TopicEntry } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/fisica", label: "Física" },
  { href: "/quimica", label: "Química" },
  { href: "/ingles", label: "Inglés" },
  { href: "/laboratorios", label: "Laboratorios" },
  { href: "/retos", label: "Retos" },
  { href: "/progreso", label: "Progreso" },
];

/* ================================================================== */
/* Panel «Explorar» — busca solo contenido que existe                   */
/* ================================================================== */

function ExplorePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      // espera al paint para poder enfocar dentro del AnimatePresence
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  const prevPath = useRef(pathname);
  useEffect(() => {
    // cierra solo cuando la ruta cambia (no al montar)
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all: { label: string; sub: string; href: string; group: string; dot?: string }[] = [
      ...SUBJECTS.map((s) => ({ label: s.name, sub: `${s.topics} temas · ${s.simulators}`, href: s.href, group: "Materias" })),
      ...TOPICS.map((t) => ({
        label: t.name,
        sub: `${t.subjectName} · ${t.desc}`,
        href: t.href,
        group: "Temas",
        dot: SUBJECT_STYLE[t.subject].dot,
      })),
      ...SECTIONS.map((s) => ({ label: s.name, sub: s.desc, href: s.href, group: "Secciones" })),
      { label: "Explorar todo", sub: "Índice completo al final de esta página", href: "/#indice", group: "Más" },
    ];
    if (!q) return all;
    return all.filter((r) => `${r.label} ${r.sub}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(0, results.length - 1)));
  }, [results.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => (results.length ? (c + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter") {
        const r = results[cursor];
        if (r) {
          onClose();
          if (r.href.startsWith("/#")) {
            const el = document.getElementById(r.href.slice(2));
            el?.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.assign(r.href);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, cursor, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-label="Explorar contenido"
        >
          <button
            aria-label="Cerrar exploración"
            className="absolute inset-0 w-full cursor-default bg-foreground/25 backdrop-blur-[2px]"
            onClick={onClose}
            tabIndex={-1}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-4 top-[10vh] mx-auto max-w-xl sm:inset-x-0"
          >
            <LiquidGlass
              variant="sheet"
              className="rounded-[20px] shadow-[0_24px_80px_-16px_rgb(46_11_29/0.35)] border border-white/40"
            >
              <div className="flex items-center gap-3 border-b border-black/[0.06] px-4">
                <Search className="h-4 w-4 shrink-0 text-guinda-600" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca un tema, materia o herramienta…"
                  className="h-12 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                  aria-label="Buscar en el laboratorio"
                />
                <kbd className="hidden shrink-0 rounded-md border border-black/10 bg-white/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
                  ESC
                </kbd>
              </div>
              <ul
                className="max-h-[52vh] overflow-y-auto overscroll-contain p-2"
                role="listbox"
                aria-label="Resultados"
              >
                {results.length === 0 && (
                  <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Sin resultados para «{query}»
                  </li>
                )}
                {results.map((r, i) => (
                  <li key={r.href} role="option" aria-selected={i === cursor}>
                    <Link
                      href={r.href.startsWith("/#") ? "/" : r.href}
                      onClick={() => {
                        onClose();
                        if (r.href.startsWith("/#")) {
                          setTimeout(() => {
                            document.getElementById(r.href.slice(2))?.scrollIntoView({ behavior: "smooth" });
                          }, 80);
                        }
                      }}
                      onMouseEnter={() => setCursor(i)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        i === cursor ? "bg-guinda-600/[0.07] text-guinda-700" : "text-foreground"
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", r.dot ?? "bg-muted-foreground/50")}
                        aria-hidden="true"
                      />
                      <span className="font-medium">{r.label}</span>
                      <span className="ml-auto truncate pl-2 text-xs text-muted-foreground">{r.sub}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-black/[0.06] px-4 py-2.5 text-[11px] text-muted-foreground">
                <span>{results.length} rutas del laboratorio</span>
                <span className="flex items-center gap-3">
                  <span>↑↓ navegar</span>
                  <span>↵ abrir</span>
                </span>
              </div>
            </LiquidGlass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================================================================== */
/* Navbar                                                              */
/* ================================================================== */

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!exploreOpen) {
      const onKey = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          setExploreOpen(true);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [exploreOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <LiquidGlass
          as="header"
          variant="nav"
          interactive
          className={cn(
            "mx-auto flex h-[52px] w-full max-w-4xl items-center gap-2 rounded-[18px] px-2.5 transition-shadow duration-300 sm:px-3",
            scrolled
              ? "shadow-[0_12px_40px_-8px_rgb(46_11_29/0.22),0_2px_8px_rgb(46_11_29/0.06)]"
              : "shadow-[0_6px_24px_-8px_rgb(46_11_29/0.14)]"
          )}
        >
          {/* Marca */}
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 rounded-xl px-1.5 py-1"
            onClick={closeMenu}
            aria-label="CECyT No. 3 Lab — inicio"
          >
            <img
              src="/cecyt3-logo.png"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-[10px] object-cover ring-1 ring-black/[0.08] bg-white shadow-sm transition-transform duration-300 group-hover:scale-[1.04]"
            />
            <span className="leading-none">
              <span className="block text-[13.5px] font-semibold tracking-tight text-foreground">
                CECyT No. 3
              </span>
              <span className="mt-[3px] block text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Lab · IPN
              </span>
            </span>
          </Link>

          {/* Enlaces de escritorio */}
          <nav
            className="relative mx-auto hidden min-w-0 items-center lg:flex"
            aria-label="Navegación principal"
          >
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative z-10 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-200",
                    active ? "text-guinda-700" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-guinda-600/[0.08] shadow-[inset_0_0_0_1px_rgb(108_29_69/0.14)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Acciones */}
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setExploreOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/45 px-3.5 py-1.5 text-[13px] font-medium text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_1px_3px_rgb(46_11_29/0.08)] backdrop-blur transition-all duration-200 hover:bg-white/70 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_4px_10px_rgb(46_11_29/0.10)] active:scale-[0.97] sm:inline-flex"
              aria-label="Explorar contenido del laboratorio"
            >
              Explorar
              <kbd className="hidden rounded-[5px] border border-black/[0.09] bg-white/70 px-1 text-[10px] font-sans text-muted-foreground md:inline">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/45 text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] backdrop-blur transition-colors hover:bg-white/70 lg:hidden"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </LiquidGlass>
      </div>

      {/* Hoja móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-3 top-[72px] z-40 lg:hidden"
          >
            <LiquidGlass variant="sheet" className="rounded-[20px] border border-white/40 shadow-[0_24px_70px_-12px_rgb(46_11_29/0.3)]">
              <nav className="p-2" aria-label="Navegación móvil">
                {LINKS.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[46px] items-center justify-between rounded-2xl px-4 text-[15px] font-medium transition-colors",
                        active
                          ? "bg-guinda-600/[0.08] text-guinda-700"
                          : "text-foreground/90 hover:bg-black/[0.03]"
                      )}
                    >
                      {l.label}
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-guinda-600" aria-hidden="true" />
                      )}
                    </Link>
                  );
                })}
                <div className="mx-3 my-2 h-px bg-black/[0.06]" aria-hidden="true" />
                <button
                  onClick={() => {
                    closeMenu();
                    setTimeout(() => setExploreOpen(true), 120);
                  }}
                  className="flex min-h-[46px] w-full items-center gap-2.5 rounded-2xl px-4 text-[15px] font-medium text-guinda-700"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Explorar todo el contenido
                </button>
              </nav>
            </LiquidGlass>
          </motion.div>
        )}
      </AnimatePresence>

      <ExplorePanel open={exploreOpen} onClose={() => setExploreOpen(false)} />
    </>
  );
}
