"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Clock,
  MessageSquare,
  Repeat,
  Search,
  SearchX,
  Sparkles,
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
  amber: {
    icon: "bg-gradient-to-br from-amber-500 to-yellow-400",
    soft: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    hover: "hover:border-amber-300/70",
    chipOn: "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/30",
    glow: "shadow-amber-500/25",
    panel: "border-amber-100/90 bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/60",
    ghost: "text-amber-500/[0.06]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(245,158,11,0.40)]",
    hoverSoft: "group-hover:border-amber-200 group-hover:bg-amber-50 group-hover:text-amber-600",
  },
  orange: {
    icon: "bg-gradient-to-br from-orange-500 to-red-400",
    soft: "border-orange-200 bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
    hover: "hover:border-orange-300/70",
    chipOn: "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/30",
    glow: "shadow-orange-500/25",
    panel: "border-orange-100/90 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/60",
    ghost: "text-orange-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(249,115,22,0.40)]",
    hoverSoft: "group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-600",
  },
  violet: {
    icon: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    soft: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
    hover: "hover:border-violet-300/70",
    chipOn: "border-violet-500 bg-violet-500 text-white shadow-sm shadow-violet-500/30",
    glow: "shadow-violet-500/25",
    panel: "border-violet-100/90 bg-gradient-to-br from-violet-50/70 via-white to-fuchsia-50/50",
    ghost: "text-violet-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(139,92,246,0.40)]",
    hoverSoft: "group-hover:border-violet-200 group-hover:bg-violet-50 group-hover:text-violet-600",
  },
  sky: {
    icon: "bg-gradient-to-br from-sky-500 to-blue-500",
    soft: "border-sky-200 bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
    hover: "hover:border-sky-300/70",
    chipOn: "border-sky-500 bg-sky-500 text-white shadow-sm shadow-sky-500/30",
    glow: "shadow-sky-500/25",
    panel: "border-sky-100/90 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/60",
    ghost: "text-sky-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(14,165,233,0.40)]",
    hoverSoft: "group-hover:border-sky-200 group-hover:bg-sky-50 group-hover:text-sky-600",
  },
} as const;

