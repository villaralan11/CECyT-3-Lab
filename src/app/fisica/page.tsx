"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  AudioWaveform,
  Car,
  ChevronDown,
  Crosshair,
  Droplets,
  ExternalLink,
  Magnet,
  Scale,
  Search,
  Spline,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, Breadcrumb } from "@/components/site/ui";

/* ------------------------------------------------------------------ datos */

type ThemeId = "blue" | "emerald" | "violet" | "amber";

type Sim = {
  id: string;
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
  theme: ThemeId;
  sims: Sim[];
};

const THEMES: Record<ThemeId, { icon: string; soft: string; dot: string; ring: string; hover: string }> = {
  blue: {
    icon: "bg-gradient-to-br from-blue-500 to-indigo-500",
    soft: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    ring: "ring-blue-200",
    hover: "hover:border-blue-200",
  },
  emerald: {
    icon: "bg-gradient-to-br from-emerald-500 to-teal-500",
    soft: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
    hover: "hover:border-emerald-200",
  },
  violet: {
    icon: "bg-gradient-to-br from-violet-500 to-purple-500",
    soft: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
    ring: "ring-violet-200",
    hover: "hover:border-violet-200",
  },
  amber: {
    icon: "bg-gradient-to-br from-amber-500 to-orange-500",
    soft: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    ring: "ring-amber-200",
    hover: "hover:border-amber-200",
  },
};

