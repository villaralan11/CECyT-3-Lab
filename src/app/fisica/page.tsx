"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  AudioWaveform,
  Car,
  Crosshair,
  Droplets,
  Library,
  Magnet,
  Scale,
  Spline,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, Breadcrumb } from "@/components/site/ui";

type Sim = {
  name: string;
  desc: string;
  tag: string;
  href: string;
  icon: LucideIcon;
};

type Unit = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  theme: {
    icon: string;
    soft: string;
    dot: string;
    hover: string;
  };
  sims: Sim[];
};

const THEMES = {
  blue: {
    icon: "bg-gradient-to-br from-blue-500 to-indigo-500",
    soft: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    hover: "hover:border-blue-200",
  },
  emerald: {
    icon: "bg-gradient-to-br from-emerald-500 to-teal-500",
    soft: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    hover: "hover:border-emerald-200",
  },
  violet: {
    icon: "bg-gradient-to-br from-violet-500 to-purple-500",
    soft: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
    hover: "hover:border-violet-200",
  },
  amber: {
    icon: "bg-gradient-to-br from-amber-500 to-orange-500",
    soft: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    hover: "hover:border-amber-200",
  },
} as const;

const UNITS: Unit[] = [
  {
    id: "fisica-i",
    tag: "F1",
    title: "Física I",
    subtitle: "Cinemática y movimiento",
    theme: THEMES.blue,
    sims: [
      {
        name: "MRU y MRUV",
        desc: "Velocidad constante y aceleración: posición, velocidad y gráficas en vivo.",
        tag: "Cinemática",
        href: "/simuladores/01-Fisica-I/mru-mruv/index.html",
        icon: Car,
      },
      {
        name: "Tiro parabólico",
        desc: "Ángulo, rapidez y gravedad: acierta el blanco en Tierra, Luna y Marte.",
        tag: "Movimiento en 2D",
        href: "/simuladores/01-Fisica-I/tiro-parabolico/index.html",
        icon: Crosshair,
      },
    ],
  },
  {
    id: "fisica-ii",
    tag: "F2",
    title: "Física II",
    subtitle: "Fuerzas, energía y fluidos",
    theme: THEMES.emerald,
    sims: [
      {
        name: "Fuerzas y movimiento",
        desc: "Fricción, plano inclinado y diagramas de cuerpo libre.",
        tag: "Dinámica",
        href: "/simuladores/02-Fisica-II/fuerzas-y-movimiento/index.html",
        icon: Scale,
      },
      {
        name: "Colisiones",
        desc: "Choques entre carritos: momento y energía antes y después.",
        tag: "Momento lineal",
        href: "/simuladores/02-Fisica-II/colisiones/index.html",
        icon: ArrowLeftRight,
      },
      {
        name: "Energía del patinador",
        desc: "Energía potencial, cinética y calor en una pista curva.",
        tag: "Trabajo y energía",
        href: "/simuladores/02-Fisica-II/energia-patinador/index.html",
        icon: Activity,
      },
      {
        name: "Resortes y masas",
        desc: "Oscilaciones verticales: periodo, frecuencia y amortiguamiento.",
        tag: "Movimiento armónico",
        href: "/simuladores/02-Fisica-II/resortes-y-mas/index.html",
        icon: Spline,
      },
      {
        name: "Flotabilidad",
        desc: "Empuje, peso y densidad: ¿flota, se hunde o queda a medias?",
        tag: "Hidrostática",
        href: "/simuladores/02-Fisica-II/flotabilidad/index.html",
        icon: Droplets,
      },
      {
        name: "Gases y presión",
        desc: "Teoría cinética, émbolo y presión medida choque por choque.",
        tag: "Termodinámica",
        href: "/simuladores/02-Fisica-II/gases/index.html",
        icon: Wind,
      },
    ],
  },
  {
    id: "fisica-iii",
    tag: "F3",
    title: "Física III",
    subtitle: "Electricidad y magnetismo",
    theme: THEMES.violet,
    sims: [
      {
        name: "Cargas y campo",
        desc: "Superposición, líneas de campo, potencial y sonda de prueba.",
        tag: "Electrostática",
        href: "/simuladores/03-Fisica-III/cargas-y-campo/index.html",
        icon: Magnet,
      },
      {
        name: "Ley de Ohm",
        desc: "Circuitos en serie y paralelo con corriente animada.",
        tag: "Circuitos eléctricos",
        href: "/simuladores/03-Fisica-III/ley-de-ohm/index.html",
        icon: Zap,
      },
    ],
  },
  {
    id: "fisica-iv",
    tag: "F4",
    title: "Física IV",
    subtitle: "Ondas y fenómenos periódicos",
    theme: THEMES.amber,
    sims: [
      {
        name: "Ondas en cuerda",
        desc: "Ondas viajeras y estacionarias, nodos, vientres y resonancia.",
        tag: "Ondas mecánicas",
        href: "/simuladores/04-Fisica-IV/ondas-en-cuerda/index.html",
        icon: AudioWaveform,
      },
    ],
  },
];

