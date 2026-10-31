"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  Atom,
  AudioWaveform,
  Beaker,
  Calculator,
  Car,
  CheckCircle2,
  Clock,
  Crosshair,
  Droplets,
  FlaskConical,
  History,
  Languages,
  Lightbulb,
  Magnet,
  MessageSquare,
  MousePointerClick,
  Repeat,
  Scale,
  Search,
  SearchX,
  Sparkles,
  Spline,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/site/ui";
import { SimCard, simCardId, type SimItem, type SimTheme } from "@/components/site/sim-card";

/* ------------------------------------------------------------------ */
/* Datos: el método científico de la guía destacada                    */
/* ------------------------------------------------------------------ */

const LAB_STEPS = [
  {
    n: 1,
    title: "Plantea la hipótesis",
    desc: "Con 8 g de H₂ y 8 g de O₂ para 2H₂ + O₂ → 2H₂O: ¿cuál se agota primero? Intuye, no calcules.",
    icon: Lightbulb,
  },
  {
    n: 2,
    title: "Realiza el cálculo",
    desc: "Gramos ÷ masa molar: 8 g de H₂ ≈ 4 mol, 8 g de O₂ ≈ 0.25 mol. Divide entre su coeficiente.",
    icon: Calculator,
  },
  {
    n: 3,
    title: "Registra los resultados",
    desc: "H₂: 4 ÷ 2 = 2 rondas · O₂: 0.25 ÷ 1 = 0.25 rondas. El menor gana (o pierde): el O₂ limita.",
    icon: Beaker,
  },
  {
    n: 4,
    title: "Concluye",
    desc: "La estequiometría cuenta moles, no gramos: el que pesa igual no se agota igual. Verifícalo en el simulador.",
    icon: CheckCircle2,
  },
];

/* ------------------------------------------------------------------ */
/* Catálogo: los 18 simuladores del sitio, agrupados por materia       */
/* ------------------------------------------------------------------ */

