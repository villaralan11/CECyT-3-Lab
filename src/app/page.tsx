"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  X,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { LiquidGlass } from "@/components/site/liquid-glass";
import { SUBJECTS, TOPICS, SUBJECT_STYLE } from "@/lib/site-data";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

/* ================================================================== */
/* Caracteres compartidos                                              */
/* ================================================================== */

const EASE = [0.23, 1, 0.32, 1] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-guinda-600">
      {children}
    </p>
  );
}

function Entrance({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================== */
/* HERO — el instrumento: tiro parabólico real del simulador /fisica    */
/*   Física mensurada con las mismas ecuaciones del simulador:          */
/*   v₀=15 m/s, θ=45°, g=9,81 m/s² → r=v₀²·sin2θ/g, h=(v₀sinθ)²/2g      */
/* ================================================================== */

function HeroInstrument() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const yFig = useMotionValue(0);
  const yTxt = useMotionValue(0);

  // Parallax ligero, client-only (aplico valores en effects: sin diff SSR)
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 → 1 mientras el bloque cruza el viewport
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        const centered = p - 0.5;
        yFig.set(-16 * centered);
        yTxt.set(-8 * centered);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [reduced, yFig, yTxt]);

  // Escala: rango horizontal 25 m → 480 unidades internas
  const W = 480;
  const H = 210;
  const range = 22.94; // m — alcance real (v₀=15, 45°, 9.81)
  const hmax = 5.74; // m — altura máxima
  const sX = (m: number) => (m / (range + 2)) * (W - 30) + 20;
  const sY = (m: number) => H - 18 - (m / (hmax + 1.2)) * (H - 42);
  // trayectoria paramétrica exacta (la misma del simulator: x=v·cosθ·t, y=v·sinθ·t−g·t²/2)
  const pts: string[] = [];
  const tFlight = (2 * 15 * Math.SQRT1_2) / 9.81;
  for (let i = 0; i <= 60; i++) {
    const t = (tFlight * i) / 60;
    const x = 15 * Math.SQRT1_2 * t;
    const yv = 15 * Math.SQRT1_2 * t - 4.905 * t * t;
    pts.push(`${sX(x).toFixed(1)},${sY(yv).toFixed(1)}`);
  }
  const path = `M ${pts.join(" L ")}`;
  const apexX = sX(range / 2);
  const apexY = sY(hmax);

  return (
    <div ref={ref} className="relative">
      <motion.div style={{ y: yTxt }} className="mb-3 flex items-center justify-between font-mono text-[10.5px] tracking-wider text-muted-foreground">
        <span className="uppercase">Instrumento 03 · Tiro parabólico</span>
        <Link href="/fisica/tiros" className="inline-flex items-center gap-1 text-guinda-600 hover:underline">
          /fisica/tiros <ArrowUpRight className="h-3 w-3" />
        </Link>
      </motion.div>

      <motion.figure
        style={{ y: yFig }}
        className="corner-ticks relative select-none overflow-hidden rounded-[20px] border border-black/[0.08] bg-white text-guinda-900/70 shadow-[0_1px_2px_rgb(46_11_29/0.05),0_24px_60px_-24px_rgb(46_11_29/0.18)]"
        initial={{ opacity: 0, scale: 0.975, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        aria-hidden="true"
      >
        <div className="graph-paper absolute inset-0 opacity-80" />
        <svg viewBox={`0 0 ${W} ${H}`} className="relative block w-full">
          {/* líneas maestras */}
          <line x1={20} y1={H - 18} x2={W - 10} y2={H - 18} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
          <line x1={20} y1={H - 18} x2={20} y2={12} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
          {/* h máxima */}
          <line x1={apexX} y1={apexY} x2={apexX} y2={H - 18} stroke="currentColor" strokeOpacity="0.18" strokeDasharray="3 4" />
          <circle cx={apexX} cy={apexY} r="3" className="fill-guinda-600" />
          <text x={apexX + 8} y={apexY - 4} className="fill-current font-mono" fontSize="9.5" opacity="0.85">
            h máx 5,74 m · vᵧ = 0
          </text>
          {/* trayectoria */}
          <motion.path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.85"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.8, ease: "easeOut" }}
          />
          {/* vectors */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }}>
            <line x1={sX(range / 2)} y1={apexY} x2={sX(range / 2) + 34} y2={apexY} className="stroke-teal-600" strokeWidth="2" markerEnd="url(#arr)" />
            <text x={sX(range / 2) + 38} y={apexY + 3} className="fill-teal-700 font-mono" fontSize="9" >
              v cons.
            </text>
            <line x1={sX(0.47)} y1={sY(0.47)} x2={sX(0.47) + 20} y2={sY(0.47) - 22} className="stroke-teal-600" strokeWidth="2" markerEnd="url(#arr)" />
            <text x={sX(0.47) + 23} y={sY(0.47) - 18} className="fill-teal-700 font-mono" fontSize="9">v₀ₓ, v₀ᵧ</text>
          </motion.g>
          {/* aterrizaje */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.45, duration: 0.4 }}>
            <line x1={sX(range)} y1={H - 18} x2={sX(range)} y2={H - 34} stroke="currentColor" strokeOpacity="0.5" />
            <text x={sX(range) - 26} y={H - 6} className="fill-current font-mono" fontSize="9.5" opacity="0.8">22,94 m</text>
            <text x={22} y={H - 6} className="fill-current font-mono" fontSize="9.5" opacity="0.6">t vuelo 2,16 s</text>
          </motion.g>
          <defs>
            <marker id="arr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-teal-600" />
            </marker>
          </defs>
        </svg>
      </motion.figure>

      <motion.p style={{ y: yTxt }} className="mt-3 font-mono text-[10.5px] tracking-wider text-muted-foreground">
        v₀ = 15 m/s · θ = 45° · g = 9,81 m/s² — misma física que anima /fisica/tiros
      </motion.p>
    </div>
  );
}

