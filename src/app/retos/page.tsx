"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Target, Zap, CheckCircle2, X, RotateCcw, ChevronRight, ArrowRight } from "lucide-react";
import { PageHeader, Breadcrumb, CtaStrip } from "@/components/site/ui";

type Q = {
  subject: "Física" | "Química" | "Inglés";
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

const QUESTIONS: Q[] = [
  {
    subject: "Física",
    prompt: "Un auto frena de 20 m/s a 0 en 5 s. Su aceleración media es:",
    options: ["−4 m/s²", "4 m/s²", "−100 m/s²", "0.25 m/s²"],
    correct: 0,
    explanation: "Δv = 0 − 20 = −20 m/s, dividido entre 5 s = −4 m/s². La aceleración apunta contra el movimiento (frenado).",
  },
  {
    subject: "Física",
    prompt: "En el ápice de un tiro parabólico, la velocidad vertical vᵧ es:",
    options: ["Máxima", "Cero", "Igual a vₓ", "Igual a g"],
    correct: 1,
    explanation: "En el punto más alto, la componente vertical se anula. Solo queda vₓ (horizontal). Por eso t_apex = v₀ᵧ/g.",
  },
  {
    subject: "Química",
    prompt: "En 2H₂ + O₂ → 2H₂O con 8 g de H₂ y 8 g de O₂, el reactivo limitante es:",
    options: ["H₂", "O₂", "H₂O", "Ninguno, sobra igual"],
    correct: 1,
    explanation: "8 g H₂ ≈ 4 mol ÷ 2 = 2 rondas; 8 g O₂ ≈ 0.25 mol ÷ 1 = 0.25 rondas. El menor gana: O₂ limita.",
  },
  {
    subject: "Química",
    prompt: "El nombre IUPAC de Ca(OH)₂ es:",
    options: ["óxido de calcio", "ácido cálcico", "hidróxido de calcio", "cal apagada (nombre común)"],
    correct: 2,
    explanation: "Metal + grupo OH⁻ = hidróxido. Ca²⁺ requiere 2 grupos OH⁻. 'Cal apagada' es el nombre común, no IUPAC.",
  },
  {
    subject: "Inglés",
    prompt: "She ____ in Mexico City since 2019. (presente perfecto)",
    options: ["lives", "has lived", "is living", "lived"],
    correct: 1,
    explanation: "'Since' marca un punto de inicio en el pasado que se prolonga hasta ahora: presente perfecto (have/has + participio).",
  },
  {
    subject: "Inglés",
    prompt: "En reported speech, 'I am running now' → she said:",
    options: ["she is running now", "she was running then", "she ran then", "she had been running now"],
    correct: 1,
    explanation: "Backshift: am → was. Marcador: now → then. Pronombre: I → she.",
  },
];

export default function RetosPage() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<(boolean | null)[]>(QUESTIONS.map(() => null));
  const [pickedHistory, setPickedHistory] = useState<(number | null)[]>(QUESTIONS.map(() => null));

  const q = QUESTIONS[idx];
  const score = results.filter((r) => r === true).length;
  const answered = results.filter((r) => r !== null).length;

  const onPick = (i: number) => {
    if (pickedHistory[idx] !== null) return;
    setPicked(i);
    setPickedHistory((h) => {
      const next = [...h];
      next[idx] = i;
      return next;
    });
    setResults((r) => {
      const next = [...r];
      next[idx] = i === q.correct;
      return next;
    });
  };

  const next = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx(idx + 1);
      setPicked(pickedHistory[idx + 1]);
    }
  };
  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setPicked(pickedHistory[idx - 1]);
    }
  };
  const reset = () => {
    setIdx(0);
    setPicked(null);
    setResults(QUESTIONS.map(() => null));
    setPickedHistory(QUESTIONS.map(() => null));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Retos" }]} />

      <PageHeader
        eyebrow="Quiz de 5 minutos"
        accent="amber"
        title={
          <>
            Retos rápidos ·{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              5 minutos también enseñan
            </span>
          </>
        }
        subtitle="Seis preguntas que mezclan Física, Química e Inglés. Cada respuesta viene con explicación pedagógica. Acumula aciertos para subir de nivel en tu bitácora."
      />

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-white p-4 text-center">
          <Flame className="h-5 w-5 mx-auto text-amber-500" />
          <div className="mt-1 text-2xl font-bold text-foreground font-mono">{answered - score}</div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Fallados</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 text-center">
          <Trophy className="h-5 w-5 mx-auto text-amber-500" />
          <div className="mt-1 text-2xl font-bold text-foreground font-mono">{score}</div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Aciertos</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 text-center">
          <Target className="h-5 w-5 mx-auto text-amber-500" />
          <div className="mt-1 text-2xl font-bold text-foreground font-mono">{answered}/{QUESTIONS.length}</div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Respondidas</div>
        </div>
      </div>

      {/* Quick nav */}
      <div className="mt-6 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mr-1">
          Saltar a:
        </span>
        {QUESTIONS.map((_, i) => {
          const r = results[i];
          const isCurrent = i === idx;
          return (
            <button
              key={i}
              onClick={() => {
                setIdx(i);
                setPicked(pickedHistory[i]);
              }}
              className={`h-7 w-7 text-xs font-bold rounded-full transition-all border ${
                isCurrent
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-transparent shadow-sm scale-110"
                  : r === true
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : r === false
                  ? "bg-rose-100 text-rose-700 border-rose-200"
                  : "bg-white text-muted-foreground border-border hover:border-foreground/30"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Quiz card */}
      <div className="mt-6 rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
        <div className="grid lg:grid-cols-5">
          {/* Left panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10" />
            <Flame className="h-6 w-6" />
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider opacity-90">
              Pregunta {idx + 1} de {QUESTIONS.length}
            </div>
            <div className="mt-1 text-xl font-bold leading-tight">
              Cinco minutos de reto también enseñan algo serio.
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4" />
                <span className="opacity-90">Materia:</span>
                <span className="font-bold">{q.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4" />
                <span className="opacity-90">Racha actual:</span>
                <span className="font-bold">{score}</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-3 p-6">
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">{q.prompt}</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isPicked = pickedHistory[idx] === i;
                const showCorrect = pickedHistory[idx] !== null && isCorrect;
                const showWrong = pickedHistory[idx] !== null && isPicked && !isCorrect;
                return (
                  <button
                    key={i}
                    onClick={() => onPick(i)}
                    disabled={pickedHistory[idx] !== null}
                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                      showCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : showWrong
                        ? "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-border bg-white hover:border-amber-300 hover:bg-amber-50/40 text-foreground"
                    } ${pickedHistory[idx] !== null && !isPicked && !isCorrect ? "opacity-50" : ""}`}
                  >
                    {showCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : showWrong ? (
                      <X className="h-4 w-4 text-rose-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[10px] font-bold text-muted-foreground/60">
                        {String.fromCharCode(65 + i)}
                      </div>
                    )}
                    <span className="font-mono">{opt}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {pickedHistory[idx] !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 rounded-xl p-3 text-sm border ${
                    pickedHistory[idx] === q.correct
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {pickedHistory[idx] === q.correct ? (
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <strong>{pickedHistory[idx] === q.correct ? "¡Correcto!" : `Era: ${q.options[q.correct]}`}</strong>{" "}
                      {q.explanation}
                      {pickedHistory[idx] !== q.correct && (
                        <div className="mt-3 pt-3 border-t border-rose-200">
                          <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1.5">Cómo resolverlo — 3 pasos</div>
                          <ol className="list-decimal pl-4 space-y-1 text-xs leading-relaxed opacity-90">
                            <li><strong>Identifica:</strong> {q.subject === "Física" ? "qué dato te dan (v₀, t, a) y qué te piden." : q.subject === "Química" ? "qué especie es reactivo/producto y balancea por inspección." : "qué marcador temporal te guía (since, now, yesterday)."} </li>
                            <li><strong>Aplica:</strong> {q.subject === "Física" ? "fórmula x = x₀ + v·t o v = v₀ + a·t según MRU/MRUV." : q.subject === "Química" ? "ajusta coeficientes y verifica átomos por elemento." : "elige tiempo verbal/modo según marcador + sujeto."} </li>
                            <li><strong>Verifica:</strong> revisa unidades, número de átomos o concordancia y descarta opciones que violan la regla.</li>
                          </ol>
                          <div className="mt-2">
                            <Link href={q.subject === "Física" ? "/fisica" : q.subject === "Química" ? "/quimica" : "/ingles"} className="inline-flex items-center gap-1 text-xs font-semibold underline hover:no-underline">
                              Ver ejemplo resuelto <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between gap-3 px-6 py-3 border-t border-amber-200 bg-white/40">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/40 transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reiniciar
          </button>
          {idx < QUESTIONS.length - 1 ? (
            <button
              onClick={next}
              disabled={pickedHistory[idx] === null}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
            >
              Siguiente <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
            >
              <Trophy className="h-3.5 w-3.5" /> Terminar
            </button>
          )}
        </div>
      </div>

      {/* Final summary */}
      {answered === QUESTIONS.length && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-4">
          <div className="text-sm font-bold text-foreground">¿Nos dejas tu feedback? (NPS 1-10)</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                onClick={() => {
                  const prev = JSON.parse(localStorage.getItem("cecyt3-nps") || "[]");
                  prev.push({ score: n, at: new Date().toISOString(), retosScore: score });
                  localStorage.setItem("cecyt3-nps", JSON.stringify(prev));
                  alert(`Gracias — NPS ${n} guardado (local).`);
                }}
                className="h-8 w-8 rounded-full border border-border bg-white text-xs font-bold hover:bg-fuchsia-50 hover:border-fuchsia-300"
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">Se guarda local en cecyt3-nps. Para piloto, exporta junto con progreso.</div>
        </div>
      )}

      {answered === QUESTIONS.length && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-2xl border-2 p-5 ${
            score === QUESTIONS.length
              ? "border-emerald-300 bg-emerald-50"
              : score >= QUESTIONS.length / 2
              ? "border-amber-300 bg-amber-50"
              : "border-rose-300 bg-rose-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <h3 className="text-lg font-bold text-foreground">
              {score === QUESTIONS.length
                ? "¡Perfecto!"
                : score >= QUESTIONS.length / 2
                ? "Buen trabajo"
                : "A repasar"}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu puntaje: <strong className="text-foreground">{score} de {QUESTIONS.length}</strong> ({Math.round((score / QUESTIONS.length) * 100)}%).
            {" "}
            {score === QUESTIONS.length
              ? "Dominas los tres módulos, prueba los simuladores completos."
              : score >= QUESTIONS.length / 2
              ? "Vas bien, repasa los errores marcados en rojo en cada módulo."
              : "Te conviene repasar la teoría de cada módulo y volver a intentarlo."}
          </p>
        </motion.div>
      )}

      <div className="mt-12">
        <CtaStrip
          title="¿Quieres profundizar?"
          description="Cada materia tiene simuladores completos con gráficas en vivo y explicaciones detalladas."
          primaryLabel="Ver Física"
          primaryHref="/fisica"
          secondaryLabel="Ver mi progreso"
          secondaryHref="/progreso"
        />
      </div>
    </div>
  );
}