const TOTAL_SIMS = UNITS.reduce((total, unit) => total + unit.sims.length, 0);

const simCount = (count: number) => (count === 1 ? "1 simulador" : `${count} simuladores`);

export default function FisicaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Física" }]} />

      <PageHeader
        eyebrow="Materia · 4 unidades"
        accent="emerald"
        title={
          <>
            Física ·{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              11 simuladores
            </span>
          </>
        }
        subtitle="Cinemática, fuerzas, energía, fluidos, electricidad y ondas en una biblioteca interactiva de Física I a IV. Sin conexión, sin cuentas y sin instalar nada."
      />

      {/* Unit index */}
      <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {UNITS.map((unit) => (
          <a
            key={unit.id}
            href={`#${unit.id}`}
            className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-black/[0.07] bg-white/75 p-3 shadow-[0_1px_2px_rgba(24,24,27,0.04)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white shadow-sm ${unit.theme.icon}`}
            >
              {unit.tag}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-foreground">
                {unit.title}
              </span>
              <span className="block text-[11px] text-muted-foreground">
                {simCount(unit.sims.length)}
              </span>
            </span>
          </a>
        ))}
      </div>

      {/* Library entry */}
      <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-600 shadow-sm">
            <Library className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground">
              Biblioteca completa, sin conexión
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
              Filtra por unidad, busca por tema y abre cada simulador con tema claro/oscuro y
              pantalla completa.
            </p>
          </div>
        </div>
        <a
          href="/simuladores/index.html"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-[12px] font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md hover:shadow-emerald-500/30 active:scale-95"
        >
          Abrir biblioteca
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Units */}
      <div className="mt-12 space-y-12 sm:space-y-14">
        {UNITS.map((unit, unitIndex) => (
          <motion.section
            key={unit.id}
            id={unit.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: unitIndex * 0.04 }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 border-b border-black/[0.06] pb-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[12px] font-bold text-white shadow-md ${unit.theme.icon}`}
              >
                {unit.tag}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h2 className="text-[20px] font-bold tracking-[-0.02em] text-foreground sm:text-[22px]">
                    {unit.title}
                  </h2>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {simCount(unit.sims.length)}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-muted-foreground sm:text-sm">
                  {unit.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {unit.sims.map((sim) => (
                <a
                  key={sim.href}
                  href={sim.href}
                  className={`group flex min-w-0 items-start gap-3.5 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_rgba(24,24,27,0.28)] ${unit.theme.hover}`}
                >
                  <span
                    className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${unit.theme.icon}`}
                  >
                    <sim.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0 text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-[15px]">
                        {sim.name}
                      </span>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-muted-foreground sm:text-[12.5px]">
                      {sim.desc}
                    </span>
                    <span
                      className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] ${unit.theme.soft}`}
                    >
                      <span className={`h-1 w-1 rounded-full ${unit.theme.dot}`} />
                      {sim.tag}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* CTA */}
      <div className="relative mt-16 overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 text-center sm:p-8">
        <div
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {TOTAL_SIMS} simuladores · 4 unidades
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ¿Listo para experimentar?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Abre la biblioteca completa para filtrar por unidad y buscar por tema. Cada simulador
            incluye controles, gráficas en vivo y una guía breve; también puedes probar los retos
            de 5 minutos.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <a
              href="/simuladores/index.html"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-emerald-500/40 active:translate-y-0 active:scale-95"
            >
              Abrir biblioteca
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/retos"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-emerald-300 hover:bg-emerald-50/40 active:scale-95"
            >
              Ver retos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