const UNITS: Unit[] = [
  {
    id: "tiempos-verbales",
    key: "i1",
    tag: "I1",
    num: "01",
    title: "Tiempos verbales",
    subtitle: "Simple, continuo, perfecto y condicionales",
    theme: THEMES.amber,
    sims: [
      {
        name: "Verb Tenses",
        desc: "Catorce ejercicios de presente y pasado, simple y continuo, perfecto y condicionales de tiempo: la señal está en los marcadores ('since', 'last year', 'look!') y en la lógica de la ciencia.",
        tag: "Tenses & markers",
        href: "/ingles/verb-tenses",
        icon: Clock,
        keywords:
          "verb tenses tiempos verbales presente pasado simple continuo perfecto condicional marcadores since last year quiz gramática",
        points: ["14 ejercicios con marcadores temporales", "Stats de aciertos y % de acierto", "Feedback con reglas generales"],
      },
    ],
  },
  {
    id: "voz-pasiva",
    key: "i2",
    tag: "I2",
    num: "02",
    title: "Voz pasiva",
    subtitle: "De quién actúa a quién recibe",
    theme: THEMES.orange,
    sims: [
      {
        name: "Passive Voice",
        desc: "Transforma oraciones activas en pasivas y domina la estructura be + participio en todos los tiempos: simple, continuo, perfecto y modal, con casos especiales como 'people'.",
        tag: "S + be + participio",
        href: "/ingles/passive-voice",
        icon: Repeat,
        keywords:
          "passive voice voz pasiva be participio transformación activa pasiva oraciones modales people quiz gramática",
        points: ["9 transformaciones por nivel", "Casos especiales: people, modales", "Fórmula general S + be + participio"],
      },
    ],
  },
  {
    id: "verbos-modales",
    key: "i3",
    tag: "I3",
    num: "03",
    title: "Verbos modales",
    subtitle: "Obligación, posibilidad y permiso",
    theme: THEMES.violet,
    sims: [
      {
        name: "Modal Verbs",
        desc: "must, can, might, should y compañía: obligación, prohibición, posibilidad, deducción y permiso. El matiz que convierte una recomendación en norma de seguridad del laboratorio.",
        tag: "Escala de certeza",
        href: "/ingles/modal-verbs",
        icon: Sparkles,
        keywords:
          "modal verbs modales must can might should obligación prohibición posibilidad deducción permiso certeza laboratorio quiz",
        points: ["10 ejercicios con contexto de laboratorio", "will → might → can't", "must not ≠ don't have to"],
      },
    ],
  },
  {
    id: "discurso-reportado",
    key: "i4",
    tag: "I4",
    num: "04",
    title: "Discurso reportado",
    subtitle: "Cuenta lo que alguien dijo",
    theme: THEMES.sky,
    sims: [
      {
        name: "Reported Speech",
        desc: "Cuenta lo que alguien dijo sin citarlo: backshift de tiempos, ajuste de pronombres y marcadores (now → then), preguntas sin auxiliar e imperativos con to + infinitivo.",
        tag: "Backshift",
        href: "/ingles/reported-speech",
        icon: MessageSquare,
        keywords:
          "reported speech discurso reportado backshift pronombres marcadores questions imperativos statements quiz gramática",
        points: ["10 transformaciones (statement, question, command)", "Tabla de backshift de tiempos", "now → then y otros marcadores"],
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
  i1: "Tiempos verbales",
  i2: "Voz pasiva",
  i3: "Verbos modales",
  i4: "Discurso reportado",
};

const SUGGESTIONS = ["passive", "modales", "reported", "tenses"];

type LastSim = { href: string; name: string };

const HERO_STATS = [
  `${TOTAL_SIMS} simuladores`,
  "4 unidades",
  "Feedback con reglas",
  "Resumen adaptativo",
];

/* Puntos con el color de cada unidad (I1–I4) para el badge del hero */
const UNIT_DOTS = ["bg-amber-500", "bg-orange-500", "bg-violet-500", "bg-sky-500"];

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
/* Arte del hero: globo, chat, fichas ABCD y fórmulas (decorativo)     */
/* ------------------------------------------------------------------ */
function HeroArt() {
  const chips = [
    { text: "S + be + participle", className: "left-[1%] top-[17%]", duration: 5.5, delay: 0 },
    { text: "will → would", className: "right-[3%] top-[5%]", duration: 6.5, delay: 0.9 },
    { text: "now → then", className: "left-[-1%] bottom-[30%]", duration: 6, delay: 0.45 },
    { text: "must · can · might", className: "right-[1%] bottom-[9%]", duration: 7, delay: 1.3 },
  ];

  const tiles = [
    { letter: "A", x: 58, y: 78, fill: "url(#igA)", d: 4.5, dl: 0 },
    { letter: "B", x: 330, y: 62, fill: "url(#igB)", d: 5.2, dl: 0.8 },
    { letter: "C", x: 52, y: 214, fill: "url(#igC)", d: 4.8, dl: 1.6 },
    { letter: "D", x: 330, y: 232, fill: "url(#igD)", d: 5.6, dl: 2.2 },
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
          <radialGradient id="igGlobe" cx="36%" cy="30%" r="80%">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset=".42" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#ea580c" />
          </radialGradient>
          <linearGradient id="igWave" x1="40" y1="278" x2="376" y2="278" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f59e0b" stopOpacity=".18" />
            <stop offset=".32" stopColor="#f97316" />
            <stop offset=".66" stopColor="#fb923c" />
            <stop offset="1" stopColor="#facc15" />
          </linearGradient>
          <linearGradient id="igArc" x1="296" y1="136" x2="366" y2="114" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb923c" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="igA" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="igB" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ea580c" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="igC" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#d946e6" />
          </linearGradient>
          <linearGradient id="igD" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#0ea5e9" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="igGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Anillo orbital punteado girando */}
        <motion.circle
          cx="210"
          cy="150"
          r="92"
          stroke="rgba(245,158,11,.32)"
          strokeWidth="1.2"
          strokeDasharray="2 7"
          style={{ transformOrigin: "210px 150px" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 90 }}
        />

        {/* Burbujas de chat flotando */}
        <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, ease: "easeInOut", duration: 5.2 }}>
          <rect x="172" y="50" width="46" height="28" rx="9" fill="#fff" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M182 77 l-3 10 12 -10 z" fill="#fff" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="181" y="58" width="26" height="3.5" rx="1.75" fill="#f59e0b" opacity=".55" />
          <rect x="181" y="66" width="17" height="3.5" rx="1.75" fill="#f59e0b" opacity=".35" />
        </motion.g>
        <motion.g animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, ease: "easeInOut", duration: 6, delay: 1.1 }}>
          <rect x="308" y="118" width="46" height="28" rx="9" fill="#fff" stroke="#f97316" strokeWidth="1.5" />
          <path d="M340 145 l10 3 -10 4 z" fill="#fff" stroke="#f97316" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="317" y="126" width="26" height="3.5" rx="1.75" fill="#f97316" opacity=".55" />
          <rect x="317" y="134" width="17" height="3.5" rx="1.75" fill="#f97316" opacity=".35" />
        </motion.g>
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, ease: "easeInOut", duration: 5.8, delay: 0.5 }}>
          <rect x="62" y="146" width="46" height="28" rx="9" fill="#fff" stroke="#fb923c" strokeWidth="1.5" />
          <path d="M94 173 l10 4 -12 6 z" fill="#fff" stroke="#fb923c" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="71" y="154" width="26" height="3.5" rx="1.75" fill="#fb923c" opacity=".55" />
          <rect x="71" y="162" width="17" height="3.5" rx="1.75" fill="#fb923c" opacity=".35" />
        </motion.g>

        {/* Globo con meridianos (ilusión de giro) */}
        <motion.circle
          cx="210"
          cy="150"
          r="64"
          fill="url(#igGlobe)"
          filter="url(#igGlow)"
          style={{ transformOrigin: "210px 150px" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 4.5 }}
        />
        <motion.g
          style={{ transformOrigin: "210px 150px" }}
          animate={{ scaleX: [1, 0.55, 1] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 9 }}
        >
          <ellipse cx="210" cy="150" rx="28" ry="64" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
          <ellipse cx="210" cy="150" rx="48" ry="64" stroke="rgba(255,255,255,.32)" strokeWidth="1.5" />
        </motion.g>
        <ellipse cx="210" cy="150" rx="64" ry="20" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" />
        <ellipse cx="197" cy="134" rx="12" ry="7" transform="rotate(-28 197 134)" fill="#ffffff" opacity=".3" />

        {/* Fichas A B C D con los colores de las unidades */}
        {tiles.map((t) => (
          <motion.g
            key={t.letter}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, ease: "easeInOut", duration: t.d, delay: t.dl }}
          >
            <rect x={t.x} y={t.y} width="30" height="30" rx="9" fill={t.fill} stroke="rgba(24,24,27,.08)" />
            <text
              x={t.x + 15}
              y={t.y + 21}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill="#ffffff"
              fontFamily="sans-serif"
            >
              {t.letter}
            </text>
          </motion.g>
        ))}

        {/* Flecha de transformación */}
        <path
          d="M296 136 C322 122 346 116 366 114"
          stroke="url(#igArc)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 7"
          opacity=".8"
        />
        <polygon points="366,108 378,114 366,121" fill="#e11d48" />
        <circle cx="296" cy="136" r="4.5" fill="#fb923c" />

        {/* Partículas */}
        <circle cx="78" cy="160" r="4" fill="#f97316" />
        <circle cx="338" cy="184" r="4" fill="#e11d48" />
        <circle cx="128" cy="252" r="4.5" fill="#fbbf24" />

        {/* Onda de voz */}
        <path d="M40 278q21-38 42 0t42 0 42 0 42 0 42 0 42 0 42 0" stroke="url(#igWave)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M40 292h336" stroke="currentColor" strokeWidth="1" opacity=".1" />
      </motion.svg>

      {/* Chips con estructuras gramaticales */}
      {chips.map((c) => (
        <motion.span
          key={c.text}
          className={`absolute rounded-full border border-amber-200/80 bg-white/85 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-amber-900/75 shadow-sm backdrop-blur ${c.className}`}
          animate={{ y: [0, -7, 0] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: c.duration, delay: c.delay }}
        >
          {c.text}
        </motion.span>
      ))}
    </div>
  );
}

