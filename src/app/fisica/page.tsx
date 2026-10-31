"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  AudioWaveform,
  Car,
  Crosshair,
  Droplets,
  History,
  Magnet,
  Scale,
  Search,
  SearchX,
  Spline,
  Wind,
  X,
  Zap,
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
  blue: {
    icon: "bg-gradient-to-br from-blue-500 to-indigo-500",
    soft: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    hover: "hover:border-blue-300/70",
    chipOn: "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/30",
    glow: "shadow-blue-500/25",
    panel: "border-blue-100/90 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50",
    ghost: "text-blue-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(59,130,246,0.40)]",
    hoverSoft: "group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600",
  },
  emerald: {
    icon: "bg-gradient-to-br from-emerald-500 to-teal-500",
    soft: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    hover: "hover:border-emerald-300/70",
    chipOn: "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/30",
    glow: "shadow-emerald-500/25",
    panel: "border-emerald-100/90 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/60",
    ghost: "text-emerald-500/[0.05]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(16,185,129,0.40)]",
    hoverSoft: "group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600",
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
  amber: {
    icon: "bg-gradient-to-br from-amber-500 to-orange-500",
    soft: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    hover: "hover:border-amber-300/70",
    chipOn: "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/30",
    glow: "shadow-amber-500/25",
    panel: "border-amber-100/90 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/60",
    ghost: "text-amber-500/[0.06]",
    hoverShadow: "hover:shadow-[0_16px_36px_-18px_rgba(245,158,11,0.40)]",
    hoverSoft: "group-hover:border-amber-200 group-hover:bg-amber-50 group-hover:text-amber-600",
  },
} as const;