/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Campo de color: la navbar glass refracta ESTE espectro al hacer scroll */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" aria-hidden="true">
        <div className="graph-paper absolute inset-0 opacity-60" />
        <div className="prism-band absolute -top-36 left-[6%] h-72 w-[560px] max-w-[80vw]" />
        <div className="prism-band prism-slow absolute -top-24 right-[10%] h-56 w-[420px] max-w-[70vw]" />
        <div className="prism-band prism-tight absolute top-40 left-[30%] h-40 w-[380px] max-w-[60vw]" />
      </div>
      <div className="mx-auto grid min-h-[calc(100svh-88px)] max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-2.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-guinda-600" aria-hidden="true" />
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-guinda-600">
              Laboratorio virtual · CECyT No. 3 · IPN
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
            className="mt-5 text-[clamp(2.8rem,6.6vw,5.1rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground"
          >
            Aprende haciendo.
            <span className="block text-muted-foreground/45">Falla con propósito.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="mt-6 max-w-[46ch] text-[16.5px] leading-[1.75] text-muted-foreground"
          >
            Física, Química e Inglés con una secuencia que demuestra en vez de
            explicar: intenta con el simulador, observa qué se rompe en tu
            razonamiento y corrigelo — con el concepto detrás de cada error.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Link
              href="/fisica"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-guinda-600 px-6 text-sm font-medium text-white shadow-[0_10px_28px_-10px_rgb(108_29_69/0.55)] transition-all duration-200 hover:bg-guinda-700 active:scale-[0.98]"
            >
              Empezar a practicar
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/laboratorios"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/[0.09] bg-white/60 px-6 text-sm font-medium text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.85)] backdrop-blur transition-colors duration-200 hover:bg-white/90"
            >
              Ver los laboratorios
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-auto pt-10 lg:pt-14"
          >
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
              10 TEMAS · 10 SIMULADORES · 82 EJERCICIOS — SIN CUENTAS, SIN NUBE
            </p>
          </motion.div>
        </div>

        <div className="lg:pl-4">
          <HeroInstrument />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* MÉTODO — el ciclo de falla productiva, como especificación          */
/* ================================================================== */

