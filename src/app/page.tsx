"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Rocket,
  GraduationCap,
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
  { n: "04", subject: "quimica", name: "Nomenclatura IUPAC", desc: "Orgánica e Inorgánica · 25 compuestos", href: "/quimica/iupac" },
  { n: "05", subject: "quimica", name: "Balanceo de ecuaciones", desc: "Steppers + tabla de átomos en vivo", href: "/quimica/balanceo" },
  { n: "06", subject: "quimica", name: "Estequiometría", desc: "Reactivo limitante y rendimiento", href: "/quimica/estequiometria" },
  { n: "07", subject: "ingles", name: "Verb Tenses", desc: "14 ejercicios con marcadores temporales", href: "/ingles/verb-tenses" },
  { n: "08", subject: "ingles", name: "Passive Voice", desc: "Transformaciones activa → pasiva", href: "/ingles/passive-voice" },
  { n: "09", subject: "ingles", name: "Modal Verbs", desc: "Obligación, prohibición, deducción", href: "/ingles/modal-verbs" },
  { n: "10", subject: "ingles", name: "Reported Speech", desc: "Backshift + marcadores + imperativos", href: "/ingles/reported-speech" },
];

const subjectOf = (id: string) => SUBJECTS.find((s) => s.id === id)!;

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl blob-float" />
          <div className="absolute top-32 right-0 h-96 w-96 rounded-full bg-amber-300/40 blur-3xl blob-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-500" />
                </span>
                Prácticas Activas · Nuevo
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
              >
                <span className="block">Falla.</span>
                <span className="block bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 bg-clip-text text-transparent animated-gradient">
                  Experimenta.
                </span>
                <span className="block">Entiende.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-muted-foreground leading-relaxed"
              >
                Laboratorio virtual de{" "}
                <Link href="/fisica" className="text-emerald-600 font-semibold hover:underline">Física</Link>,{" "}
                <Link href="/quimica" className="text-fuchsia-600 font-semibold hover:underline">Química</Link> e{" "}
                <Link href="/ingles" className="text-amber-600 font-semibold hover:underline">Inglés</Link> con la
                secuencia{" "}
                <span className="font-semibold text-foreground">falla productiva → simulador → ejemplo resuelto</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <Link
                  href="/retos"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:scale-105 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  Diagnóstico 2 min
                </Link>
                <Link
                  href="/quimica/iupac"
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-fuchsia-300 hover:bg-fuchsia-50/40 transition-all"
                >
                  <Sparkles className="h-4 w-4 text-fuchsia-500" />
                  Ver Química
                </Link>
              </motion.div>

              {/* Onboarding stepper — 1→2→3 */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="mt-6 flex items-center gap-2 justify-center lg:justify-start"
              >
                {[
                  { n: "01", t: "Elige materia", d: "Física / Química / Inglés" },
                  { n: "02", t: "Falla a propósito", d: "Intenta sin ayuda" },
                  { n: "03", t: "Simula y entiende", d: "Ejemplo con explicación" },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-[10px] font-bold text-white">{s.n}</span>
                      <div className="text-left leading-tight hidden sm:block">
                        <div className="text-xs font-bold text-foreground">{s.t}</div>
                        <div className="text-[10px] text-muted-foreground">{s.d}</div>
                      </div>
                      <div className="sm:hidden text-xs font-bold text-foreground">{s.t}</div>
                    </div>
                    {i < 2 && <span className="text-muted-foreground/40">→</span>}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex items-center gap-6 justify-center lg:justify-start"
              >
                <div className="flex -space-x-2">
                  {[
                    { c: "from-emerald-400 to-teal-500", i: Atom },
                    { c: "from-fuchsia-400 to-pink-500", i: FlaskConical },
                    { c: "from-amber-400 to-orange-500", i: Languages },
                  ].map((it, i) => (
                    <div key={i} className={`h-10 w-10 rounded-full bg-gradient-to-br ${it.c} ring-2 ring-background flex items-center justify-center shadow-sm`}>
                      <it.i className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">
                    10 temas · 3 materias · 82 ejercicios
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Falla productiva → simulador → ejemplo con auto-explicación
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md">
                <div className="relative h-[420px]">
                  <Link href="/fisica" className="absolute top-0 left-4 right-4 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-6 shadow-2xl shadow-emerald-500/20 rotate-[-6deg] hover:rotate-0 transition-transform duration-500 block">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                          <Atom className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-medium opacity-90">FÍSICA</div>
                          <div className="text-sm font-bold">Cinemática · 5 modos</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="mt-4 h-20 rounded-xl bg-white/15 backdrop-blur flex items-end gap-1 px-3 pb-3">
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

                  <Link href="/quimica" className="absolute top-32 left-0 right-8 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 p-6 shadow-2xl shadow-fuchsia-500/25 rotate-[3deg] hover:rotate-0 transition-transform duration-500 block">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                          <FlaskConical className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-medium opacity-90">QUÍMICA</div>
                          <div className="text-sm font-bold">IUPAC · Balanceo · Moles</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {["H₂O", "CO₂", "NaCl"].map((f) => (
                        <div key={f} className="rounded-lg bg-white/15 backdrop-blur px-2 py-2 text-center text-white text-sm font-mono font-semibold">
                          {f}
                        </div>
                      ))}
                    </div>
                  </Link>

                  <Link href="/ingles" className="absolute top-64 left-8 right-0 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-6 shadow-2xl shadow-amber-500/25 rotate-[-2deg] hover:rotate-0 transition-transform duration-500 block">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                          <Languages className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-medium opacity-90">INGLÉS</div>
                          <div className="text-sm font-bold">Grammar · 4 trainers</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="mt-4 space-y-1.5">
                      {["She said she was ready.", "The experiment is done."].map((s, i) => (
                        <div key={i} className="rounded-lg bg-white/15 backdrop-blur px-3 py-1.5 text-white text-xs font-medium">
                          "{s}"
                        </div>
                      ))}
                    </div>
                  </Link>
                </div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -right-2 rounded-2xl bg-white shadow-xl border border-border p-3 flex items-center gap-2"
                >
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs text-muted-foreground">Tu avance</div>
                    <div className="text-sm font-bold">0 %</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-16 border-y border-border bg-secondary/40 py-4 overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-8 items-center">
                {[
                  { t: "Física", i: Atom, c: "text-emerald-600" },
                  { t: "Química", i: FlaskConical, c: "text-fuchsia-600" },
                  { t: "Inglés", i: Languages, c: "text-amber-600" },
                  { t: "Cinemática", i: Zap, c: "text-emerald-600" },
                  { t: "Nomenclatura IUPAC", i: FlaskConical, c: "text-fuchsia-600" },
                  { t: "Estequiometría", i: Target, c: "text-fuchsia-600" },
                  { t: "Reported speech", i: Languages, c: "text-amber-600" },
                  { t: "Aprender haciendo", i: Sparkles, c: "text-fuchsia-600" },
                ].map((it, i) => (
                  <div key={i} className="flex items-center gap-2 text-foreground/70">
                    <it.i className={`h-4 w-4 ${it.c}`} />
                    <span className="font-semibold text-sm">{it.t}</span>
                    <span className="text-muted-foreground/40">◆</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD / SUBJECTS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-700">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
              El método
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Tres materias.{" "}
              <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Un mismo método
              </span>{" "}
              de aprender.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Física, Química e Inglés del plan DEMS. Química trae secuencia
              completa: <strong className="text-foreground">falla productiva</strong>,{" "}
              <strong className="text-foreground">simulador</strong>,{" "}
              <strong className="text-foreground">ejemplo resuelto</strong>; el resto,
              entrenador interactivo. Del MRU al
              tiro parabólico, del nombre IUPAC al reactivo limitante, del presente simple
              al reported speech.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SUBJECTS.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  href={s.href}
                  className={`group relative block overflow-hidden rounded-3xl border ${s.border} ${s.bgSoft} p-6 hover:shadow-xl transition-all hover:-translate-y-1`}
                >
                  <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${s.bg} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                  <div className="relative">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.bg} shadow-lg`}>
                      <s.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-foreground">{s.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.chips.map((c) => (
                        <span key={c} className={`inline-flex items-center rounded-full ${s.bgSoft} ${s.text} border ${s.border} px-2.5 py-0.5 text-xs font-medium`}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/60">
                      <span className="text-xs text-muted-foreground">{s.count}</span>
                      <span className={`inline-flex items-center gap-1 ${s.text} text-sm font-semibold group-hover:gap-2 transition-all`}>
                        Explorar <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gradient-to-br from-foreground via-foreground to-foreground/90 text-background relative overflow-hidden">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5 hover:bg-white/10 transition-colors"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.c} mb-3`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-4xl font-bold tracking-tight">{s.value}</div>
                <div className="mt-1 text-sm font-semibold">{s.label}</div>
                <div className="mt-0.5 text-xs opacity-70">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS GRID */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-700">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                Descubrir temas
              </span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                10 de 10 temas · todos con{" "}
                <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                  práctica interactiva
                </span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Haz clic en cualquier tema para abrir su página y práctica interactiva.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((t, i) => {
              const s = subjectOf(t.subject);
              return (
                <motion.div
                  key={t.n}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: (i % 6) * 0.05 }}
                >
                  <Link
                    href={t.href}
                    className="group relative block overflow-hidden rounded-2xl border border-border bg-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.bg}`} />
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-mono font-bold text-muted-foreground">{t.n}</span>
                      <span className={`inline-flex items-center rounded-full ${s.bgSoft} ${s.text} border ${s.border} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide`}>
                        {s.name}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-foreground leading-tight">{t.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.text}`}>
                        <Sparkles className="h-3 w-3" />
                        Abrir página
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/laboratorios" className="group rounded-3xl border border-fuchsia-200 bg-white p-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">Laboratorios</h3>
              <p className="mt-2 text-sm text-muted-foreground">Guías con el método científico: hipótesis, cálculo, registro y conclusión.</p>
              <div className="mt-4 inline-flex items-center gap-1 text-fuchsia-600 text-sm font-semibold group-hover:gap-2 transition-all">
                Ver laboratorios <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link href="/retos" className="group rounded-3xl border border-amber-200 bg-white p-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">Retos rápidos</h3>
              <p className="mt-2 text-sm text-muted-foreground">Quizzes rápidos con feedback pedagógico. Suma puntos y sube de nivel.</p>
              <div className="mt-4 inline-flex items-center gap-1 text-amber-600 text-sm font-semibold group-hover:gap-2 transition-all">
                Probar un reto <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link href="/progreso" className="group rounded-3xl border border-emerald-200 bg-white p-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">Mi progreso</h3>
              <p className="mt-2 text-sm text-muted-foreground">Tu bitácora: actividades, ítems resueltos y nivel (Novato → Experto).</p>
              <div className="mt-4 inline-flex items-center gap-1 text-emerald-600 text-sm font-semibold group-hover:gap-2 transition-all">
                Ver mi avance <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