const UNITS: Unit[] = [
  {
    id: "fisica-i",
    key: "f1",
    tag: "F1",
    num: "01",
    title: "Física I",
    subtitle: "Cinemática y movimiento",
    theme: THEMES.blue,
    sims: [
      {
        name: "MRU y MRUV",
        desc: "Velocidad constante y aceleración: posición, velocidad y gráficas en vivo.",
        tag: "Cinemática",
        href: "/simuladores/01-Fisica-I/mru-mruv/index.html",
        icon: Car,
        keywords:
          "movimiento rectilíneo uniforme mru mruv cinemática velocidad aceleración posición gráfica auto distancia tiempo",
        points: ["Posición y velocidad en vivo", "Gráficas x-t y v-t"],
      },
      {
        name: "Tiro parabólico",
        desc: "Ángulo, rapidez y gravedad: acierta el blanco en Tierra, Luna y Marte.",
        tag: "Movimiento en 2D",
        href: "/simuladores/01-Fisica-I/tiro-parabolico/index.html",
        icon: Crosshair,
        keywords:
          "tiro parabólico proyectil cañón blanco objetivo gravedad tierra luna marte ángulo velocidad trayectoria",
        points: ["3 gravedades: Tierra, Luna y Marte", "Ajusta ángulo y rapidez"],
      },
    ],
  },
  {
    id: "fisica-ii",
    key: "f2",
    tag: "F2",
    num: "02",
    title: "Física II",
    subtitle: "Fuerzas, energía y fluidos",
    theme: THEMES.emerald,
    sims: [
      {
        name: "Fuerzas y movimiento",
        desc: "Fricción, plano inclinado y diagramas de cuerpo libre.",
        tag: "Dinámica",
        href: "/simuladores/02-Fisica-II/fuerzas-y-movimiento/index.html",
        icon: Scale,
        keywords:
          "fuerzas movimiento newton fricción estática dinámica plano inclinado masa aceleración diagrama cuerpo libre",
        points: ["Diagrama de cuerpo libre", "Fricción estática y dinámica"],
      },
      {
        name: "Colisiones",
        desc: "Choques entre carritos: momento y energía antes y después.",
        tag: "Momento lineal",
        href: "/simuladores/02-Fisica-II/colisiones/index.html",
        icon: ArrowLeftRight,
        keywords:
          "colisiones choques momento cantidad de movimiento energía carritos restitución conservación impulso",
        points: ["Elasticidad ajustable", "Momento antes y después"],
      },
      {
        name: "Energía del patinador",
        desc: "Energía potencial, cinética y calor en una pista curva.",
        tag: "Trabajo y energía",
        href: "/simuladores/02-Fisica-II/energia-patinador/index.html",
        icon: Activity,
        keywords:
          "energía patinador potencial cinética fricción calor conservación pista curva trabajo potencia",
        points: ["Energía potencial, cinética y calor", "Pista curva editable"],
      },
      {
        name: "Resortes y masas",
        desc: "Oscilaciones verticales: periodo, frecuencia y amortiguamiento.",
        tag: "Movimiento armónico",
        href: "/simuladores/02-Fisica-II/resortes-y-mas/index.html",
        icon: Spline,
        keywords:
          "resortes masas oscilación armónico periodo frecuencia amortiguamiento ley de hooke elasticidad",
        points: ["Ley de Hooke en vivo", "Periodo y frecuencia"],
      },
      {
        name: "Flotabilidad",
        desc: "Empuje, peso y densidad: ¿flota, se hunde o queda a medias?",
        tag: "Hidrostática",
        href: "/simuladores/02-Fisica-II/flotabilidad/index.html",
        icon: Droplets,
        keywords:
          "flotabilidad empuje arquímedes densidad líquido flota hundir peso volumen hidrostática",
        points: ["Principio de Arquímedes", "Densidad ajustable"],
      },
      {
        name: "Gases y presión",
        desc: "Teoría cinética, émbolo y presión medida choque por choque.",
        tag: "Termodinámica",
        href: "/simuladores/02-Fisica-II/gases/index.html",
        icon: Wind,
        keywords:
          "gases presión temperatura volumen émbolo teoría cinética partículas choques maxwell boltzmann",
        points: ["Teoría cinética molecular", "Émbolo interactivo"],
      },
    ],
  },
  {
    id: "fisica-iii",
    key: "f3",
    tag: "F3",
    num: "03",
    title: "Física III",
    subtitle: "Electricidad y magnetismo",
    theme: THEMES.violet,
    sims: [
      {
        name: "Cargas y campo",
        desc: "Superposición, líneas de campo, potencial y sonda de prueba.",
        tag: "Electrostática",
        href: "/simuladores/03-Fisica-III/cargas-y-campo/index.html",
        icon: Magnet,
        keywords:
          "cargas campo eléctrico potencial superposición líneas de campo sonda fuerza coulomb dipolo electrostática",
        points: ["Líneas de campo visible", "Sonda de potencial"],
      },
      {
        name: "Ley de Ohm",
        desc: "Circuitos en serie y paralelo con corriente animada.",
        tag: "Circuitos eléctricos",
        href: "/simuladores/03-Fisica-III/ley-de-ohm/index.html",
        icon: Zap,
        keywords:
          "ley de ohm circuito serie paralelo resistencia voltaje corriente batería potencia eléctrica calor",
        points: ["Serie y paralelo", "Corriente animada"],
      },
    ],
  },
  {
    id: "fisica-iv",
    key: "f4",
    tag: "F4",
    num: "04",
    title: "Física IV",
    subtitle: "Ondas y fenómenos periódicos",
    theme: THEMES.amber,
    sims: [
      {
        name: "Ondas en cuerda",
        desc: "Ondas viajeras y estacionarias, nodos, vientres y resonancia.",
        tag: "Ondas mecánicas",
        href: "/simuladores/04-Fisica-IV/ondas-en-cuerda/index.html",
        icon: AudioWaveform,
        keywords:
          "ondas cuerda viajera estacionaria nodos vientres frecuencia tensión resonancia armónico longitud de onda",
        points: ["Nodos y vientres", "Resonancia armónica"],
      },
    ],
  },
];

const TOTAL_SIMS = UNITS.reduce((total, unit) => total + unit.sims.length, 0);
const ALL_HREFS = new Set(UNITS.flatMap((u) => u.sims.map((s) => s.href)));

const simCount = (count: number) => (count === 1 ? "1 simulador" : `${count} simuladores`);

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

/* Búsqueda sin importar acentos ni mayúsculas */
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const UNIT_LABEL: Record<string, string> = {
  all: "todas las unidades",
  f1: "Física I",
  f2: "Física II",
  f3: "Física III",
  f4: "Física IV",
};

const SUGGESTIONS = ["energía", "ondas", "circuito", "fuerzas"];

type LastSim = { href: string; name: string };

const HERO_STATS = [
  `${TOTAL_SIMS} simuladores`,
  "4 unidades",
  "Gráficas en vivo",
  "Funciona sin internet",
];

