"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Beaker,
  Calculator,
  Scale,
  Search,
  SearchX,
  X,
  Zap,
  History,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/site/ui";
import { SimCard, simCardId } from "@/components/site/sim-card";

type Sim = {
  name: string;
  desc: string;
  tag: string;
  href: string;
  icon: LucideIcon;
  keywords: string;
  points: string[];
};

type Unit = {
  id: string;
  key: string;
  tag: string;
  num: string;
  title: string;
  subtitle: string;
  theme: {
    icon: string;
    soft: string;
    dot: string;
    hover: string;
    chipOn: string;
    glow: string;
    panel: string;
    ghost: string;
    hoverShadow: string;
    hoverSoft: string;
  };
  sims: Sim[];
};

const THEMES = {
  fuchsia: {
    icon: "bg-gradient-to-br from-fuchsia-500 to-pink-500",
    soft: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    dot: "bg-fuchsia-500",
    hover: "hover:border-fuchsia-300/70",
    chipOn: "border-fuchsia-500 bg-fuchsia-500 text-white shadow-sm shadow-fuchsia-500/30",
    glow: "shadow-fuchsia-500/25",
    panel: "border-fuchsia-100/90 bg-gradient-to-br from-fuchsia-50/70 via-white to-pink-50/60",
    ghost: "text-fuchsia-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(217,70,239,0.40)]",
    hoverSoft: "group-hover:border-fuchsia-200 group-hover:bg-fuchsia-50 group-hover:text-fuchsia-600",
  },
  violet: {
    icon: "bg-gradient-to-br from-violet-500 to-purple-500",
    soft: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
    hover: "hover:border-violet-300/70",
    chipOn: "border-violet-500 bg-violet-500 text-white shadow-sm shadow-violet-500/30",
    glow: "shadow-violet-500/25",
    panel: "border-violet-100/90 bg-gradient-to-br from-violet-50/70 via-white to-purple-50/50",
    ghost: "text-violet-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(139,92,246,0.40)]",
    hoverSoft: "group-hover:border-violet-200 group-hover:bg-violet-50 group-hover:text-violet-600",
  },
  rose: {
    icon: "bg-gradient-to-br from-rose-500 to-pink-500",
    soft: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    hover: "hover:border-rose-300/70",
    chipOn: "border-rose-500 bg-rose-500 text-white shadow-sm shadow-rose-500/30",
    glow: "shadow-rose-500/25",
    panel: "border-rose-100/90 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/60",
    ghost: "text-rose-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(244,63,94,0.40)]",
    hoverSoft: "group-hover:border-rose-200 group-hover:bg-rose-50 group-hover:text-rose-600",
  },
} as const;

const UNITS: Unit[] = [
  {
    id: "lenguaje-quimico",
    key: "q1",
    tag: "Q1",
    num: "01",
    title: "Lenguaje químico",
    subtitle: "Nomenclatura inorgánica y orgánica",
    theme: THEMES.fuchsia,
    sims: [
      {
        name: "Nomenclatura IUPAC",
        desc: "Entrenador bidireccional: te muestra la fórmula y eliges el nombre, o al revés. Óxidos, hidróxidos, ácidos y sales por el lado inorgánico; alcanos, alquenos, alcoholes, cetonas y ácidos por el orgánico.",
        tag: "Fórmula ⇄ Nombre",
        href: "/quimica/iupac",
        icon: Beaker,
        keywords:
          "iupac nomenclatura óxidos hidróxidos ácidos sales alcanos alquenos alcoholes cetonas fórmula nombre inorgánica orgánica bidireccional",
        points: ["25 compuestos · 9 categorías visuales", "Pistas + explicaciones pedagógicas"],
      },
    ],
  },
  {
    id: "reacciones-quimicas",
    key: "q2",
    tag: "Q2",
    num: "02",
    title: "Reacciones químicas",
    subtitle: "Balanceo y conservación de la masa",
    theme: THEMES.violet,
    sims: [
      {
        name: "Balanceo de ecuaciones",
        desc: "Ajusta coeficientes con steppers o escribiendo el número directamente y observa la tabla de átomos equilibrarse en vivo: combustiones de hidrocarburos y reacciones inorgánicas clásicas.",
        tag: "Conteo de átomos",
        href: "/quimica/balanceo",
        icon: Scale,
        keywords:
          "balanceo ecuaciones coeficientes steppers átomos tabla combustiones hidrocarburos reacciones inorgánicas conservación masa solución",
        points: ["8 reacciones con input editable", "Columna Δ en la tabla de átomos", "Botón Ver solución + insights"],
      },
    ],
  },
  {
    id: "estequiometria-moles",
    key: "q3",
    tag: "Q3",
    num: "03",
    title: "Estequiometría",
    subtitle: "Moles, masas y reactivo limitante",
    theme: THEMES.rose,
    sims: [
      {
        name: "Reactivo limitante",
        desc: "De gramos a moles y de moles a producto: ajusta las masas de los reactivos, predice cuál se agota primero y calcula el rendimiento teórico con masas molares reales de la tabla periódica.",
        tag: "Masa → mol → gramos",
        href: "/quimica/estequiometria",
        icon: Calculator,
        keywords:
          "estequiometría reactivo limitante moles gramos rendimiento teórico masa molar tabla periódica conversiones exceso rondas",
        points: ["Tabla masa → mol → rondas", "Diagrama de flujo con flechas", "Marcas LIMITANTE / EN EXCESO"],
      },
    ],
  },
];

