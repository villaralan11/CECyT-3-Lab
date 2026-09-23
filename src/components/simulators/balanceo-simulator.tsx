"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Minus, Plus, CheckCircle2, RotateCcw, AlertTriangle, Scale } from "lucide-react";
import { SimHeader, Insight } from "./shared";
import { balanceReaction, parseFormula } from "@/lib/balance";
import { useProgress } from "@/hooks/use-progress";

type Species = { formula: string; defaultCoef: number };
type Reaction = {
  id: string;
  label: string;
  category: "combustión" | "síntesis" | "oxidación";
  reactants: Species[];
  products: Species[];
  balanced: number[];
};

const REACTIONS: Reaction[] = [
  {
    id: "combustion-metano",
    label: "Combustión de metano",
    category: "combustión",
    reactants: [
      { formula: "CH₄", defaultCoef: 1 },
      { formula: "O₂", defaultCoef: 1 },
    ],
    products: [
      { formula: "CO₂", defaultCoef: 1 },
      { formula: "H₂O", defaultCoef: 1 },
    ],
    balanced: [1, 2, 1, 2],
  },
  {
    id: "combustion-etano",
    label: "Combustión de etano",
    category: "combustión",
    reactants: [
      { formula: "C₂H₆", defaultCoef: 1 },
      { formula: "O₂", defaultCoef: 1 },
    ],
    products: [
      { formula: "CO₂", defaultCoef: 1 },
      { formula: "H₂O", defaultCoef: 1 },
    ],
    balanced: [2, 7, 4, 6],
  },
  {
    id: "combustion-etanol",
    label: "Combustión de etanol",
    category: "combustión",
    reactants: [
      { formula: "C₂H₅OH", defaultCoef: 1 },
      { formula: "O₂", defaultCoef: 1 },
    ],
    products: [
      { formula: "CO₂", defaultCoef: 1 },
      { formula: "H₂O", defaultCoef: 1 },
    ],
    balanced: [1, 3, 2, 3],
  },
  {
    id: "combustion-glucosa",
    label: "Combustión de glucosa",
    category: "combustión",
    reactants: [
      { formula: "C₆H₁₂O₆", defaultCoef: 1 },
      { formula: "O₂", defaultCoef: 1 },
    ],
    products: [
      { formula: "CO₂", defaultCoef: 1 },
      { formula: "H₂O", defaultCoef: 1 },
    ],
    balanced: [1, 6, 6, 6],
  },
  {
    id: "sintesis-agua",
    label: "Síntesis del agua",
    category: "síntesis",
    reactants: [
      { formula: "H₂", defaultCoef: 1 },
      { formula: "O₂", defaultCoef: 1 },
    ],
    products: [{ formula: "H₂O", defaultCoef: 1 }],
    balanced: [2, 1, 2],
  },
  {
    id: "amoniaco",
    label: "Síntesis del amoniaco (Haber)",
    category: "síntesis",
    reactants: [
      { formula: "N₂", defaultCoef: 1 },
      { formula: "H₂", defaultCoef: 1 },
    ],
    products: [{ formula: "NH₃", defaultCoef: 1 }],
    balanced: [1, 3, 2],
  },
  {
    id: "fe-oxido",
    label: "Oxidación del hierro (óxido férrico)",
    category: "oxidación",
    reactants: [
      { formula: "Fe", defaultCoef: 1 },
      { formula: "O₂", defaultCoef: 1 },
    ],
    products: [{ formula: "Fe₂O₃", defaultCoef: 1 }],
    balanced: [4, 3, 2],
  },
  {
    id: "aluminio",
    label: "Reacción del aluminio",
    category: "oxidación",
    reactants: [
      { formula: "Al", defaultCoef: 1 },
      { formula: "O₂", defaultCoef: 1 },
    ],
    products: [{ formula: "Al₂O₃", defaultCoef: 1 }],
    balanced: [4, 3, 2],
  },
];

// Parse formula and count atoms (handles elements + subscript digits)
function countAtoms(formula: string, coef: number): Record<string, number> {
  const atoms = parseFormula(formula);
  const result: Record<string, number> = {};
  for (const [el, n] of Object.entries(atoms)) result[el] = n * coef;
  return result;
}

function balancedCoef(coef: number) {
  return coef === 1 ? "" : coef.toString();
}

