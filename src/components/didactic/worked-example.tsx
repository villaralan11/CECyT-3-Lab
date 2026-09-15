"use client";

import { useState } from "react";
import { BookOpen, Check, Lock, RotateCcw, ChevronRight } from "lucide-react";

export type WorkedStep = {
  title: string;
  math: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type WorkedExampleData = {
  title: string;
  problem: string;
  steps: WorkedStep[];
};

export function WorkedExampleCard({
  data,
  accent = "fuchsia",
}: {
  data: WorkedExampleData;
  accent?: "fuchsia" | "emerald" | "amber";
}) {
  const [visible, setVisible] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [wrong, setWrong] = useState<Record<number, boolean>>({});

  const steps = data.steps;
  const total = steps.length;
  const finished = visible >= total;

  const choose = (idx: number, opt: number) => {
    if (visible !== idx) return;
    const isCorrect = steps[idx].correct === opt;
    setAnswers((a) => ({ ...a, [idx]: opt }));
    setWrong((w) => ({ ...w, [idx]: !isCorrect }));
    if (isCorrect) setVisible(idx + 1);
  };

  const restart = () => {
    setVisible(0);
    setAnswers({});
    setWrong({});
  };

  const accentGrad = {
    fuchsia: "from-fuchsia-500 to-pink-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
  }[accent];

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-white p-6 sm:p-7 shadow-sm">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-400 opacity-10 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${accentGrad} px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm`}>
          <BookOpen size={12} /> 03 · Ejemplo resuelto
        </span>
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          paso {Math.min(visible + (finished ? 0 : 1), total)} / {total}
        </span>
      </div>

      <p className="relative mt-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">{data.title}</p>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{data.problem}</p>

      <ol className="relative mt-6 space-y-4">
        {steps.map((st, i) => {
          const locked = i > visible;
          const isCurrent = i === visible;
          const isDone = i < visible;

          if (locked) {
            return (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/40 px-5 py-4 text-sm text-muted-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary border">
                  <Lock size={13} />
                </span>
                <span className="font-medium">Paso {i + 1} · {st.title}</span>
              </li>
            );
          }

          return (
            <li key={i} className={`rounded-2xl border-2 p-5 ${isDone ? "border-emerald-200 bg-emerald-50/50" : "border-fuchsia-200 bg-fuchsia-50/40"}`}>
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold text-white bg-gradient-to-br ${isDone ? "from-emerald-500 to-teal-500" : accentGrad}`}>
                  {isDone ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                <h4 className="text-[15px] font-bold text-foreground">{st.title}</h4>
              </div>

              <p className="mt-3 rounded-xl bg-white border border-border px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground">
                {st.math}
              </p>

              {isCurrent ? (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">Antes de avanzar — {st.prompt}</p>
                  <div className="mt-3 grid gap-2">
                    {st.options.map((opt, j) => {
                      const chosen = answers[i] === j;
                      const showWrong = wrong[i] && chosen;
                      return (
                        <button
                          key={j}
                          onClick={() => choose(i, j)}
                          className={`flex min-h-[44px] items-center rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition ${showWrong ? "border-rose-300 bg-rose-50 text-rose-800" : "border-border bg-white hover:border-fuchsia-300 hover:bg-fuchsia-50/50 text-foreground"}`}
                        >
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full border mr-3 text-[11px] font-bold ${showWrong ? "border-rose-300 text-rose-700" : "border-muted-foreground/30 text-muted-foreground"}`}>
                            {String.fromCharCode(65 + j)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {wrong[i] && <p className="mt-2 text-xs text-rose-600">No exactamente — revisa la pista y vuelve a intentar.</p>}
                </div>
              ) : (
                <div className="mt-3 rounded-xl bg-white border border-emerald-200 p-3 text-sm text-emerald-800">
                  <strong>✓</strong> {st.explanation}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {finished && (
        <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4">
          <div className="text-sm font-semibold text-emerald-800">¡Ejemplo completado! Ya puedes explicar cada paso.</div>
          <button onClick={restart} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
            <RotateCcw className="h-3 w-3" /> Repetir
          </button>
        </div>
      )}

      {!finished && visible > 0 && (
        <div className="mt-4 flex justify-end">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronRight className="h-3 w-3" /> Responde para desbloquear el siguiente paso
          </span>
        </div>
      )}
    </div>
  );
}
