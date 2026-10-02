"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  FlaskConical,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Scale,
  Coins,
} from "lucide-react";
import { SimHeader, Slider, Insight } from "./shared";
import { useProgress } from "@/hooks/use-progress";

type RxnDef = {
  id: string;
  label: string;
  equation: string;
  reactants: { formula: string; molarMass: number; coef: number }[];
  products: { formula: string; molarMass: number; coef: number }[];
};

const REACTIONS: RxnDef[] = [
  {
    id: "agua",
    label: "Síntesis del agua",
    equation: "2H₂ + O₂ → 2H₂O",
    reactants: [
      { formula: "H₂", molarMass: 2.016, coef: 2 },
      { formula: "O₂", molarMass: 31.998, coef: 1 },
    ],
    products: [{ formula: "H₂O", molarMass: 18.015, coef: 2 }],
  },
  {
    id: "amoniaco",
    label: "Síntesis del amoniaco (Haber)",
    equation: "N₂ + 3H₂ → 2NH₃",
    reactants: [
      { formula: "N₂", molarMass: 28.014, coef: 1 },
      { formula: "H₂", molarMass: 2.016, coef: 3 },
    ],
    products: [{ formula: "NH₃", molarMass: 17.031, coef: 2 }],
  },
  {
    id: "metano",
    label: "Combustión de metano",
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    reactants: [
      { formula: "CH₄", molarMass: 16.043, coef: 1 },
      { formula: "O₂", molarMass: 31.998, coef: 2 },
    ],
    products: [
      { formula: "CO₂", molarMass: 44.009, coef: 1 },
      { formula: "H₂O", molarMass: 18.015, coef: 2 },
    ],
  },
  {
    id: "fe2o3",
    label: "Reducción del hierro (alto horno)",
    equation: "Fe₂O₃ + 3CO → 2Fe + 3CO₂",
    reactants: [
      { formula: "Fe₂O₃", molarMass: 159.687, coef: 1 },
      { formula: "CO", molarMass: 28.010, coef: 3 },
    ],
    products: [
      { formula: "Fe", molarMass: 55.845, coef: 2 },
      { formula: "CO₂", molarMass: 44.009, coef: 3 },
    ],
  },
];

