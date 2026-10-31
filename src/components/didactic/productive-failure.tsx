"use client";

import { useState } from "react";
import { Lightbulb, Check, X, RotateCcw } from "lucide-react";

export type FailureItem = {
  question: string;
  options: string[];
  correct: number;
  reveal: string;
};

export function ProductiveFailureCard({
  data,
  accent = "fuchsia",
  onSolved,
}: {
  data: FailureItem;
  accent?: "fuchsia" | "emerald" | "amber";
  onSolved?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const pick = (i: number) => {
    if (answered) return;
    setSelected(i);
    onSolved?.();
  };

  const accentMap = {
    fuchsia: "from-fuchsia-500 to-pink-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-white to-pink-50 p-6 sm:p-7">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-400 opacity-15 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${accentMap[accent]} px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm`}>
          <Lightbulb size={12} /> 01 · Falla productiva
        </span>
        {answered && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            Intento registrado
          </span>
        )}
      </div>

      <p className="relative mt-4 text-xl font-bold leading-snug text-foreground sm:text-2xl">
        {data.question}
      </p>
      <p className="relative mt-2 text-sm text-muted-foreground">
        Responde con tu intuición — aún sin repasar. Equivocarte aquí es parte del método.
      </p>

      <div className="relative mt-5 grid gap-2.5">
        {data.options.map((opt, i) => {
          const isCorrect = i === data.correct;
          const isSelected = selected === i;
          let cls = "border-border bg-white hover:border-fuchsia-300 hover:bg-fuchsia-50/50 text-foreground";
          if (answered) {
            if (isCorrect) cls = "border-emerald-300 bg-emerald-50 text-emerald-800";
            else if (isSelected) cls = "border-rose-300 bg-rose-50 text-rose-800";
            else cls = "border-border bg-white text-muted-foreground opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={answered}
              className={`flex min-h-[44px] items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-[15px] font-medium transition ${cls}`}
            >
              <span>{opt}</span>
              {answered && isCorrect && <Check size={17} strokeWidth={3} className="text-emerald-600" />}
              {answered && isSelected && !isCorrect && <X size={17} strokeWidth={3} className="text-rose-600" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="relative mt-5 rounded-2xl border border-fuchsia-200 bg-white p-4 shadow-sm">
          <p className="text-sm leading-relaxed text-foreground">
            <b className={selected === data.correct ? "text-emerald-600" : "text-fuchsia-600"}>
              {selected === data.correct ? "¡Exacto! " : "No exactamente. "}
            </b>
            {data.reveal}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Ahora baja al simulador y comprueba con tus manos.</p>
            <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
