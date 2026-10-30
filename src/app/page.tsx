"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom,
  FlaskConical,
  Languages,
  Sparkles,
  Zap,
  Target,
  BookOpen,
  Compass,
  Microscope,
  Layers,
  ArrowRight,
  ChevronRight,
  Trophy,
  Flame,
  GraduationCap,
  CheckCircle2,
  X,
  RotateCcw,
} from "lucide-react";
import { PageHeader, Breadcrumb } from "@/components/site/ui";

const SUBJECTS = [
  {
    id: "fisica",
    name: "Física",
    icon: Atom,
    desc: "Cinemática, fuerzas, energía, fluidos, electricidad y ondas: 11 simuladores de Física I a IV con gráficas en vivo.",
    bg: "from-emerald-400 via-teal-400 to-cyan-400",
    bgSoft: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
    hoverBorder: "hover:border-emerald-200",
    glow: "shadow-emerald-500/25",
    chips: ["Cinemática", "Fuerzas y energía", "Ondas"],
    count: "11 simuladores",
    href: "/fisica",
  },
  {
    id: "quimica",
    name: "Química",
    icon: FlaskConical,
    desc: "Nomenclatura IUPAC, balanceo con conteo en vivo y estequiometría con masas molares reales.",
    bg: "from-fuchsia-400 via-pink-400 to-rose-400",
    bgSoft: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    dot: "bg-fuchsia-500",
    border: "border-fuchsia-200",
    chip: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
    hoverBorder: "hover:border-fuchsia-200",
    glow: "shadow-fuchsia-500/25",
    chips: ["IUPAC", "Balanceo", "Estequiometría"],
    count: "3 simuladores",
    href: "/quimica",
  },
  {
    id: "ingles",
    name: "Inglés",
    icon: Languages,
    desc: "Grammar trainer con estrategia y explicación: tiempos verbales, voz pasiva, modales y reported speech.",
    bg: "from-amber-400 via-orange-400 to-rose-400",
    bgSoft: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
    chip: "bg-amber-50 text-amber-700 border-amber-100",
    hoverBorder: "hover:border-amber-200",
    glow: "shadow-amber-500/25",
    chips: ["Tenses", "Passive", "Modals", "Reported"],
    count: "4 trainers",
    href: "/ingles",
  },
];

const STATS = [
  { value: "3", label: "Materias", sub: "Física · Química · Inglés", icon: Layers, tint: "text-emerald-300", aura: "bg-emerald-400/10" },
  { value: "10", label: "Temas", sub: "Cada uno con falla + sim + ejemplo", icon: BookOpen, tint: "text-fuchsia-300", aura: "bg-fuchsia-400/10" },
  { value: "18", label: "Simuladores", sub: "11 Física · 3 Química · 4 Inglés", icon: Microscope, tint: "text-amber-300", aura: "bg-amber-400/10" },
  { value: "82", label: "Ejercicios", sub: "Bancos + reacciones + transformaciones", icon: Target, tint: "text-rose-300", aura: "bg-rose-400/10" },
];

const TOPICS = [
  { n: "01", subject: "fisica", name: "Física I · Cinemática", desc: "MRU, MRUV y tiro parabólico", href: "/fisica#fisica-i" },
  { n: "02", subject: "fisica", name: "Física II · Fuerzas y energía", desc: "Dinámica, colisiones, fluidos y gases", href: "/fisica#fisica-ii" },
  { n: "03", subject: "fisica", name: "Física III–IV · Electricidad y ondas", desc: "Cargas, circuitos y ondas en cuerda", href: "/fisica#fisica-iii" },
  { n: "04", subject: "quimica", name: "Nomenclatura IUPAC", desc: "Orgánica e Inorgánica · 25 compuestos", href: "/quimica/iupac" },
  { n: "05", subject: "quimica", name: "Balanceo de ecuaciones", desc: "Steppers + tabla de átomos en vivo", href: "/quimica/balanceo" },
  { n: "06", subject: "quimica", name: "Estequiometría", desc: "Reactivo limitante y rendimiento", href: "/quimica/estequiometria" },
  { n: "07", subject: "ingles", name: "Verb Tenses", desc: "12 ejercicios con marcadores temporales", href: "/ingles/verb-tenses" },
  { n: "08", subject: "ingles", name: "Passive Voice", desc: "Transformaciones activa → pasiva", href: "/ingles/passive-voice" },
  { n: "09", subject: "ingles", name: "Modal Verbs", desc: "Obligación, prohibición, deducción", href: "/ingles/modal-verbs" },
  { n: "10", subject: "ingles", name: "Reported Speech", desc: "Backshift + marcadores + imperativos", href: "/ingles/reported-speech" },
];

