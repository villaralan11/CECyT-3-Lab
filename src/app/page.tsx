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
import { CtaGhost, CtaPrimary, ModuleGrid, ModuleHeader, ModuleTile } from "@/components/site/modules";

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
            Una pregunta real de la sección <Link href="/retos" className="font-semibold text-amber-700 hover:underline">Retos</Link>:
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
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[10px] font-bold text-muted-foreground">
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
      <section className="relative overflow-hidden pt-10 pb-24 sm:pt-14 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
        </div>

        <div className="module-col">
          {/* Intro tipográfico (módulo de introducción) */}
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="type-hero mx-auto max-w-4xl text-foreground"
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
              className="type-sub mx-auto mt-6 max-w-2xl text-muted-foreground"
            >
              Practica <Link href="/fisica" className="font-semibold text-emerald-700 hover:underline">Física</Link>, <Link href="/quimica" className="font-semibold text-fuchsia-700 hover:underline">Química</Link> e <Link href="/ingles" className="font-semibold text-amber-700 hover:underline">Inglés</Link> con una secuencia guiada: prueba, simula, corrige y entiende por qué funciona.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              <CtaPrimary href="/fisica">
                <Sparkles className="h-4 w-4" />
                Empezar a practicar
              </CtaPrimary>
              <CtaGhost href="/retos">
                <Zap className="h-4 w-4 text-fuchsia-500" />
                Ver retos
              </CtaGhost>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-5"
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

          {/* Módulos de materias: 1 tile completo + 2 medios */}
          <div className="mt-16 sm:mt-20">
            <ModuleHeader eyebrow="Elige una materia" title="Una ruta clara para empezar hoy mismo." />
            <ModuleGrid className="mt-10 sm:mt-12">
              {SUBJECTS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <ModuleTile
                    key={s.id}
                    size={i === 0 ? "full" : "half"}
                    eyebrow={s.count}
                    title={
                      <span className="inline-flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bgSoft} ring-1 ${s.border}`}>
                          <Icon className={`h-5 w-5 ${s.text}`} />
                        </span>
                        {s.name}
                      </span>
                    }
                    sub={s.desc}
                    href={s.href}
                    ctaLabel="Ver simuladores"
                    delay={i * 0.08}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {s.chips.map((c) => (
                        <span key={c} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.chip}`}>
                          {c}
                        </span>
                      ))}
                    </div>

                    {s.id === "fisica" ? (
                      <div className="mt-5 h-44 overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-200/70 dark:bg-emerald-950/40 dark:ring-emerald-900/60">
                        <div className="flex h-full items-end gap-1.5 px-6 pb-6">
                          {[40, 65, 30, 80, 50, 90, 60, 75].map((h, bi) => (
                            <motion.div
                              key={bi}
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{ delay: 0.2 + bi * 0.07, duration: 0.5, ease: "easeOut" }}
                              className="flex-1 rounded-sm bg-emerald-400/70"
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </ModuleTile>
                );
              })}
            </ModuleGrid>
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-6">
        <div className="module-col">
          <div className="overflow-hidden rounded-[2rem] bg-foreground px-6 py-12 text-background sm:px-10 sm:py-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="app-caption font-semibold uppercase tracking-[0.18em] text-background/60">La plataforma en números</div>
                <h2 className="mt-2 app-large text-background">Todo listo para practicar hoy</h2>
              </div>
              <Link href="/progreso" className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-5 app-footnote font-semibold backdrop-blur transition-colors hover:bg-white/15">
                Ver mi progreso <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.12]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <s.icon className="h-5 w-5 text-background" />
                  </div>
                  <div className="mt-4 app-large tabular-nums text-background">{s.value}</div>
                  <div className="mt-1 app-headline text-background">{s.label}</div>
                  <div className="mt-1 app-caption text-background/70">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="module-col">
          <ModuleHeader
            eyebrow="Descubrir temas"
            title={
              <>
                Explora los <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">10 temas</span> de la plataforma.
              </>
            }
            sub="Cada página combina explicación, práctica y validación para que aprendas del error y no solo del resultado."
          />

          <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-3">
            {TOPICS.map((t, i) => {
              const s = subjectOf(t.subject);
              return (
                <ModuleTile
                  key={t.n}
                  eyebrow={`${t.n} · ${s.name}`}
                  title={t.name}
                  sub={t.desc}
                  href={t.href}
                  ctaLabel="Abrir página"
                  delay={(i % 6) * 0.05}
                  className="p-6 sm:p-7"
                />
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
        <div className="module-col">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            <ModuleTile
              title={
                <span className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-50 ring-1 ring-fuchsia-200">
                    <FlaskConical className="h-5 w-5 text-fuchsia-700" />
                  </span>
                  Laboratorios
                </span>
              }
              sub="Guías con el método científico: hipótesis, cálculo, registro y conclusión."
              href="/laboratorios"
              ctaLabel="Ver laboratorios"
              className="p-6 sm:p-7"
            />
            <ModuleTile
              title={
                <span className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-200">
                    <Flame className="h-5 w-5 text-amber-700" />
                  </span>
                  Retos de 5 minutos
                </span>
              }
              sub="Quizzes rápidos con feedback pedagógico. Suma puntos y sube de nivel."
              href="/retos"
              ctaLabel="Probar un reto"
              className="p-6 sm:p-7"
            />
            <ModuleTile
              title={
                <span className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200">
                    <GraduationCap className="h-5 w-5 text-emerald-700" />
                  </span>
                  Mi progreso
                </span>
              }
              sub="Tu bitácora: actividades, ítems resueltos y nivel (Novato → Experto)."
              href="/progreso"
              ctaLabel="Ver mi avance"
              className="p-6 sm:p-7"
            />
          </div>
        </div>
      </section>
    </>
  );
}
