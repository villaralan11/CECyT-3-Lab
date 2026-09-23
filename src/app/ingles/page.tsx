"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Languages, ArrowRight, Clock, Repeat, Sparkles, MessageSquare } from "lucide-react";
import { PageHeader, Breadcrumb, CtaStrip } from "@/components/site/ui";

const SIMS = [
  {
    n: "07",
    name: "Verb Tenses",
    desc: "Catorce ejercicios de presente y pasado, simple y continuo, perfecto y condicionales de tiempo: la señal está en los marcadores ('since', 'last year', 'look!') y en la lógica de la ciencia.",
    href: "/ingles/verb-tenses",
    icon: Clock,
    points: ["14 ejercicios con marcadores temporales", "Stats de aciertos y % de acierto", "Feedback con reglas generales"],
  },
  {
    n: "08",
    name: "Passive Voice",
    desc: "Transforma oraciones activas en pasivas y domina la estructura be + participio en todos los tiempos. El foco cambia: del quien hace al que recibe.",
    href: "/ingles/passive-voice",
    icon: Repeat,
    points: ["9 transformaciones (simple, continuo, perfecto, modal)", "Casos especiales: people, modales", "Fórmula general S + be + participio"],
  },
  {
    n: "09",
    name: "Modal Verbs",
    desc: "must, can, might, should y compañía: obligación, prohibición, posibilidad, deducción y permiso. El matiz que cambia una recomendación en una norma de seguridad del laboratorio.",
    href: "/ingles/modal-verbs",
    icon: Sparkles,
    points: ["10 ejercicios con contexto de laboratorio", "Escala de certeza (will → might → can't)", "Diferencia must not vs don't have to"],
  },
  {
    n: "10",
    name: "Reported Speech",
    desc: "Cuenta lo que alguien dijo sin citarlo: backshift de tiempos, ajuste de pronombres y marcadores (now→then), preguntas sin auxiliar e imperativos con to + infinitivo.",
    href: "/ingles/reported-speech",
    icon: MessageSquare,
    points: ["10 transformaciones (statements, questions, imperatives)", "Tabla de backshift de tiempos", "Marcadores temporales (yesterday → the day before)"],
  },
];

export default function InglesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Inglés" }]} />

      <PageHeader
        eyebrow="Materia"
        accent="amber"
        title={
          <>
            Inglés ·{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Grammar Trainer
            </span>
          </>
        }
        subtitle="Cuatro entrenadores con estrategia y explicación: tiempos verbales, voz pasiva, modales y reported speech. Cada ejercicio viene con feedback pedagógico y reglas generales."
      />

      {/* Subject intro card */}
      <div className="mt-10 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg flex-shrink-0">
            <Languages className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">¿Qué vas a encontrar?</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Cuatro trainers tipo quiz con feedback rico. Cada uno muestra estadísticas de
              aciertos, navegación por puntos numerados (clickeables para saltar entre
              ejercicios), opciones con letras A/B/C/D, explicación tras cada respuesta y una
              nota "extra" con la regla general del tema. Al final, un resumen adaptativo te
              dice si dominas el tema o te conviene repasar.
            </p>
          </div>
        </div>
      </div>

      {/* Trainer grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SIMS.map((sim, i) => (
          <motion.div
            key={sim.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              href={sim.href}
              className="group block h-full rounded-2xl border-2 border-amber-100 bg-white p-5 hover:shadow-lg hover:border-amber-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                  <sim.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground">Tema {sim.n}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-foreground">{sim.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">{sim.desc}</p>
              <ul className="mt-3 space-y-1 text-xs text-amber-700">
                {sim.points.map((p) => (
                  <li key={p} className="inline-flex items-center gap-1 mr-3">
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Sparkles className="h-3 w-3" />
                  Abrir trainer
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
        <CtaStrip
          title="¿Listo para practicar?"
          description="Empieza por Verb Tenses si eres nuevo en los marcadores temporales. Cada trainer guarda tu progreso mientras navegas entre ejercicios."
          primaryLabel="Empezar con Verb Tenses"
          primaryHref="/ingles/verb-tenses"
          secondaryLabel="Ver retos"
          secondaryHref="/retos"
        />
      </div>
    </div>
  );
}