const UNITS: Unit[] = [
  {
    id: "fisica-i",
    tag: "F1",
    title: "Física I",
    subtitle: "Cinemática y movimiento",
    theme: "blue",
    sims: [
      {
        id: "mru-mruv",
        name: "MRU y MRUV",
        desc: "Velocidad constante y aceleración: posición, velocidad y gráficas en vivo.",
        tag: "Cinemática",
        href: "/simuladores/01-Fisica-I/mru-mruv/index.html",
        icon: Car,
      },
      {
        id: "tiro-parabolico",
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
    theme: "emerald",
    sims: [
      {
        id: "fuerzas-y-movimiento",
        name: "Fuerzas y movimiento",
        desc: "Fricción, plano inclinado y diagramas de cuerpo libre.",
        tag: "Dinámica",
        href: "/simuladores/02-Fisica-II/fuerzas-y-movimiento/index.html",
        icon: Scale,
      },
      {
        id: "colisiones",
        name: "Colisiones",
        desc: "Choques entre carritos: momento y energía antes y después.",
        tag: "Momento lineal",
        href: "/simuladores/02-Fisica-II/colisiones/index.html",
        icon: ArrowLeftRight,
      },
      {
        id: "energia-patinador",
        name: "Energía del patinador",
        desc: "Energía potencial, cinética y calor en una pista curva.",
        tag: "Trabajo y energía",
        href: "/simuladores/02-Fisica-II/energia-patinador/index.html",
        icon: Activity,
      },
      {
        id: "resortes-y-mas",
        name: "Resortes y masas",
        desc: "Oscilaciones verticales: periodo, frecuencia y amortiguamiento.",
        tag: "Movimiento armónico",
        href: "/simuladores/02-Fisica-II/resortes-y-mas/index.html",
        icon: Spline,
      },
      {
        id: "flotabilidad",
        name: "Flotabilidad",
        desc: "Empuje, peso y densidad: ¿flota, se hunde o queda a medias?",
        tag: "Hidrostática",
        href: "/simuladores/02-Fisica-II/flotabilidad/index.html",
        icon: Droplets,
      },
      {
        id: "gases",
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
    theme: "violet",
    sims: [
      {
        id: "cargas-y-campo",
        name: "Cargas y campo",
        desc: "Superposición, líneas de campo, potencial y sonda de prueba.",
        tag: "Electrostática",
        href: "/simuladores/03-Fisica-III/cargas-y-campo/index.html",
        icon: Magnet,
      },
      {
        id: "ley-de-ohm",
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
    theme: "amber",
    sims: [
      {
        id: "ondas-en-cuerda",
        name: "Ondas en cuerda",
        desc: "Ondas viajeras y estacionarias, nodos, vientres y resonancia.",
        tag: "Ondas mecánicas",
        href: "/simuladores/04-Fisica-IV/ondas-en-cuerda/index.html",
        icon: AudioWaveform,
      },
    ],
  },
];

const ALL_SIMS = UNITS.flatMap((unit) => unit.sims);
const STORAGE_KEY = "cecyt3-fisica-open";

/* ------------------------------------------------------------------ página */

export default function FisicaPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let restored: Record<string, boolean> = {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      restored = {};
    }
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && ALL_SIMS.some((sim) => sim.id === hash)) restored[hash] = true;

    const frame = requestAnimationFrame(() => {
      setOpen(restored);
      setReady(true);
      if (hash) {
        window.setTimeout(() => {
          document.getElementById(`lab-${hash}`)?.scrollIntoView({ block: "start" });
        }, 80);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(open));
    } catch {
      /* modo privado */
    }
  }, [open, ready]);

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || !ALL_SIMS.some((sim) => sim.id === id)) return;
      setOpen((prev) => ({ ...prev, [id]: true }));
      window.setTimeout(() => {
        document.getElementById(`lab-${id}`)?.scrollIntoView({ block: "start" });
      }, 80);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const toggle = useCallback((id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const matches = useCallback(
    (sim: Sim) => {
      const q = query.trim().toLowerCase();
      return !q || `${sim.name} ${sim.desc} ${sim.tag}`.toLowerCase().includes(q);
    },
    [query],
  );

  const visibleUnits = useMemo(
    () =>
      UNITS.map((unit) => ({ ...unit, sims: unit.sims.filter(matches) })).filter(
        (unit) => unit.sims.length > 0,
      ),
    [matches],
  );

  const openCount = ALL_SIMS.filter((sim) => open[sim.id]).length;

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
        subtitle="Los 11 laboratorios de Física I a IV en esta misma página: abre sólo el que necesitas y ciérralo al terminar. Cada simulador se carga en el momento en que lo despliegas, así la página arranca ligera."
      />

      {/* Controles */}
      <div className="sticky top-20 z-20 mt-8 rounded-2xl border border-black/[0.07] bg-white/85 p-3 shadow-[0_8px_24px_-18px_rgba(24,24,27,0.35)] backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar simulador o tema…"
              aria-label="Buscar simulador"
              className="w-full rounded-xl border border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:inline">
              {openCount} abiertos · {ALL_SIMS.length} labs
            </span>
            <button
              type="button"
              onClick={() =>
                setOpen(
                  Object.fromEntries(
                    visibleUnits.flatMap((u) => u.sims).map((sim) => [sim.id, true]),
                  ),
                )
              }
              className="rounded-full border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-95"
            >
              Mostrar todos
            </button>
            <button
              type="button"
              onClick={() => setOpen({})}
              className="rounded-full border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-95"
            >
              Ocultar todos
            </button>
          </div>
        </div>
      </div>

      {/* Unidades */}
      <div className="mt-10 space-y-10">
        {visibleUnits.map((unit) => {
          const theme = THEMES[unit.theme];
          return (
            <section key={unit.id} id={unit.id} className="scroll-mt-40">
              <div className="flex items-center gap-3 border-b border-black/[0.06] pb-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white shadow-sm ${theme.icon}`}
                >
                  {unit.tag}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[19px] font-bold tracking-[-0.02em] text-foreground">
                    {unit.title}
                  </h2>
                  <p className="text-[12.5px] text-muted-foreground">{unit.subtitle}</p>
                </div>
                <span
                  className={`ml-auto shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${theme.soft}`}
                >
                  {unit.sims.length} {unit.sims.length === 1 ? "lab" : "labs"}
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {unit.sims.map((sim) => {
                  const isOpen = Boolean(open[sim.id]);
                  return (
                    <div
                      key={sim.id}
                      id={`lab-${sim.id}`}
                      className={`scroll-mt-40 overflow-hidden rounded-2xl border bg-white transition-shadow ${
                        isOpen
                          ? `border-black/[0.09] shadow-[0_18px_44px_-30px_rgba(24,24,27,0.5)] ring-2 ${theme.ring}`
                          : `border-black/[0.07] ${theme.hover}`
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(sim.id)}
                        aria-expanded={isOpen}
                        aria-controls={`panel-${sim.id}`}
                        className="flex w-full items-start gap-3.5 p-4 text-left transition hover:bg-black/[0.015]"
                      >
                        <span
                          className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${theme.icon}`}
                        >
                          <sim.icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-3">
                            <span className="min-w-0 text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-[15px]">
                              {sim.name}
                            </span>
                            <ChevronDown
                              className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                          <span className="mt-1 block text-[12px] leading-relaxed text-muted-foreground sm:text-[12.5px]">
                            {sim.desc}
                          </span>
                          <span className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] ${theme.soft}`}
                            >
                              <span className={`h-1 w-1 rounded-full ${theme.dot}`} />
                              {sim.tag}
                            </span>
                            <span className="text-[10.5px] text-muted-foreground">
                              {isOpen ? "Cargado" : "Se carga al abrir"}
                            </span>
                          </span>
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="panel"
                            id={`panel-${sim.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-black/[0.06] bg-[#fbfbfd]">
                              <div className="flex flex-wrap items-center justify-end gap-2 px-3 py-2">
                                <a
                                  href={sim.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11.5px] font-semibold text-foreground transition hover:border-emerald-300 hover:bg-emerald-50/60"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Abrir aparte
                                </a>
                              </div>
                              <iframe
                                src={sim.href}
                                title={`Simulador: ${sim.name}`}
                                loading="lazy"
                                allow="fullscreen"
                                className="block h-[min(78vh,880px)] min-h-[520px] w-full border-0 bg-white"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {visibleUnits.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-foreground">Sin resultados para «{query}»</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Prueba con «ohm», «ondas», «gases» o el nombre de la unidad.
            </p>
          </div>
        )}
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
            {ALL_SIMS.length} simuladores · 4 unidades
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ¿Listo para experimentar?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Elige un simulador de la unidad que estés cursando. Cada uno incluye controles,
            gráficas en vivo y una guía breve; si quieres medirte, prueba los retos de 5 minutos.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/retos"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-emerald-500/40 active:translate-y-0 active:scale-95"
            >
              Ver retos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/progreso"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-emerald-300 hover:bg-emerald-50/40 active:scale-95"
            >
              Mi progreso
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
