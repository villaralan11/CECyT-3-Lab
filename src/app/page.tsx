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

const SUBJECTS = [
  {
    id: "fisica",
    name: "Física",
    icon: Atom,
    desc: "Cinemática con integración Euler-Cromer: MRU, MRUV y los 3 tiros (vertical, horizontal y parabólico).",
    bg: "from-emerald-400 via-teal-400 to-cyan-400",
    bgSoft: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
    hoverBorder: "hover:border-emerald-200",
    glow: "shadow-emerald-500/25",
    chips: ["MRU", "MRUV", "Los 3 tiros"],
    count: "3 simuladores",
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
  { value: "3", label: "Materias", sub: "Física · Química · Inglés", icon: Layers, c: "from-emerald-400 to-teal-500" },
  { value: "10", label: "Temas", sub: "Cada uno con falla + sim + ejemplo", icon: BookOpen, c: "from-fuchsia-400 to-pink-500" },
  { value: "10", label: "Simuladores", sub: "Euler-Cromer · IUPAC real · Moles", icon: Microscope, c: "from-amber-400 to-orange-500" },
  { value: "82", label: "Ejercicios", sub: "Bancos + reacciones + transformaciones", icon: Target, c: "from-rose-400 to-pink-500" },
];

const TOPICS = [
  { n: "01", subject: "fisica", name: "Cinemática · MRU", desc: "Movimiento Rectilíneo Uniforme", href: "/fisica/mru" },
  { n: "02", subject: "fisica", name: "Cinemática · MRUV", desc: "Aceleración Constante", href: "/fisica/mruv" },
  { n: "03", subject: "fisica", name: "Los 3 tiros", desc: "Vertical, Horizontal y Parabólico", href: "/fisica/tiros" },
  { n: "04", subject: "quimica", name: "Nomenclatura IUPAC", desc: "Orgánica e Inorgánica · 24 compuestos", href: "/quimica/iupac" },
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
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            ¿Puedes con este?{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Respóndelo aquí mismo
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Una pregunta real de la sección <Link href="/retos" className="font-semibold text-amber-600 hover:underline">Retos</Link>:
            así se ve el formato — intentas, fallas con propósito y recibes la explicación al instante.
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
                      }`}
                    />
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
                  <button
                    key={i}
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
                  </button>
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
                  className={`overflow-hidden`}
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
                    ? "Eso es todo — ¿te animas a los 6 completos?"
                    : "Toca «Siguiente reto» para continuar."
                  : "Elige una opción — no hay penalización por fallar."}
              </p>
              <div className="flex items-center gap-2">
                {done && (
                  <button
                    onClick={advance}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-95"
                  >
                    {isLast ? <RotateCcw className="h-3.5 w-3.5" /> : null}
                    {isLast ? "Reiniciar" : "Siguiente reto"}
                    {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden pt-7 pb-16 sm:pt-11 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-[24rem] w-[24rem] rounded-full bg-fuchsia-200/40 blur-3xl blob-float" />
          <div className="absolute top-20 -right-24 h-[26rem] w-[26rem] rounded-full bg-amber-200/35 blur-3xl blob-float" style={{ animationDelay: "4s" }} />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl blob-float" style={{ animationDelay: "8s" }} />
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-white/80 px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 animate-soft-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />
                </span>
                Laboratorio virtual · CECyT No. 3
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-5 text-5xl font-black tracking-tighter text-foreground sm:text-6xl lg:text-7xl"
              >
                <span className="block">Aprende haciendo.</span>
                <span className="mt-2 block bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 bg-clip-text text-transparent animated-gradient">
                  Falla con propósito.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
              >
                Practica <Link href="/fisica" className="font-semibold text-emerald-600 hover:underline">Física</Link>, <Link href="/quimica" className="font-semibold text-fuchsia-600 hover:underline">Química</Link> e <Link href="/ingles" className="font-semibold text-amber-600 hover:underline">Inglés</Link> con una secuencia guiada: prueba, simula, corrige y entiende por qué funciona.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
              >
                <Link
                  href="/fisica"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-fuchsia-500/40 active:translate-y-0 active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  Empezar a practicar
                </Link>
                <Link
                  href="/retos"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-fuchsia-200 hover:bg-fuchsia-50/40 active:translate-y-0 active:scale-95"
                >
                  <Zap className="h-4 w-4 text-fuchsia-500" />
                  Ver retos
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex items-center justify-center gap-5 lg:justify-start"
              >
                <div className="flex -space-x-2.5">
                  {[
                    { c: "from-emerald-400 to-teal-500", i: Atom },
                    { c: "from-fuchsia-400 to-pink-500", i: FlaskConical },
                    { c: "from-amber-400 to-orange-500", i: Languages },
                  ].map((it, i) => (
                    <div key={i} className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${it.c} ring-2 ring-background shadow-sm`}>
                      <it.i className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">10 temas · 3 materias · 82 ejercicios</div>
                  <div className="text-xs text-muted-foreground">Diseñado para estudiar con lógica, no solo memorizar.</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md">
                <div className="relative h-[420px]">
                  <Link href="/fisica" className="absolute left-4 right-4 top-0 block overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-5 shadow-xl shadow-emerald-500/15 ring-1 ring-white/40 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] shine rotate-[-2deg]">
                    <div className="relative z-10 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
                          <Atom className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-85">Física</div>
                          <div className="text-sm font-bold">MRU · MRUV · Tiros</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="relative z-10 mt-4 flex h-20 items-end gap-1 rounded-xl bg-white/15 px-3 pb-3 ring-1 ring-white/25 backdrop-blur">
                      {[40, 65, 30, 80, 50, 90, 60, 75].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                          className="flex-1 rounded-sm bg-white/80"
                        />
                      ))}
                    </div>
                  </Link>

                  <Link href="/quimica" className="absolute left-0 right-8 top-32 z-10 block overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 p-5 shadow-xl shadow-fuchsia-500/15 ring-1 ring-white/40 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] shine rotate-[1.5deg]">
                    <div className="relative z-10 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
                          <FlaskConical className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-85">Química</div>
                          <div className="text-sm font-bold">IUPAC · Balanceo · Moles</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
                      {['H₂O', 'CO₂', 'NaCl'].map((f) => (
                        <div key={f} className="rounded-lg bg-white/15 px-2 py-2 text-center text-sm font-mono font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                          {f}
                        </div>
                      ))}
                    </div>
                  </Link>

                  <Link href="/ingles" className="absolute left-8 right-0 top-64 z-20 block overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-5 shadow-xl shadow-amber-500/15 ring-1 ring-white/40 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] shine rotate-[3deg]">
                    <div className="relative z-10 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
                          <Languages className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-85">Inglés</div>
                          <div className="text-sm font-bold">Grammar · Tenses</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="relative z-10 mt-4 flex items-end gap-2">
                      <div className="flex-1 rounded-xl bg-white/15 px-2 py-2 text-center text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                        I have been
                      </div>
                      <div className="flex-1 rounded-xl bg-white/15 px-2 py-2 text-center text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                        since 2019
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              ¿Por qué funciona?
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Estudiar sin frustración, con práctica real y feedback inmediato.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Falla productiva",
                text: "Intentas resolverlo antes de ver la solución, para detectar qué sabes y dónde se rompe tu razonamiento.",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: Microscope,
                title: "Simulador interactivo",
                text: "Puedes experimentar con variables reales, cambiar valores y ver cómo cambian los resultados en tiempo real.",
                color: "from-fuchsia-500 to-pink-500",
              },
              {
                icon: BookOpen,
                title: "Explicación clara",
                text: "Cuando hay error, no te deja solo: te muestra el porqué del concepto y la lógica detrás de la respuesta.",
                color: "from-amber-500 to-orange-500",
              },
            ].map(({ icon: Icon, title, text, color }) => (
              <div key={title} className="rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04]">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg ring-1 ring-white/40`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
              Elige una materia
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Una ruta clara para empezar hoy mismo.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {SUBJECTS.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.08 }}
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-6 py-12 text-background sm:px-10 sm:py-14">
            <div className="absolute inset-0 grid-pattern-light opacity-40" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-28 right-1/5 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden="true" />

            <div className="relative mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-background/50">La plataforma en números</div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Todo listo para practicar hoy</h2>
              </div>
              <Link href="/progreso" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/10">
                Ver mi progreso <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="relative grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.c} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="mt-3 text-4xl font-bold tracking-tight">{s.value}</div>
                  <div className="mt-1 text-sm font-semibold">{s.label}</div>
                  <div className="mt-0.5 text-xs opacity-60">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Descubrir temas
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explora los <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">10 temas</span> de la plataforma.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">Cada página combina explicación, práctica y validación para que aprendas del error y no solo del resultado.</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((t, i) => {
              const s = subjectOf(t.subject);
              return (
                <motion.div
                  key={t.n}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: (i % 6) * 0.05 }}
                >
                  <Link
                    href={t.href}
                    className={`group relative block overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.05] ${s.hoverBorder}`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r ${s.bg} transition-transform duration-500 group-hover:scale-x-100`} />
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-mono font-semibold text-muted-foreground/60">{t.n}</span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.bgSoft} ${s.text} ${s.border}`}>
                        {s.name}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-tight text-foreground">{t.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.text}`}>
                        <Sparkles className="h-3 w-3" />
                        Abrir página
                      </span>
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-fuchsia-500 group-hover:to-pink-500 group-hover:text-white">
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-px" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MiniReto />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/laboratorios" className="group relative block overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-500/10">
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-fuchsia-400 to-pink-500 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg shadow-fuchsia-500/25 ring-1 ring-white/40 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">Laboratorios</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Guías con el método científico: hipótesis, cálculo, registro y conclusión.</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-fuchsia-600 transition-all group-hover:gap-2.5">
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
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 transition-all group-hover:gap-2.5">
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
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2.5">
                Ver mi avance <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