export default function EstequiometriaSimulator() {
  const { save } = useProgress();
  const [rIdx, setRIdx] = useState(0);
  const reaction = REACTIONS[rIdx];
  const [masses, setMasses] = useState<number[]>(reaction.reactants.map(() => 8));

  const switchReaction = (i: number) => {
    setRIdx(i);
    setMasses(REACTIONS[i].reactants.map(() => 8));
  };

  // Moles of each reactant
  const moles = useMemo(
    () => reaction.reactants.map((r, i) => masses[i] / r.molarMass),
    [masses, reaction]
  );
  // "Rondas" posibles = moles / coef
  const rondas = moles.map((m, i) => m / reaction.reactants[i].coef);
  // Limiting reactant = min rondas
  const minRondas = Math.min(...rondas);
  const limitingIdx = rondas.indexOf(minRondas);
  const limiting = reaction.reactants[limitingIdx];

  // Guarda progreso al interactuar (demo: cada cambio de masa cuenta como intento)
  // se guarda en efecto abajo
  // Theoretical yield for each product
  const yields = reaction.products.map((p) => ({
    formula: p.formula,
    molarMass: p.molarMass,
    coef: p.coef,
    moles: minRondas * p.coef,
    grams: minRondas * p.coef * p.molarMass,
  }));

  // Excess reactant leftover
  const leftover = reaction.reactants.map((r, i) => {
    const consumed = minRondas * r.coef;
    const consumedMass = consumed * r.molarMass;
    return {
      formula: r.formula,
      initialMass: masses[i],
      consumedMass,
      leftoverMass: Math.max(0, masses[i] - consumedMass),
      leftoverMoles: Math.max(0, moles[i] - consumed),
      consumedMoles: consumed,
    };
  });

  // Auto-guarda progreso al interactuar
  const esteqSavedRef = useRef(false);
  useEffect(() => {
    const hasInteracted = masses.some((m) => m !== 8);
    if (hasInteracted && !esteqSavedRef.current) {
      esteqSavedRef.current = true;
      save("06_estequiometria", 1, 1);
    } else if (!hasInteracted) {
      esteqSavedRef.current = false;
    }
  }, [masses, save]);
  // Find max mass for bar scaling
  const maxMass = Math.max(...masses, ...yields.map((y) => y.grams), 1);

  return (
    <div className="space-y-5">
      <SimHeader
        title="Estequiometría · Reactivo Limitante"
        description="De gramos a moles y de moles a producto: ajusta las masas de los reactivos, predice cuál se agota primero y calcula el rendimiento teórico con masas molares reales de la tabla periódica."
        badge="Química · Laboratorio"
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
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equation */}
      <div className="rounded-2xl border-2 border-fuchsia-100 bg-white p-4 text-center">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
          Reacción balanceada
        </div>
        <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">{reaction.equation}</div>
      </div>

      {/* Mass sliders + bar chart */}
      <div className="rounded-2xl border border-border bg-white p-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5" />
          Entrada · masa de cada reactivo
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {reaction.reactants.map((r, i) => (
            <div key={i}>
              <Slider
                label={`Masa de ${r.formula}`}
                value={masses[i]}
                min={0}
                max={50}
                step={0.5}
                unit="g"
                onChange={(v) => setMasses((m) => m.map((x, j) => (j === i ? v : x)))}
                color="fuchsia"
                description={`Masa molar: ${r.molarMass.toFixed(2)} g/mol`}
              />
              {/* Visual bar */}
              <div className="mt-2 rounded-lg bg-secondary/60 p-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
                  <span>{r.formula} (g)</span>
                  <span>{masses[i].toFixed(1)} g</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-400 to-pink-500 transition-all"
                    style={{ width: `${(masses[i] / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conversion table */}
        <div className="rounded-lg bg-fuchsia-50/40 border border-fuchsia-100 p-3">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-fuchsia-700 mb-2">
            Conversión masa → moles → rondas
          </div>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-muted-foreground border-b border-fuchsia-100">
                <th className="py-1 text-left font-semibold">Reactivo</th>
                <th className="py-1 text-right font-semibold">Masa (g)</th>
                <th className="py-1 text-right font-semibold">÷ M (g/mol)</th>
                <th className="py-1 text-right font-semibold">Moles</th>
                <th className="py-1 text-right font-semibold">÷ coef</th>
                <th className="py-1 text-right font-semibold">Rondas</th>
              </tr>
            </thead>
            <tbody>
              {reaction.reactants.map((r, i) => (
                <tr key={i} className={`border-b border-fuchsia-100/60 ${i === limitingIdx ? "bg-rose-50" : "bg-emerald-50/40"}`}>
                  <td className="py-1.5 text-left font-bold text-foreground">
                    {r.formula} {i === limitingIdx && <span className="text-rose-600">⚠</span>}
                  </td>
                  <td className="py-1.5 text-right text-fuchsia-700 font-bold">{masses[i].toFixed(2)}</td>
                  <td className="py-1.5 text-right text-muted-foreground">÷ {r.molarMass.toFixed(2)}</td>
                  <td className="py-1.5 text-right text-fuchsia-700 font-bold">{moles[i].toFixed(3)}</td>
                  <td className="py-1.5 text-right text-muted-foreground">÷ {r.coef}</td>
                  <td className={`py-1.5 text-right font-bold ${i === limitingIdx ? "text-rose-600" : "text-emerald-600"}`}>
                    {rondas[i].toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Limiting reactant highlight */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Limitante: ${limiting.formula} con ${minRondas.toFixed(3)} rondas. Teórico: ${yields.map(y => `${y.formula} ${y.grams.toFixed(1)}g`).join(", ")}`}
      </div>
      <div className="rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-pink-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="h-4 w-4 text-rose-600" />
          <div className="text-xs uppercase tracking-wider font-bold text-rose-700">
            Reactivo limitante · ¿quién se agota?
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {reaction.reactants.map((r, i) => {
            const isLimiting = i === limitingIdx;
            return (
              <div
                key={i}
                className={`rounded-xl p-4 border-2 transition-all ${
                  isLimiting
                    ? "border-rose-400 bg-white shadow-md"
                    : "border-emerald-300 bg-white/70"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {isLimiting ? (
                      <TrendingDown className="h-4 w-4 text-rose-600" />
                    ) : (
                      <FlaskConical className="h-4 w-4 text-emerald-600" />
                    )}
                    <span className="font-bold text-foreground font-mono text-lg">{r.formula}</span>
                  </div>
                  {isLimiting ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                      LIMITANTE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                      EN EXCESO
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Inicial</div>
                    <div className="font-bold text-foreground font-mono">{leftover[i].initialMass.toFixed(2)} g</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Consumido</div>
                    <div className="font-bold text-rose-600 font-mono">{leftover[i].consumedMass.toFixed(2)} g</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Sobrante</div>
                    <div className="font-bold text-emerald-600 font-mono">{leftover[i].leftoverMass.toFixed(2)} g</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
                  moles = {moles[i].toFixed(3)} · rondas = {rondas[i].toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theoretical yield */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-4 w-4 text-emerald-600" />
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-700">
            Rendimiento teórico · {minRondas.toFixed(3)} rondas × coef
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {yields.map((y, i) => (
            <div key={i} className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground font-mono text-xl">{y.formula}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              {/* Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-mono">
                  <span>0 g</span>
                  <span>{y.grams.toFixed(2)} g</span>
                </div>
                <div className="h-3 rounded-full bg-emerald-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
                    style={{ width: `${(y.grams / maxMass) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Moles</div>
                  <div className="font-bold text-emerald-700 font-mono text-base">{y.moles.toFixed(3)} mol</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Masa teórica</div>
                  <div className="font-bold text-emerald-700 font-mono text-base">{y.grams.toFixed(2)} g</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground font-mono border-t border-emerald-200 pt-1.5">
                {minRondas.toFixed(3)} × {y.coef} × {y.molarMass.toFixed(2)} g/mol = {y.grams.toFixed(2)} g
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion flow */}
      <div className="rounded-2xl border border-border bg-secondary/30 p-4">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">
          Flujo de conversión
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center text-xs font-mono font-bold">
          <div className="rounded-lg bg-white border border-fuchsia-200 px-3 py-2 text-center">
            <div className="text-[9px] text-muted-foreground font-normal uppercase">Entrada</div>
            <div className="text-fuchsia-700">{masses.join(" + ")} g</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="rounded-lg bg-white border border-fuchsia-200 px-3 py-2 text-center">
            <div className="text-[9px] text-muted-foreground font-normal uppercase">÷ Molar Mass</div>
            <div className="text-fuchsia-700">{moles.map((m) => m.toFixed(3)).join(" + ")} mol</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="rounded-lg bg-white border border-rose-200 px-3 py-2 text-center">
            <div className="text-[9px] text-muted-foreground font-normal uppercase">÷ coeficiente</div>
            <div className="text-rose-600">min rondas = {minRondas.toFixed(3)}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="rounded-lg bg-white border border-emerald-200 px-3 py-2 text-center">
            <div className="text-[9px] text-muted-foreground font-normal uppercase">× coef × M</div>
            <div className="text-emerald-700">{yields.map((y) => y.grams.toFixed(2)).join(" + ")} g</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Insight color="rose" title="¿Por qué O₂ y no H₂?" icon={<AlertTriangle className="h-4 w-4" />}>
          Con 8 g de H₂ y 8 g de O₂, el <strong>limitante es el O₂</strong> aunque las masas sean iguales. La estequiometría cuenta <strong>moles</strong>, no gramos: 8 g de H₂ son ~4 mol, pero 8 g de O₂ son solo 0.25 mol. Y como la reacción pide 2:1, las "rondas" resultan 2 (H₂) vs 0.25 (O₂) → gana O₂.
        </Insight>
        <Insight color="emerald" title="El truco: mol ÷ coef" icon={<CheckCircle2 className="h-4 w-4" />}>
          Para comparar reactivos con coeficientes distintos, divide sus moles entre su coeficiente en la ecuación. El <strong>menor</strong> es el limitante. Ese número (rondas) te dice cuántas "veces" se puede ejecutar la reacción. Multiplica por el coeficiente del producto → moles obtenidos → × masa molar → gramos teóricos.
        </Insight>
      </div>
    </div>
  );
}
