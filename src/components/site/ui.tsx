"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// =================== SECTION HEADER ===================

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "fuchsia",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  accent?: "fuchsia" | "emerald" | "amber";
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
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
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

// =================== SIM CARD (link to a simulator page) ===================

export function SimCard({
  index,
  name,
  description,
  type,
  href,
  accentBg,
  accentText,
  accentBorder,
  accentBgSoft,
  badge,
}: {
  index: string;
  name: string;
  description: string;
  type: string;
  href: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  accentBgSoft: string;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={href}
        className="group block h-full rounded-2xl border border-border bg-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r rounded-t-2xl", accentBg)} />
        <div className="flex items-start justify-between">
          <span className="text-xs font-mono font-bold text-muted-foreground">{index}</span>
          <div className="flex items-center gap-1.5">
            {badge && (
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", accentBgSoft, accentText)}>
                {badge}
              </span>
            )}
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", accentBgSoft, accentText, accentBorder)}>
              {type}
            </span>
          </div>
        </div>
        <h3 className="mt-3 text-lg font-bold text-foreground leading-tight">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", accentText)}>
            <Play className="h-3 w-3" />
            Abrir simulador
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

// =================== BREADCRUMB ===================

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.href ? (
            <Link href={it.href} className="hover:text-foreground transition-colors">
              {it.label}
            </Link>
          ) : (
            <span className="text-foreground font-semibold">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="text-muted-foreground/50">/</span>}
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
    <div className="rounded-3xl border border-border bg-gradient-to-br from-fuchsia-50 via-pink-50 to-amber-50 p-8 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:scale-105 transition-all"
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-fuchsia-300 hover:bg-fuchsia-50/40 transition-all"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