const MATERIA_THEMES: Record<string, SimTheme> = {
  fisica: {
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
  quimica: {
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
  ingles: {
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
};

type Materia = {
  id: string;
  key: "fisica" | "quimica" | "ingles";
  title: string;
  subtitle: string;
  ghost: string;
  icon: LucideIcon;
  theme: SimTheme;
  sims: SimItem[];
};

const MATERIAS: Materia[] = [
  {
    id: "lab-fisica",
    key: "fisica",
    title: "Física",
    subtitle: "Cinemática, fuerzas, energía, fluidos, electricidad y ondas — de Física I a IV",
    ghost: "F",
    icon: Atom,
    theme: MATERIA_THEMES.fisica,
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
  {
    id: "lab-quimica",
    key: "quimica",
    title: "Química",
    subtitle: "Lenguaje químico, reacciones y estequiometría con datos reales",
    ghost: "Q",
    icon: FlaskConical,
    theme: MATERIA_THEMES.quimica,
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
      {
        name: "Balanceo de ecuaciones",
        desc: "Ajusta coeficientes con steppers o escribiendo el número directamente y observa la tabla de átomos equilibrarse en vivo: combustiones de hidrocarburos y reacciones inorgánicas clásicas.",
        tag: "Conteo de átomos",
        href: "/quimica/balanceo",
        icon: Scale,
        keywords:
          "balanceo ecuaciones coeficientes steppers átomos tabla combustiones hidrocarburos reacciones inorgánicas conservación masa solución",
        points: ["8 reacciones con input editable", "Botón Ver solución + insights"],
      },
      {
        name: "Reactivo limitante",
        desc: "De gramos a moles y de moles a producto: ajusta las masas de los reactivos, predice cuál se agota primero y calcula el rendimiento teórico con masas molares reales de la tabla periódica.",
        tag: "Masa → mol → gramos",
        href: "/quimica/estequiometria",
        icon: Calculator,
        keywords:
          "estequiometría reactivo limitante moles gramos rendimiento teórico masa molar tabla periódica conversiones exceso rondas",
        points: ["Tabla masa → mol → rondas", "Marcas LIMITANTE / EN EXCESO"],
      },
    ],
  },
  {
    id: "lab-ingles",
    key: "ingles",
    title: "Inglés",
    subtitle: "Tiempos verbales, voz pasiva, modales y discurso reportado",
    ghost: "I",
    icon: Languages,
    theme: MATERIA_THEMES.ingles,
    sims: [
      {
        name: "Verb Tenses",
        desc: "Catorce ejercicios de presente y pasado, simple y continuo, perfecto y condicionales de tiempo: la señal está en los marcadores ('since', 'last year', 'look!') y en la lógica de la ciencia.",
        tag: "Tenses & markers",
        href: "/ingles/verb-tenses",
        icon: Clock,
        keywords:
          "verb tenses tiempos verbales presente pasado simple continuo perfecto condicional marcadores since last year quiz gramática",
        points: ["14 ejercicios con marcadores temporales", "Feedback con reglas generales"],
      },
      {
        name: "Passive Voice",
        desc: "Transforma oraciones activas en pasivas y domina la estructura be + participio en todos los tiempos: simple, continuo, perfecto y modal, con casos especiales como 'people'.",
        tag: "S + be + participio",
        href: "/ingles/passive-voice",
        icon: Repeat,
        keywords:
          "passive voice voz pasiva be participio transformación activa pasiva oraciones modales people quiz gramática",
        points: ["9 transformaciones por nivel", "Casos especiales: people, modales"],
      },
      {
        name: "Modal Verbs",
        desc: "must, can, might, should y compañía: obligación, prohibición, posibilidad, deducción y permiso. El matiz que convierte una recomendación en norma de seguridad del laboratorio.",
        tag: "Escala de certeza",
        href: "/ingles/modal-verbs",
        icon: Sparkles,
        keywords:
          "modal verbs modales must can might should obligación prohibición posibilidad deducción permiso certeza laboratorio quiz",
        points: ["10 ejercicios con contexto de laboratorio", "must not ≠ don't have to"],
      },
      {
        name: "Reported Speech",
        desc: "Cuenta lo que alguien dijo sin citarlo: backshift de tiempos, ajuste de pronombres y marcadores (now → then), preguntas sin auxiliar e imperativos con to + infinitivo.",
        tag: "Backshift",
        href: "/ingles/reported-speech",
        icon: MessageSquare,
        keywords:
          "reported speech discurso reportado backshift pronombres marcadores questions imperativos statements quiz gramática",
        points: ["10 transformaciones (statement, question, command)", "Tabla de backshift de tiempos"],
      },
    ],
  },
];

const TOTAL_SIMS = MATERIAS.reduce((total, m) => total + m.sims.length, 0);
const ALL_HREFS = new Set(MATERIAS.flatMap((m) => m.sims.map((s) => s.href)));

const simCount = (count: number) => (count === 1 ? "1 simulador" : `${count} simuladores`);

/* Búsqueda sin importar acentos ni mayúsculas */
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const MATERIA_LABEL: Record<string, string> = {
  all: "todas las materias",
  fisica: "Física",
  quimica: "Química",
  ingles: "Inglés",
};

const SUGGESTIONS = ["moles", "ondas", "IUPAC", "passive"];

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

type LastSim = { href: string; name: string };

const HERO_STATS = [
  `${TOTAL_SIMS} simuladores`,
  "3 materias",
  "Método científico",
  "Sin salir de la página",
];

/* Puntos con el color de cada materia para el badge del hero */
const SUBJECT_DOTS = ["bg-emerald-500", "bg-fuchsia-500", "bg-amber-500"];

/* ------------------------------------------------------------------ */
/* Arte del hero: vaso de precipitados, gotero, tubos y molécula       */
/* ------------------------------------------------------------------ */

function HeroArt() {
  const chips = [
    { text: "n = m ÷ M", className: "left-[1%] top-[17%]", duration: 5.5, delay: 0 },
    { text: "6.022 × 10²³", className: "right-[3%] top-[5%]", duration: 6.5, delay: 0.9 },
    { text: "±0.01 g", className: "left-[-1%] bottom-[30%]", duration: 6, delay: 0.45 },
    { text: "T = 25 °C", className: "right-[1%] bottom-[9%]", duration: 7, delay: 1.3 },
  ];

  const bubbles = [
    { cx: 196, r: 4, d: 3.6, dl: 0 },
    { cx: 221, r: 3, d: 4.4, dl: 1.2 },
    { cx: 241, r: 5, d: 3.2, dl: 0.6 },
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
          <radialGradient id="lgLiquid" cx="38%" cy="30%" r="85%">
            <stop offset="0" stopColor="#ddd6fe" />
            <stop offset=".45" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#4f46e5" />
          </radialGradient>
          <linearGradient id="lgWave" x1="40" y1="278" x2="376" y2="278" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity=".18" />
            <stop offset=".32" stopColor="#8b5cf6" />
            <stop offset=".66" stopColor="#6366f1" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="lgArc" x1="258" y1="152" x2="328" y2="116" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="lgTube1" x1="80" y1="204" x2="102" y2="248" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f472b6" />
            <stop offset="1" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="lgTube2" x1="114" y1="204" x2="136" y2="248" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <filter id="lgGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="lgBeakerClip">
            <path d="M172 90 h76 v138 q0 14 -14 14 h-48 q-14 0 -14 -14 z" />
          </clipPath>
        </defs>

        {/* Anillo orbital punteado girando */}
        <motion.circle
          cx="210"
          cy="168"
          r="94"
          stroke="rgba(139,92,246,.32)"
          strokeWidth="1.2"
          strokeDasharray="2 7"
          style={{ transformOrigin: "210px 168px" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 90 }}
        />

        {/* Graduaciones del vaso */}
        <path d="M238 118 h8 M238 146 h8 M238 174 h8" stroke="#8b5cf6" strokeWidth="1.4" opacity=".45" strokeLinecap="round" />

        {/* Vaso de precipitados con líquido violeta */}
        <g>
          <path
            d="M172 90 h76 v138 q0 14 -14 14 h-48 q-14 0 -14 -14 z"
            fill="rgba(255,255,255,.5)"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Pico vertedor */}
          <path d="M172 90 l-8 8" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
          <g clipPath="url(#lgBeakerClip)">
            <path
              d="M170 176 q19 -8 38 0 t38 0 v54 q0 14 -14 14 h-48 q-14 0 -14 -14 z"
              fill="url(#lgLiquid)"
              opacity=".85"
              filter="url(#lgGlow)"
            />
            <path d="M170 176 q19 -8 38 0 t38 0" stroke="#ddd6fe" strokeWidth="1.5" opacity=".7" />
            {bubbles.map((b) => (
              <motion.circle
                key={b.cx}
                cx={b.cx}
                cy={226}
                r={b.r}
                fill="#fff"
                animate={{ y: [0, -42], opacity: [0, 0.85, 0] }}
                transition={{ repeat: Infinity, ease: "linear", duration: b.d, delay: b.dl }}
              />
            ))}
          </g>
        </g>

        {/* Gotero con gota cayendo */}
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, ease: "easeInOut", duration: 5 }}>
          <rect x="206.5" y="62" width="7" height="26" rx="3" fill="#fff" stroke="#8b5cf6" strokeWidth="1.5" />
          <ellipse cx="210" cy="52" rx="11" ry="13" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
          <ellipse cx="206" cy="47" rx="3.5" ry="4.5" fill="#fff" opacity=".7" />
        </motion.g>
        <motion.circle
          cx="210"
          cy="98"
          r="3.5"
          fill="#6366f1"
          animate={{ y: [0, 68], opacity: [0, 0.9, 0] }}
          transition={{ repeat: Infinity, ease: "easeIn", duration: 1.5, delay: 0.4 }}
        />

        {/* Tubos de ensayo con la gradilla */}
        <g>
          <path d="M80 154 h22 v84 q0 12 -11 12 q-11 0 -11 -12 z" fill="rgba(255,255,255,.55)" stroke="#a78bfa" strokeWidth="2" strokeLinejoin="round" />
          <path d="M82 204 h18 v34 q0 10 -9 10 q-9 0 -9 -10 z" fill="url(#lgTube1)" opacity=".85" />
          <path d="M114 154 h22 v84 q0 12 -11 12 q-11 0 -11 -12 z" fill="rgba(255,255,255,.55)" stroke="#a78bfa" strokeWidth="2" strokeLinejoin="round" />
          <path d="M116 204 h18 v34 q0 10 -9 10 q-9 0 -9 -10 z" fill="url(#lgTube2)" opacity=".85" />
          <rect x="66" y="250" width="84" height="12" rx="5" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
        </g>

        {/* Molécula flotante */}
        <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, ease: "easeInOut", duration: 5.5 }}>
          <line x1="332" y1="98" x2="360" y2="76" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="328" y1="92" x2="356" y2="70" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" opacity=".45" />
          <circle cx="332" cy="98" r="10" fill="#6366f1" />
          <circle cx="360" cy="76" r="7" fill="#0ea5e9" />
        </motion.g>

        {/* Flecha de reacción */}
        <path
          d="M258 152 C286 144 310 130 328 116"
          stroke="url(#lgArc)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 7"
          opacity=".8"
        />
        <polygon points="328,108 340,116 328,124" fill="#0ea5e9" />
        <circle cx="258" cy="152" r="4.5" fill="#a78bfa" />

        {/* Partículas */}
        <circle cx="66" cy="184" r="4" fill="#ec4899" />
        <circle cx="352" cy="200" r="4" fill="#6366f1" />
        <circle cx="150" cy="124" r="4.5" fill="#0ea5e9" />

        {/* Superficie del líquido */}
        <path d="M40 278q21-38 42 0t42 0 42 0 42 0 42 0 42 0 42 0" stroke="url(#lgWave)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M40 292h336" stroke="currentColor" strokeWidth="1" opacity=".1" />
      </motion.svg>

      {/* Chips con datos de laboratorio */}
      {chips.map((c) => (
        <motion.span
          key={c.text}
          className={`absolute rounded-full border border-violet-200/80 bg-white/85 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-violet-900/75 shadow-sm backdrop-blur ${c.className}`}
          animate={{ y: [0, -7, 0] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: c.duration, delay: c.delay }}
        >
          {c.text}
        </motion.span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function LaboratoriosPage() {
  const [materia, setMateria] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [last, setLast] = useState<LastSim | null>(null);
  const [openHref, setOpenHref] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Abrir/cerrar un simulador en su tarjeta (acordeón inline) */
  const toggleSim = (sim: SimItem) => {
    const next = openHref === sim.href ? null : sim.href;
    setOpenHref(next);
    if (next) {
      rememberLastSim(next, sim.name);
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
    setMateria("all");
    setOpenHref(last.href);
    rememberLastSim(last.href, last.name);
    window.setTimeout(() => {
      document
        .getElementById(simCardId(last.href))
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 140);
  };

  /* La guía destacada abre su simulador aquí mismo, en el catálogo */
  const openFeatured = () => {
    const href = "/quimica/estequiometria";
    setQuery("");
    setMateria("all");
    setOpenHref(href);
    rememberLastSim(href, "Reactivo limitante");
    window.setTimeout(() => {
      document
        .getElementById(simCardId(href))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
  };

  /* Último simulador abierto (compartido con las páginas de materia) */
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

  /* Atajo «/» para enfocar el buscador, como en las materias */
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
    return MATERIAS.filter((m) => materia === "all" || m.key === materia)
      .map((m) => ({
        ...m,
        sims: q
          ? m.sims.filter((s) =>
              norm(`${s.name} ${s.desc} ${s.tag} ${s.keywords}`).includes(q),
            )
          : m.sims,
      }))
      .filter((m) => m.sims.length > 0);
  }, [materia, q]);

  const visibleCount = visible.reduce((n, m) => n + m.sims.length, 0);

  const filtersActive = query.trim() !== "" || materia !== "all";
  const clearFilters = () => {
    setQuery("");
    setMateria("all");
  };

  const infoParts = [simCount(visibleCount), MATERIA_LABEL[materia] ?? "todas las materias"];
  if (query.trim()) infoParts.push(`búsqueda: «${query.trim()}»`);

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative -mt-[4.125rem] overflow-hidden bg-gradient-to-b from-violet-100/80 via-indigo-50/60 to-violet-100/80">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-96 w-96 rounded-full bg-violet-200/45 blur-3xl blob-float" />
          <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl blob-float" style={{ animationDelay: "4s" }} />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl blob-float" style={{ animationDelay: "8s" }} />
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[calc(4rem+1.75rem)] sm:px-6 lg:px-8 lg:pb-16">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Laboratorios" }]} />

          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Texto */}
            <div className="min-w-0 text-center lg:col-span-7 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur"
              >
                <span className="flex items-center -space-x-1" aria-hidden="true">
                  {SUBJECT_DOTS.map((c) => (
                    <span key={c} className={`h-2 w-2 rounded-full ring-2 ring-white ${c}`} />
                  ))}
                </span>
                Todo en una página · {TOTAL_SIMS} simuladores
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.98] tracking-tighter"
              >
                <span className="block bg-gradient-to-r from-foreground via-violet-950 to-violet-700 bg-clip-text text-transparent">
                  Del concepto al
                </span>
                <span className="relative inline-block">
                  {/* Halo de color detrás del texto */}
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-4 -inset-y-2 rounded-full bg-gradient-to-r from-violet-400/25 via-indigo-300/25 to-sky-300/35 blur-xl animated-gradient"
                  />
                  <span className="relative bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent animated-gradient pr-[0.12em] -mr-[0.12em]">
                    experimento.
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
                      stroke="url(#labs-underline)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="labs-underline" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#7c3aed" />
                        <stop offset="0.5" stopColor="#6366f1" />
                        <stop offset="1" stopColor="#0ea5e9" />
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
                Los {TOTAL_SIMS} simuladores de Física, Química e Inglés en un solo lugar:
                da clic en uno y se abre aquí mismo, sin cambiar de pestaña. Cada guía
                sigue el método científico que usarás en la industria: hipótesis,
                cálculo, registro y conclusión.
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-white/75 px-3 py-1 text-[11px] font-semibold text-foreground/70 shadow-sm backdrop-blur"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
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
                  href="#catalogo"
                  className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-violet-500/40 active:translate-y-0 active:scale-95"
                >
                  Explorar simuladores
                  <ArrowDown className="h-4 w-4" />
                </a>
                <Link
                  href="/retos"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-violet-300 hover:bg-violet-50/40 active:translate-y-0 active:scale-95"
                >
                  <Zap className="h-4 w-4 text-violet-500" />
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

        {/* Divisor de ola hacia el contenido */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full sm:h-14 lg:h-16"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="labs-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7c3aed" stopOpacity="0" />
              <stop offset=".18" stopColor="#7c3aed" stopOpacity=".9" />
              <stop offset=".5" stopColor="#6366f1" />
              <stop offset=".82" stopColor="#0ea5e9" stopOpacity=".9" />
              <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
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
          {/* Cresta con el degradado de la sección */}
          <path
            d="M0 60 C 240 92 480 18 720 38 C 960 60 1200 88 1440 34"
            stroke="url(#labs-wave)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </section>

      {/* ==================== CONTENIDO ==================== */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Caso destacado + método científico */}
        <div id="metodo" className="mt-12 grid scroll-mt-48 gap-10 lg:grid-cols-12">
          {/* Izquierda: laboratorio destacado */}
          <div className="lg:col-span-5">
            <div className="shine sticky top-24 overflow-hidden rounded-3xl border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50 p-6 shadow-[0_2px_10px_-4px_rgba(24,24,27,0.06)] sm:p-7">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fuchsia-300/25 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-sm shadow-fuchsia-500/30">
                    <FlaskConical className="h-3 w-3" />
                    Recomendado
                  </span>
                  <span className="text-xs font-semibold text-fuchsia-700">Química</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Reactivo limitante</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  El caso clásico: si reaccionan 8 g de H₂ con 8 g de O₂ para formar agua,
                  ¿cuál se agota primero? A igual masa, no a igual cantidad de materia.
                </p>
                <div className="mt-4 rounded-xl border border-fuchsia-200/60 bg-white/70 px-4 py-3 text-center font-mono text-sm text-foreground backdrop-blur">
                  2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O · 8 g + 8 g
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["Masa → mol → rondas", "Diagrama de flujo"].map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={openFeatured}
                  className="shine relative mt-5 inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-fuchsia-500/40 active:translate-y-0 active:scale-95"
                >
                  <FlaskConical className="h-4 w-4" />
                  Abrir laboratorio
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-fuchsia-700/80">
                  <MousePointerClick className="h-3.5 w-3.5 shrink-0" />
                  Se abre aquí mismo · sin cambiar de pestaña
                </p>
              </div>
            </div>
          </div>

          {/* Derecha: método científico */}
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/25">
                <Beaker className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-lg font-bold tracking-tight text-foreground">Método científico aplicado</h3>
            </div>
            <div className="space-y-4">
              {LAB_STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group relative flex gap-4 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_36px_-18px_rgba(124,58,237,0.35)]"
                >
                  {/* Halo de color en la esquina */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 opacity-[0.05] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]"
                  />
                  <div className="relative shrink-0">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-lg font-black text-white shadow-lg shadow-violet-500/25">
                      {step.n}
                    </span>
                  </div>
                  <div className="relative min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 shrink-0 text-violet-500" />
                      <h4 className="text-base font-bold tracking-tight text-foreground">{step.title}</h4>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                  {/* Conector hacia el siguiente paso */}
                  {i < LAB_STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-[-1rem] left-[2.75rem] top-[4.25rem] w-px bg-gradient-to-b from-violet-300 to-transparent"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== CATÁLOGO ==================== */}
        <div id="catalogo" className="mt-16 scroll-mt-48">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-violet-700 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                {TOTAL_SIMS} simuladores · 3 materias
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Explora el catálogo
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              <MousePointerClick className="mr-1 inline h-3.5 w-3.5 -translate-y-px text-violet-500" />
              Da clic en cualquier tarjeta: el simulador se despliega aquí mismo,
              con recargar, pantalla completa y pestaña nueva por si la necesitas.
            </p>
          </div>

          {/* Continuar donde te quedaste */}
          {last && (
            <motion.button
              type="button"
              onClick={openLastSim}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="shine group relative mt-6 flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-indigo-50/70 to-white p-4 text-left shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/30">
                <History className="h-4.5 w-4.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-violet-700">
                  Continuar donde te quedaste
                </span>
                <span className="block truncate text-[14.5px] font-semibold text-foreground">
                  {last.name}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-violet-600 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          )}

          {/* Buscador + filtro por materia (flota al hacer scroll) */}
          <div className="sticky top-[5.25rem] z-30 mt-6 rounded-2xl border border-black/[0.06] bg-white/85 p-3 shadow-[0_14px_40px_-18px_rgba(24,24,27,0.35)] backdrop-blur-xl sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="group relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-violet-600" />
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
                  placeholder="Buscar simulador: moles, ondas, passive voice…"
                  aria-label="Buscar simulador por tema"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-10 w-full rounded-full border border-black/[0.08] bg-white pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-violet-400 focus:ring-[3px] focus:ring-violet-400/20 [&::-webkit-search-cancel-button]:hidden"
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
                  aria-label="Filtrar por materia"
                  className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin lg:flex-wrap lg:overflow-visible lg:pb-0"
                >
                  <button
                    type="button"
                    aria-pressed={materia === "all"}
                    onClick={() => setMateria("all")}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all active:scale-95 ${
                      materia === "all"
                        ? "border-transparent bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm shadow-violet-500/25"
                        : "border-black/[0.08] bg-white text-muted-foreground hover:border-black/20 hover:text-foreground"
                    }`}
                  >
                    Todos
                    <span className={materia === "all" ? "ml-1.5 opacity-75" : "ml-1.5 text-muted-foreground/60"}>
                      {TOTAL_SIMS}
                    </span>
                  </button>
                  {MATERIAS.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      aria-pressed={materia === m.key}
                      onClick={() => setMateria(materia === m.key ? "all" : m.key)}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all active:scale-95 ${
                        materia === m.key
                          ? m.theme.chipOn
                          : "border-black/[0.08] bg-white text-muted-foreground hover:border-black/20 hover:text-foreground"
                      }`}
                    >
                      {m.title}
                      <span className={materia === m.key ? "ml-1.5 opacity-75" : "ml-1.5 text-muted-foreground/60"}>
                        {m.sims.length}
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
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-violet-700 transition-colors hover:bg-violet-50 active:scale-95"
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
                  className="absolute -inset-3 rounded-full border border-dashed border-violet-300/80"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 16 }}
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-200 bg-white text-violet-600 shadow-sm">
                  <SearchX className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-[15px] font-semibold text-foreground">
                No encontramos simuladores para «{query.trim()}»
                {materia !== "all" ? ` en ${MATERIA_LABEL[materia]}` : ""}.
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
                    className="rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-[12px] font-semibold text-violet-700 transition-all hover:bg-violet-100 active:scale-95"
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

          {/* Materias — paneles con el color de cada una */}
          <div className="mt-10 space-y-8 sm:space-y-10">
            {visible.map((mat, matIndex) => (
              <motion.section
                key={mat.id}
                id={mat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: matIndex * 0.04 }}
                className="scroll-mt-48"
              >
                <div
                  className={`relative overflow-hidden rounded-3xl border p-4 shadow-[0_2px_10px_-4px_rgba(24,24,27,0.06)] sm:p-6 ${mat.theme.panel}`}
                >
                  {/* Letra fantasma de la materia */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-7 right-2 select-none font-mono text-[110px] font-black leading-none tracking-tighter sm:right-5 sm:text-[130px] ${mat.theme.ghost}`}
                  >
                    {mat.ghost}
                  </span>

                  {/* Encabezado de materia */}
                  <div className="relative flex items-center gap-3.5 border-b border-black/[0.05] pb-4 sm:pb-5">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${mat.theme.icon} ${mat.theme.glow}`}
                    >
                      <mat.icon className="h-5.5 w-5.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <h3 className="text-[21px] font-bold tracking-[-0.02em] text-foreground sm:text-[23px]">
                          {mat.title}
                        </h3>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${mat.theme.soft}`}
                        >
                          {simCount(mat.sims.length)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] text-muted-foreground sm:text-sm">
                        {mat.subtitle}
                      </p>
                    </div>
                    <Link
                      href={mat.key === "fisica" ? "/fisica" : mat.key === "quimica" ? "/quimica" : "/ingles"}
                      className={`relative hidden shrink-0 items-center gap-1.5 rounded-full border bg-white/80 px-3 py-1.5 text-[11px] font-semibold transition-all hover:-translate-y-0.5 sm:inline-flex ${mat.theme.soft}`}
                    >
                      Ver materia
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Tarjetas (acordeón: se abren en la misma página) */}
                  <div className="relative mt-4 grid gap-3.5 sm:mt-5 sm:gap-4 lg:grid-cols-2">
                    {mat.sims.map((sim, i) => (
                      <SimCard
                        key={sim.href}
                        sim={sim}
                        theme={mat.theme}
                        open={openHref === sim.href}
                        onToggle={() => toggleSim(sim)}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50 via-indigo-50 to-white p-6 text-center shadow-sm sm:p-10">
          <div className="absolute inset-0 dots-pattern opacity-25" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-violet-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              {TOTAL_SIMS} simuladores · 3 materias
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ¿Listo para aplicar el método?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Empieza por el caso del reactivo limitante: plantea tu hipótesis, haz el cálculo
              y deja que la tabla de rondas te diga si acertaste. Después recorre los once
              laboratorios de Física y los entrenadores de Inglés — todo se abre
              aquí mismo, en esta página.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={openFeatured}
                className="shine relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-violet-500/40 active:translate-y-0 active:scale-95"
              >
                Practicar estequiometría
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/retos"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-violet-300 hover:bg-violet-50/40 active:scale-95"
              >
                Ver retos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
