"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Lightbulb,
  Trophy,
  Sparkles,
} from "lucide-react";
import { SimHeader, Insight } from "./shared";
import { cn } from "@/lib/utils";
import { isCorrectEnglish } from "@/lib/nlp";

export type QItem = {
  prompt: string;
  type: "blank" | "transform" | "write";
  sentence?: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
  extra?: string; // extra context shown after answering
  accepted?: string[]; // variaciones aceptadas para write (tolerante)
  placeholder?: string;
};

export function QuizTrainer({
  title,
  description,
  badge,
  items,
  accentColor = "amber",
  intro,
}: {
  title: string;
  description: string;
  badge: string;
  items: QItem[];
  accentColor?: "amber" | "fuchsia" | "emerald";
  intro?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<(boolean | null)[]>(items.map(() => null));
  const [showHint, setShowHint] = useState(false);

  const item = items[idx];
  const total = items.length;
  const [writeValue, setWriteValue] = useState("");
  const isWriteMode = item.type === "write";

  const score = results.filter((r) => r === true).length;
  const answered = results.filter((r) => r !== null).length;

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setResults((r) => {
      const next = [...r];
      next[idx] = i === item.correct;
      return next;
    });
  };

  const goto = (i: number) => {
    if (i < 0 || i >= total) return;
    setIdx(i);
    setPicked(results[i] !== null ? items[i].correct : null); // if already answered, keep showing as answered
    // Actually we need to track the picked index separately - let me redo
    setShowHint(false);
  };

  const next = () => {
    if (idx < total - 1) {
      setIdx(idx + 1);
      setPicked(null);
      setWriteValue("");
      setShowHint(false);
    }
  };

  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setPicked(null);
      setWriteValue("");
      setShowHint(false);
    }
  };

  const reset = () => {
    setIdx(0);
    setPicked(null);
    setWriteValue("");
    setResults(items.map(() => null));
    setShowHint(false);
    setPickedHistory(items.map(() => null));
  };

  // For showing picked, we need to track which option user picked (not just correct/incorrect)
  // Let me track separately
  const [pickedHistory, setPickedHistory] = useState<(number | null)[]>(items.map(() => null));

  const onPickV2 = (i: number) => {
    if (pickedHistory[idx] !== null) return;
    setPickedHistory((h) => {
      const next = [...h];
      next[idx] = i;
      return next;
    });
    setResults((r) => {
      const next = [...r];
      next[idx] = i === item.correct;
      return next;
    });
    setPicked(i);
  };

  const onSubmitWrite = () => {
    if (pickedHistory[idx] !== null || !writeValue.trim()) return;
    const expected = item.accepted ?? [item.options[item.correct]];
    const correct = isCorrectEnglish(writeValue, expected);
    setPickedHistory((h) => {
      const next = [...h];
      next[idx] = correct ? item.correct : -1;
      return next;
    });
    setResults((r) => {
      const next = [...r];
      next[idx] = correct;
      return next;
    });
    setPicked(correct ? item.correct : -1);
  };

  const gotoV2 = (i: number) => {
    if (i < 0 || i >= total) return;
    setIdx(i);
    setPicked(pickedHistory[i]);
    setWriteValue("");
    setShowHint(false);
  };

  const accentMap = {
    amber: {
      text: "text-amber-600",
      bgSoft: "bg-amber-50",
      border: "border-amber-200",
      gradient: "from-amber-400 to-orange-500",
      solid: "bg-amber-500",
      solidText: "text-amber-700",
    },
    fuchsia: {
      text: "text-fuchsia-600",
      bgSoft: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      gradient: "from-fuchsia-400 to-pink-500",
      solid: "bg-fuchsia-500",
      solidText: "text-fuchsia-700",
    },
    emerald: {
      text: "text-emerald-600",
      bgSoft: "bg-emerald-50",
      border: "border-emerald-200",
      gradient: "from-emerald-400 to-teal-500",
      solid: "bg-emerald-500",
      solidText: "text-emerald-700",
    },
  };
  const c = accentMap[accentColor];

  const allAnswered = answered === total;

  return (
    <div className="space-y-5">
      <SimHeader title={title} description={description} badge={badge} color={accentColor} />

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Aciertos</div>
          <div className={cn("mt-0.5 text-xl font-bold font-mono", c.text)}>
            {score}<span className="text-sm text-muted-foreground">/{answered}</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Respondidas</div>
          <div className="mt-0.5 text-xl font-bold font-mono text-foreground">
            {answered}<span className="text-sm text-muted-foreground">/{total}</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">% acierto</div>
          <div className={cn("mt-0.5 text-xl font-bold font-mono", c.text)}>
            {answered > 0 ? Math.round((score / answered) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Progress dots / quick nav */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mr-1">
          Ir a:
        </span>
        <div className="inline-flex flex-wrap gap-1">
          {items.map((_, i) => {
            const r = results[i];
            const isCurrent = i === idx;
            return (
              <button
                key={i}
                onClick={() => gotoV2(i)}
                className={cn(
                  "h-7 w-7 text-xs font-bold rounded-full transition-all border",
                  isCurrent && `bg-gradient-to-br ${c.gradient} text-white border-transparent shadow-sm scale-110`,
                  !isCurrent && r === true && "bg-emerald-100 text-emerald-700 border-emerald-200",
                  !isCurrent && r === false && "bg-rose-100 text-rose-700 border-rose-200",
                  !isCurrent && r === null && "bg-white text-muted-foreground border-border hover:border-foreground/30"
                )}
                title={`Ejercicio ${i + 1}${r === true ? " (correcto)" : r === false ? " (incorrecto)" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question card */}
      <div className={cn("rounded-2xl border-2 p-6", c.border, c.bgSoft)}>
        <div className="flex items-center justify-between mb-3">
          <div className={cn("text-xs uppercase tracking-wider font-bold", c.text)}>
            Ejercicio {idx + 1} de {total}
          </div>
          <button
            onClick={() => setShowHint((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 border transition-colors",
              showHint ? `${c.bgSoft} ${c.text} ${c.border}` : "bg-white text-muted-foreground border-border hover:text-foreground"
            )}
          >
            <Lightbulb className="h-3 w-3" />
            {showHint ? "Ocultar pista" : "Pista"}
          </button>
        </div>

        {/* Prompt */}
        <div className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
          {item.prompt}
        </div>

        {/* Sentence for blank type */}
        {item.type === "blank" && item.sentence && (
          <div className="mt-4 text-lg sm:text-xl font-mono text-foreground leading-relaxed">
            {item.sentence.split("____").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span
                    className={cn(
                      "inline-block min-w-[100px] px-2 py-0.5 mx-1 rounded border-2 text-center",
                      pickedHistory[idx] !== null
                        ? cn(c.border, c.bgSoft, c.text, "font-bold")
                        : "border-dashed border-muted-foreground/40 bg-white"
                    )}
                  >
                    {pickedHistory[idx] !== null ? item.options[pickedHistory[idx]!] : "?"}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Write mode (tolerante) */}
        {isWriteMode ? (
          <div className="mt-5 space-y-3">
            <textarea
              value={writeValue}
              onChange={(e) => setWriteValue(e.target.value)}
              disabled={pickedHistory[idx] !== null}
              placeholder={item.placeholder ?? "Escribe tu respuesta aquí..."}
              rows={3}
              className="w-full rounded-xl border-2 border-border bg-white p-3 text-sm focus:border-amber-300 focus:outline-none disabled:opacity-60"
              aria-label="Respuesta escrita"
            />
            <button
              onClick={onSubmitWrite}
              disabled={pickedHistory[idx] !== null || !writeValue.trim()}
              className={cn("inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-40", c.gradient, "bg-gradient-to-r")}
            >
              Comprobar respuesta
            </button>
            <div className="text-[11px] text-muted-foreground">Aceptamos <em>I&apos;m</em> = <em>I am</em>, puntuación opcional y pequeños typos.</div>
          </div>
        ) : (
          <div className="mt-5 grid sm:grid-cols-2 gap-2.5">
            {item.options.map((opt, i) => {
            const isCorrect = i === item.correct;
            const isPicked = pickedHistory[idx] === i;
            const showCorrect = pickedHistory[idx] !== null && isCorrect;
            const showWrong = pickedHistory[idx] !== null && isPicked && !isCorrect;
            return (
              <button
                key={i}
                onClick={() => onPickV2(i)}
                disabled={pickedHistory[idx] !== null}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                  showCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
                  showWrong && "border-rose-400 bg-rose-50 text-rose-700",
                  !showCorrect && !showWrong && "border-border bg-white hover:border-amber-300 hover:bg-amber-50/40 text-foreground",
                  pickedHistory[idx] !== null && !isPicked && !isCorrect && "opacity-50"
                )}
              >
                {showCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                ) : showWrong ? (
                  <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground/60">
                    {String.fromCharCode(65 + i)}
                  </div>
                )}
                <span className="font-mono">{opt}</span>
              </button>
            );
          })}
          </div>
          )}

        {/* Hint */}
        {showHint && item.hint && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Pista:</strong> {item.hint}
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {pickedHistory[idx] !== null && (
          <div
            className={cn(
              "mt-4 rounded-xl p-4 text-sm border",
              pickedHistory[idx] === item.correct
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            )}
          >
            <div className="flex items-start gap-2">
              {pickedHistory[idx] === item.correct ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="font-bold mb-1">
                  {pickedHistory[idx] === item.correct ? "¡Correcto!" : `No era esa. La respuesta es: ${item.options[item.correct]}`}
                </div>
                <div className="leading-relaxed">{item.explanation}</div>
                {item.extra && (
                  <div className="mt-2 pt-2 border-t border-current/20 text-xs italic opacity-80">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    {item.extra}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/40 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Anterior
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" />
          Reiniciar
        </button>
        {idx < total - 1 ? (
          <button
            onClick={next}
            disabled={pickedHistory[idx] === null}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-4 py-1.5 text-xs font-semibold text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-shadow",
              c.gradient
            )}
          >
            Siguiente <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
          >
            <Trophy className="h-3.5 w-3.5" /> Reiniciar
          </button>
        )}
      </div>

      {/* Final summary */}
      {allAnswered && (
        <Insight
          color={score === total ? "emerald" : score >= total / 2 ? "amber" : "rose"}
          title={score === total ? "¡Perfecto!" : score >= total / 2 ? "Buen trabajo" : "A repasar"}
          icon={<Trophy className="h-4 w-4" />}
        >
          {intro || "Has completado todos los ejercicios."} Tu puntaje: <strong>{score} de {total}</strong> ({Math.round((score / total) * 100)}%). {score === total ? "Dominas el tema, prueba con otro módulo." : score >= total / 2 ? "Vas bien, repasa los errores marcados en rojo." : "Te conviene repasar la teoría y volver a intentarlo."}
        </Insight>
      )}
    </div>
  );
}