/* Puntos con el color de cada unidad (F1–F4) para el badge del hero */
const UNIT_DOTS = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];

/* ------------------------------------------------------------------ */
/* Arte del hero: órbitas, núcleo y fórmulas flotantes (decorativo)    */
/* ------------------------------------------------------------------ */
function HeroArt() {
  const chips = [
    { text: "F = m · a", className: "left-[1%] top-[17%]", duration: 5.5, delay: 0 },
    { text: "v = √(T/μ)", className: "right-[3%] top-[5%]", duration: 6.5, delay: 0.9 },
    { text: "E = ½mv²", className: "left-[-1%] bottom-[30%]", duration: 6, delay: 0.45 },
    { text: "P · V = nRT", className: "right-[1%] bottom-[9%]", duration: 7, delay: 1.3 },
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
          <radialGradient id="hgNucleus" cx="34%" cy="28%" r="80%">
            <stop offset="0" stopColor="#a7f3d0" />
            <stop offset=".42" stopColor="#10b981" />
            <stop offset="1" stopColor="#0e7490" />
          </radialGradient>
          <linearGradient id="hgWave" x1="40" y1="278" x2="376" y2="278" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#10b981" stopOpacity=".18" />
            <stop offset=".32" stopColor="#14b8a6" />
            <stop offset=".66" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="hgArc" x1="54" y1="252" x2="264" y2="116" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#fbbf24" />
          </linearGradient>
          <filter id="hgGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Órbitas */}
        <motion.g
          style={{ transformOrigin: "210px 150px" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 52 }}
          opacity=".55"
        >
          <ellipse cx="210" cy="150" rx="132" ry="47" transform="rotate(-17 210 150)" stroke="#10b981" strokeWidth="1.5" />
          <ellipse cx="210" cy="150" rx="132" ry="47" transform="rotate(47 210 150)" stroke="#06b6d4" strokeWidth="1.5" />
          <ellipse cx="210" cy="150" rx="132" ry="47" transform="rotate(103 210 150)" stroke="#f59e0b" strokeWidth="1.5" />
        </motion.g>

        {/* Anillo punteado + núcleo */}
        <motion.circle
          cx="210"
          cy="150"
          r="76"
          stroke="rgba(16,185,129,.28)"
          strokeWidth="1"
          strokeDasharray="2 7"
          style={{ transformOrigin: "210px 150px" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 90 }}
        />
        <motion.circle
          cx="210"
          cy="150"
          r="34"
          fill="url(#hgNucleus)"
          filter="url(#hgGlow)"
          style={{ transformOrigin: "210px 150px" }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 4.5 }}
        />
        <ellipse cx="199" cy="137" rx="11" ry="7" transform="rotate(-28 199 137)" fill="#ffffff" opacity=".34" />

        {/* Partículas */}
        <circle cx="335" cy="116" r="5" fill="#34d399" />
        <circle cx="84" cy="184" r="4" fill="#f59e0b" />
        <circle cx="276" cy="214" r="4.5" fill="#06b6d4" />

        {/* Trayectoria parabólica */}
        <path d="M54 252C94 166 172 120 264 126" stroke="url(#hgArc)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" opacity=".8" />
        <circle cx="264" cy="126" r="5" fill="#fbbf24" />

        {/* Onda */}
        <path d="M40 278q21-38 42 0t42 0 42 0 42 0 42 0 42 0 42 0" stroke="url(#hgWave)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M40 292h336" stroke="currentColor" strokeWidth="1" opacity=".1" />
      </motion.svg>

      {/* Chips con fórmulas */}
      {chips.map((c) => (
        <motion.span
          key={c.text}
          className={`absolute rounded-full border border-emerald-200/80 bg-white/85 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-emerald-900/75 shadow-sm backdrop-blur ${c.className}`}
          animate={{ y: [0, -7, 0] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: c.duration, delay: c.delay }}
        >
          {c.text}
        </motion.span>
      ))}
    </div>
  );
}

