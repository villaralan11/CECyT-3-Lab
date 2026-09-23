"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Atom, ArrowRight, Zap, TrendingUp, Crosshair } from "lucide-react";
import { PageHeader, Breadcrumb, CtaStrip } from "@/components/site/ui";

const SIMS = [
  {
    n: "01",
    name: "Cinemática · MRU",
    desc: "Movimiento Rectilíneo Uniforme. Velocidad constante, aceleración cero. Observa la pista, la gráfica x–t que crece en línea recta y comprueba que el área bajo v–t ES la distancia recorrida.",
    href: "/fisica/mru",
    icon: Zap,
    points: ["Vector velocidad sobre el auto", "Área sombreada bajo v-t = distancia", "Botones de paso (0.1 s)"],
  },
  {
    n: "02",
    name: "Cinemática · MRUV",
    desc: "Aceleración Constante. La gráfica x–t es una parábola y v–t una recta cuya pendiente ES la aceleración. Juega con frenados y arranques.",
    href: "/fisica/mruv",
    icon: TrendingUp,
    points: ["Distinción Acelerando/Frenando en vivo", "Vector velocidad con dirección correcta", "Área sombreada bajo v-t = Δx"],
  },
  {
    n: "03",
    name: "Los 3 tiros",
    desc: "Tiro Vertical, Horizontal y Parabólico. El mismo instrumento en 2D: lanza verticalmente, dispara en horizontal desde una altura o con cualquier ángulo.",
    href: "/fisica/tiros",
    icon: Crosshair,
    points: ["Vectores vₓ y vᵧ separados en vivo", "Marcadores de ápice y aterrizaje", "Tiempo de vuelo analítico"],
  },
];

export default function FisicaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Física" }]} />

      <PageHeader
        eyebrow="Materia"
        accent="emerald"
        title={
          <>
            Física ·{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Cinemática
            </span>
          </>
        }
        subtitle="Un solo laboratorio de cinemática con integración Euler-Cromer contrastada contra la solución analítica exacta: MRU, MRUV, tiro vertical, tiro horizontal y tiro parabólico en el mismo instrumento."
      />

      {/* Subject intro card */}
      <div className="mt-10 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg flex-shrink-0">
            <Atom className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">¿Qué vas a encontrar?</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tres simuladores interactivos con animación SVG en tiempo real, gráficas x–t y v–t
              con marcadores de tiempo actual, y áreas sombreadas que muestran visualmente el
              significado físico de pendientes e integrales. Cada simulador incluye botones de
              paso (avanzar/retroceder 0.1 s), readouts con fórmulas, e insights pedagógicos.
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
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center rounded-2xl border-2 border-emerald-100 bg-white p-5 hover:shadow-lg hover:border-emerald-300 transition-all"
            >
              <div className="md:col-span-1 flex md:justify-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
                  <sim.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-mono font-bold text-muted-foreground">Tema {sim.n}</span>
                <div className="mt-1 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
                  Simulador
                </div>
              </div>
              <div className="md:col-span-7">
                <h3 className="text-lg font-bold text-foreground">{sim.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{sim.desc}</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-700">
                  {sim.points.map((p) => (
                    <li key={p} className="inline-flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 flex md:justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all">
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
          description="Cada simulador es una página independiente con controles, gráficas en vivo y notas pedagógicas. También puedes probar los retos rápidos."
          primaryLabel="Empezar con MRU"
          primaryHref="/fisica/mru"
          secondaryLabel="Ver retos"
          secondaryHref="/retos"
        />
      </div>
    </div>
  );
}
