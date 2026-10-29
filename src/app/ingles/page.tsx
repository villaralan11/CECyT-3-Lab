"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Clock,
  ExternalLink,
  Languages,
  MessageSquare,
  Repeat,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, Breadcrumb, CtaStrip } from "@/components/site/ui";

/* ------------------------------------------------------------------ carga diferida */

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

const VerbTensesTrainer = dynamic(() => import("@/components/simulators/verb-tenses-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const PassiveVoiceTrainer = dynamic(() => import("@/components/simulators/passive-voice-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const ModalVerbsTrainer = dynamic(() => import("@/components/simulators/modal-verbs-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const ReportedSpeechTrainer = dynamic(
  () => import("@/components/simulators/reported-speech-trainer"),
  { ssr: false, loading: () => <LabSkeleton /> },
);

/* ------------------------------------------------------------------ datos */

type Lab = {
  id: string;
  n: string;
  name: string;
  desc: string;
  tag: string;
  href: string;
  icon: LucideIcon;
  points: string[];
  component: ComponentType;
};

const LABS: Lab[] = [
  {
    id: "verb-tenses",
    n: "07",
    name: "Verb Tenses",
    desc: "Doce ejercicios de presente y pasado, simple y continuo, perfecto y condicionales de tiempo: la señal está en los marcadores («since», «last year», «look!»).",
    tag: "Tiempos verbales",
    href: "/ingles/verb-tenses",
    icon: Clock,
    points: ["12 ejercicios con marcadores", "Stats de aciertos", "Feedback con reglas"],
    component: VerbTensesTrainer,
  },
  {
    id: "passive-voice",
    n: "08",
    name: "Passive Voice",
    desc: "Transforma oraciones activas en pasivas y domina la estructura be + participio en todos los tiempos. El foco cambia: de quién hace a quién recibe.",
    tag: "Voz pasiva",
    href: "/ingles/passive-voice",
    icon: Repeat,
    points: ["8 transformaciones", "Casos especiales y modales", "Fórmula S + be + participio"],
    component: PassiveVoiceTrainer,
  },
  {
    id: "modal-verbs",
    n: "09",
    name: "Modal Verbs",
    desc: "must, can, might, should y compañía: obligación, prohibición, posibilidad, deducción y permiso. El matiz que cambia una recomendación en una norma de seguridad.",
    tag: "Modales",
    href: "/ingles/modal-verbs",
    icon: Sparkles,
    points: ["8 ejercicios contextualizados", "Escala de certeza", "must not vs don't have to"],
    component: ModalVerbsTrainer,
  },
  {
    id: "reported-speech",
    n: "10",
    name: "Reported Speech",
    desc: "Cuenta lo que alguien dijo sin citarlo: backshift de tiempos, ajuste de pronombres y marcadores (now→then), preguntas sin auxiliar e imperativos con to + infinitivo.",
    tag: "Estilo indirecto",
    href: "/ingles/reported-speech",
    icon: MessageSquare,
    points: ["8 transformaciones", "Tabla de backshift", "Marcadores temporales"],
    component: ReportedSpeechTrainer,
  },
];

const STORAGE_KEY = "cecyt3-ingles-open";

/* ------------------------------------------------------------------ página */

export default function InglesPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
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
    if (hash && LABS.some((lab) => lab.id === hash)) restored[hash] = true;

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
      if (!id || !LABS.some((lab) => lab.id === id)) return;
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

  const openCount = LABS.filter((lab) => open[lab.id]).length;

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
        subtitle="Los cuatro entrenadores de gramática en esta misma página. Despliega el tema que toca hoy y ciérralo al terminar: cada trainer se carga sólo cuando lo abres."
      />

      <div className="mt-10 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg flex-shrink-0">
            <Languages className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">¿Qué vas a encontrar?</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Cuatro trainers tipo quiz con feedback rico. Cada uno muestra estadísticas de
              aciertos, navegación por puntos numerados, opciones A/B/C/D, explicación tras cada
              respuesta y una nota con la regla general del tema. Al final, un resumen adaptativo
              te dice si dominas el tema o te conviene repasar.
            </p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="sticky top-20 z-20 mt-6 rounded-2xl border border-black/[0.07] bg-white/85 p-3 shadow-[0_8px_24px_-18px_rgba(24,24,27,0.35)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {openCount} abiertos · {LABS.length} trainers
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(Object.fromEntries(LABS.map((lab) => [lab.id, true])))}
              className="rounded-full border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition hover:border-amber-300 hover:bg-amber-50/50 active:scale-95"
            >
              Mostrar todos
            </button>
            <button
              type="button"
              onClick={() => setOpen({})}
              className="rounded-full border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition hover:border-amber-300 hover:bg-amber-50/50 active:scale-95"
            >
              Ocultar todos
            </button>
          </div>
        </div>
      </div>

      {/* Trainers */}
      <div className="mt-6 space-y-3">
        {LABS.map((lab) => {
          const isOpen = Boolean(open[lab.id]);
          return (
            <div
              key={lab.id}
              id={`lab-${lab.id}`}
              className={`scroll-mt-40 overflow-hidden rounded-2xl border-2 bg-white transition-shadow ${
                isOpen
                  ? "border-amber-200 ring-2 ring-amber-100 shadow-[0_18px_44px_-30px_rgba(24,24,27,0.5)]"
                  : "border-amber-100 hover:border-amber-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(lab.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${lab.id}`}
                className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-amber-50/30"
              >
                <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                  <lab.icon className="h-5 w-5 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        Tema {lab.n}
                      </span>
                      <span className="mt-0.5 block text-lg font-bold text-foreground">
                        {lab.name}
                      </span>
                    </span>
                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {lab.desc}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-amber-700">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-semibold uppercase tracking-[0.08em]">
                      <span className="h-1 w-1 rounded-full bg-amber-500" />
                      {lab.tag}
                    </span>
                    {lab.points.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-amber-400" />
                        {p}
                      </span>
                    ))}
                    <span className="text-muted-foreground">
                      {isOpen ? "· Cargado" : "· Se carga al abrir"}
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
                    <div className="border-t border-amber-100 bg-[#fffdfa]">
                      <div className="flex flex-wrap items-center justify-end gap-2 px-3 py-2">
                        <a
                          href={lab.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11.5px] font-semibold text-foreground transition hover:border-amber-300 hover:bg-amber-50/60"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Abrir aparte
                        </a>
                      </div>
                      <div className="px-3 pb-5 sm:px-5">
                        <lab.component />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <CtaStrip
          title="¿Listo para practicar?"
          description="Empieza por Verb Tenses si eres nuevo en los marcadores temporales. Cada trainer guarda tu progreso mientras navegas entre ejercicios."
          primaryLabel="Empezar con Verb Tenses"
          primaryHref="#verb-tenses"
          secondaryLabel="Ver retos"
          secondaryHref="/retos"
        />
      </div>
    </div>
  );
}
