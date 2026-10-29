"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeftRight,
  ArrowUpRight,
  AudioWaveform,
  BookOpen,
  Car,
  ChevronDown,
  Crosshair,
  Droplets,
  FlaskConical,
  Languages,
  Magnet,
  Maximize2,
  Scale,
  Search,
  Spline,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, Breadcrumb, CtaStrip } from "@/components/site/ui";

/* ------------------------------------------------------------------ tipos */

type GroupId = "fisica-i" | "fisica-ii" | "fisica-iii" | "fisica-iv" | "quimica" | "ingles";
type ThemeId = "blue" | "emerald" | "violet" | "amber" | "fuchsia" | "sky";

type Lab = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  group: GroupId;
  href: string;
  icon: LucideIcon;
  kind: "iframe" | "component";
  /** Ruta pública del simulador standalone (kind = iframe). */
  src?: string;
  /** Componente React cargado sólo al abrir la sección (kind = component). */
  component?: ComponentType;
};

type Group = {
  id: GroupId;
  label: string;
  subtitle: string;
  theme: ThemeId;
};

/* ------------------------------------------------------------------ temas */

const THEMES: Record<
  ThemeId,
  { icon: string; soft: string; dot: string; ring: string; hover: string }
> = {
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
  fuchsia: {
    icon: "bg-gradient-to-br from-fuchsia-500 to-pink-500",
    soft: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    dot: "bg-fuchsia-500",
    ring: "ring-fuchsia-200",
    hover: "hover:border-fuchsia-200",
  },
  sky: {
    icon: "bg-gradient-to-br from-sky-500 to-cyan-500",
    soft: "border-sky-200 bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
    ring: "ring-sky-200",
    hover: "hover:border-sky-200",
  },
};

const GROUPS: Group[] = [
  { id: "fisica-i", label: "Física I", subtitle: "Cinemática y movimiento", theme: "blue" },
  { id: "fisica-ii", label: "Física II", subtitle: "Fuerzas, energía y fluidos", theme: "emerald" },
  { id: "fisica-iii", label: "Física III", subtitle: "Electricidad y magnetismo", theme: "violet" },
  { id: "fisica-iv", label: "Física IV", subtitle: "Ondas y fenómenos periódicos", theme: "amber" },
  { id: "quimica", label: "Química", subtitle: "Estequiometría, balanceo y nomenclatura", theme: "fuchsia" },
  { id: "ingles", label: "Inglés", subtitle: "Grammar trainers del plan DEMS", theme: "sky" },
];

/* ------------------------------------------------------------------ carga diferida */