const CYCLE = [
  { n: "01", t: "Intentar", d: "Resuelves antes de leer la solución. Lo que crees saber entra en juego." },
  { n: "02", t: "Experimentar", d: "El simulador ejecuta tus hipótesis con variables reales: cambia valores y observa." },
  { n: "03", t: "Detectar el error", d: "El resultado confronta tu suposición. La falla se hace visible, no abstracta." },
  { n: "04", t: "Entender", d: "La explicación conecta el resultado con el concepto — la parte que faltaba en tu modelo." },
  { n: "05", t: "Volver a intentar", d: "Reintantas con el modelo corregido. El segundo intento ya es conocimiento." },
];

function MethodSection() {
  return (
    <section className="border-t border-black/[0.06]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Entrance><SectionLabel>El método</SectionLabel></Entrance>
            <Entrance delay={0.06}>
              <h2 className="mt-3 max-w-[18ch] text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
                Un ciclo, cinco pasos. Los 10 temas lo recorren igual.
              </h2>
            </Entrance>
          </div>
          <Entrance delay={0.12} className="max-w-[40ch]">
            <p className="text-[15px] leading-[1.7] text-muted-foreground">
              Cada tema combina el mismo instrumento: un quiz de choque inicial,
              un simulador que responde a tus decisiones y una explicación que cierra el ciclo.
            </p>
          </Entrance>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-5">
          {CYCLE.map((step, i) => (
            <Entrance
              key={step.n}
              delay={i * 0.07}
              className={cn(
                "group relative border-black/[0.07] px-0 py-6 sm:px-6 lg:px-5 lg:py-2",
                "border-t sm:border-t lg:border-t-0",
                i > 0 && "lg:border-l",
                i === 0 && "lg:pl-0",
                i === CYCLE.length - 1 && "lg:pr-0"
              )}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-guinda-600">{step.n}</span>
                <span className="h-px flex-1 bg-black/[0.08] transition-colors duration-300 group-hover:bg-guinda-600/40" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight text-foreground">{step.t}</h3>
              <p className="mt-1.5 max-w-[30ch] text-[13px] leading-[1.65] text-muted-foreground">{step.d}</p>
            </Entrance>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ================================================================== */
/* COMPOSICIONES por materia (decorativas, datos reales)               */
/* ================================================================== */

function FisicaComposition() {
  return (
    <svg viewBox="0 0 300 170" className="h-full w-full" aria-hidden="true">
      <line x1="12" y1="148" x2="288" y2="148" stroke="currentColor" strokeOpacity="0.3" />
      <motion.path
        d="M 16 148 Q 96 20 176 118 T 288 148"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <g className="stroke-teal-600">
        <motion.line x1="16" y1="148" x2="16" y2="112" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} />
        <motion.line x1="16" y1="148" x2="52" y2="148" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.35 }} />
      </g>
      <text x="30" y="118" className="fill-teal-700 font-mono" fontSize="9">v₀ᵧ</text>
      <text x="52" y="143" className="fill-teal-700 font-mono" fontSize="9">v₀ₓ</text>
      <text x="180" y="140" className="fill-current font-mono" fontSize="9" opacity="0.6">aₓ = 0 · aᵧ = −g</text>
      <motion.g
        initial={{ opacity: 0 }} whileInView={{ opacity: 0.85 }} viewport={{ once: true }} transition={{ delay: 1.5 }}
      >
        <circle cx="96" cy="55" r="3" className="fill-current" />
        <circle cx="164" cy="100" r="3" className="fill-current opacity-50" />
        <circle cx="240" cy="140" r="3" className="fill-current opacity-30" />
      </motion.g>
    </svg>
  );
}

function QuimicaComposition() {
  return (
    <svg viewBox="0 0 300 170" className="h-full w-full" aria-hidden="true">
      <motion.path d="M70 60 L140 90 M70 120 L140 90 M140 90 L216 60 M216 60 L286 60 M140 90 L216 120 M216 120 L286 120 M70 60 L70 120" stroke="currentColor" strokeWidth="1.1" fill="none" strokeOpacity="0.55" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
      {[
        [70, 60, "H"], [70, 120, "H"], [140, 90, "O"], [216, 60, "OH"], [216, 120, "OH"], [286, 60, "OH"], [286, 120, "OH"],
      ].map(([x, y, label], i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.35 + i * 0.09 }}>
          <circle cx={x} cy={y} r={label === "O" ? 13 : 9} className={label === "O" ? "fill-fuchsia-500" : "fill-fuchsia-200"} />
          <text x={x} y={Number(y) + 3.5} textAnchor="middle" className="fill-white font-mono" fontSize={label === "O" ? 10 : 8.5}>{label}</text>
        </motion.g>
      ))}
      <motion.text x="150" y="158" textAnchor="middle" className="fill-current font-mono" fontSize="10" opacity="0.65" initial={{ opacity: 0 }} whileInView={{ opacity: 0.65 }} viewport={{ once: true }} transition={{ delay: 1.1 }}>
        Ca(OH)₂ · IUPAC: hidróxido de calcio
      </motion.text>
    </svg>
  );
}