const TOTAL_SIMS = UNITS.reduce((total, unit) => total + unit.sims.length, 0);
const ALL_HREFS = new Set(UNITS.flatMap((u) => u.sims.map((s) => s.href)));

const simCount = (count: number) => (count === 1 ? "1 simulador" : `${count} simuladores`);

/* Búsqueda sin importar acentos ni mayúsculas */
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const UNIT_LABEL: Record<string, string> = {
  all: "todas las unidades",
  q1: "Lenguaje químico",
  q2: "Reacciones químicas",
  q3: "Estequiometría",
};

const SUGGESTIONS = ["moles", "IUPAC", "balanceo", "ácidos"];

type LastSim = { href: string; name: string };

const HERO_STATS = [
  `${TOTAL_SIMS} simuladores`,
  "3 unidades",
  "Masas molares reales",
  "Explicación en cada paso",
];

/* Puntos con el color de cada unidad (Q1–Q3) para el badge del hero */
const UNIT_DOTS = ["bg-fuchsia-500", "bg-violet-500", "bg-rose-500"];

/* Guarda el último simulador abierto (lo lee el chip «Continuar…») */
const rememberLastSim = (href: string, name: string) => {
  try {
    localStorage.setItem(
      "cecyt3-last-sim",
      JSON.stringify({ href, name, t: Date.now() }),
    );
  } catch {
    /* almacenamiento no disponible */
  }
};

