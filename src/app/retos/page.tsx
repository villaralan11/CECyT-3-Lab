"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  X,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Maximize2,
  Minimize2,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Breadcrumb } from "@/components/site/ui";
import { useProgress } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";

type Q = {
  subject: "Física" | "Química" | "Inglés";
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  // ruta de práctica recomendada para reforzar el tema de esta pregunta
  practiceHref: string;
  practiceLabel: string;
};

const QUESTIONS: Q[] = [
  {
    subject: "Física",
    prompt: "Un auto frena de 20 m/s a 0 en 5 s. Su aceleración media es:",
    options: ["−4 m/s²", "4 m/s²", "−100 m/s²", "0.25 m/s²"],
    correct: 0,
    explanation: "Δv = 0 − 20 = −20 m/s, dividido entre 5 s = −4 m/s². La aceleración apunta contra el movimiento (frenado).",
    practiceHref: "/simuladores/01-Fisica-I/mru-mruv/index.html",
    practiceLabel: "Practicar MRUV con el simulador",
  },
  {
    subject: "Física",
    prompt: "En el ápice de un tiro parabólico, la velocidad vertical vᵧ es:",
    options: ["Máxima", "Cero", "Igual a vₓ", "Igual a g"],
    correct: 1,
    explanation: "En el punto más alto, la componente vertical se anula. Solo queda vₓ (horizontal). Por eso t_apex = v₀ᵧ/g.",
    practiceHref: "/simuladores/01-Fisica-I/tiro-parabolico/index.html",
    practiceLabel: "Practicar tiro parabólico",
  },
  {
    subject: "Química",
    prompt: "En 2H₂ + O₂ → 2H₂O con 8 g de H₂ y 8 g de O₂, el reactivo limitante es:",
    options: ["H₂", "O₂", "H₂O", "Ninguno, sobra igual"],
    correct: 1,
    explanation: "8 g H₂ ≈ 4 mol ÷ 2 = 2 rondas; 8 g O₂ ≈ 0.25 mol ÷ 1 = 0.25 rondas. El menor es el limitante: O₂.",
    practiceHref: "/quimica/estequiometria",
    practiceLabel: "Practicar estequiometría",
  },
  {
    subject: "Química",
    prompt: "El nombre IUPAC de Ca(OH)₂ es:",
    options: ["óxido de calcio", "ácido cálcico", "hidróxido de calcio", "cal apagada (nombre común)"],
    correct: 2,
    explanation: "Metal + grupo OH⁻ = hidróxido. Ca²⁺ requiere 2 grupos OH⁻. 'Cal apagada' es el nombre común, no IUPAC.",
    practiceHref: "/quimica/iupac",
    practiceLabel: "Practicar nomenclatura IUPAC",
  },
  {
    subject: "Inglés",
    prompt: "She ____ in Mexico City since 2019. (presente perfecto)",
    options: ["lives", "has lived", "is living", "lived"],
    correct: 1,
    explanation: "'Since' marca un punto de inicio en el pasado que se prolonga hasta ahora: presente perfecto (have/has + participio).",
    practiceHref: "/ingles/verb-tenses",
    practiceLabel: "Practicar verb tenses",
  },
  {
    subject: "Inglés",
    prompt: "En reported speech, 'I am running now' → she said:",
    options: ["she is running now", "she was running then", "she ran then", "she had been running now"],
    correct: 1,
    explanation: "Backshift: am → was. Marcador: now → then. Pronombre: I → she.",
    practiceHref: "/ingles/reported-speech",
    practiceLabel: "Practicar reported speech",
  },
];

