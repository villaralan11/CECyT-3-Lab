"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// =================== SECTION HEADER ===================

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "fuchsia",
  titleClass,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  accent?: "fuchsia" | "emerald" | "amber";
  titleClass?: string;
}) {
  const cmap = {
    fuchsia: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };
  const dot = {
    fuchsia: "bg-fuchsia-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };
  return (
    <div className="max-w-3xl">
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
          cmap[accent]
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", dot[accent])} />
        {eyebrow}
      </span>
      <h1 className={cn("mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight", titleClass)}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// =================== FANCY TITLE TEXT ===================
/* El tratamiento del hero de /fisica: degradado vivo con barrido
   animado, halo de color difuso y subrayado curvo que se dibuja. */

const FANCY_THEMES = {
  emerald: {
    text: "from-emerald-600 via-teal-500 to-cyan-400",
    halo: "from-emerald-400/25 via-teal-300/25 to-cyan-300/35",
    stops: ["#059669", "#14b8a6", "#22d3ee"],
  },
  fuchsia: {
    text: "from-fuchsia-600 via-pink-500 to-rose-400",
    halo: "from-fuchsia-400/25 via-pink-300/25 to-rose-300/35",
    stops: ["#c026d3", "#ec4899", "#fb7185"],
  },
  amber: {
    text: "from-amber-600 via-orange-500 to-yellow-400",
    halo: "from-amber-400/25 via-orange-300/25 to-yellow-300/35",
    stops: ["#d97706", "#f97316", "#facc15"],
  },
} as const;

export function FancyTitleText({
  children,
  theme,
  gradientId,
}: {
  children: React.ReactNode;
  theme: keyof typeof FANCY_THEMES;
  gradientId: string;
}) {
  const t = FANCY_THEMES[theme];
  return (
    <span className="relative inline-block">
      {/* Halo de color detrás del texto */}
      <span
        aria-hidden="true"
        className={`absolute -inset-x-4 -inset-y-2 rounded-full bg-gradient-to-r ${t.halo} blur-xl animated-gradient`}
      />
      <span
        className={`relative bg-gradient-to-r ${t.text} bg-clip-text text-transparent animated-gradient pr-[0.12em] -mr-[0.12em]`}
      >
        {children}
      </span>
      {/* Subrayado curvo que se dibuja — altura fija para que no se
          estire con el ancho del título ni suba a cruzar las letras */}
      <svg
        className="absolute -bottom-4 left-0 h-2.5 w-full"
        viewBox="0 0 220 12"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M3 9C60 3 160 3 217 8"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor={t.stops[0]} />
            <stop offset="0.5" stopColor={t.stops[1]} />
            <stop offset="1" stopColor={t.stops[2]} />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

// =================== BREADCRUMB ===================

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((it, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            {it.href ? (
              <Link href={it.href} className="hover:text-foreground transition-colors">
                {it.label}
              </Link>
            ) : (
              <span className="text-foreground font-semibold" aria-current="page">{it.label}</span>
            )}
            {i < items.length - 1 && <span className="text-muted-foreground/50" aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
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
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-fuchsia-50 via-pink-50 to-amber-50 p-8 text-center">
      <div className="absolute inset-0 dots-pattern opacity-30" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/25 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-px active:translate-y-0 active:scale-95 transition-all"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-fuchsia-300 hover:bg-fuchsia-50/40 active:scale-95 transition-all"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
