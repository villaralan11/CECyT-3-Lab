"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { Atom, FlaskConical, Languages, Loader2 } from "lucide-react";

// Lazy-load each simulator to keep the initial bundle small
const MRU = dynamic(() => import("./mru-simulator"), { loading: () => <Loading /> });
const MRUV = dynamic(() => import("./mruv-simulator"), { loading: () => <Loading /> });
const Tiros = dynamic(() => import("./tiros-simulator"), { loading: () => <Loading /> });
const IUPAC = dynamic(() => import("./iupac-trainer"), { loading: () => <Loading /> });
const Balanceo = dynamic(() => import("./balanceo-simulator"), { loading: () => <Loading /> });
const Estequiometria = dynamic(() => import("./estequiometria-simulator"), { loading: () => <Loading /> });
const VerbTenses = dynamic(() => import("./verb-tenses-trainer"), { loading: () => <Loading /> });
const PassiveVoice = dynamic(() => import("./passive-voice-trainer"), { loading: () => <Loading /> });
const ModalVerbs = dynamic(() => import("./modal-verbs-trainer"), { loading: () => <Loading /> });
const ReportedSpeech = dynamic(() => import("./reported-speech-trainer"), { loading: () => <Loading /> });

function Loading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-fuchsia-500" />
      <span className="ml-2 text-sm text-muted-foreground">Cargando simulador…</span>
    </div>
  );
}

export type SimId =
  | "mru"
  | "mruv"
  | "tiros"
  | "iupac"
  | "balanceo"
  | "estequiometria"
  | "verb-tenses"
  | "passive-voice"
  | "modal-verbs"
  | "reported-speech";

const SIM_META: Record<SimId, { title: string; subject: "fisica" | "quimica" | "ingles" }> = {
  mru: { title: "MRU · Movimiento Rectilíneo Uniforme", subject: "fisica" },
  mruv: { title: "MRUV · Aceleración Constante", subject: "fisica" },
  tiros: { title: "Los 3 Tiros · Cinemática 2D", subject: "fisica" },
  iupac: { title: "Nomenclatura IUPAC", subject: "quimica" },
  balanceo: { title: "Balanceo de Ecuaciones", subject: "quimica" },
  estequiometria: { title: "Estequiometría · Reactivo Limitante", subject: "quimica" },
  "verb-tenses": { title: "Grammar · Verb Tenses", subject: "ingles" },
  "passive-voice": { title: "Grammar · Passive Voice", subject: "ingles" },
  "modal-verbs": { title: "Grammar · Modal Verbs", subject: "ingles" },
  "reported-speech": { title: "Grammar · Reported Speech", subject: "ingles" },
};

function SubjectBadge({ subject }: { subject: "fisica" | "quimica" | "ingles" }) {
  const map = {
    fisica: { Icon: Atom, label: "Física", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    quimica: { Icon: FlaskConical, label: "Química", cls: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
    ingles: { Icon: Languages, label: "Inglés", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  };
  const { Icon, label, cls } = map[subject];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export function SimulatorDialog({
  simId,
  onClose,
}: {
  simId: SimId | null;
  onClose: () => void;
}) {
  const open = simId !== null;
  const meta = simId ? SIM_META[simId] : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-5xl w-[calc(100%-2rem)] sm:w-full max-h-[92vh] p-0 overflow-hidden gap-0"
        showCloseButton
      >
        <DialogTitle className="sr-only">
          {meta?.title ?? "Simulador"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Simulador interactivo de {meta?.title}. Ajusta las variables, observa las
          gráficas y experimenta con el método falla productiva → simulador → ejemplo.
        </DialogDescription>
        {/* Header strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-gradient-to-r from-secondary/60 to-secondary/30">
          <div className="flex items-center gap-3">
            {meta && <SubjectBadge subject={meta.subject} />}
            <div className="text-sm font-bold text-foreground">{meta?.title}</div>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground hidden sm:inline">
            Simulador interactivo
          </span>
        </div>
        {/* Body */}
        <ScrollArea className="max-h-[80vh]">
          <div className="p-5 sm:p-6">
            {simId === "mru" && <MRU />}
            {simId === "mruv" && <MRUV />}
            {simId === "tiros" && <Tiros />}
            {simId === "iupac" && <IUPAC />}
            {simId === "balanceo" && <Balanceo />}
            {simId === "estequiometria" && <Estequiometria />}
            {simId === "verb-tenses" && <VerbTenses />}
            {simId === "passive-voice" && <PassiveVoice />}
            {simId === "modal-verbs" && <ModalVerbs />}
            {simId === "reported-speech" && <ReportedSpeech />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