const subjectOf = (id: string) => SUBJECTS.find((s) => s.id === id)!;

/* MINI RETO — adelanto interactivo de la sección /retos */
const MINI_QUESTIONS = [
  {
    subject: "Física",
    prompt: "En el ápice de un tiro parabólico, la velocidad vertical vᵧ es:",
    options: ["Máxima", "Cero", "Igual a vₓ", "Igual a g"],
    correct: 1,
    explanation:
      "En el punto más alto, la componente vertical se anula. Solo queda vₓ (horizontal). Por eso t_apex = v₀ᵧ/g.",
  },
  {
    subject: "Química",
    prompt: "El nombre IUPAC de Ca(OH)₂ es:",
    options: ["óxido de calcio", "ácido cálcico", "hidróxido de calcio", "cal apagada (nombre común)"],
    correct: 2,
    explanation:
      "Metal + grupo OH⁻ = hidróxido. Ca²⁺ requiere 2 grupos OH⁻. 'Cal apagada' es el nombre común, no IUPAC.",
  },
  {
    subject: "Inglés",
    prompt: "She ____ in Mexico City since 2019. (presente perfecto)",
    options: ["lives", "has lived", "is living", "lived"],
    correct: 1,
    explanation:
      "'Since' marca un punto de inicio en el pasado que se prolonga hasta ahora: presente perfecto (have/has + participio).",
  },
];

const MINI_SUBJECT_STYLE: Record<string, string> = {
  Física: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Química: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  Inglés: "bg-amber-50 text-amber-700 border-amber-200",
};