export default function InglesPage() {
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
      <section className="relative -mt-[4.125rem] overflow-hidden bg-gradient-to-b from-amber-200/70 via-amber-100/70 to-orange-200/60">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-96 w-96 rounded-full bg-amber-200/45 blur-3xl blob-float" />
          <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl blob-float" style={{ animationDelay: "4s" }} />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-yellow-200/35 blur-3xl blob-float" style={{ animationDelay: "8s" }} />
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[calc(4rem+1.75rem)] sm:px-6 lg:px-8 lg:pb-16">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Inglés" }]} />

          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Texto */}
            <div className="min-w-0 text-center lg:col-span-7 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur"
              >
                <span className="flex items-center -space-x-1" aria-hidden="true">
                  {UNIT_DOTS.map((c) => (
                    <span key={c} className={`h-2 w-2 rounded-full ring-2 ring-white ${c}`} />
                  ))}
                </span>
                Materia · 4 unidades
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.98] tracking-tighter"
              >
                <span className="block bg-gradient-to-r from-foreground via-amber-950 to-amber-600 bg-clip-text text-transparent">
                  Inglés
                </span>
                <span className="relative inline-block">
                  {/* Halo de color detrás del texto */}
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-4 -inset-y-2 rounded-full bg-gradient-to-r from-amber-400/25 via-orange-300/25 to-yellow-300/35 blur-xl animated-gradient"
                  />
                  <span className="relative bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent animated-gradient pr-[0.12em] -mr-[0.12em]">
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
                      stroke="url(#ingles-underline)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="ingles-underline" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#d97706" />
                        <stop offset="0.5" stopColor="#f97316" />
                        <stop offset="1" stopColor="#facc15" />
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
                Cuatro entrenadores de gramática con estrategia y explicación: tiempos verbales,
                voz pasiva, modales y reported speech. Busca por tema, filtra por unidad y
                practica aquí mismo: cada ejercicio trae feedback pedagógico y reglas generales.
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-white/75 px-3 py-1 text-[11px] font-semibold text-foreground/70 shadow-sm backdrop-blur"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
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
                  href="#tiempos-verbales"
                  className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-amber-500/40 active:translate-y-0 active:scale-95"
                >
                  Explorar simuladores
                  <ArrowDown className="h-4 w-4" />
                </a>
                <Link
                  href="/retos"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-amber-300 hover:bg-amber-50/40 active:translate-y-0 active:scale-95"
                >
                  <Zap className="h-4 w-4 text-amber-500" />
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
            <linearGradient id="ingles-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#d97706" stopOpacity="0" />
              <stop offset=".18" stopColor="#d97706" stopOpacity=".9" />
              <stop offset=".5" stopColor="#f97316" />
              <stop offset=".82" stopColor="#facc15" stopOpacity=".9" />
              <stop offset="1" stopColor="#facc15" stopOpacity="0" />
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
            stroke="url(#ingles-wave)"
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
            className="shine group relative -mt-2 flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50/70 to-white p-4 text-left shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30">
              <History className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-700">
                Continuar donde te quedaste
              </span>
              <span className="block truncate text-[14.5px] font-semibold text-foreground">
                {last.name}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-amber-600 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        )}

        {/* Buscador + filtro por unidad (flota al hacer scroll) */}
        <div className="sticky top-[5.25rem] z-30 mt-6 rounded-2xl border border-black/[0.06] bg-white/85 p-3 shadow-[0_14px_40px_-18px_rgba(24,24,27,0.35)] backdrop-blur-xl sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="group relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-amber-600" />
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
                placeholder="Buscar simulador por tema: passive, modales, tenses…"
                aria-label="Buscar simulador por tema"
                autoComplete="off"
                spellCheck={false}
                className="h-10 w-full rounded-full border border-black/[0.08] bg-white pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-amber-400 focus:ring-[3px] focus:ring-amber-400/20 [&::-webkit-search-cancel-button]:hidden"
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
                      ? "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25"
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
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-50 active:scale-95"
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
                className="absolute -inset-3 rounded-full border border-dashed border-amber-300/80"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 16 }}
              />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-white text-amber-600 shadow-sm">
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
                  className="rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-[12px] font-semibold text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
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
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 text-center shadow-sm sm:p-10">
          <div className="absolute inset-0 dots-pattern opacity-25" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {TOTAL_SIMS} simuladores · 4 unidades
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ¿Listo para practicar?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Empieza por Verb Tenses si es tu primera vez con los marcadores temporales.
              Cada simulador guarda tu progreso mientras navegas entre ejercicios y cierra con
              un resumen que te dice si dominas el tema o te conviene repasar.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/ingles/verb-tenses"
                className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-amber-500/40 active:translate-y-0 active:scale-95"
              >
                Empezar con Verb Tenses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/laboratorios"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-amber-300 hover:bg-amber-50/40 active:scale-95"
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
