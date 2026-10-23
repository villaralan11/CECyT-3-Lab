"use client";

/**
 * Componentes compartidos del sistema visual — usados por todas las
 * páginas internas. Lenguaje: editorial, hairlines, guinda institucional,
 * tipografía jerárquica. Sin cards 3D, sin gradientes decorativos.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// =================== SECTION HEADER ===================

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "guinda",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  /** Mantiene la API previa: cada página usaba fuchsia|emerald|amber */
  accent?: "fuchsia" | "emerald" | "amber" | "guinda";
}) {
  const dotMap = {
    fuchsia: "bg-fuchsia-500",
    emerald: "bg-teal-500",
    amber: "bg-amber-500",
    guinda: "bg-guinda-600",
  };
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-guinda-600">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[accent])} aria-hidden="true" />
        {eyebrow}
      </p>
      <h1 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.75] text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// =================== SIM CARD ===================

export function SimCard({
  index,
  name,
  description,
  type,
  href,
  accentText,
  badge,
}: {
  index: string;
  name: string;
  description: string;
  type: string;
  href: string;
  /** Compat: props previas se aceptan y se ignoran si ya no aplican */
  accentBg?: string;
  accentBorder?: string;
  accentBgSoft?: string;
  accentText: string;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
    >
      <Link
        href={href}
        className="group row-highlight relative flex h-full items-stretch gap-5 border border-black/[0.07] bg-white p-5 transition-all duration-300 hover:border-black/[0.14] hover:shadow-[0_16px_40px_-24px_rgb(46_11_29/0.25)]"
      >
        <span className="hidden w-10 shrink-0 items-start justify-between sm:flex">
          <span className="pt-0.5 font-mono text-[11px] font-medium text-muted-foreground/70">{index}</span>
          <span aria-hidden="true" className="h-px w-full pt-0.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            {badge && (
              <span className={cn("font-mono text-[10px] font-semibold uppercase tracking-wider", accentText)}>
                {badge}
              </span>
            )}
            <span className="rounded-md border border-black/[0.08] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              {type}
            </span>
          </span>
          <span className="mt-2 block text-[17px] font-semibold leading-snug tracking-tight text-foreground">
            {name}
          </span>
          <span className="mt-1.5 block text-[13px] leading-[1.65] text-muted-foreground line-clamp-3">
            {description}
          </span>
          <span className={cn("mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium transition-all duration-200 group-hover:gap-3", accentText)}>
            Abrir simulador
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

// =================== BREADCRUMB ===================

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-7 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground" aria-label="Miga de pan">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.href ? (
            <Link href={it.href} className="transition-colors hover:text-guinda-700">
              {it.label}
            </Link>
          ) : (
            <span className="text-foreground">{it.label}</span>
          )}
          {i < items.length - 1 && <span aria-hidden="true" className="text-muted-foreground/40">/</span>}
        </span>
      ))}
    </nav>
  );
}

// =================== CTA STRIP ===================

export function CtaStrip({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-black/[0.07] bg-white p-8 sm:p-10">
      <div className="dots-pattern absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative">
        <h2 className="max-w-[24ch] text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-[58ch] text-[14.5px] leading-[1.7] text-muted-foreground">{description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-guinda-600 px-6 text-sm font-medium text-white shadow-[0_10px_28px_-10px_rgb(108_29_69/0.5)] transition-all duration-200 hover:bg-guinda-700 active:scale-[0.98]"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/[0.09] bg-white/70 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors duration-200 hover:bg-white"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