function MiniReto() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<(boolean | null)[]>(MINI_QUESTIONS.map(() => null));

  const q = MINI_QUESTIONS[idx];
  const done = picked !== null;
  const isLast = idx === MINI_QUESTIONS.length - 1;
  const answeredAll = history.every((h) => h !== null);

  const pick = (i: number) => {
    if (done) return;
    setPicked(i);
    const ok = i === q.correct;
    if (ok) setScore((s) => s + 1);
    setHistory((h) => {
      const next = [...h];
      next[idx] = ok;
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
      setScore(0);
      setHistory(MINI_QUESTIONS.map(() => null));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Reto exprés
          </span>
          <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold tracking-tight text-foreground">
            ¿Puedes con este?{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Respóndelo aquí mismo
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Una pregunta real de la sección <Link href="/retos" className="font-semibold text-amber-700 hover:underline">Retos</Link>:
            así se ve el formato: intentas, fallas con propósito y recibes la explicación al instante.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 shadow-sm">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-foreground">
            Aciertos: <span className="font-mono">{score}</span>
            <span className="text-muted-foreground">/{MINI_QUESTIONS.length}</span>
          </span>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="grid lg:grid-cols-5">
          {/* Panel izquierdo — branding */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-6 text-white sm:p-8 lg:col-span-2">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <Flame className="h-5 w-5" />
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider opacity-90">
                Mini reto · menos de 1 minuto
              </div>
              <div className="mt-1.5 text-xl font-bold leading-snug">
                Cinco minutos también enseñan algo serio.
              </div>
              <p className="mt-3 text-sm leading-relaxed opacity-90">
                En la sección completa hay 6 preguntas que mezclan Física, Química e Inglés, con racha,
                puntos y guía de 3 pasos en cada error.
              </p>
              <Link
                href="/retos"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition-all hover:bg-white/25 active:scale-95"
              >
                Ir a los retos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Panel derecho — pregunta */}
          <div className="p-6 sm:p-8 lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${MINI_SUBJECT_STYLE[q.subject]}`}>
                {q.subject}
              </span>
              <div className="flex items-center gap-1.5">
                {MINI_QUESTIONS.map((_, i) => {
                  const r = history[i];
                  return (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i === idx
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 ring-2 ring-amber-200"
                          : r === true
                          ? "bg-emerald-400"
                          : r === false
                          ? "bg-rose-400"
                          : "bg-border"
                      }`} />
                  );
                })}
              </div>
            </div>

            <h3 className="mt-4 text-base font-bold leading-snug text-foreground sm:text-lg">
              {q.prompt}
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isPicked = picked === i;
                const showCorrect = done && isCorrect;
                const showWrong = done && isPicked && !isCorrect;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => pick(i)}
                    disabled={done}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                      showCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : showWrong
                        ? "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-border bg-white text-foreground hover:border-amber-300 hover:bg-amber-50/50 active:scale-[0.98]"
                    } ${done && !isPicked && !isCorrect ? "opacity-50" : ""}`}
                  >
                    {showCorrect ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                    ) : showWrong ? (
                      <X className="h-4 w-4 flex-shrink-0 text-rose-500" />
                    ) : (
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[10px] font-bold text-muted-foreground/60">
                        {String.fromCharCode(65 + i)}
                      </div>
                    )}
                    <span className="font-mono">{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`mt-4 rounded-xl border p-3 text-sm ${
                      picked === q.correct
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {picked === q.correct ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <strong>{picked === q.correct ? "¡Correcto!" : `Era: ${q.options[q.correct]}`}</strong>{" "}
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {done
                  ? answeredAll && isLast
                    ? "Eso es todo. ¿Te animas a los 6 completos?"
                    : "Toca «Siguiente reto» para continuar."
                  : "Elige una opción: no hay penalización por fallar."}
              </p>
              <div className="flex items-center gap-2">
                {done && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={advance}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-95"
                  >
                    {isLast ? <RotateCcw className="h-3.5 w-3.5" /> : null}
                    {isLast ? "Reiniciar" : "Siguiente reto"}
                    {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MARQUEE_ITEMS = [
  { t: "Física", i: Atom, c: "text-emerald-700" },
  { t: "Química", i: FlaskConical, c: "text-fuchsia-700" },
  { t: "Inglés", i: Languages, c: "text-amber-700" },
  { t: "Cinemática", i: Zap, c: "text-emerald-700" },
  { t: "Nomenclatura IUPAC", i: FlaskConical, c: "text-fuchsia-700" },
  { t: "Estequiometría", i: Target, c: "text-fuchsia-700" },
  { t: "Reported speech", i: Languages, c: "text-amber-700" },
  { t: "Aprender haciendo", i: Sparkles, c: "text-fuchsia-700" },
];

function SubjectMarquee({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-secondary/40 border-y border-border/50 py-3.5 sm:py-4 overflow-hidden marquee-mask ${className}`}>
      <div className="flex items-center gap-10 sm:gap-14 animate-marquee motion-reduce:animate-none whitespace-nowrap w-max">
        {[...Array(2)].map((_, k) => (
          <div key={k} className="flex items-center gap-10 sm:gap-14" aria-hidden={k === 1 ? true : undefined}>
            {MARQUEE_ITEMS.map((it) => (
              <div key={it.t} className="flex items-center gap-2.5 text-foreground/60">
                <it.i className={`h-4 w-4 shrink-0 ${it.c}`} />
                <span className="text-[13px] font-semibold tracking-[-0.01em] sm:text-sm">{it.t}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-[4.125rem] overflow-hidden bg-gradient-to-b from-fuchsia-100/90 via-rose-50/40 to-transparent pb-16 pt-[calc(4rem_+_clamp(1.25rem,2.5vw,2.5rem))] sm:pb-20 lg:flex lg:min-h-dvh lg:flex-col lg:pb-0">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-[24rem] w-[24rem] rounded-full bg-fuchsia-200/40 blur-3xl blob-float" />
          <div className="absolute top-20 -right-24 h-[26rem] w-[26rem] rounded-full bg-amber-200/35 blur-3xl blob-float" style={{ animationDelay: "4s" }} />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl blob-float" style={{ animationDelay: "8s" }} />
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 lg:pb-8 2xl:max-w-[88rem]">
          <div className="grid w-full lg:grid-cols-12 gap-12 items-center">
            <div className="min-w-0 max-md:flex max-md:min-h-[calc(100dvh-5.25rem)] max-md:flex-col lg:col-span-7 text-center lg:text-left">
              <div className="max-md:flex max-md:flex-1 max-md:flex-col max-md:items-center max-md:justify-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hero-compact-hide inline-flex items-center gap-2.5 rounded-full border border-border bg-white/80 px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 animate-soft-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />
                </span>
                Prácticas Activas · Plan DEMS
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="hero-compact-title mt-4 text-[clamp(2.75rem,5.5vw,5rem)] font-black leading-[0.95] tracking-tighter text-foreground sm:mt-5 max-[359px]:text-[2.5rem]"
              >
                <span className="block">Falla.</span>
                <span className="block bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 bg-clip-text text-transparent animated-gradient">
                  Experimenta.
                </span>
                <span className="relative inline-block">
                  Entiende.
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 220 12"
                    fill="none"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M3 9C60 3 160 3 217 8"
                      stroke="url(#underline-grad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="underline-grad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#d946ef" />
                        <stop offset="0.5" stopColor="#ec4899" />
                        <stop offset="1" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-5 max-w-2xl mx-auto lg:mx-0 text-[clamp(1rem,1.1vw,1.25rem)] text-muted-foreground leading-relaxed sm:mt-6"
              >
                Laboratorio virtual de{" "}
                <Link href="/fisica" className="text-emerald-700 font-semibold hover:underline">Física</Link>,{" "}
                <Link href="/quimica" className="text-fuchsia-700 font-semibold hover:underline">Química</Link> e{" "}
                <Link href="/ingles" className="text-amber-700 font-semibold hover:underline">Inglés</Link> con la
                secuencia{" "}
                <span className="font-semibold text-foreground">falla productiva → simulador → ejemplo resuelto</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 flex flex-wrap gap-2 justify-center sm:mt-8 sm:gap-3 lg:justify-start"
              >
                <Link
                  href="/fisica"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-fuchsia-500/40 active:translate-y-0 active:scale-95 sm:px-6 sm:py-3 sm:text-sm max-[359px]:px-2.5 max-[359px]:text-xs"
                >
                  <Compass className="h-4 w-4" />
                  Explorar Módulos
                </Link>
                <Link
                  href="/retos"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-fuchsia-200 hover:bg-fuchsia-50/40 active:translate-y-0 active:scale-95 sm:px-6 sm:py-3 sm:text-sm max-[359px]:px-2.5 max-[359px]:text-xs"
                >
                  <Zap className="h-4 w-4 text-fuchsia-500" />
                  Probar un reto
                </Link>
              </motion.div>

              </div>
              <SubjectMarquee className="hero-compact-hide md:hidden -mx-4 sm:-mx-6 max-[359px]:hidden" />
            </div>

            {/* Right visual — tarjetas inclinadas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="flex flex-col">
                  <Link href="/fisica" className="relative block w-[92%] self-start rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-5 shadow-xl shadow-emerald-500/15 ring-1 ring-white/40 rotate-[-2deg] hover:rotate-0 hover:scale-[1.02] transition-transform duration-500 shine overflow-hidden">
                    <div className="flex items-center justify-between text-white relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                          <Atom className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-85">Física</div>
                          <div className="text-sm font-bold">11 simuladores · 4 unidades</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="mt-4 h-20 rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25 flex items-end gap-1 px-3 pb-3 relative z-10">
                      {[40, 65, 30, 80, 50, 90, 60, 75].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                          className="flex-1 bg-white/80 rounded-sm"
                        />
                      ))}
                    </div>
                  </Link>

                  <Link href="/quimica" className="relative z-10 mt-[calc(clamp(2.25rem,5vw,3.25rem)*-1)] block w-[88%] self-end rounded-3xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 p-5 shadow-xl shadow-fuchsia-500/15 ring-1 ring-white/40 rotate-[1.5deg] hover:rotate-0 hover:scale-[1.02] transition-transform duration-500 shine overflow-hidden">
                    <div className="flex items-center justify-between text-white relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                          <FlaskConical className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-85">Química</div>
                          <div className="text-sm font-bold">IUPAC · Balanceo · Moles</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 relative z-10">
                      {["H₂O", "CO₂", "NaCl"].map((f) => (
                        <div key={f} className="rounded-lg bg-white/15 backdrop-blur ring-1 ring-white/25 px-2 py-2 text-center text-white text-sm font-mono font-semibold">
                          {f}
                        </div>
                      ))}
                    </div>
                  </Link>

                  <Link href="/ingles" className="relative z-10 mt-[calc(clamp(1.5rem,4vw,2.5rem)*-1)] block w-[94%] self-end rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-5 shadow-xl shadow-amber-500/15 ring-1 ring-white/40 rotate-[-1deg] hover:rotate-0 hover:scale-[1.02] transition-transform duration-500 shine overflow-hidden">
                    <div className="flex items-center justify-between text-white relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                          <Languages className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-85">Inglés</div>
                          <div className="text-sm font-bold">Grammar · 4 trainers</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="mt-4 space-y-1.5 relative z-10">
                      {["She said she was ready.", "The experiment is done."].map((s, i) => (
                        <div key={i} className="rounded-lg bg-white/15 backdrop-blur ring-1 ring-white/25 px-3 py-1.5 text-white text-xs font-medium">
                          "{s}"
                        </div>
                      ))}
                    </div>
                  </Link>
                </div>

                <Link href="/progreso" className="absolute -top-3 -right-2 z-20 block" title="Ver mi progreso">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-2xl border border-border bg-white/95 p-3 shadow-lg shadow-black/5 backdrop-blur flex items-center gap-2.5 transition-all hover:shadow-xl hover:border-fuchsia-200"
                  >
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-sm shadow-fuchsia-500/30">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs text-muted-foreground">Tu avance</div>
                    <div className="text-sm font-bold text-foreground">0 %</div>
                  </div>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Marquee (md+) — en móvil vive al fondo del primer viewport */}
        <SubjectMarquee className="mt-[clamp(2rem,4vw,3.5rem)] max-md:hidden lg:mt-auto" />
      </section>

      {/* METHOD / SUBJECTS */}
      <section className="py-[clamp(3.5rem,7vw,6rem)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[88rem]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
              El método
            </span>
            <h2 className="animate-fade-in-up mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold tracking-tight text-foreground">
              Tres materias.{" "}
              <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Un mismo método
              </span>{" "}
              de aprender.
            </h2>
            <p className="animate-fade-in-up delay-2 mt-4 text-lg text-muted-foreground leading-relaxed">
              Física, Química e Inglés del plan DEMS, cada tema con su secuencia
              completa: <strong className="text-foreground">falla productiva</strong>,{" "}
              <strong className="text-foreground">simulador</strong>,{" "}
              <strong className="text-foreground">ejemplo resuelto</strong>. De la
              cinemática a las ondas, de las fuerzas a los fluidos, del nombre IUPAC al
              reactivo limitante, del presente simple al reported speech.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SUBJECTS.map((s, idx) => (
              <div key={s.id} className={`animate-fade-in-up delay-${idx + 2} h-full`}>
                <Link
                  href={s.href}
                  className={`group relative block h-full overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/[0.06] ${s.hoverBorder}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${s.bg} transition-transform duration-500 group-hover:scale-x-100`} />
                  <div className={`pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gradient-to-br ${s.bg} opacity-[0.07] blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-[0.16]`} />
                  <div className="relative">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.bg} shadow-lg ${s.glow} ring-1 ring-white/40 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                      <s.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.chips.map((c) => (
                        <span key={c} className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.chip}`}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                      <span className="text-xs text-muted-foreground">{s.count}</span>
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${s.text} transition-all group-hover:gap-2.5`}>
                        Explorar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — panel Liquid Glass oscuro */}
      <section id="plataforma" className="relative scroll-mt-24 py-4 sm:py-6">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[88rem]">
          <div className="animate-fade-in-up relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#17171a]/95 text-white shadow-[0_32px_80px_-32px_rgba(23,23,26,0.6)] backdrop-blur-xl sm:rounded-[2.5rem]">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -top-32 left-[8%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
              <div className="absolute -bottom-40 right-[6%] h-80 w-80 rounded-full bg-emerald-400/15 blur-[100px]" />
              <div className="absolute inset-0 grid-pattern-light opacity-[0.16]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>

            <div className="relative p-6 sm:p-9 lg:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.9)]" />
                    La plataforma en números
                  </div>
                  <h2 className="mt-3 text-[clamp(1.5rem,2.5vw,2rem)] font-semibold tracking-[-0.025em] text-white">
                    Todo listo para practicar hoy
                  </h2>
                </div>
                <Link
                  href="/progreso"
                  className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-[13px] font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
                >
                  Ver mi progreso
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-10 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0">
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className={`animate-slide-up delay-${i + 2} relative lg:px-7 ${i > 0 ? "lg:border-l lg:border-white/10" : ""} ${i === 0 ? "lg:pl-0" : ""} ${i === STATS.length - 1 ? "lg:pr-0" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/10 ${s.aura} ${s.tint} shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]`}>
                        <s.icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="text-[13px] font-semibold text-white/90">{s.label}</span>
                    </div>
                    <div className="mt-4 text-[clamp(2.75rem,4.2vw,3.5rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums text-white">
                      {s.value}
                    </div>
                    <div className="mt-2.5 max-w-[15rem] text-[12px] leading-relaxed text-white/55">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS — lista agrupada estilo iOS/macOS */}
      <section id="temas" className="relative scroll-mt-24 py-[clamp(3.5rem,7vw,6rem)]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-[100px]" />
          <div className="absolute bottom-10 right-[10%] h-80 w-80 rounded-full bg-emerald-200/25 blur-[110px]" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[88rem]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-[0_1px_2px_rgba(24,24,27,0.04)] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Descubrir temas
              </span>
              <h2 className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-[-0.035em] text-foreground">
                Explora los <span className="text-fuchsia-600">10 temas</span> de la plataforma
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Cada uno con su secuencia completa: falla productiva, simulador interactivo y ejemplo resuelto.
                Haz clic en cualquier tema para abrir su página.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3.5 py-2 text-[12px] font-medium text-muted-foreground shadow-[0_1px_2px_rgba(24,24,27,0.04)] backdrop-blur-md md:inline-flex">
              <Layers className="h-3.5 w-3.5 text-fuchsia-500" />
              10 temas · 3 materias
            </div>
          </div>

          <div className="animate-fade-in-up mt-9 overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white/70 shadow-[0_28px_70px_-36px_rgba(24,24,27,0.3)] backdrop-blur-xl sm:mt-11">
            <div className="grid min-w-0 md:grid-cols-2">
              {[0, 1].map((col) => (
                <div
                  key={col}
                  className={`min-w-0 ${col === 1 ? "border-t border-black/[0.06] md:border-l md:border-t-0" : ""}`}
                >
                  {TOPICS.slice(col * 5, col * 5 + 5).map((t, idx) => {
                    const s = subjectOf(t.subject);
                    return (
                      <li
                        key={t.n}
                        className="group relative flex min-w-0 items-center gap-3 px-3.5 py-4 transition-colors hover:bg-white/80 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fuchsia-500/40 sm:gap-4 sm:px-5"
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-mono text-[11px] font-semibold tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:h-11 sm:w-11 sm:rounded-[13px] ${s.bgSoft} ${s.border} ${s.text}`}>
                          {t.n}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-[15px]">
                            {t.name}
                          </span>
                          <span className="mt-0.5 block text-pretty text-[12px] leading-snug text-muted-foreground sm:text-[12.5px]">
                            {t.desc}
                          </span>
                          <span className={`mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] ${s.text}`}>
                            <span className={`h-1 w-1 rounded-full ${s.dot}`} />
                            {s.name}
                          </span>
                        </span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white/60 text-muted-foreground shadow-[0_1px_2px_rgba(24,24,27,0.03)] transition-all duration-300 group-hover:border-transparent group-hover:bg-foreground group-hover:text-white">
                          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-px" />
                        </span>
                        {idx < 4 && (
                          <span
                            className="pointer-events-none absolute inset-x-3.5 bottom-0 h-px bg-black/[0.05] sm:inset-x-5"
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MINI RETO — adelanto de /retos */}
      <section className="animate-fade-in-up bg-secondary/50 py-[clamp(3rem,5.5vw,5rem)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[88rem]">
          <MiniReto />
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="animate-fade-in-up py-[clamp(3rem,6vw,6rem)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[88rem]">
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/laboratorios" className="group relative block overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-500/10">
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-fuchsia-400 to-pink-500 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg shadow-fuchsia-500/25 ring-1 ring-white/40 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">Laboratorios</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Guías con el método científico: hipótesis, cálculo, registro y conclusión.</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-fuchsia-700 transition-all group-hover:gap-2.5">
                Ver laboratorios <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            <Link href="/retos" className="group relative block overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber-400 to-orange-500 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25 ring-1 ring-white/40 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">Retos de 5 minutos</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Quizzes rápidos con feedback pedagógico. Suma puntos y sube de nivel.</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 transition-all group-hover:gap-2.5">
                Probar un reto <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            <Link href="/progreso" className="group relative block overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-400 to-teal-500 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 ring-1 ring-white/40 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">Mi progreso</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tu bitácora: actividades, ítems resueltos y nivel (Novato → Experto).</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-all group-hover:gap-2.5">
                Ver mi avance <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}