export default function BalanceoSimulator() {
  const { save } = useProgress();
  const [rIdx, setRIdx] = useState(0);
  const reaction = REACTIONS[rIdx];
  const allSpecies = [...reaction.reactants, ...reaction.products];
  const [coefs, setCoefs] = useState<number[]>(allSpecies.map((s) => s.defaultCoef));
  const interactedRef = useRef(false);
  const balSavedRef = useRef<Set<number>>(new Set());

  const switchReaction = (i: number) => {
    interactedRef.current = false;
    setRIdx(i);
    const r = REACTIONS[i];
    setCoefs([...r.reactants, ...r.products].map((s) => s.defaultCoef));
  };

  const reset = () => {
    setCoefs(allSpecies.map((s) => s.defaultCoef));
  };

  const bump = (i: number, delta: number) => {
    interactedRef.current = true;
    setCoefs((c) => {
      const next = [...c];
      next[i] = Math.max(1, next[i] + delta);
      return next;
    });
  };

  const setCoef = (i: number, value: number) => {
    interactedRef.current = true;
    setCoefs((c) => {
      const next = [...c];
      next[i] = Math.max(1, Math.min(20, Math.floor(value || 1)));
      return next;
    });
  };

  const showSolution = () => {
    interactedRef.current = false;
    setCoefs([...reaction.balanced]);
  };

  // Compute atom counts on each side
  const reactantCounts = useMemo(() => {
    const total: Record<string, number> = {};
    reaction.reactants.forEach((s, i) => {
      const c = countAtoms(s.formula, coefs[i] || 1);
      Object.entries(c).forEach(([el, n]) => {
        total[el] = (total[el] || 0) + n;
      });
    });
    return total;
  }, [coefs, reaction]);

  const productCounts = useMemo(() => {
    const total: Record<string, number> = {};
    reaction.products.forEach((s, i) => {
      const idx = reaction.reactants.length + i;
      const c = countAtoms(s.formula, coefs[idx] || 1);
      Object.entries(c).forEach(([el, n]) => {
        total[el] = (total[el] || 0) + n;
      });
    });
    return total;
  }, [coefs, reaction]);

  const allAtoms = Array.from(new Set([...Object.keys(reactantCounts), ...Object.keys(productCounts)])).sort();
  const isBalanced = allAtoms.length > 0 && allAtoms.every((el) => (reactantCounts[el] || 0) === (productCounts[el] || 0));
  const [customR, setCustomR] = useState("H2, O2");
  const [customP, setCustomP] = useState("H2O");
  const [customRes, setCustomRes] = useState<number[] | null>(null);
  const [customErr, setCustomErr] = useState<string | null>(null);
  const tryCustom = () => {
    const r = customR.split(",").map((s) => s.trim()).filter(Boolean);
    const p2 = customP.split(",").map((s) => s.trim()).filter(Boolean);
    const res = balanceReaction(r, p2);
    if (res) { setCustomRes(res); setCustomErr(null); }
    else { setCustomRes(null); setCustomErr("No se pudo balancear con coeficientes ≤100. Revisa fórmulas."); }
  };
  useEffect(() => {
    if (!isBalanced || !interactedRef.current) return;
    if (balSavedRef.current.has(rIdx)) return;
    const next = new Set(balSavedRef.current).add(rIdx);
    balSavedRef.current = next;
    void save("05_balanceo", next.size, REACTIONS.length);
  }, [isBalanced, rIdx, save]);

  return (
    <div className="space-y-5">
      <SimHeader
        title="Balanceo de Ecuaciones"
        description="Ajusta coeficientes con steppers o escribe el número directamente. Observa la tabla de átomos equilibrarse en vivo. Combustiones de hidrocarburos (metano, etano, etanol, glucosa) y reacciones inorgánicas clásicas."
        badge="Química · Balanceador"
        color="fuchsia"
      />

      {/* Reaction selector */}
      <div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
          Selecciona una reacción
        </div>
        <div className="flex flex-wrap gap-2">
          {REACTIONS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => switchReaction(i)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === rIdx
                  ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-sm"
                  : "bg-white border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`inline-flex items-center rounded-full px-1.5 py-0 text-[8px] font-bold uppercase tracking-wide ${
                i === rIdx ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
              }`}>
                {r.category === "combustión" ? "🔥" : r.category === "síntesis" ? "⚗" : "⚙"}
              </span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equation */}
      <div className="rounded-2xl border-2 border-fuchsia-100 bg-white p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Ecuación química
          </div>
          <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            isBalanced
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-amber-100 text-amber-700 border border-amber-200"
          }`}>
            <Scale className="h-3 w-3" />
            {isBalanced ? "Balanceada" : "Sin balancear"}
          </div>
        </div>
        <div role="group" aria-label="Ecuación química con coeficientes ajustables" className="flex flex-wrap items-center gap-2 justify-center text-xl sm:text-2xl font-mono font-bold">
          {reaction.reactants.map((s, i) => (
            <div key={`r${i}`} className="flex items-center gap-1">
              <div className="inline-flex items-stretch rounded-lg border-2 border-fuchsia-200 bg-fuchsia-50 overflow-hidden">
                <button
                  onClick={() => bump(i, -1)}
                  className="px-2 py-1.5 text-fuchsia-600 hover:bg-fuchsia-100 transition-colors"
                  aria-label="Decrementar"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={coefs[i]}
                  onChange={(e) => setCoef(i, parseInt(e.target.value, 10))}
                  className="w-10 text-center text-lg text-fuchsia-700 bg-transparent border-0 outline-none font-mono font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => bump(i, 1)}
                  className="px-2 py-1.5 text-fuchsia-600 hover:bg-fuchsia-100 transition-colors"
                  aria-label="Incrementar"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="text-foreground">{s.formula}</span>
              {i < reaction.reactants.length - 1 && <span className="text-muted-foreground mx-1">+</span>}
            </div>
          ))}
          <span className={`mx-2 text-2xl ${isBalanced ? "text-emerald-500" : "text-muted-foreground"}`}>→</span>
          {reaction.products.map((s, i) => {
            const idx = reaction.reactants.length + i;
            return (
              <div key={`p${i}`} className="flex items-center gap-1">
                <div className="inline-flex items-stretch rounded-lg border-2 border-emerald-200 bg-emerald-50 overflow-hidden">
                  <button
                    onClick={() => bump(idx, -1)}
                    className="px-2 py-1.5 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    aria-label="Decrementar"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={coefs[idx]}
                    onChange={(e) => setCoef(idx, parseInt(e.target.value, 10))}
                    className="w-10 text-center text-lg text-emerald-700 bg-transparent border-0 outline-none font-mono font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => bump(idx, 1)}
                    className="px-2 py-1.5 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    aria-label="Incrementar"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-foreground">{s.formula}</span>
                {i < reaction.products.length - 1 && <span className="text-muted-foreground mx-1">+</span>}
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isBalanced ? `Balanceada: ${allAtoms.map(el => `${el} ${reactantCounts[el]}`).join(", ")}` : `Sin balancear: ${allAtoms.map(el => `${el} reactivos ${reactantCounts[el]||0} productos ${productCounts[el]||0}`).join(", ")}`}
        </div>
        <div className={`mt-4 rounded-lg p-2.5 text-center text-xs font-semibold ${
          isBalanced
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          {isBalanced ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              ¡Balanceada! La masa se conserva (Lavoisier): mismo nº de átomos de cada elemento a cada lado.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Ajusta los coeficientes hasta igualar el nº de átomos a cada lado del →.
            </span>
          )}
        </div>
      </div>

      {/* Atom inventory */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-secondary/40 flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5" />
            Conteo de átomos · Ley de conservación de la masa
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            Reactivos = Productos?
          </div>
        </div>
        <table className="w-full text-sm" role="table" aria-label="Conteo de átomos por elemento">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 text-left font-semibold">Elemento</th>
              <th className="px-4 py-2 text-center font-semibold text-fuchsia-700">Reactivos</th>
              <th className="px-4 py-2 text-center font-semibold text-emerald-700">Productos</th>
              <th className="px-4 py-2 text-center font-semibold">Δ</th>
              <th className="px-4 py-2 text-center font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {allAtoms.map((el) => {
              const r = reactantCounts[el] || 0;
              const p = productCounts[el] || 0;
              const diff = r - p;
              const ok = diff === 0;
              return (
                <tr key={el} className={`border-b border-border/40 last:border-0 ${!ok ? "bg-amber-50/40" : ""}`}>
                  <td className="px-4 py-2.5 font-mono font-bold text-base text-foreground">{el}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-lg text-fuchsia-700">{r}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-lg text-emerald-700">{p}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-sm">
                    <span className={ok ? "text-emerald-600" : "text-rose-600"}>
                      {ok ? "0" : diff > 0 ? `+${diff}` : diff}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {ok ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" /> OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
                        <AlertTriangle className="h-3 w-3" /> Ajustar
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-secondary/40 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reiniciar coeficientes
        </button>
        <button
          onClick={showSolution}
          className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 px-3 py-1.5 text-xs font-semibold hover:bg-fuchsia-100 transition-colors"
        >
          <CheckCircle2 className="h-3 w-3" />
          Ver solución
        </button>
      </div>

      {/* Custom solver — dinámico */}
      <div className="rounded-2xl border-2 border-dashed border-fuchsia-300 bg-fuchsia-50/40 p-4">
        <div className="text-xs uppercase tracking-wider font-bold text-fuchsia-700">🧪 Solver dinámico — prueba tu propia reacción</div>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <label className="text-xs font-semibold">Reactivos (coma)
            <input value={customR} onChange={(e) => setCustomR(e.target.value)} placeholder="ej: C3H8, O2" className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm" />
          </label>
          <label className="text-xs font-semibold">Productos (coma)
            <input value={customP} onChange={(e) => setCustomP(e.target.value)} placeholder="ej: CO2, H2O" className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm" />
          </label>
        </div>
        <button onClick={tryCustom} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
          Balancear con álgebra lineal
        </button>
        {customRes && (() => {
          const r = customR.split(",").map((s) => s.trim()).filter(Boolean);
          const pp = customP.split(",").map((s) => s.trim()).filter(Boolean);
          const left = r.map((f, i) => `${customRes[i] === 1 ? "" : customRes[i]}${f}`).join(" + ");
          const right = pp.map((f, i) => `${customRes[r.length + i] === 1 ? "" : customRes[r.length + i]}${f}`).join(" + ");
          return (
            <div className="mt-3 rounded-xl bg-white border border-emerald-200 p-3 font-mono text-sm">
              <span className="text-emerald-700 font-bold">✓ {left} → {right}</span>
              <div className="text-xs text-muted-foreground mt-1">Coeficientes: [{customRes.join(", ")}] · verificado átomo por átomo</div>
            </div>
          );
        })()}
        {customErr && <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">{customErr}</div>}
        <div className="mt-2 text-[11px] text-muted-foreground">Usa el mismo motor que valida las 8 del banco. Prueba C4H10+O2→CO2+H2O o KClO3→KCl+O2.</div>
      </div>

      {/* Insights */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Insight color="fuchsia" title="Coeficiente vs subíndice" icon={<AlertTriangle className="h-4 w-4" />}>
          El <strong>coeficiente</strong> (número grande a la izquierda de la fórmula, como el 2 en 2H₂O) <strong>se puede cambiar</strong> y multiplica TODA la fórmula. El <strong>subíndice</strong> (número pequeño dentro, como el ₂ en H₂O) <strong>NO se toca</strong>: cambiarlo alteraría la sustancia.
        </Insight>
        <Insight color="emerald" title="Método de tanteo" icon={<CheckCircle2 className="h-4 w-4" />}>
          <strong>Pasos:</strong> 1) cuenta átomos a cada lado. 2) Empieza por el elemento que aparece en menos sustancias (suele ser el C en combustiones). 3) Balancea el H y deja el O para el final (aparece en varias sustancias). 4) Verifica con la tabla. 5) Si hay fracciones, multiplica todo por 2.
        </Insight>
      </div>

      {/* Equation reminder */}
      <div className="rounded-xl border border-border bg-secondary/40 p-3 text-center text-sm font-mono">
        <span className="text-muted-foreground">Ecuación balanceada:</span>{" "}
        <span className="font-bold text-foreground">
          {reaction.reactants.map((s, i) => `${balancedCoef(reaction.balanced[i])}${s.formula}`).join(" + ")}
          {" → "}
          {reaction.products.map((s, i) => `${balancedCoef(reaction.balanced[reaction.reactants.length + i])}${s.formula}`).join(" + ")}
        </span>
      </div>
    </div>
  );
}
