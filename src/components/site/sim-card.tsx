"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tarjeta de simulador expandible (acordeón inline)                    */
/* Compartida por /fisica, /quimica e /ingles para que el catálogo     */
/* se vea y se comporte igual en las tres materias.                     */
/* ------------------------------------------------------------------ */

export type SimTheme = {
  icon: string;
  soft: string;
  dot: string;
  hover: string;
  glow: string;
  hoverShadow: string;
  hoverSoft: string;
  chipOn?: string;
  panel?: string;
  ghost?: string;
};

export type SimItem = {
  name: string;
  desc: string;
  tag: string;
  href: string;
  icon: LucideIcon;
  keywords: string;
  points: string[];
};

/* id estable de cada tarjeta: lo usa el chip «Continuar donde te quedaste»
   para abrir el simulador inline y hacer scroll hasta él. */
export const simCardId = (href: string) =>
  "sim-" +
  href
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const TOOL_BTN =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.07] bg-white text-muted-foreground/70 transition-all hover:border-black/20 hover:text-foreground active:scale-90";

export function SimCard({
  sim,
  theme,
  open,
  onToggle,
  index = 0,
  full = false,
}: {
  sim: SimItem;
  theme: SimTheme;
  open: boolean;
  onToggle: () => void;
  index?: number;
  /* La unidad tiene un solo simulador: la tarjeta va a todo el ancho */
  full?: boolean;
}) {
  const panelId = `${simCardId(sim.href)}-panel`;
  const stageRef = useRef<HTMLDivElement>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isFull, setIsFull] = useState(false);

  /* Reflejar el estado de pantalla completa del navegador */
  useEffect(() => {
    const onFs = () =>
      setIsFull(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* Todos los sims se abren en modo embed: los de Física ocultan su botón
     «Catálogo» (base.js) y los de Química/Inglés la barra y el pie del sitio. */
  const frameSrc = sim.href.includes("?")
    ? `${sim.href}&embed=1`
    : `${sim.href}?embed=1`;

  const reload = () => {
    setLoaded(false);
    setReloadKey((k) => k + 1);
  };

  const toggleFull = () => {
    if (document.fullscreenElement === stageRef.current) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void stageRef.current?.requestFullscreen().catch(() => {});
    }
  };

  return (
    <motion.article
      id={simCardId(sim.href)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 2) * 0.05 }}
      className={`shine group relative min-w-0 scroll-mt-44 overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
        open
          ? "col-span-full border-black/[0.12] shadow-[0_22px_48px_-24px_rgba(24,24,27,0.32)]"
          : `${full ? "col-span-full " : ""}border-black/[0.06] shadow-[0_1px_2px_rgba(24,24,27,0.04)] hover:-translate-y-1 ${theme.hover} ${theme.hoverShadow}`
      }`}
    >
      {/* ================= Encabezado clicable ================= */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="relative flex w-full items-start gap-4 p-4 text-left sm:p-5"
      >
        {/* Halo de color en la esquina */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.06] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.16] ${theme.icon}`}
        />
        <span
          className={`relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${theme.icon} ${theme.glow}`}
        >
          <sim.icon className="h-5.5 w-5.5" />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2.5">
            <span className="min-w-0 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-[15.5px]">
              {sim.name}
            </span>
            {/* Chevron — móvil */}
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.07] bg-white/80 text-muted-foreground/60 transition-all duration-300 sm:hidden ${theme.hoverSoft}`}
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </span>
          </span>
          <span className="mt-1 block max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
            {sim.desc}
          </span>
          <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] ${theme.soft}`}
            >
              <span className={`h-1 w-1 rounded-full ${theme.dot}`} />
              {sim.tag}
            </span>
            {sim.points.map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-full border border-black/[0.06] bg-black/[0.02] px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </span>
        </span>
        {/* Chevron + etiqueta — escritorio */}
        <span className="relative hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.07] bg-white/80 text-muted-foreground/60 transition-all duration-300 ${theme.hoverSoft}`}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground/45 transition-colors group-hover:text-foreground/60">
            {open ? "Cerrar" : "Abrir"}
          </span>
        </span>
      </button>

      {/* Línea de acento inferior (se pinta completa al abrir) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left transition-transform duration-500 ${
          open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        } ${theme.icon}`}
      />

      {/* ================= Panel desplegable ================= */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-label={`Simulador ${sim.name}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div ref={stageRef} className="flex min-h-0 flex-col bg-white">
              {/* Barra de herramientas */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-black/[0.06] px-4 py-2.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${theme.dot}`} />
                  <span className="truncate text-[13px] font-semibold text-foreground">
                    {sim.name}
                  </span>
                  <span
                    className={`hidden rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] sm:inline-flex ${theme.soft}`}
                  >
                    {sim.tag}
                  </span>
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={reload}
                    title="Recargar simulador"
                    aria-label="Recargar simulador"
                    className={TOOL_BTN}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleFull}
                    title={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
                    aria-label={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
                    className={TOOL_BTN}
                  >
                    {isFull ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <a
                    href={sim.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir en pestaña nueva"
                    aria-label="Abrir en pestaña nueva"
                    className={TOOL_BTN}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={onToggle}
                    title="Cerrar simulador"
                    aria-label="Cerrar simulador"
                    className={TOOL_BTN}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              </div>

              {/* Escenario del simulador */}
              <div className={`relative ${isFull ? "flex-1" : ""}`}>
                <iframe
                  key={reloadKey}
                  src={frameSrc}
                  title={sim.name}
                  onLoad={() => setLoaded(true)}
                  allow="fullscreen"
                  className={`block w-full border-0 bg-white ${
                    isFull ? "h-full" : "h-[clamp(430px,72vh,640px)]"
                  }`}
                />
                {!loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
                    <span className="relative flex h-9 w-9 items-center justify-center">
                      <span className={`absolute inset-0 animate-ping rounded-full opacity-20 ${theme.icon}`} />
                      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-black/[0.08] border-t-foreground/50" />
                    </span>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Cargando «{sim.name}»…
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