/* ------------------------------------------------------------------ */
/* Arte del hero: matraz, benceno, molécula y fórmulas (decorativo)    */
/* ------------------------------------------------------------------ */
function HeroArt() {
  const chips = [
    { text: "H₂O", className: "left-[1%] top-[17%]", duration: 5.5, delay: 0 },
    { text: "1 mol = 6.022 × 10²³", className: "right-[3%] top-[5%]", duration: 6.5, delay: 0.9 },
    { text: "Fe₂O₃", className: "left-[-1%] bottom-[30%]", duration: 6, delay: 0.45 },
    { text: "pH = 7", className: "right-[1%] bottom-[9%]", duration: 7, delay: 1.3 },
  ];

  const bubbles = [
    { cx: 168, r: 4.5, d: 3.6, dl: 0 },
    { cx: 205, r: 3, d: 4.4, dl: 1.2 },
    { cx: 238, r: 5, d: 3.2, dl: 0.6 },
    { cx: 258, r: 3.5, d: 4.8, dl: 2 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[440px] select-none" aria-hidden="true">
      <motion.svg
        viewBox="0 0 420 330"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        <defs>
          <radialGradient id="qgLiquid" cx="38%" cy="30%" r="85%">
            <stop offset="0" stopColor="#fbcfe8" />
            <stop offset=".45" stopColor="#ec4899" />
            <stop offset="1" stopColor="#a21caf" />
          </radialGradient>
          <linearGradient id="qgWave" x1="40" y1="278" x2="376" y2="278" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#d946e6" stopOpacity=".18" />
            <stop offset=".32" stopColor="#ec4899" />
            <stop offset=".66" stopColor="#f472b6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="qgArc" x1="296" y1="136" x2="366" y2="114" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e879f9" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="qgGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="qgFlaskClip">
            <path d="M188 70 h44 v50 l58 128 a10 10 0 0 1 -9 14 h-142 a10 10 0 0 1 -9 -14 l58 -128 z" />
          </clipPath>
        </defs>

        {/* Anillo de benceno girando */}
        <motion.g
          style={{ transformOrigin: "95px 95px" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 46 }}
          opacity=".55"
        >
          <polygon points="95,61 124.4,78 124.4,112 95,129 65.6,112 65.6,78" stroke="#8b5cf6" strokeWidth="1.5" />
          <circle cx="95" cy="95" r="17" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="2 5" />
        </motion.g>

        {/* Molécula flotante (dos átomos con doble enlace) */}
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 5.5 }}
        >
          <line x1="315" y1="92" x2="344" y2="70" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="311" y1="86" x2="340" y2="64" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" opacity=".45" />
          <circle cx="315" cy="92" r="10" fill="#ec4899" />
          <circle cx="344" cy="70" r="7" fill="#f472b6" />
        </motion.g>

        {/* Matraz con líquido y burbujas */}
        <g>
          <path
            d="M188 70 h44 v50 l58 128 a10 10 0 0 1 -9 14 h-142 a10 10 0 0 1 -9 -14 l58 -128 z"
            fill="rgba(255,255,255,.5)"
            stroke="#d946e6"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <g clipPath="url(#qgFlaskClip)">
            <path
              d="M130 216 q40 -12 80 0 t80 0 L290 264 L130 264 Z"
              fill="url(#qgLiquid)"
              opacity=".85"
              filter="url(#qgGlow)"
            />
            <path
              d="M130 216 q40 -12 80 0 t80 0"
              stroke="#fbcfe8"
              strokeWidth="1.5"
              opacity=".7"
            />
            {bubbles.map((b) => (
              <motion.circle
                key={b.cx}
                cx={b.cx}
                cy={256}
                r={b.r}
                fill="#fff"
                animate={{ y: [0, -36], opacity: [0, 0.85, 0] }}
                transition={{ repeat: Infinity, ease: "linear", duration: b.d, delay: b.dl }}
              />
            ))}
          </g>
          {/* Boca del matraz */}
          <rect x="183" y="62" width="54" height="9" rx="4.5" fill="#fff" opacity=".9" stroke="#d946e6" strokeWidth="1.5" />
          {/* Vapor */}
          <motion.g
            animate={{ y: [0, -9], opacity: [0, 0.75, 0] }}
            transition={{ repeat: Infinity, ease: "easeOut", duration: 3.4, delay: 0.4 }}
          >
            <path d="M204 56 q5 -7 0 -14" stroke="#d946e6" strokeWidth="2" strokeLinecap="round" />
            <path d="M216 56 q-5 -7 0 -14" stroke="#d946e6" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        </g>

        {/* Flecha de reacción */}
        <path
          d="M296 136 C322 122 346 116 366 114"
          stroke="url(#qgArc)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 7"
          opacity=".8"
        />
        <polygon points="366,108 378,114 366,121" fill="#8b5cf6" />
        <circle cx="296" cy="136" r="4.5" fill="#f472b6" />

        {/* Partículas */}
        <circle cx="70" cy="196" r="4" fill="#ec4899" />
        <circle cx="352" cy="204" r="4" fill="#a21caf" />
        <circle cx="122" cy="252" r="4.5" fill="#f472b6" />

        {/* Superficie del líquido */}
        <path d="M40 278q21-38 42 0t42 0 42 0 42 0 42 0 42 0 42 0" stroke="url(#qgWave)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M40 292h336" stroke="currentColor" strokeWidth="1" opacity=".1" />
      </motion.svg>

      {/* Chips con fórmulas */}
      {chips.map((c) => (
        <motion.span
          key={c.text}
          className={`absolute rounded-full border border-fuchsia-200/80 bg-white/85 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-fuchsia-900/75 shadow-sm backdrop-blur ${c.className}`}
          animate={{ y: [0, -7, 0] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: c.duration, delay: c.delay }}
        >
          {c.text}
        </motion.span>
      ))}
    </div>
  );
}