export default function FisicaPage() {
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

  /* Último simulador abierto (registrado por base.js) — solo tras montar */
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

  /* Atajo «/» para enfocar el buscador, como en los simuladores */
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
      <section className="relative -mt-[4.125rem] overflow-hidden bg-gradient-to-b from-emerald-100/80 via-teal-50/60 to-emerald-100/80">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-96 w-96 rounded-full bg-emerald-200/45 blur-3xl blob-float" />
          <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl blob-float" style={{ animationDelay: "4s" }} />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl blob-float" style={{ animationDelay: "8s" }} />
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[calc(4rem+1.75rem)] sm:px-6 lg:px-8 lg:pb-16">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Física" }]} />

          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Texto */}
            <div className="min-w-0 text-center lg:col-span-7 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur"
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
                <span className="block bg-gradient-to-r from-foreground via-emerald-900 to-emerald-700 bg-clip-text text-transparent">
                  Física
                </span>
                <span className="relative inline-block">
                  {/* Halo de color detrás del texto */}
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-4 -inset-y-2 rounded-full bg-gradient-to-r from-emerald-400/25 via-teal-300/25 to-cyan-300/35 blur-xl animated-gradient"
                  />
                  <span className="relative bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 bg-clip-text text-transparent animated-gradient pr-[0.12em] -mr-[0.12em]">
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
                      stroke="url(#fisica-underline)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="fisica-underline" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#059669" />
                        <stop offset="0.5" stopColor="#14b8a6" />
                        <stop offset="1" stopColor="#22d3ee" />
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
                Cinemática, fuerzas, energía, fluidos, electricidad y ondas en un solo catálogo
                interactivo de Física I a IV. Busca por tema, filtra por unidad y experimenta
                aquí mismo: sin salir de la página, sin cuentas y sin instalar nada.
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white/75 px-3 py-1 text-[11px] font-semibold text-foreground/70 shadow-sm backdrop-blur"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
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
                  href="#fisica-i"
                  className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-emerald-500/40 active:translate-y-0 active:scale-95"
                >
                  Explorar simuladores
                  <ArrowDown className="h-4 w-4" />
                </a>
                <Link
                  href="/retos"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-emerald-300 hover:bg-emerald-50/40 active:translate-y-0 active:scale-95"
                >
                  <Zap className="h-4 w-4 text-emerald-500" />
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
            <linearGradient id="fisica-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#059669" stopOpacity="0" />
              <stop offset=".18" stopColor="#059669" stopOpacity=".9" />
              <stop offset=".5" stopColor="#14b8a6" />
              <stop offset=".82" stopColor="#22d3ee" stopOpacity=".9" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
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
            stroke="url(#fisica-wave)"
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
            className="shine group relative -mt-2 flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-white p-4 text-left shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30">
              <History className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-700">
                Continuar donde te quedaste
              </span>
              <span className="block truncate text-[14.5px] font-semibold text-foreground">
                {last.name}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        )}

        {/* Buscador + filtro por unidad (flota al hacer scroll) */}
        <div className="sticky top-[5.25rem] z-30 mt-6 rounded-2xl border border-black/[0.06] bg-white/85 p-3 shadow-[0_14px_40px_-18px_rgba(24,24,27,0.35)] backdrop-blur-xl sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="group relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-emerald-600" />
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
                placeholder="Buscar simulador por tema: energía, ondas, circuitos…"
                aria-label="Buscar simulador por tema"
                autoComplete="off"
                spellCheck={false}
                className="h-10 w-full rounded-full border border-black/[0.08] bg-white pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-emerald-400 focus:ring-[3px] focus:ring-emerald-400/20 [&::-webkit-search-cancel-button]:hidden"
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
                      ? "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/25"
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
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 active:scale-95"
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
                className="absolute -inset-3 rounded-full border border-dashed border-emerald-300/80"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 16 }}
              />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600 shadow-sm">
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
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[12px] font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95"
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

        {/* Unidades — paneles con el color de cada materia */}
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
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 text-center shadow-sm sm:p-10">
          <div className="absolute inset-0 dots-pattern opacity-25" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {TOTAL_SIMS} simuladores · 4 unidades
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ¿Listo para experimentar?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Elige un simulador, mueve los controles y observa las gráficas cambiar en tiempo real;
              cada uno trae una guía breve con la teoría que ocurre en pantalla. Cuando te sientas
              listo, mide lo aprendido con los retos de 5 minutos.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/retos"
                className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-emerald-500/40 active:translate-y-0 active:scale-95"
              >
                Ver retos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/laboratorios"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-emerald-300 hover:bg-emerald-50/40 active:scale-95"
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
