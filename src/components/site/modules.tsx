"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   Capa «módulos» — v1.1 (ver DESIGN.md)
   Componentes base para landing con patrón de módulos:
   columna estrecha, tipografía grande, tiles de radio 28px.
   ============================================================ */

/* ---------- FadeIn: reveal suave al hacer scroll (fade + rise) ---------- */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- CTA primario: la única pieza con el gradiente de marca ---------- */
export function CtaPrimary({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-7 text-[15px] font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-fuchsia-500/35 active:translate-y-0 active:scale-[0.98]",
        className
      )}
    >
      {children}
    </Link>
  );
}

/* ---------- CTA secundario: pill silencioso con borde ---------- */
export function CtaGhost({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-white px-7 text-[15px] font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-fuchsia-200 hover:bg-fuchsia-50/40 active:translate-y-0 active:scale-[0.98]",
        className
      )}
    >
      {children}
    </Link>
  );
}

/* ---------- ChevronLink: enlace con chevron (patrón ›) ---------- */
export function ChevronLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1 text-[15px] font-semibold text-fuchsia-700 transition-colors hover:text-fuchsia-900 dark:text-fuchsia-400 dark:hover:text-fuchsia-300",
        className
      )}
    >
      <span className="underline-offset-2 group-hover:underline">{children}</span>
      <ChevronRight
        className="mt-px h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </Link>
  );
}

/* ---------- ModuleTile: tile de módulo (full|half · plain|dark) ---------- */
export function ModuleTile({
  size = "half",
  tone = "plain",
  eyebrow,
  title,
  sub,
  href,
  ctaLabel = "Abrir",
  delay = 0,
  className,
  children,
}: {
  size?: "full" | "half";
  tone?: "plain" | "dark";
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  href?: string;
  ctaLabel?: string;
  delay?: number;
  className?: string;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={cn(
        "module-tile relative flex flex-col p-8 sm:p-10",
        dark
          ? "bg-foreground text-background"
          : "bg-card text-card-foreground ring-1 ring-border/70",
        size === "full" && "sm:col-span-2",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h3 className={cn("type-h3 text-foreground dark:text-background", eyebrow && "mt-2")}>
        {title}
      </h3>
      {sub ? (
        <p
          className={cn(
            "type-body mt-2 max-w-xl",
            dark ? "text-background/70" : "text-muted-foreground"
          )}
        >
          {sub}
        </p>
      ) : null}

      {children ? <div className="mt-6 flex flex-1 flex-col justify-end">{children}</div> : null}

      {href ? (
        <div className={cn(children ? "mt-6" : "mt-auto pt-6")}>
          <Link
            href={href}
            className={cn(
              "group inline-flex items-center gap-1 text-[15px] font-semibold transition-opacity hover:opacity-75",
              dark ? "text-background" : "text-fuchsia-700 dark:text-fuchsia-400"
            )}
          >
            <span className="underline-offset-2 group-hover:underline">{ctaLabel}</span>
            <ChevronRight
              className="mt-px h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </Link>
        </div>
      ) : null}
    </motion.article>
  );
}

/* ---------- ModuleGrid: 2 columnas; tiles full abarcan 2 ---------- */
export function ModuleGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-4", className)}>
      {children}
    </div>
  );
}

/* ---------- ModuleHeader: encabezado de módulo ---------- */
export function ModuleHeader({
  eyebrow,
  title,
  sub,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <FadeIn
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={cn("type-h2 text-foreground", eyebrow && "mt-2")}>{title}</h2>
      {sub ? <p className="type-sub mt-3 text-muted-foreground">{sub}</p> : null}
    </FadeIn>
  );
}