export default function QuimicaPage() {
  const [unit, setUnit] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [last, setLast] = useState<LastSim | null>(null);
  const [openHref, setOpenHref] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Abrir/cerrar un simulador en su tarjeta (acordeón inline) */
  const toggleSim = (sim: Sim) => {
    const next = openHref === sim.href ? null : sim.href;
    setOpenHref(next);
    if (next) {
      rememberLastSim(next, sim.name);
      /* Asegurar que la tarjeta expandida quede a la vista */
      window.setTimeout(() => {
        document
          .getElementById(simCardId(next))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 90);
    }
  };

  /* El chip «Continuar…» abre el simulador inline y centra la tarjeta */
  const openLastSim = () => {
    if (!last) return;
    setQuery("");
    setUnit("all");
    setOpenHref(last.href);
    rememberLastSim(last.href, last.name);
    window.setTimeout(() => {
      document
        .getElementById(simCardId(last.href))
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 140);
  };

  /* Último simulador abierto — solo tras montar */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cecyt3-last-sim");
      if (!raw) return;
      const val = JSON.parse(raw) as { href?: string; name?: string; t?: number };
      const fresh = typeof val.t === "number" && Date.now() - val.t < 30 * 24 * 3600 * 1000;
      if (fresh && typeof val.href === "string" && typeof val.name === "string" && ALL_HREFS.has(val.href)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- lee localStorage solo tras montar (evita mismatch de hidratación)
        setLast({ href: val.href, name: val.name });
      }
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  /* Atajo «/» para enfocar el buscador */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const q = norm(query.trim());

  const visible = useMemo(() => {
    return UNITS.filter((u) => unit === "all" || u.key === unit)
      .map((u) => ({
        ...u,
        sims: q
          ? u.sims.filter((s) =>
              norm(`${s.name} ${s.desc} ${s.tag} ${s.keywords}`).includes(q),
            )
          : u.sims,
      }))
      .filter((u) => u.sims.length > 0);
  }, [unit, q]);

  const visibleCount = visible.reduce((n, u) => n + u.sims.length, 0);

  const filtersActive = query.trim() !== "" || unit !== "all";
  const clearFilters = () => {
    setQuery("");
    setUnit("all");
  };

  const infoParts = [simCount(visibleCount), UNIT_LABEL[unit] ?? "todas las unidades"];
  if (query.trim()) infoParts.push(`búsqueda: «${query.trim()}»`);

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative -mt-[4.125rem] overflow-hidden bg-gradient-to-b from-fuchsia-200/70 via-fuchsia-100/70 to-pink-200/60">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-96 w-96 rounded-full bg-fuchsia-200/45 blur-3xl blob-float" />
          <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl blob-float" style={{ animationDelay: "4s" }} />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl blob-float" style={{ animationDelay: "8s" }} />
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[calc(4rem+1.75rem)] sm:px-6 lg:px-8 lg:pb-16">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Química" }]} />

          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Texto */}
            <div className="min-w-0 text-center lg:col-span-7 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-fuchsia-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur"
              >
                <span className="flex items-center -space-x-1" aria-hidden="true">
                  {UNIT_DOTS.map((c) => (
                    <span key={c} className={`h-2 w-2 rounded-full ring-2 ring-white ${c}`} />
                  ))}
                </span>
                Materia · 3 unidades
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.98] tracking-tighter"
              >
                <span className="block bg-gradient-to-r from-foreground via-fuchsia-950 to-fuchsia-700 bg-clip-text text-transparent">
                  Química
                </span>
                <span className="relative inline-block">
                  {/* Halo de color detrás del texto */}
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-4 -inset-y-2 rounded-full bg-gradient-to-r from-fuchsia-400/25 via-pink-300/25 to-rose-300/35 blur-xl animated-gradient"
                  />
                  <span className="relative bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-400 bg-clip-text text-transparent animated-gradient pr-[0.12em] -mr-[0.12em]">
                    {TOTAL_SIMS} simuladores
                  </span>
                  <svg
                    className="absolute -bottom-4 left-0 h-2.5 w-full"
                    viewBox="0 0 220 12"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M3 9C60 3 160 3 217 8"
                      stroke="url(#quimica-underline)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="quimica-underline" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#c026d3" />
                        <stop offset="0.5" stopColor="#ec4899" />
                        <stop offset="1" stopColor="#fb7185" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mx-auto mt-5 max-w-2xl text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-muted-foreground lg:mx-0"
              >
                Nomenclatura IUPAC en ambos sentidos, balanceo con conteo de átomos en vivo
                y estequiometría con masas molares reales. Busca por tema, filtra por unidad
                y practica aquí mismo: sin salir de la página y sin instalar nada.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start"
              >
                {HERO_STATS.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200/80 bg-white/75 px-3 py-1 text-[11px] font-semibold text-foreground/70 shadow-sm backdrop-blur"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />
                    {s}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start"
              >
                <a
                  href="#lenguaje-quimico"
                  className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-fuchsia-500/40 active:translate-y-0 active:scale-95"
                >
                  Explorar simuladores
                  <ArrowDown className="h-4 w-4" />
                </a>
                <Link
                  href="/retos"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-fuchsia-300 hover:bg-fuchsia-50/40 active:translate-y-0 active:scale-95"
                >
                  <Zap className="h-4 w-4 text-fuchsia-500" />
                  Ver retos
                </Link>
              </motion.div>
            </div>

            {/* Arte */}
            <div className="lg:col-span-5">
              <HeroArt />
            </div>
          </div>
        </div>

        {/* Divisor de ola hacia el catálogo */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full sm:h-14 lg:h-16"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="quimica-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#c026d3" stopOpacity="0" />
              <stop offset=".18" stopColor="#c026d3" stopOpacity=".9" />
              <stop offset=".5" stopColor="#ec4899" />
              <stop offset=".82" stopColor="#fb7185" stopOpacity=".9" />
              <stop offset="1" stopColor="#fb7185" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Ola eco translúcida detrás de la principal */}
          <path
            d="M0 46 C 240 74 480 10 720 30 C 960 52 1200 72 1440 24 L1440 96 L0 96 Z"
            fill="var(--background)"
            opacity=".45"
          />
          {/* Ola principal que recorta el hero */}
          <path
            d="M0 60 C 240 92 480 18 720 38 C 960 60 1200 88 1440 34 L1440 96 L0 96 Z"
            fill="var(--background)"
          />
          {/* Cresta con el degradado de la materia */}
          <path
            d="M0 60 C 240 92 480 18 720 38 C 960 60 1200 88 1440 34"
            stroke="url(#quimica-wave)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </section>

      {/* ==================== CATÁLOGO ==================== */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Continuar donde te quedaste */}
        {last && (
          <motion.button
            type="button"
            onClick={openLastSim}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="shine group relative -mt-2 flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-pink-50/70 to-white p-4 text-left shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-md shadow-fuchsia-500/30">
              <History className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-fuchsia-700">
                Continuar donde te quedaste
              </span>
              <span className="block truncate text-[14.5px] font-semibold text-foreground">
                {last.name}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-fuchsia-600 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        )}

        {/* Buscador + filtro por unidad (flota al hacer scroll) */}
        <div className="sticky top-[5.25rem] z-30 mt-6 rounded-2xl border border-black/[0.06] bg-white/85 p-3 shadow-[0_14px_40px_-18px_rgba(24,24,27,0.35)] backdrop-blur-xl sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="group relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-fuchsia-600" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setQuery("");
                  }
                }}
                placeholder="Buscar simulador por tema: moles, balanceo, ácidos…"
                aria-label="Buscar simulador por tema"
                autoComplete="off"
                spellCheck={false}
                className="h-10 w-full rounded-full border border-black/[0.08] bg-white pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-fuchsia-400 focus:ring-[3px] focus:ring-fuchsia-400/20 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpiar búsqueda"
                  title="Limpiar (Esc)"
                  className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground/70 transition hover:bg-black/5 hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-black/[0.08] bg-muted/60 px-1.5 py-0.5 font-sans text-[10.5px] font-semibold text-muted-foreground/70 sm:block">
                  /
                </kbd>
              )}
            </div>

            <div className="relative min-w-0">
              <div
                role="group"
                aria-label="Filtrar por unidad"
                className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin lg:flex-wrap lg:overflow-visible lg:pb-0"
              >
                <button
                  type="button"
                  aria-pressed={unit === "all"}
                  onClick={() => setUnit("all")}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all active:scale-95 ${
                    unit === "all"
                      ? "border-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-sm shadow-fuchsia-500/25"
                      : "border-black/[0.08] bg-white text-muted-foreground hover:border-black/20 hover:text-foreground"
                  }`}
                >
                  Todos
                </button>
                {UNITS.map((u) => (
                  <button
                    key={u.key}
                    type="button"
                    aria-pressed={unit === u.key}
                    onClick={() => setUnit(unit === u.key ? "all" : u.key)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all active:scale-95 ${
                      unit === u.key
                        ? u.theme.chipOn
                        : "border-black/[0.08] bg-white text-muted-foreground hover:border-black/20 hover:text-foreground"
                    }`}
                  >
                    {u.title}
                    <span className={unit === u.key ? "ml-1.5 opacity-75" : "ml-1.5 text-muted-foreground/60"}>
                      {u.sims.length}
                    </span>
                  </button>
                ))}
              </div>
              {/* Pista de desplazamiento: solo móvil */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white via-white/70 to-transparent lg:hidden"
              />
            </div>
          </div>

          {/* Contador de resultados solo para lectores de pantalla */}
          <p aria-live="polite" className="sr-only">
            {infoParts.join(" · ")}
          </p>

          {filtersActive && (
            <div className="mt-2.5 flex justify-end px-1">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700 transition-colors hover:bg-fuchsia-50 active:scale-95"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Sin resultados */}
        {visibleCount === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white/60 p-10 text-center">
            <div className="relative mx-auto w-fit">
              <motion.span
                aria-hidden="true"
                className="absolute -inset-3 rounded-full border border-dashed border-fuchsia-300/80"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 16 }}
              />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-200 bg-white text-fuchsia-600 shadow-sm">
                <SearchX className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-[15px] font-semibold text-foreground">
              No encontramos simuladores para «{query.trim()}»
              {unit !== "all" ? ` en ${UNIT_LABEL[unit]}` : ""}.
            </p>
            <p className="mt-1.5 text-[13px] text-muted-foreground">Prueba con otro tema:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3.5 py-1.5 text-[12px] font-semibold text-fuchsia-700 transition-all hover:bg-fuchsia-100 active:scale-95"
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-muted-foreground transition-all hover:text-foreground active:scale-95"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Unidades — paneles con el color de cada tema */}
        <div className="mt-10 space-y-8 sm:space-y-10">
          {visible.map((unitData, unitIndex) => (
            <motion.section
              key={unitData.id}
              id={unitData.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: unitIndex * 0.04 }}
              className="scroll-mt-48"
            >
              <div
                className={`relative overflow-hidden rounded-3xl border p-4 shadow-[0_2px_10px_-4px_rgba(24,24,27,0.06)] sm:p-6 ${unitData.theme.panel}`}
              >
                {/* Número fantasma de la unidad */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-7 right-2 select-none font-mono text-[110px] font-black leading-none tracking-tighter sm:right-5 sm:text-[130px] ${unitData.theme.ghost}`}
                >
                  {unitData.num}
                </span>

                {/* Encabezado de unidad */}
                <div className="relative flex items-center gap-3.5 border-b border-black/[0.05] pb-4 sm:pb-5">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[13px] font-bold text-white shadow-lg ${unitData.theme.icon} ${unitData.theme.glow}`}
                  >
                    {unitData.tag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <h2 className="text-[21px] font-bold tracking-[-0.02em] text-foreground sm:text-[23px]">
                        {unitData.title}
                      </h2>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${unitData.theme.soft}`}
                      >
                        {simCount(unitData.sims.length)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-muted-foreground sm:text-sm">
                      {unitData.subtitle}
                    </p>
                  </div>
                </div>

                {/* Tarjetas (acordeón: se abren en la misma página) */}
                <div className="relative mt-4 grid gap-3.5 sm:mt-5 sm:gap-4 lg:grid-cols-2">
                  {unitData.sims.map((sim, i) => (
                    <SimCard
                      key={sim.href}
                      sim={sim}
                      theme={unitData.theme}
                      open={openHref === sim.href}
                      onToggle={() => toggleSim(sim)}
                      index={i}
                      full={unitData.sims.length === 1}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* CTA */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-fuchsia-200/70 bg-gradient-to-br from-fuchsia-50 via-pink-50 to-white p-6 text-center shadow-sm sm:p-10">
          <div className="absolute inset-0 dots-pattern opacity-25" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/80 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fuchsia-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
              {TOTAL_SIMS} simuladores · 3 unidades
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ¿Listo para experimentar?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Te sugerimos empezar por IUPAC para dominar la nomenclatura; después ajusta
              coeficientes con la tabla de átomos equilibrándose en vivo y calcula moles con
              masas reales de la tabla periódica. Cada simulador trae pistas y explicaciones
              pedagógicas paso a paso.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/quimica/iupac"
                className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-fuchsia-500/40 active:translate-y-0 active:scale-95"
              >
                Empezar con IUPAC
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/laboratorios"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-fuchsia-300 hover:bg-fuchsia-50/40 active:scale-95"
              >
                Explorar laboratorios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