/* Colores de cada materia para chips y puntos */
const SUBJECT_STYLE: Record<Q["subject"], { soft: string; dot: string }> = {
  Física: { soft: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Química: { soft: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700", dot: "bg-fuchsia-500" },
  Inglés: { soft: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

/* Puntos con el color de cada materia para el badge del hero */
const SUBJECT_DOTS = ["bg-emerald-500", "bg-fuchsia-500", "bg-amber-500"];

const HERO_STATS = [
  `${QUESTIONS.length} preguntas`,
  "3 materias",
  "Feedback pedagógico",
  "Practica sin salir del quiz",
];

const NPS_KEY = "cecyt3-nps";

/* Total de simuladores del sitio (física 11 + química 3 + inglés 4),
   igual que el catálogo de /laboratorios */
const TOTAL_SIMS = 18;

/* ------------------------------------------------------------------ */
/* Práctica inline: el simulador de refuerzo se despliega aquí mismo,  */
/* sin cambiar de pestaña (carga lazy solo al expandir).               */
/* ------------------------------------------------------------------ */

const PRAX_BTN =
  "flex h-7 w-7 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600/80 transition-all hover:border-rose-300 hover:text-rose-700 active:scale-90";

function PracticeEmbed({ href, label }: { href: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFs = () =>
      setIsFull(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* Modo embed: oculta la barra del sitio o el botón «Catálogo» del sim */
  const frameSrc = href.includes("?") ? `${href}&embed=1` : `${href}?embed=1`;

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
    <div className="overflow-hidden rounded-xl border border-rose-200/80 bg-white/70">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50/60"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rose-300 bg-white">
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </span>
        <span className="min-w-0 flex-1">{label}</span>
        <span className="shrink-0 text-[9.5px] font-bold uppercase tracking-[0.12em] text-rose-500/80">
          {open ? "Cerrar" : "Aquí mismo"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div
              ref={stageRef}
              className="flex flex-col border-t border-rose-200/70 bg-white"
              role="region"
              aria-label={`Simulador de práctica: ${label}`}
            >
              {/* Barra de herramientas */}
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span className="min-w-0 truncate text-[11px] font-semibold text-foreground/80">
                  Práctica en vivo
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  <button type="button" onClick={reload} title="Recargar" aria-label="Recargar simulador" className={PRAX_BTN}>
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleFull}
                    title={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
                    aria-label={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
                    className={PRAX_BTN}
                  >
                    {isFull ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir en pestaña nueva"
                    aria-label="Abrir en pestaña nueva"
                    className={PRAX_BTN}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </span>
              </div>

              {/* Escenario del simulador */}
              <div className={`relative ${isFull ? "flex-1" : ""}`}>
                <iframe
                  key={reloadKey}
                  src={frameSrc}
                  title={label}
                  onLoad={() => setLoaded(true)}
                  allow="fullscreen"
                  className={`block w-full border-0 bg-white ${
                    isFull ? "h-full" : "h-[clamp(380px,62vh,560px)]"
                  }`}
                />
                {!loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-white">
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-20" />
                      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-black/[0.08] border-t-rose-500/70" />
                    </span>
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Cargando la práctica…
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Arte del hero: trofeo, confeti y aciertos (decorativo)              */
/* ------------------------------------------------------------------ */

function HeroArt() {
  const chips = [
    { text: "Racha ×3", className: "left-[1%] top-[17%]", duration: 5.5, delay: 0 },
    { text: "+10 pts", className: "right-[3%] top-[5%]", duration: 6.5, delay: 0.9 },
    { text: "5 min", className: "left-[-1%] bottom-[30%]", duration: 6, delay: 0.45 },
    { text: "6 / 6", className: "right-[1%] bottom-[9%]", duration: 7, delay: 1.3 },
  ];

  const confetti = [
    { x: 86, y: 74, c: "#f59e0b", d: 3.4, r: -14 },
    { x: 336, y: 62, c: "#fb7185", d: 4.2, r: 18 },
    { x: 62, y: 226, c: "#8b5cf6", d: 3.8, r: 10 },
    { x: 354, y: 212, c: "#10b981", d: 4.6, r: -18 },
    { x: 122, y: 118, c: "#facc15", d: 5.1, r: 22 },
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
          <radialGradient id="rgCup" cx="36%" cy="30%" r="80%">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset=".42" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#ea580c" />
          </radialGradient>
          <linearGradient id="rgWave" x1="40" y1="278" x2="376" y2="278" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f59e0b" stopOpacity=".18" />
            <stop offset=".32" stopColor="#f97316" />
            <stop offset=".66" stopColor="#fb923c" />
            <stop offset="1" stopColor="#facc15" />
          </linearGradient>
          <filter id="rgGlow" x="-60%" y="-60%" width="220%" height="220%">
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
          cy="160"
          r="96"
          stroke="rgba(245,158,11,.32)"
          strokeWidth="1.2"
          strokeDasharray="2 7"
          style={{ transformOrigin: "210px 160px" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 90 }}
        />

        {/* Trofeo con brillo y pulso */}
        <motion.g
          style={{ transformOrigin: "210px 160px" }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 4.5 }}
        >
          {/* Asas */}
          <path d="M176 116 q-30 6 -24 34 q5 22 30 24" stroke="#d97706" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M244 116 q30 6 24 34 q-5 22 -30 24" stroke="#d97706" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Copa */}
          <path
            d="M178 98 h64 v40 q0 48 -32 56 q-32 -8 -32 -56 z"
            fill="url(#rgCup)"
            filter="url(#rgGlow)"
          />
          <ellipse cx="194" cy="122" rx="8" ry="14" transform="rotate(-20 194 122)" fill="#ffffff" opacity=".3" />
          {/* Borde */}
          <rect x="171" y="90" width="78" height="13" rx="6.5" fill="#ffffff" opacity=".92" stroke="#d97706" strokeWidth="1.5" />
          {/* Estrella */}
          <polygon
            points="210,130 214.2,139.6 224.7,141 217.1,148.2 219.1,158.6 210,153.6 200.9,158.6 202.9,148.2 195.3,141 205.8,139.6"
            fill="#ffffff"
            opacity=".95"
          />
          {/* Pie y base */}
          <rect x="204" y="194" width="12" height="16" rx="2" fill="#d97706" />
          <path
            d="M192 210 h36 q4 0 5.5 4 l4.5 9 q2 6 -4.5 6 h-47 q-6.5 0 -4.5 -6 l4.5 -9 q1.5 -4 5.5 -4 z"
            fill="#b45309"
          />
        </motion.g>

        {/* Insignia de acierto */}
        <motion.g animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, ease: "easeInOut", duration: 4.6 }}>
          <circle cx="98" cy="104" r="17" fill="#10b981" />
          <path d="M91 104 l5 5 l10 -11" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>

        {/* Insignia de error */}
        <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, ease: "easeInOut", duration: 5.2, delay: 0.8 }}>
          <circle cx="330" cy="224" r="17" fill="#f43f5e" />
          <path d="M323 217 l14 14 M337 217 l-14 14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
        </motion.g>

        {/* Confeti */}
        {confetti.map((c) => (
          <motion.g
            key={`${c.x}-${c.y}`}
            style={{ transformOrigin: `${c.x + 4.5}px ${c.y + 6.5}px` }}
            animate={{ y: [0, -8, 0], rotate: [c.r, c.r + 24, c.r] }}
            transition={{ repeat: Infinity, ease: "easeInOut", duration: c.d }}
          >
            <rect x={c.x} y={c.y} width="9" height="13" rx="2.5" fill={c.c} opacity=".85" />
          </motion.g>
        ))}

        {/* Partículas */}
        <circle cx="76" cy="168" r="4" fill="#f97316" />
        <circle cx="352" cy="150" r="4" fill="#e11d48" />
        <circle cx="128" cy="254" r="4.5" fill="#fbbf24" />

        {/* Onda de energía */}
        <path d="M40 278q21-38 42 0t42 0 42 0 42 0 42 0 42 0 42 0" stroke="url(#rgWave)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M40 292h336" stroke="currentColor" strokeWidth="1" opacity=".1" />
      </motion.svg>

      {/* Chips con el lenguaje de los retos */}
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

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function RetosPage() {
  const { save } = useProgress();
  const { toast } = useToast();
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>(QUESTIONS.map(() => null));
  const [pickedHistory, setPickedHistory] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [npsVoted, setNpsVoted] = useState<boolean>(false);

  const q = QUESTIONS[idx];
  const ss = SUBJECT_STYLE[q.subject];
  const score = results.filter((r) => r === true).length;
  const answered = results.filter((r) => r !== null).length;

  // racha real: aciertos consecutivos desde la última respuesta (ignorando sin responder)
  const streak = useMemo(() => {
    let s = 0;
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i] === null) continue;
      if (results[i] === true) s++;
      else break;
    }
    return s;
  }, [results]);

  const onPick = (i: number) => {
    if (pickedHistory[idx] !== null) return;
    const nextPicked = [...pickedHistory];
    nextPicked[idx] = i;
    setPickedHistory(nextPicked);
    const nextResults = [...results];
    nextResults[idx] = i === q.correct;
    setResults(nextResults);
    // registra el avance del quiz cuando quedan todas respondidas
    if (nextResults.every((r) => r !== null)) {
      save("11_retos", nextResults.filter((r) => r === true).length, QUESTIONS.length);
    }
  };

  const next = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx(idx + 1);
    }
  };
  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
    }
  };
  const reset = () => {
    setIdx(0);
    setResults(QUESTIONS.map(() => null));
    setPickedHistory(QUESTIONS.map(() => null));
  };

  const voteNps = (n: number) => {
    if (npsVoted) return;
    try {
      const existing = JSON.parse(localStorage.getItem(NPS_KEY) || "[]");
      if (!Array.isArray(existing)) throw new Error("bad");
      existing.push({ score: n, at: new Date().toISOString(), retosScore: score });
      localStorage.setItem(NPS_KEY, JSON.stringify(existing));
      setNpsVoted(true);
      toast({ title: `¡Gracias! NPS ${n} guardado.`, description: "Se guardó de forma local en este navegador." });
    } catch {
      toast({ title: "No se pudo guardar el NPS", description: "Tu navegador bloquea el almacenamiento local.", variant: "destructive" });
    }
  };

  const stats = [
    { label: "Racha", value: String(streak), icon: Flame, chip: "from-amber-500 to-orange-500 shadow-amber-500/25" },
    { label: "Aciertos", value: String(score), icon: Trophy, chip: "from-emerald-500 to-teal-500 shadow-emerald-500/25" },
    { label: "Fallados", value: String(answered - score), icon: X, chip: "from-rose-500 to-pink-500 shadow-rose-500/25" },
    { label: "Respondidas", value: `${answered}/${QUESTIONS.length}`, icon: Target, chip: "from-sky-500 to-blue-500 shadow-sky-500/25" },
  ];

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative -mt-[4.125rem] overflow-hidden bg-gradient-to-b from-amber-100/80 via-orange-50/60 to-amber-100/80">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-96 w-96 rounded-full bg-amber-200/45 blur-3xl blob-float" />
          <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl blob-float" style={{ animationDelay: "4s" }} />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-200/35 blur-3xl blob-float" style={{ animationDelay: "8s" }} />
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[calc(4rem+1.75rem)] sm:px-6 lg:px-8 lg:pb-16">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Retos" }]} />

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
                  {SUBJECT_DOTS.map((c) => (
                    <span key={c} className={`h-2 w-2 rounded-full ring-2 ring-white ${c}`} />
                  ))}
                </span>
                Quiz de 5 minutos · {QUESTIONS.length} preguntas
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.98] tracking-tighter"
              >
                <span className="block bg-gradient-to-r from-foreground via-amber-950 to-amber-600 bg-clip-text text-transparent">
                  Retos rápidos ·
                </span>
                <span className="relative inline-block">
                  {/* Halo de color detrás del texto */}
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-4 -inset-y-2 rounded-full bg-gradient-to-r from-amber-400/25 via-orange-300/25 to-yellow-300/35 blur-xl animated-gradient"
                  />
                  <span className="relative bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent animated-gradient pr-[0.12em] -mr-[0.12em]">
                    5 minutos también enseñan
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
                      stroke="url(#retos-underline)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="retos-underline" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
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
                Seis preguntas que mezclan Física, Química e Inglés. Cada respuesta viene
                con explicación pedagógica y, si fallas, el simulador de práctica se
                despliega aquí mismo: refuerzas el tema sin salir del quiz. Al
                responderlas todas, suma a tu bitácora de progreso.
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
                  href="#reto"
                  className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-amber-500/40 active:translate-y-0 active:scale-95"
                >
                  Empezar el reto
                  <ArrowDown className="h-4 w-4" />
                </a>
                <Link
                  href="/progreso"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-amber-300 hover:bg-amber-50/40 active:translate-y-0 active:scale-95"
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Ver mi progreso
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
            <linearGradient id="retos-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
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
          {/* Cresta con el degradado de la sección */}
          <path
            d="M0 60 C 240 92 480 18 720 38 C 960 60 1200 88 1440 34"
            stroke="url(#retos-wave)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </section>

      {/* ==================== QUIZ ==================== */}
      <div id="reto" className="mx-auto max-w-5xl scroll-mt-48 px-4 pb-20 sm:px-6 lg:px-8">
        {/* Marcador */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(24,24,27,0.25)]"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md ${s.chip}`}>
                  <s.icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-2xl font-bold leading-none text-foreground">{s.value}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navegación rápida */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Saltar a:
          </span>
          {QUESTIONS.map((qq, i) => {
            const r = results[i];
            const isCurrent = i === idx;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Ir a la pregunta ${i + 1}: ${qq.subject}`}
                className={`h-8 w-8 rounded-full border text-xs font-bold transition-all duration-200 ${
                  isCurrent
                    ? "scale-110 border-transparent bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30"
                    : r === true
                      ? "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : r === false
                        ? "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200"
                        : "border-black/[0.08] bg-white text-muted-foreground hover:border-black/25 hover:text-foreground"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Tarjeta del quiz */}
        <div className="mt-6 overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="grid lg:grid-cols-5">
            {/* Panel izquierdo */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-6 text-white lg:col-span-2">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
              <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden="true" />
              <div className="relative">
                <Flame className="h-6 w-6" />
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider opacity-90">
                  Pregunta {idx + 1} de {QUESTIONS.length}
                </div>
                <div className="mt-1 text-xl font-bold leading-tight">
                  Cinco minutos de reto también enseñan algo serio.
                </div>

                {/* Barra de progreso */}
                <div className="mt-6">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      animate={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] opacity-85">
                    <span>Progreso</span>
                    <span className="font-mono">
                      {answered}/{QUESTIONS.length}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 shrink-0" />
                    <span className="opacity-90">Racha actual:</span>
                    <span className="font-bold">
                      {streak} {streak === 1 ? "acierto" : "aciertos"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 shrink-0" />
                    <span className="opacity-90">Aciertos:</span>
                    <span className="font-bold">
                      {score} de {answered}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel derecho: pregunta */}
            <div className="p-6 lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] ${ss.soft}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${ss.dot}`} />
                    {q.subject}
                  </span>
                  <h3 className="mt-2.5 text-base font-bold leading-snug text-foreground sm:text-lg">
                    {q.prompt}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {q.options.map((opt, i) => {
                      const isCorrect = i === q.correct;
                      const isPicked = pickedHistory[idx] === i;
                      const showCorrect = pickedHistory[idx] !== null && isCorrect;
                      const showWrong = pickedHistory[idx] !== null && isPicked && !isCorrect;
                      return (
                        <button
                          key={i}
                          onClick={() => onPick(i)}
                          disabled={pickedHistory[idx] !== null}
                          className={`group flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                            showCorrect
                              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                              : showWrong
                                ? "border-rose-400 bg-rose-50 text-rose-700"
                                : "border-border bg-white text-foreground hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50/40"
                          } ${pickedHistory[idx] !== null && !isPicked && !isCorrect ? "opacity-50" : ""}`}
                        >
                          {showCorrect ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : showWrong ? (
                            <X className="h-4 w-4 shrink-0 text-rose-500" />
                          ) : (
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-colors ${
                                pickedHistory[idx] !== null
                                  ? "border-transparent text-transparent"
                                  : "border-muted-foreground/30 text-muted-foreground/60 group-hover:border-amber-400 group-hover:text-amber-600"
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                          )}
                          <span className="font-mono">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {pickedHistory[idx] !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mt-4 rounded-xl border p-3.5 text-sm ${
                          pickedHistory[idx] === q.correct
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-rose-200 bg-rose-50 text-rose-800"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {pickedHistory[idx] === q.correct ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                          ) : (
                            <X className="mt-0.5 h-4 w-4 shrink-0" />
                          )}
                          <div className="flex-1">
                            <strong>
                              {pickedHistory[idx] === q.correct ? "¡Correcto!" : `Era: ${q.options[q.correct]}`}
                            </strong>{" "}
                            {q.explanation}
                            {pickedHistory[idx] !== q.correct && (
                              <div className="mt-3 border-t border-rose-200 pt-3">
                                <div className="mb-1.5 text-xs font-bold uppercase tracking-wider opacity-80">
                                  Cómo resolverlo — 3 pasos
                                </div>
                                <ol className="list-decimal space-y-1 pl-4 text-xs leading-relaxed opacity-90">
                                  <li>
                                    <strong>Identifica:</strong>{" "}
                                    {q.subject === "Física"
                                      ? "qué dato te dan (v₀, t, a) y qué te piden."
                                      : q.subject === "Química"
                                        ? "qué especie es reactivo/producto y balancea por inspección."
                                        : "qué marcador temporal te guía (since, now, yesterday)."}
                                  </li>
                                  <li>
                                    <strong>Aplica:</strong>{" "}
                                    {q.subject === "Física"
                                      ? "fórmula x = x₀ + v·t o v = v₀ + a·t según MRU/MRUV."
                                      : q.subject === "Química"
                                        ? "ajusta coeficientes y verifica átomos por elemento."
                                        : "elige tiempo verbal/modo según marcador + sujeto."}
                                  </li>
                                  <li>
                                    <strong>Verifica:</strong> revisa unidades, número de átomos o concordancia y
                                    descarta opciones que violan la regla.
                                  </li>
                                </ol>
                                <div className="mt-2">
                                  <PracticeEmbed href={q.practiceHref} label={q.practiceLabel} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between gap-3 border-t border-amber-200 bg-white/40 px-6 py-3">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Anterior
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar
            </button>
            {idx < QUESTIONS.length - 1 ? (
              <button
                onClick={next}
                disabled={pickedHistory[idx] === null}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
              >
                <Trophy className="h-3.5 w-3.5" /> Terminar
              </button>
            )}
          </div>
        </div>

        {/* NPS */}
        {answered === QUESTIONS.length && (
          <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
            <div className="text-sm font-bold text-foreground">¿Nos dejas tu feedback? (NPS 1-10)</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => voteNps(n)}
                  disabled={npsVoted}
                  className="h-8 w-8 rounded-full border border-black/[0.08] bg-white font-mono text-xs font-bold transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              {npsVoted
                ? "¡Gracias! Tu voto ya quedó guardado en este navegador (cecyt3-nps)."
                : "Se guarda local en cecyt3-nps. Para el piloto, expórtalo junto con tu progreso."}
            </div>
          </div>
        )}

        {/* Resumen final */}
        {answered === QUESTIONS.length && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 overflow-hidden rounded-2xl border-2 p-5 ${
              score === QUESTIONS.length
                ? "border-emerald-300 bg-emerald-50"
                : score >= QUESTIONS.length / 2
                  ? "border-amber-300 bg-amber-50"
                  : "border-rose-300 bg-rose-50"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${
                    score === QUESTIONS.length
                      ? "from-emerald-500 to-teal-500 shadow-emerald-500/25"
                      : score >= QUESTIONS.length / 2
                        ? "from-amber-500 to-orange-500 shadow-amber-500/25"
                        : "from-rose-500 to-pink-500 shadow-rose-500/25"
                  }`}
                >
                  <Trophy className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-foreground">
                    {score === QUESTIONS.length
                      ? "¡Perfecto!"
                      : score >= QUESTIONS.length / 2
                        ? "Buen trabajo"
                        : "A repasar"}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {score === QUESTIONS.length
                      ? "Dominas los tres módulos, prueba los simuladores completos."
                      : score >= QUESTIONS.length / 2
                        ? "Vas bien, repasa los errores marcados en rojo en cada módulo."
                        : "Te conviene repasar la teoría de cada módulo y volver a intentarlo."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-3xl font-black leading-none text-foreground">
                  {score}
                  <span className="text-muted-foreground/50">/{QUESTIONS.length}</span>
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {Math.round((score / QUESTIONS.length) * 100)}% de acierto
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 text-center shadow-sm sm:p-10">
          <div className="absolute inset-0 dots-pattern opacity-25" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {TOTAL_SIMS} simuladores en línea
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ¿Quieres profundizar?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              En Laboratorios están los {TOTAL_SIMS} simuladores del sitio —
              Física con gráficas en vivo, Química con masas molares reales e Inglés con
              feedback en cada ejercicio — y todos se abren en la misma página.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/laboratorios"
                className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-amber-500/40 active:translate-y-0 active:scale-95"
              >
                Explorar laboratorios
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/progreso"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-amber-300 hover:bg-amber-50/40 active:scale-95"
              >
                Ver mi progreso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
