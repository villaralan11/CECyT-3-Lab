"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, ArrowRight, Beaker, Calculator, Scale } from "lucide-react";
import { PageHeader, Breadcrumb, CtaStrip } from "@/components/site/ui";

const SIMS = [
  {
    n: "04",
    name: "Nomenclatura IUPAC",
    desc: "Entrenador bidireccional: te muestra la fórmula y eliges el nombre, o al revés. Óxidos, hidróxidos, ácidos y sales por el lado inorgánico; alcanos, alquenos, alcoholes, cetonas y ácidos por el orgánico.",
    href: "/quimica/iupac",
    icon: Beaker,
    points: ["25 compuestos con 9 categorías visuales", "Toggle Fórmula ⇄ Nombre", "Pistas + explicaciones pedagógicas"],
  },
  {
    n: "05",
    name: "Balanceo de ecuaciones",
    desc: "Ajusta coeficientes con steppers o escribe el número directamente. Observa la tabla de átomos equilibrarse en vivo. Combustiones de hidrocarburos y reacciones inorgánicas clásicas.",
    href: "/quimica/balanceo",
    icon: Scale,
    points: ["8 reacciones con input numérico editable", "Tabla con columna Δ (diferencia)", "Botón Ver solución + insights"],
  },
  {
    n: "06",
    name: "Estequiometría · Reactivo Limitante",
    desc: "De gramos a moles y de moles a producto: ajusta las masas de los reactivos, predice cuál se agota primero y calcula el rendimiento teórico con masas molares reales de la tabla periódica.",
    href: "/quimica/estequiometria",
    icon: Calculator,
    points: ["Tabla de conversión masa→mol→rondas", "Diagrama de flujo con flechas", "Marcas LIMITANTE / EN EXCESO"],
  },
];

export default function QuimicaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Química" }]} />

      <PageHeader
        eyebrow="Materia"
        accent="fuchsia"
        title={
          <>
            Química ·{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              IUPAC, Balanceo y Moles
            </span>
          </>
        }
        subtitle="Entrenador bidireccional IUPAC, balanceador de ecuaciones con conteo en vivo y laboratorio de estequiometría con masas molares reales de la tabla periódica."
      />

      {/* Subject intro card */}
      <div className="mt-10 rounded-2xl border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50 p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg flex-shrink-0">
            <FlaskConical className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">¿Qué vas a encontrar?</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tres simuladores con lógica estequiométrica real: parser de fórmulas que cuenta
              átomos correctamente (incluyendo paréntesis como (OH)₂), masas molares reales
              (H=1.008, O=15.999, etc.), y detección automática del reactivo limitante por
              el método de "rondas" (mol ÷ coeficiente).
            </p>
          </div>
        </div>
      </div>

      {/* Simulator list */}
      <div className="mt-10 space-y-4">
        {SIMS.map((sim, i) => (
          <motion.div
            key={sim.n}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              href={sim.href}
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center rounded-2xl border-2 border-fuchsia-100 bg-white p-5 hover:shadow-lg hover:border-fuchsia-300 transition-all"
            >
              <div className="md:col-span-1 flex md:justify-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-md">
                  <sim.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-mono font-bold text-muted-foreground">Tema {sim.n}</span>
                <div className="mt-1 inline-flex items-center rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 px-2.5 py-0.5 text-xs font-semibold">
                  Simulador
                </div>
              </div>
              <div className="md:col-span-7">
                <h3 className="text-lg font-bold text-foreground">{sim.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{sim.desc}</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fuchsia-700">
                  {sim.points.map((p) => (
                    <li key={p} className="inline-flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-fuchsia-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 flex md:justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 px-3 py-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all">
                  Abrir
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
        <CtaStrip
          title="¿Listo para experimentar?"
          description="Cada simulador es una página independiente. Te sugerimos empezar por IUPAC para dominar la nomenclatura antes de balancear y calcular moles."
          primaryLabel="Empezar con IUPAC"
          primaryHref="/quimica/iupac"
          secondaryLabel="Ver laboratorios"
          secondaryHref="/laboratorios"
        />
      </div>
    </div>
  );
}