const EstequiometriaSimulator = dynamic(
  () => import("@/components/simulators/estequiometria-simulator"),
  { ssr: false, loading: () => <LabSkeleton /> },
);
const BalanceoSimulator = dynamic(
  () => import("@/components/simulators/balanceo-simulator"),
  { ssr: false, loading: () => <LabSkeleton /> },
);
const IUPACTrainer = dynamic(() => import("@/components/simulators/iupac-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const VerbTensesTrainer = dynamic(() => import("@/components/simulators/verb-tenses-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const ModalVerbsTrainer = dynamic(() => import("@/components/simulators/modal-verbs-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const PassiveVoiceTrainer = dynamic(() => import("@/components/simulators/passive-voice-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const ReportedSpeechTrainer = dynamic(
  () => import("@/components/simulators/reported-speech-trainer"),
  { ssr: false, loading: () => <LabSkeleton /> },
);

/* ------------------------------------------------------------------ catálogo */

const LABS: Lab[] = [
  {
    id: "mru-mruv",
    title: "MRU y MRUV",
    desc: "Velocidad constante y aceleración: posición, velocidad y gráficas en vivo.",
    tag: "Cinemática",
    group: "fisica-i",
    href: "/simuladores/01-Fisica-I/mru-mruv/index.html",
    icon: Car,
    kind: "iframe",
    src: "/simuladores/01-Fisica-I/mru-mruv/index.html",
  },
  {
    id: "tiro-parabolico",
    title: "Tiro parabólico",
    desc: "Ángulo, rapidez y gravedad: acierta el blanco en Tierra, Luna y Marte.",
    tag: "Movimiento en 2D",
    group: "fisica-i",
    href: "/simuladores/01-Fisica-I/tiro-parabolico/index.html",
    icon: Crosshair,
    kind: "iframe",
    src: "/simuladores/01-Fisica-I/tiro-parabolico/index.html",
  },
  {
    id: "fuerzas-y-movimiento",
    title: "Fuerzas y movimiento",
    desc: "Fricción, plano inclinado y diagramas de cuerpo libre.",
    tag: "Dinámica",
    group: "fisica-ii",
    href: "/simuladores/02-Fisica-II/fuerzas-y-movimiento/index.html",
    icon: Scale,
    kind: "iframe",
    src: "/simuladores/02-Fisica-II/fuerzas-y-movimiento/index.html",
  },
  {
    id: "colisiones",
    title: "Colisiones",
    desc: "Choques entre carritos: momento y energía antes y después.",
    tag: "Momento lineal",
    group: "fisica-ii",
    href: "/simuladores/02-Fisica-II/colisiones/index.html",
    icon: ArrowLeftRight,
    kind: "iframe",
    src: "/simuladores/02-Fisica-II/colisiones/index.html",
  },
  {
    id: "energia-patinador",
    title: "Energía del patinador",
    desc: "Energía potencial, cinética y calor en una pista curva.",
    tag: "Trabajo y energía",
    group: "fisica-ii",
    href: "/simuladores/02-Fisica-II/energia-patinador/index.html",
    icon: Activity,
    kind: "iframe",
    src: "/simuladores/02-Fisica-II/energia-patinador/index.html",
  },
  {
    id: "resortes-y-mas",
    title: "Resortes y masas",
    desc: "Oscilaciones verticales: periodo, frecuencia y amortiguamiento.",
    tag: "Movimiento armónico",
    group: "fisica-ii",
    href: "/simuladores/02-Fisica-II/resortes-y-mas/index.html",
    icon: Spline,
    kind: "iframe",
    src: "/simuladores/02-Fisica-II/resortes-y-mas/index.html",
  },
  {
    id: "flotabilidad",
    title: "Flotabilidad",
    desc: "Empuje, peso y densidad: ¿flota, se hunde o queda a medias?",
    tag: "Hidrostática",
    group: "fisica-ii",
    href: "/simuladores/02-Fisica-II/flotabilidad/index.html",
    icon: Droplets,
    kind: "iframe",
    src: "/simuladores/02-Fisica-II/flotabilidad/index.html",
  },
  {
    id: "gases",
    title: "Gases y presión",
    desc: "Teoría cinética, émbolo y presión medida choque por choque.",
    tag: "Termodinámica",
    group: "fisica-ii",
    href: "/simuladores/02-Fisica-II/gases/index.html",
    icon: Wind,
    kind: "iframe",
    src: "/simuladores/02-Fisica-II/gases/index.html",
  },
  {
    id: "cargas-y-campo",
    title: "Cargas y campo",
    desc: "Superposición, líneas de campo, potencial y sonda de prueba.",
    tag: "Electrostática",
    group: "fisica-iii",
    href: "/simuladores/03-Fisica-III/cargas-y-campo/index.html",
    icon: Magnet,
    kind: "iframe",
    src: "/simuladores/03-Fisica-III/cargas-y-campo/index.html",
  },
  {
    id: "ley-de-ohm",
    title: "Ley de Ohm",
    desc: "Circuitos en serie y paralelo con corriente animada.",
    tag: "Circuitos eléctricos",
    group: "fisica-iii",
    href: "/simuladores/03-Fisica-III/ley-de-ohm/index.html",
    icon: Zap,
    kind: "iframe",
    src: "/simuladores/03-Fisica-III/ley-de-ohm/index.html",
  },
  {
    id: "ondas-en-cuerda",
    title: "Ondas en cuerda",
    desc: "Ondas viajeras y estacionarias, nodos, vientres y resonancia.",
    tag: "Ondas mecánicas",
    group: "fisica-iv",
    href: "/simuladores/04-Fisica-IV/ondas-en-cuerda/index.html",
    icon: AudioWaveform,
    kind: "iframe",
    src: "/simuladores/04-Fisica-IV/ondas-en-cuerda/index.html",
  },
  {
    id: "estequiometria",
    title: "Reactivo limitante",
    desc: "Predice qué reactivo se agota primero y calcula el rendimiento teórico con masas molares reales.",
    tag: "Estequiometría",
    group: "quimica",
    href: "/quimica/estequiometria",
    icon: FlaskConical,
    kind: "component",
    component: EstequiometriaSimulator,
  },
  {
    id: "balanceo",
    title: "Balanceo de combustiones",
    desc: "Ajusta coeficientes de combustiones con tabla de átomos en vivo.",
    tag: "Balanceo",
    group: "quimica",
    href: "/quimica/balanceo",
    icon: FlaskConical,
    kind: "component",
    component: BalanceoSimulator,
  },
  {
    id: "iupac",
    title: "Nomenclatura IUPAC",
    desc: "Fórmula ⇄ nombre en inorgánica y orgánica: 25 compuestos explicados.",
    tag: "Nomenclatura",
    group: "quimica",
    href: "/quimica/iupac",
    icon: FlaskConical,
    kind: "component",
    component: IUPACTrainer,
  },
  {
    id: "verb-tenses",
    title: "Verb Tenses",
    desc: "12 ejercicios de tiempos verbales con marcadores: since, last year, look!, yet, while.",
    tag: "Grammar",
    group: "ingles",
    href: "/ingles/verb-tenses",
    icon: Languages,
    kind: "component",
    component: VerbTensesTrainer,
  },
  {
    id: "modal-verbs",
    title: "Modal Verbs",
    desc: "Can, could, should, must, might: deducción, obligación y permiso en contexto.",
    tag: "Grammar",
    group: "ingles",
    href: "/ingles/modal-verbs",
    icon: Languages,
    kind: "component",
    component: ModalVerbsTrainer,
  },
  {
    id: "passive-voice",
    title: "Passive Voice",
    desc: "Transforma voz activa ⇄ pasiva con tiempos y sujetos agentes.",
    tag: "Grammar",
    group: "ingles",
    href: "/ingles/passive-voice",
    icon: Languages,
    kind: "component",
    component: PassiveVoiceTrainer,
  },
  {
    id: "reported-speech",
    title: "Reported Speech",
    desc: "Reporta declaraciones, preguntas y órdenes ajustando tiempos y pronombres.",
    tag: "Grammar",
    group: "ingles",
    href: "/ingles/reported-speech",
    icon: BookOpen,
    kind: "component",
    component: ReportedSpeechTrainer,
  },
];

const STORAGE_KEY = "cecyt3-labs-open";

/* ------------------------------------------------------------------ helpers */

function LabSkeleton() {
  return (
    <div className="space-y-3 p-4" aria-hidden="true">
      <div className="h-4 w-40 animate-pulse rounded bg-black/[0.06]" />
      <div className="h-3 w-full animate-pulse rounded bg-black/[0.05]" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-black/[0.05]" />
      <div className="h-40 w-full animate-pulse rounded-xl bg-black/[0.04]" />
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function LaboratoriosPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const pendingHash = useRef<string | null>(null);

  /* Restaurar secciones abiertas / deep-link #lab */
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    let restored: Record<string, boolean> = {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      restored = {};
    }
    if (hash && LABS.some((lab) => lab.id === hash)) {
      restored[hash] = true;
    } else if (Object.keys(restored).length === 0) {
      restored[LABS[0].id] = true;
    }
    pendingHash.current = hash || null;
    const frame = requestAnimationFrame(() => {
      setOpen(restored);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Persistir estado */
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(open));
    } catch {
      /* modo privado: ignorar */
    }
  }, [open, ready]);

  /* Desplazar a la sección del hash cuando ya está montada */
  useEffect(() => {
    if (!ready || !pendingHash.current) return;
    const id = pendingHash.current;
    pendingHash.current = null;
    const timer = window.setTimeout(() => {
      document.getElementById(`lab-${id}`)?.scrollIntoView({ block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [ready]);

  /* Cambiar de hash dentro de la página (p. ej. /laboratorios#iupac) abre esa sección */
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || !LABS.some((lab) => lab.id === id)) return;
      setOpen((prev) => ({ ...prev, [id]: true }));
      requestAnimationFrame(() => {
        document.getElementById(`lab-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const toggle = useCallback((id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LABS;
    return LABS.filter((lab) =>
      `${lab.title} ${lab.desc} ${lab.tag} ${GROUPS.find((g) => g.id === lab.group)?.label ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const openCount = LABS.filter((lab) => open[lab.id]).length;

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    filtered.forEach((lab) => {
      next[lab.id] = true;
    });
    setOpen(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Laboratorios" }]} />

      <PageHeader
        eyebrow="Guías prácticas"
        accent="fuchsia"
        title={
          <>
            Todos los laboratorios en{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              una sola página
            </span>
            .
          </>
        }
        subtitle="Abre sólo el laboratorio que necesitas: cada sección se carga al desplegarla, así la página arranca ligera y no se satura. Puedes cerrarla en cualquier momento y seguir con otra."
      />

      {/* Barra de control */}
      <div className="sticky top-20 z-20 mt-8 rounded-2xl border border-black/[0.07] bg-white/85 p-3 shadow-[0_8px_24px_-18px_rgba(24,24,27,0.35)] backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar laboratorio, tema o materia…"
              aria-label="Buscar laboratorio"
              className="w-full rounded-xl border border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:inline">
              {openCount} abiertos · {LABS.length} labs
            </span>
            <button
              type="button"
              onClick={expandAll}
              className="rounded-full border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition hover:border-fuchsia-300 hover:bg-fuchsia-50/50 active:scale-95"
            >
              Mostrar todos
            </button>
            <button
              type="button"
              onClick={() => setOpen({})}
              className="rounded-full border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition hover:border-fuchsia-300 hover:bg-fuchsia-50/50 active:scale-95"
            >
              Ocultar todos
            </button>
          </div>
        </div>
      </div>

      {/* Secciones */}
      <div className="mt-10 space-y-10">
        {GROUPS.map((group) => {
          const labs = filtered.filter((lab) => lab.group === group.id);
          if (labs.length === 0) return null;
          const theme = THEMES[group.theme];
          return (
            <section key={group.id} id={group.id} className="scroll-mt-40">
              <div className="flex items-center gap-3 border-b border-black/[0.06] pb-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold uppercase text-white shadow-sm ${theme.icon}`}
                >
                  {group.label.slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[19px] font-bold tracking-[-0.02em] text-foreground">
                    {group.label}
                  </h2>
                  <p className="text-[12.5px] text-muted-foreground">{group.subtitle}</p>
                </div>
                <span className={`ml-auto shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${theme.soft}`}>
                  {labs.length} {labs.length === 1 ? "lab" : "labs"}
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {labs.map((lab) => {
                  const isOpen = Boolean(open[lab.id]);
                  return (
                    <div
                      key={lab.id}
                      id={`lab-${lab.id}`}
                      className={`scroll-mt-40 overflow-hidden rounded-2xl border bg-white transition-shadow ${
                        isOpen
                          ? `border-black/[0.09] shadow-[0_18px_44px_-30px_rgba(24,24,27,0.5)] ring-2 ${theme.ring}`
                          : `border-black/[0.07] ${theme.hover}`
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(lab.id)}
                        aria-expanded={isOpen}
                        aria-controls={`panel-${lab.id}`}
                        className="flex w-full items-start gap-3.5 p-4 text-left transition hover:bg-black/[0.015]"
                      >
                        <span
                          className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${theme.icon}`}
                        >
                          <lab.icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-3">
                            <span className="min-w-0 text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-[15px]">
                              {lab.title}
                            </span>
                            <ChevronDown
                              className={`mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                          <span className="mt-1 block text-[12px] leading-relaxed text-muted-foreground sm:text-[12.5px]">
                            {lab.desc}
                          </span>
                          <span className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] ${theme.soft}`}
                            >
                              <span className={`h-1 w-1 rounded-full ${theme.dot}`} />
                              {lab.tag}
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
                            id={`panel-${lab.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-black/[0.06] bg-[#fbfbfd]">
                              <div className="flex flex-wrap items-center justify-end gap-2 px-3 py-2">
                                <a
                                  href={lab.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11.5px] font-semibold text-foreground transition hover:border-fuchsia-300 hover:bg-fuchsia-50/60"
                                >
                                  <Maximize2 className="h-3.5 w-3.5" />
                                  Abrir aparte
                                </a>
                              </div>

                              {lab.kind === "iframe" && lab.src ? (
                                <iframe
                                  key={lab.src}
                                  src={lab.src}
                                  title={`Laboratorio: ${lab.title}`}
                                  loading="lazy"
                                  allow="fullscreen"
                                  className="block h-[min(78vh,880px)] min-h-[520px] w-full border-0 bg-white"
                                />
                              ) : (
                                <div className="px-3 pb-4 sm:px-4">
                                  {lab.component ? <lab.component /> : <LabSkeleton />}
                                </div>
                              )}
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

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-foreground">Sin resultados para «{query}»</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Prueba con «ohm», «ondas», «estequiometría» o el nombre de la materia.
            </p>
          </div>
        )}
      </div>

      <div className="mt-14">
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