function InglesComposition() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 px-1" aria-hidden="true">
      <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Active</span>
        <p className="mt-1.5 text-[15px] font-medium tracking-tight text-foreground">
          The lab has <span className="border-b-2 border-amber-400">opened</span> its doors.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <span className="h-px flex-1 bg-black/[0.08]" />
        <ChevronRight className="h-4 w-4 rotate-90 text-amber-600" />
        <span className="h-px flex-1 bg-black/[0.08]" />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.65 }}>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Passive</span>
        <p className="mt-1.5 text-[15px] font-medium tracking-tight text-foreground">
          Its doors <span className="border-b-2 border-amber-400">have been opened</span> by the lab.
        </p>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }} transition={{ delay: 1.1 }} className="font-mono text-[9.5px] tracking-wider text-muted-foreground">
        BE + PAST PARTICIPLE — EL VERBO VIAJA, EL SUJETO DEJA DE ACTUAR
      </motion.p>
    </div>
  );
}

/* ================================================================== */
/* MATERIAS — filas editoriales, una identidad por materia            */
/* ================================================================== */

function SubjectsSection() {
  const compositions: Record<string, React.ReactNode> = {
    fisica: <FisicaComposition />,
    quimica: <QuimicaComposition />,
    ingles: <InglesComposition />,
  };
  const accents: Record<string, { text: string; bg: string }> = {
    fisica: { text: "text-teal-700", bg: "bg-teal-50" },
    quimica: { text: "text-fuchsia-700", bg: "bg-fuchsia-50" },
    ingles: { text: "text-amber-700", bg: "bg-amber-50" },
  };

  return (
    <section className="border-t border-black/[0.06]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Entrance><SectionLabel>Las materias</SectionLabel></Entrance>
            <Entrance delay={0.06}>
              <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
                Tres materias. Un mismo ciclo didáctico.
              </h2>
            </Entrance>
          </div>
        </div>

        <div className="mt-4 divide-y divide-black/[0.07]">
          {SUBJECTS.map((s, i) => {
            const acc = accents[s.id];
            return (
              <Entrance key={s.id} delay={i * 0.05}>
                <Link href={s.href} className="group grid grid-cols-1 items-center gap-8 py-12 sm:py-14 lg:grid-cols-12 lg:gap-10">
                  <div className={cn(s.id === "ingles" ? "lg:order-2 lg:col-span-5" : "lg:col-span-5")}>
                    <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground/70">
                      {s.index}
                    </span>
                    <h3 className="mt-3 text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-[-0.02em] text-foreground">
                      {s.name}
                    </h3>
                    <p className="mt-3 max-w-[44ch] text-[14.5px] leading-[1.7] text-muted-foreground">
                      {s.desc}
                    </p>
                    <span className={cn("mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:gap-3", acc.text)}>
                      Explorar {s.name.toLowerCase()}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className={cn("lg:order-3 h-44 lg:h-40", s.id === "ingles" ? "lg:col-span-7" : "lg:col-span-7")}>
                    <div className={cn("corner-ticks relative h-full rounded-2xl border border-black/[0.06] p-5 transition-colors duration-300 group-hover:border-black/[0.12]", acc.bg, acc.text)}>
                      {compositions[s.id]}
                    </div>
                  </div>
                </Link>
              </Entrance>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ÍNDICE — los 10 temas, como página de especificaciones              */
/* ================================================================== */

function TopicsIndex() {
  return (
    <section id="indice" className="border-t border-black/[0.06]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Entrance><SectionLabel>Índice</SectionLabel></Entrance>
            <Entrance delay={0.06}>
              <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
                Los 10 temas del laboratorio.
              </h2>
            </Entrance>
          </div>
          <Entrance delay={0.1}>
            <p className="max-w-[38ch] text-[15px] leading-[1.7] text-muted-foreground">
              Cada uno abre su propia página con quiz inicial, simulador y ejemplo resuelto.
            </p>
          </Entrance>
        </div>

        <ol className="mt-12 grid gap-x-12 md:grid-cols-2">
          {TOPICS.map((t, i) => {
            const st = SUBJECT_STYLE[t.subject];
            return (
              <Entrance key={t.n} delay={(i % 2) * 0.05}>
                <Link
                  href={t.href}
                  className="group row-highlight flex items-baseline gap-4 border-b border-black/[0.07] py-5 transition-colors"
                >
                  <span className="w-8 shrink-0 font-mono text-[12px] font-medium text-muted-foreground/60">
                    {t.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2.5">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", st.dot)} aria-hidden="true" />
                      <span className="truncate text-[15.5px] font-medium tracking-tight text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                        {t.name}
                      </span>
                    </span>
                    <span className="mt-0.5 block pl-4 text-[13px] text-muted-foreground/85">
                      {t.subjectName} · {t.desc}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-guinda-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Entrance>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ================================================================== */
/* RETOS — el mini-reto real (motor existente), piel nueva             */
/* ================================================================== */

const MINI_QUESTIONS = [
  {
    subject: "Física",
    dot: "bg-teal-500",
    prompt: "En el ápice de un tiro parabólico, la velocidad vertical vᵧ es:",
    options: ["Máxima", "Cero", "Igual a vₓ", "Igual a g"],
    correct: 1,
    explanation:
      "En el punto más alto, la componente vertical se anula. Solo queda vₓ (horizontal). Por eso t_apex = v₀ᵧ/g.",
  },
  {
    subject: "Química",
    dot: "bg-fuchsia-500",
    prompt: "El nombre IUPAC de Ca(OH)₂ es:",
    options: ["óxido de calcio", "ácido cálcico", "hidróxido de calcio", "cal apagada (nombre común)"],
    correct: 2,
    explanation:
      "Metal + grupo OH⁻ = hidróxido. Ca²⁺ requiere 2 grupos OH⁻. 'Cal apagada' es el nombre común, no IUPAC.",
  },
  {
    subject: "Inglés",
    dot: "bg-amber-500",
    prompt: "She ____ in Mexico City since 2019. (presente perfecto)",
    options: ["lives", "has lived", "is living", "lived"],
    correct: 1,
    explanation:
      "'Since' marca un punto de inicio en el pasado que se prolonga hasta ahora: presente perfecto (have/has + participio).",
  },
];

function MiniChallenge() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [history, setHistory] = useState<(boolean | null)[]>(MINI_QUESTIONS.map(() => null));

  const q = MINI_QUESTIONS[idx];
  const done = picked !== null;
  const isLast = idx === MINI_QUESTIONS.length - 1;
  const score = history.filter((h) => h === true).length;

  const pick = (i: number) => {
    if (done) return;
    setPicked(i);
    setHistory((h) => {
      const next = [...h];
      next[idx] = i === q.correct;
      return next;
    });
  };

  const advance = () => {
    if (!isLast) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      setIdx(0);
      setPicked(null);
      setHistory(MINI_QUESTIONS.map(() => null));
    }
  };

  return (
    <LiquidGlass variant="panel" className="rounded-[24px] border border-white/50 shadow-[0_24px_70px_-28px_rgb(46_11_29/0.25)]">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className={cn("inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", q.dot)} aria-hidden="true" />
            {q.subject}
          </span>
          <span className="flex items-center gap-1" aria-label={`Reto ${idx + 1} de ${MINI_QUESTIONS.length}`}>
            {MINI_QUESTIONS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 w-5 rounded-full transition-colors duration-200",
                  i === idx ? "bg-guinda-600" : history[i] === true ? "bg-teal-500" : history[i] === false ? "bg-rose-400" : "bg-black/[0.08]"
                )}
              />
            ))}
          </span>
        </div>

        <h3 className="mt-5 text-[19px] font-semibold leading-snug tracking-tight text-foreground">{q.prompt}</h3>

        <div className="mt-6 grid gap-2">
          {q.options.map((opt, i) => {
            const showCorrect = done && i === q.correct;
            const showWrong = done && picked === i && i !== q.correct;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={done}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150",
                  showCorrect
                    ? "border-teal-300 bg-teal-50/80 text-teal-800"
                    : showWrong
                    ? "border-rose-300 bg-rose-50/80 text-rose-800"
                    : "border-black/[0.08] bg-white/60 text-foreground hover:border-guinda-600/40 hover:bg-white/90",
                  done && !showCorrect && !showWrong && "opacity-50"
                )}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/[0.12] font-mono text-[10px] text-muted-foreground/80">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {showCorrect && <CheckCircle2 className="ml-auto h-4 w-4 text-teal-600" />}
                {showWrong && <X className="ml-auto h-4 w-4 text-rose-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {done && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <p className="mt-4 border-l-2 border-guinda-600/50 pl-3.5 text-[13px] leading-relaxed text-foreground/85">
                {picked === q.correct ? "Exacto. " : ""}
                {q.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="font-mono text-[10.5px] tracking-wider text-muted-foreground">
            ACIERTOS {score}/{MINI_QUESTIONS.length}
          </span>
          {done && (
            <button
              onClick={advance}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-[13px] font-medium text-background transition-transform duration-150 hover:bg-foreground/90 active:scale-[0.97]"
            >
              {isLast ? <RotateCcw className="h-3.5 w-3.5" /> : null}
              {isLast ? "Repetir" : "Siguiente"}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>
    </LiquidGlass>
  );
}

function ChallengesSection() {
  return (
    <section className="border-t border-black/[0.06] bg-secondary/45">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
        <div>
          <Entrance><SectionLabel>Retos exprés</SectionLabel></Entrance>
          <Entrance delay={0.06}>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
              Seis preguntas. Tres materias. Cinco minutos.
            </h2>
          </Entrance>
          <Entrance delay={0.12}>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.75] text-muted-foreground">
              En la sección completa tienes el reto con racha, puntos y una guía de
              tres pasos en cada error. Aquí va una muestra — genérica, contestable
              al instante. Fallar aquí también enseña: cada respuesta trae su explicación.
            </p>
          </Entrance>
          <Entrance delay={0.16} className="mt-8">
            <Link
              href="/retos"
              className="group inline-flex items-center gap-2 text-sm font-medium text-guinda-700 transition-all duration-200 hover:gap-3.5"
            >
              Abrir los retos completos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Entrance>
        </div>
        <Entrance delay={0.1}>
          <MiniChallenge />
        </Entrance>
      </div>
    </section>
  );
}

/* ================================================================== */
/* LABORATORIOS — banda oscura, tipográfica                            */
/* ================================================================== */

const LAB_PHASES = [
  { n: "I", t: "Hipótesis", d: "Formula qué crees que va a pasar." },
  { n: "II", t: "Cálculo", d: "El simulador ejecuta tus condiciones." },
  { n: "III", t: "Registro", d: "La bitácora captura datos y decisiones." },
  { n: "IV", t: "Conclusión", d: "Compara el resultado con tu intuición inicial." },
];

function LabsSection() {
  return (
    <section className="border-t border-black/[0.06] bg-[#1d1219] text-[#f5eef2]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Entrance>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-guinda-300/80">
                Laboratorios guiados
              </p>
            </Entrance>
            <Entrance delay={0.06}>
              <h2 className="mt-3 max-w-[20ch] text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
                El método científico, completo, en pantalla.
              </h2>
            </Entrance>
          </div>
          <Entrance delay={0.12}>
            <Link
              href="/laboratorios"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-medium text-white backdrop-blur transition-colors duration-200 hover:bg-white/[0.12]"
            >
              Entrar a los laboratorios
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Entrance>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {LAB_PHASES.map((p, i) => (
            <Entrance key={p.n} delay={i * 0.07}>
              <dt className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] text-guinda-300/70">{p.n}</span>
                <span className="text-[16px] font-semibold tracking-tight text-white">{p.t}</span>
              </dt>
              <dd className="mt-2.5 pl-6 text-[13px] leading-[1.65] text-white/55">{p.d}</dd>
              <div className="mt-4 h-px bg-white/[0.09] pl-0" aria-hidden="true" />
            </Entrance>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PROGRESO — estado real desde localStorage (hook existente)          */
/* ================================================================== */

const LEVELS = [
  { name: "Novato", min: 0 },
  { name: "Explorador", min: 4 },
  { name: "Practicante", min: 10 },
  { name: "Laboratorista", min: 20 },
  { name: "Experto", min: 40 },
];

function ProgressSection() {
  const { progress } = useProgress();
  const stats = useMemo(() => {
    const items = Object.values(progress);
    const points = items.reduce((a, p) => a + p.score + (p.completed ? 2 : 0), 0);
    const completed = items.filter((p) => p.completed).length;
    const attempts = items.reduce((a, p) => a + p.attempts, 0);
    return { points, completed, attempts, empty: items.length === 0 };
  }, [progress]);
  const level = LEVELS.find((l) => stats.points >= l.min) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.min > stats.points);

  return (
    <section className="border-t border-black/[0.06]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <LiquidGlass variant="panel" className="rounded-[24px] border border-white/50 shadow-[0_24px_70px_-28px_rgb(46_11_29/0.22)]">
            <div className="p-6 sm:p-8">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Mi bitácora · este navegador
              </span>
              {stats.empty ? (
                <div className="mt-6">
                  <p className="text-[15px] font-medium text-foreground">Aún no hay registros.</p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-muted-foreground">
                    Resuelve un reto o practica en un simulador y tu avance aparecerá aquí —
                    puntos, nivel e intentos, guardados localmente.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-mono text-[38px] font-medium leading-none tracking-tight text-foreground tabular-nums">
                        {stats.points}
                      </div>
                      <div className="mt-1.5 text-[12px] text-muted-foreground">puntos acumulados</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-semibold tracking-tight text-guinda-700">{level.name}</div>
                      <div className="mt-0.5 text-[12px] text-muted-foreground">
                        {next ? `${next.min - stats.points} pt para ${next.name}` : "nivel máximo"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 h-1 rounded-full bg-black/[0.06]" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-guinda-600 transition-[width] duration-500"
                      style={{ width: `${next ? Math.min(100, ((stats.points - level.min) / (next.min - level.min)) * 100) : 100}%` }}
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-3 divide-x divide-black/[0.06] text-center">
                    <div>
                      <div className="font-mono text-[17px] font-medium tabular-nums text-foreground">{stats.completed}/10</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">temas</div>
                    </div>
                    <div>
                      <div className="font-mono text-[17px] font-medium tabular-nums text-foreground">{stats.attempts}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">intentos</div>
                    </div>
                    <div>
                      <div className="font-mono text-[17px] font-medium tabular-nums text-foreground">{stats.points}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">puntos</div>
                    </div>
                  </div>
                </>
              )}
              <Link
                href="/progreso"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-guinda-700 transition-all duration-200 hover:gap-3"
              >
                Ver la bitácora completa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </LiquidGlass>
        </div>

        <div className="order-1 lg:order-2">
          <Entrance><SectionLabel>Progreso</SectionLabel></Entrance>
          <Entrance delay={0.06}>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
              Cada intento deja registro. El nivel se gana.
            </h2>
          </Entrance>
          <Entrance delay={0.12}>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.75] text-muted-foreground">
              Puntos, temas completados e intentos se guardan en este navegador —
              sin cuentas ni nube. Aprende en serio y sube de Novato a Experto;
              importa tus datos o expórtalos cuando quieras.
            </p>
          </Entrance>
          <Entrance delay={0.16} className="mt-8">
            <p className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground/80">
              NOVATO 0 · EXPLORADOR 4 · PRACTICANTE 10 · LABORATORISTA 20 · EXPERTO 40 PT
            </p>
          </Entrance>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */

export default function Home() {
  return (
    <>
      <Hero />
      <MethodSection />
      <SubjectsSection />
      <TopicsIndex />
      <ChallengesSection />
      <LabsSection />
      <ProgressSection />
    </>
  );
}
