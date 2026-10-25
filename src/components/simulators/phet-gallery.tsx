"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Atom,
  CircuitBoard,
  ExternalLink,
  Rocket,
  Search,
  Sun,
  Thermometer,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhetPlayerDialog } from "./phet-player";
import { PHET_AREAS, PHET_SIMS, type PhetArea, type PhetSim } from "./phet-registry";

const AREA_ICONS: Record<PhetArea, ComponentType<{ className?: string }>> = {
  Mecánica: Rocket,
  Oscilaciones: Activity,
  Energía: Zap,
  "Fluidos y termodinámica": Thermometer,
  "Ondas y sonido": Waves,
  Óptica: Sun,
  "Electricidad y magnetismo": CircuitBoard,
  "Física moderna": Atom,
};

export function PhetGallery() {
  const [area, setArea] = useState<PhetArea | "Todas">("Todas");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<PhetSim | null>(null);
  const [open, setOpen] = useState(false);

  const sims = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PHET_SIMS.filter((s) => {
      if (area !== "Todas" && s.area !== area) return false;
      if (!needle) return true;
      return s.label.toLowerCase().includes(needle) || s.desc.toLowerCase().includes(needle);
    });
  }, [area, q]);

  const openSim = (s: PhetSim) => {
    setSel(s);
    setOpen(true);
  };

  return (
    <>
      {/* Filtros por área + búsqueda */}
      <div className="mt-10 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={area === "Todas"} onClick={() => setArea("Todas")}>
            Todas ({PHET_SIMS.length})
          </FilterChip>
          {PHET_AREAS.map((a) => (
            <FilterChip key={a} active={area === a} onClick={() => setArea(a)}>
              {a} ({PHET_SIMS.filter((s) => s.area === a).length})
            </FilterChip>
          ))}
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar simulación por nombre o tema…"
            className="w-full rounded-full border border-border bg-white py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-300 transition"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cuadrícula de simulaciones */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sims.map((s, i) => {
          const Icon = AREA_ICONS[s.area];
          return (
            <motion.button
              key={s.slug}
              type="button"
              onClick={() => openSim(s)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.05 }}
              className="group rounded-2xl border-2 border-emerald-100 bg-white p-4 text-left hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="text-xs text-muted-foreground">{s.area}</span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">{s.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {s.desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:gap-2 transition-all">
                Abrir simulación
                <ExternalLink className="h-3 w-3" />
              </span>
            </motion.button>
          );
        })}
      </div>

      {sims.length === 0 && (
        <div className="mt-6 rounded-2xl border-2 border-emerald-100 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-foreground">
            No hay simulaciones que coincidan con el filtro.
          </p>
          <button
            type="button"
            onClick={() => {
              setArea("Todas");
              setQ("");
            }}
            className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <PhetPlayerDialog sim={sel} open={open} onOpenChange={setOpen} />
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95",
        active
          ? "border-emerald-600 bg-emerald-600 text-white shadow"
          : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
      )}
    >
      {children}
    </button>
  );
}
