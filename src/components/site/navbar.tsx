"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FlaskConical, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/fisica", label: "Física" },
  { href: "/quimica", label: "Química" },
  { href: "/ingles", label: "Inglés" },
  { href: "/laboratorios", label: "Laboratorios" },
  { href: "/retos", label: "Retos" },
  { href: "/progreso", label: "Progreso" },
  { href: "/notebook", label: "Notebook IA" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header data-site-chrome="" className="lab-navbar">
      <div className="lab-nav-inner">
        <Link href="/" className="lab-brand" onClick={() => setOpen(false)} aria-label="CECyT No. 3 Lab, inicio">
          <span className="lab-brand-mark"><img src="/cecyt3-logo.png" alt="" width={38} height={38} /></span>
          <span className="lab-brand-copy"><strong>CECyT No. 3</strong><small>LAB <i>·</i> IPN</small></span>
        </Link>

        <nav className="lab-nav-links" aria-label="Navegación principal">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={isActive(link.href) ? "active" : ""}>
              {link.label}
              {isActive(link.href) && <motion.span layoutId="lab-nav-indicator" className="lab-nav-indicator" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            </Link>
          ))}
        </nav>

        <Link href="/fisica" className="lab-nav-cta"><FlaskConical size={14} /> Explorar</Link>

        <span className="ml-auto flex items-center gap-2 lg:ml-0.5">
          <ThemeToggle />
        </span>

        <button type="button" className="lab-mobile-toggle" onClick={() => setOpen((value) => !value)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav className="lab-mobile-menu" aria-label="Navegación móvil" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
            {LINKS.map((link, i) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={isActive(link.href) ? "active" : ""}>
                <span className="mobile-link-index">0{i + 1}</span>{link.label}<ArrowUpRight size={15} />
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
