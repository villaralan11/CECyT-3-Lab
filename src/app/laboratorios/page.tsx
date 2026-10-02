"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lightbulb, Calculator, Beaker, CheckCircle2, ArrowRight, FlaskConical } from "lucide-react";
import { PageHeader, Breadcrumb, CtaStrip } from "@/components/site/ui";

const LAB_STEPS = [
  { n: 1, title: "Plantea la hipótesis", desc: "Con 8 g de H₂ y 8 g de O₂ para 2H₂ + O₂ → 2H₂O: ¿cuál se agota primero? Intuye, no calcules.", icon: Lightbulb },
  { n: 2, title: "Realiza el cálculo", desc: "Gramos ÷ masa molar: 8 g de H₂ ≈ 4 mol, 8 g de O₂ ≈ 0.25 mol. Divide entre su coeficiente.", icon: Calculator },
  { n: 3, title: "Registra los resultados", desc: "H₂: 4 ÷ 2 = 2 rondas · O₂: 0.25 ÷ 1 = 0.25 rondas. El menor gana (o pierde): el O₂ limita.", icon: Beaker },
  { n: 4, title: "Concluye", desc: "La estequiometría cuenta moles, no gramos: el que pesa igual no se agota igual. Verifícalo en el simulador.", icon: CheckCircle2 },
];

const LABS = [
  {
    title: "Reactivo limitante",
    subject: "Química",
    href: "/quimica/estequiometria",
    description: "Predice cuál reactivo se agota primero y calcula el rendimiento teórico con masas molares reales.",
    color: "fuchsia",
  },
  {
    title: "MRU a tiro parabólico",
    subject: "Física",
    href: "/fisica/tiros",
    description: "Un solo simulador: MRU, MRUV y los tres tiros con Euler-Cromer validado contra la fórmula exacta.",
    color: "emerald",
  },
  {
    title: "Balanceo de combustiones",
    subject: "Química",
    href: "/quimica/balanceo",
    description: "Ajusta coeficientes de combustiones de metano, etano, etanol y glucosa con tabla de átomos en vivo.",
    color: "fuchsia",
  },
  {
    title: "Nomenclatura IUPAC",
    subject: "Química",
    href: "/quimica/iupac",
    description: "Fórmula ⇄ nombre en inorgánica y orgánica: 24 compuestos con explicación de las reglas.",
    color: "fuchsia",
  },
];

export default function LaboratoriosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Laboratorios" }]} />

      <PageHeader
        eyebrow="Guías prácticas"
        accent="fuchsia"
        title={
          <>
            Del concepto al{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              experimento
            </span>
            .
          </>
        }
        subtitle="Guías que convierten la teoría en decisiones, observaciones y resultados. Cada laboratorio sigue el método científico que usarás en la industria: hipótesis, cálculo, registro y conclusión."
      />

      {/* Featured lab: reactivo limitante */}
      <div className="mt-12 grid lg:grid-cols-12 gap-10">
        {/* Left: featured lab card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50 p-6 sticky top-24">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-fuchsia-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Recomendado
              </span>
              <span className="text-xs text-fuchsia-700 font-semibold">Química</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Reactivo limitante</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              El caso clásico: si reaccionan 8 g de H₂ con 8 g de O₂ para formar agua,
              ¿cuál se agota primero? A igual masa, no a igual cantidad de materia.
            </p>
            <div className="mt-4 rounded-xl bg-white/70 backdrop-blur border border-fuchsia-200/60 px-4 py-3 font-mono text-sm text-foreground">
              2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O · 8 g + 8 g
            </div>
            <Link
              href="/quimica/estequiometria"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
            >
              <FlaskConical className="h-4 w-4" />
              Abrir laboratorio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: steps */}
        <div className="lg:col-span-7">
          <h3 className="text-lg font-bold text-foreground mb-4">Método científico aplicado</h3>
          <div className="relative space-y-4">
            {LAB_STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-4 rounded-2xl border border-border bg-white p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                    {step.n}
                  </div>
                  {i < LAB_STEPS.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-[calc(100%+1rem)] bg-gradient-to-b from-fuchsia-300 to-transparent" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-fuchsia-500" />
                    <h4 className="text-base font-bold text-foreground">{step.title}</h4>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* All labs grid */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Otros laboratorios disponibles</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {LABS.map((lab, i) => {
            const cmap = {
              fuchsia: { bg: "from-fuchsia-500 to-pink-500", text: "text-fuchsia-700", border: "border-fuchsia-200" },
              emerald: { bg: "from-emerald-500 to-teal-500", text: "text-emerald-700", border: "border-emerald-200" },
            };
            const c = cmap[lab.color as "fuchsia" | "emerald"];
            return (
              <motion.div
                key={lab.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={lab.href}
                  className={`group block rounded-2xl border-2 ${c.border} bg-white p-5 hover:shadow-lg transition-all hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.bg} shadow-md`}>
                      <FlaskConical className="h-5 w-5 text-white" />
                    </div>
                    <span className={`text-xs font-semibold ${c.text}`}>{lab.subject}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground">{lab.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{lab.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:gap-2 transition-all">
                    Abrir laboratorio <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <CtaStrip
          title="¿Quieres más retos?"
          description="Prueba los retos de 5 minutos: quizzes rápidos con feedback pedagógico que te dan puntos para subir de nivel."
          primaryLabel="Ver retos"
          primaryHref="/retos"
          secondaryLabel="Ver mi progreso"
          secondaryHref="/progreso"
        />
      </div>
    </div>
  );
}
