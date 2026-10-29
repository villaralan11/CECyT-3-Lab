"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Beaker,
  Calculator,
  ChevronDown,
  ExternalLink,
  FlaskConical,
  Scale,
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

const IUPACTrainer = dynamic(() => import("@/components/simulators/iupac-trainer"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const BalanceoSimulator = dynamic(() => import("@/components/simulators/balanceo-simulator"), {
  ssr: false,
  loading: () => <LabSkeleton />,
});
const EstequiometriaSimulator = dynamic(
  () => import("@/components/simulators/estequiometria-simulator"),
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
    id: "iupac",
    n: "04",
    name: "Nomenclatura IUPAC",
    desc: "Entrenador bidireccional: te muestra la fórmula y eliges el nombre, o al revés. Óxidos, hidróxidos, ácidos y sales por el lado inorgánico; alcanos, alquenos, alcoholes y ácidos por el orgánico.",
    tag: "Nomenclatura",
    href: "/quimica/iupac",
    icon: Beaker,
    points: ["24 compuestos con 9 categorías", "Toggle Fórmula ⇄ Nombre", "Pistas + explicaciones"],
    component: IUPACTrainer,
  },
  {
    id: "balanceo",
    n: "05",
    name: "Balanceo de ecuaciones",
    desc: "Ajusta coeficientes con steppers o escribe el número directamente y observa la tabla de átomos equilibrarse en vivo. Combustiones de hidrocarburos y reacciones inorgánicas clásicas.",
    tag: "Balanceo",
    href: "/quimica/balanceo",
    icon: Scale,
    points: ["8 reacciones con input editable", "Tabla con columna Δ", "Ver solución + insights"],
    component: BalanceoSimulator,
  },
  {
    id: "estequiometria",
    n: "06",
    name: "Estequiometría · Reactivo limitante",
    desc: "De gramos a moles y de moles a producto: ajusta las masas de los reactivos, predice cuál se agota primero y calcula el rendimiento teórico con masas molares reales.",
    tag: "Estequiometría",
    href: "/quimica/estequiometria",
    icon: Calculator,
    points: ["Tabla masa→mol→rondas", "Diagrama de flujo", "Marcas LIMITANTE / EN EXCESO"],
    component: EstequiometriaSimulator,
  },
];

const STORAGE_KEY = "cecyt3-quimica-open";

/* ------------------------------------------------------------------ página */

export default function QuimicaPage() {
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
        subtitle="Los tres laboratorios de Química en esta misma página. Despliega el que vayas a usar: el entrenador se carga en ese momento, no al entrar, y puedes cerrarlo para seguir con otro."
      />

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
              (H=1.008, O=15.999, etc.) y detección automática del reactivo limitante por el
              método de «rondas» (mol ÷ coeficiente).
            </p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="sticky top-20 z-20 mt-6 rounded-2xl border border-black/[0.07] bg-white/85 p-3 shadow-[0_8px_24px_-18px_rgba(24,24,27,0.35)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {openCount} abiertos · {LABS.length} laboratorios
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(Object.fromEntries(LABS.map((lab) => [lab.id, true])))}
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

      {/* Laboratorios */}
      <div className="mt-6 space-y-3">
        {LABS.map((lab) => {
          const isOpen = Boolean(open[lab.id]);
          return (
            <div
              key={lab.id}
              id={`lab-${lab.id}`}
              className={`scroll-mt-40 overflow-hidden rounded-2xl border-2 bg-white transition-shadow ${
                isOpen
                  ? "border-fuchsia-200 ring-2 ring-fuchsia-100 shadow-[0_18px_44px_-30px_rgba(24,24,27,0.5)]"
                  : "border-fuchsia-100 hover:border-fuchsia-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(lab.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${lab.id}`}
                className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-fuchsia-50/30"
              >
                <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-md">
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
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-fuchsia-700">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2 py-0.5 font-semibold uppercase tracking-[0.08em]">
                      <span className="h-1 w-1 rounded-full bg-fuchsia-500" />
                      {lab.tag}
                    </span>
                    {lab.points.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-fuchsia-400" />
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
                    <div className="border-t border-fuchsia-100 bg-[#fdfbfd]">
                      <div className="flex flex-wrap items-center justify-end gap-2 px-3 py-2">
                        <a
                          href={lab.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11.5px] font-semibold text-foreground transition hover:border-fuchsia-300 hover:bg-fuchsia-50/60"
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
          title="¿Listo para experimentar?"
          description="Te sugerimos empezar por IUPAC para dominar la nomenclatura antes de balancear y calcular moles."
          primaryLabel="Empezar con IUPAC"
          primaryHref="#iupac"
          secondaryLabel="Ver laboratorios"
          secondaryHref="/laboratorios"
        />
      </div>
    </div>
  );
}
