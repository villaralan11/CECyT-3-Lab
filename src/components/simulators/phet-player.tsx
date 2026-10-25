"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Loader2, RotateCcw } from "lucide-react";
import { phetEmbedUrl, phetSimPageUrl, type PhetSim } from "./phet-registry";

/**
 * Reproductor dialog de la biblioteca PhET.
 * Carga la simulación en su iframe oficial (hosteada en phet.colorado.edu)
 * con atribución visible y enlace a la página original.
 */
export function PhetPlayerDialog({
  sim,
  open,
  onOpenChange,
}: {
  sim: PhetSim | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [nonce, setNonce] = useState(0);

  // Reset al cerrar: la próxima apertura arranca limpia.
  useEffect(() => {
    if (!open) {
      setLoaded(false);
      setNonce(0);
    }
  }, [open]);

  if (!sim) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-4xl">
        <div className="flex items-start justify-between gap-3 pr-6">
          <div className="min-w-0">
            <DialogTitle className="text-lg font-bold text-foreground leading-tight">
              {sim.label}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {sim.desc}
            </DialogDescription>
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
            {sim.area}
          </span>
        </div>

        <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-black/5 bg-slate-100">
          <iframe
            key={`${sim.slug}-${nonce}`}
            src={phetEmbedUrl(sim.slug)}
            className="absolute inset-0 h-full w-full"
            title={`${sim.label} — simulación embebida de PhET`}
            loading="lazy"
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-sm text-muted-foreground">
                Cargando simulación…
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setLoaded(false);
              setNonce((n) => n + 1);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            Reiniciar
          </button>
          <span className="text-xs text-muted-foreground">
            Simulación de{" "}
            <a
              href={phetSimPageUrl(sim.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
            >
              PhET Interactive Simulations · University of Colorado Boulder
              <ExternalLink className="h-3 w-3" />
            </a>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
