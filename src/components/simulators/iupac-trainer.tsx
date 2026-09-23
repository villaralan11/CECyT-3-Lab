"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lightbulb,
  ChevronRight,
  Trophy,
  FlaskConical,
  Atom,
} from "lucide-react";
import { SimHeader, Insight } from "./shared";
import { MolViewer, SDFS } from "@/components/chemistry/mol-viewer";
import { useProgress } from "@/hooks/use-progress";

type CompoundType = "oxido" | "hidroxido" | "acido" | "sal" | "alcano" | "alqueno" | "alcohol" | "cetona" | "acido_org";

type Compound = {
  formula: string;
  name: string;
  type: CompoundType;
  hint: string;
  explanation: string;
};

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TYPE_META: Record<CompoundType, { label: string; group: "Inorgánico" | "Orgánico"; color: string; bgSoft: string; border: string }> = {
  oxido: { label: "Óxido", group: "Inorgánico", color: "text-rose-700", bgSoft: "bg-rose-50", border: "border-rose-200" },
  hidroxido: { label: "Hidróxido", group: "Inorgánico", color: "text-orange-700", bgSoft: "bg-orange-50", border: "border-orange-200" },
  acido: { label: "Ácido", group: "Inorgánico", color: "text-amber-700", bgSoft: "bg-amber-50", border: "border-amber-200" },
  sal: { label: "Sal", group: "Inorgánico", color: "text-lime-700", bgSoft: "bg-lime-50", border: "border-lime-200" },
  alcano: { label: "Alcano", group: "Orgánico", color: "text-emerald-700", bgSoft: "bg-emerald-50", border: "border-emerald-200" },
  alqueno: { label: "Alqueno", group: "Orgánico", color: "text-teal-700", bgSoft: "bg-teal-50", border: "border-teal-200" },
  alcohol: { label: "Alcohol", group: "Orgánico", color: "text-cyan-700", bgSoft: "bg-cyan-50", border: "border-cyan-200" },
  cetona: { label: "Cetona", group: "Orgánico", color: "text-sky-700", bgSoft: "bg-sky-50", border: "border-sky-200" },
  acido_org: { label: "Ácido carboxílico", group: "Orgánico", color: "text-fuchsia-700", bgSoft: "bg-fuchsia-50", border: "border-fuchsia-200" },
};

const COMPOUNDS: Compound[] = [
  // Óxidos
  { formula: "CO₂", name: "dióxido de carbono", type: "oxido", hint: "Óxido: prefijos griegos según nº de O (mono-, di-, tri-).", explanation: "C + 2 O. 'di-' por 2 oxígenos. Como el C tiene varias valencias, aquí va con la mayor (IV); CO sería C(II)." },
  { formula: "SO₃", name: "trióxido de azufre", type: "oxido", hint: "Óxido ácido de un no-metal. Prefijo 'tri-' por 3 O.", explanation: "S + 3 O. Prefijo 'tri-' porque hay 3 átomos de O (nomenclatura sistemática)." },
  { formula: "Na₂O", name: "óxido de sodio", type: "oxido", hint: "Óxido básico (metal + O). Sodio valencia 1.", explanation: "Na⁺ + O²⁻. Se necesitan 2 Na para compensar la carga del O²⁻. Sin prefijos (valencia única)." },
  { formula: "CaO", name: "óxido de calcio", type: "oxido", hint: "Cal viva. Ca²⁺ + O²⁻.", explanation: "Cal viva. Ca²⁺ y O²⁻ se neutralizan 1:1. Sin prefijos." },
  { formula: "Fe₂O₃", name: "óxido de hierro (III)", type: "oxido", hint: "Hierro con valencia 3. Se indica con números romanos.", explanation: "Hierro con valencia III. Como el Fe tiene valencias 2 y 3, hay que indicarla con número romano (Stock)." },
  // Hidróxidos
  { formula: "NaOH", name: "hidróxido de sodio", type: "hidroxido", hint: "Base: metal + grupo OH⁻.", explanation: "Na⁺ + OH⁻. Sosa cáustica. 1:1 porque Na es +1 y OH es −1." },
  { formula: "Ca(OH)₂", name: "hidróxido de calcio", type: "hidroxido", hint: "Cal apagada. Ca²⁺ necesita 2 OH⁻.", explanation: "Ca²⁺ + 2 OH⁻. Cal apagada. Se escribe (OH)₂ para indicar 2 grupos." },
  { formula: "Al(OH)₃", name: "hidróxido de aluminio", type: "hidroxido", hint: "Al³⁺ requiere 3 grupos OH⁻.", explanation: "Al³⁺ + 3 OH⁻. El paréntesis indica que el subíndice afecta a todo el grupo OH." },
  // Ácidos
  { formula: "HCl", name: "ácido clorhídrico", type: "acido", hint: "Ácido binario (H + no-metal). Termina en -hídrico.", explanation: "H + Cl. Ácido binario sin O. Terminación -hídrico. En disolución acuosa es «ácido clorhídrico»; el gas puro es «cloruro de hidrógeno»." },
  { formula: "H₂SO₄", name: "ácido sulfúrico", type: "acido", hint: "Oxoácido del azufre con valencia VI. Termina en -ico.", explanation: "H₂SO₄. Oxoácido. S con valencia VI → -ico. Ácido fuerte de uso industrial." },
  { formula: "HNO₃", name: "ácido nítrico", type: "acido", hint: "Oxoácido del nitrógeno. N valencia V.", explanation: "HNO₃. N con valencia V → -ico. Ácido fuerte usado en fertilizantes." },
  { formula: "H₃PO₄", name: "ácido fosfórico", type: "acido", hint: "Tres H ionizables. P valencia V.", explanation: "H₃PO₄. P con valencia V → -ico. 3 H reemplazables → ácido triprótico." },
  // Sales
  { formula: "NaCl", name: "cloruro de sodio", type: "sal", hint: "Sal binaria: -uro del no-metal + de + metal.", explanation: "Na⁺ + Cl⁻. Sal de mesa. Cl como 'cloruro' (valencia única)." },
  { formula: "KBr", name: "bromuro de potasio", type: "sal", hint: "Sal binaria de haluro.", explanation: "K⁺ + Br⁻. Bromuro. Sal binaria típica de haluro." },
  { formula: "CaCO₃", name: "carbonato de calcio", type: "sal", hint: "Sal de ácido carbónico. Cambia -ico → -ato.", explanation: "Ca²⁺ + CO₃²⁻. Sal de ácido carbónico (H₂CO₃). -ico del ácido → -ato en la sal." },
  { formula: "FeSO₄", name: "sulfato de hierro (II)", type: "sal", hint: "Hierro con valencia 2 → (II).", explanation: "Fe²⁺ + SO₄²⁻. Hierro (II) → sal verde. La valencia va entre paréntesis." },
  { formula: "AgNO₃", name: "nitrato de plata", type: "sal", hint: "Sal de ácido nítrico. Plata +1.", explanation: "Ag⁺ + NO₃⁻. Nitrato de plata. Reactivo de laboratorio para detectar cloruros." },
  // Alcanos
  { formula: "CH₄", name: "metano", type: "alcano", hint: "Alcano 1 C: met- + -ano.", explanation: "1 C → met-. Sin enlaces dobles → -ano. Gas metano, componente del gas natural." },
  { formula: "C₂H₆", name: "etano", type: "alcano", hint: "Alcano 2 C: et- + -ano.", explanation: "2 C → et-. -ano por enlace simple. Segundo alcano de la serie." },
  { formula: "C₃H₈", name: "propano", type: "alcano", hint: "Alcano 3 C: prop- + -ano.", explanation: "3 C → prop-. Gas LP (licuado de petróleo)." },
  // Alquenos
  { formula: "C₂H₄", name: "eteno", type: "alqueno", hint: "Alqueno 2 C, doble enlace: -eno.", explanation: "2 C con un enlace C=C. Sufijo -eno. Etileno, madurador de frutas." },
  // Alcoholes
  { formula: "CH₃OH", name: "metanol", type: "alcohol", hint: "Alcohol 1 C: met- + -anol.", explanation: "1 C + grupo OH. Metanol (alcohol de madera). Tóxico." },
  { formula: "C₂H₅OH", name: "etanol", type: "alcohol", hint: "Alcohol 2 C: et- + -anol.", explanation: "2 C + grupo OH. Etanol (alcohol de bebidas)." },
  // Ácidos carboxílicos
  { formula: "CH₃COOH", name: "ácido acético", type: "acido_org", hint: "Ácido carboxílico 2 C: usa el nombre común aceptado.", explanation: "2 C con grupo -COOH. Ácido acético (vinagre). IUPAC: ácido etanoico." },
  // Cetonas
  { formula: "CH₃COCH₃", name: "propanona", type: "cetona", hint: "Cetona 3 C, C=O en medio.", explanation: "3 C con C=O en el carbono central. Propanona (acetona). Quitaesmalte." },
];

export default function IUPACTrainer() {
  const { save } = useProgress();
  const [filter, setFilter] = useState<"all" | "inorgánico" | "orgánico">("all");
  const [direction, setDirection] = useState<"formula-name" | "name-formula">("formula-name");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState(false);
  const [history, setHistory] = useState<boolean[]>([]);

  const pool = useMemo(
    () =>
      filter === "all"
        ? COMPOUNDS
        : COMPOUNDS.filter((c) => TYPE_META[c.type].group === (filter === "inorgánico" ? "Inorgánico" : "Orgánico")),
    [filter]
  );

  const current = pool[idx % pool.length];

  // Generate 3 distractors + 1 correct, shuffled
  const options = useMemo(() => {
    if (!current) return [];
    // Prefer distractors of the same type, then same group, then any
    const sameType = COMPOUNDS.filter((c) => c.type === current.type && c.name !== current.name);
    const sameGroup = COMPOUNDS.filter((c) => TYPE_META[c.type].group === TYPE_META[current.type].group && c.type !== current.type);
    const others = COMPOUNDS.filter((c) => TYPE_META[c.type].group !== TYPE_META[current.type].group);

    const candidates = [...sameType, ...sameGroup, ...others].filter((c) => c.name !== current.name);
    // Dedupe and shuffle deterministically (evita hydration mismatch en SSR)
    const unique = Array.from(new Set(candidates.map((c) => c.name))).map((n) => candidates.find((c) => c.name === n)!);
    const seed = hashSeed(current.name + "|" + idx);
    const shuffled = seededShuffle(unique, seed);
    const opts = seededShuffle([...shuffled.slice(0, 3), current], seed ^ 0x9e3779b9);
    return opts;
  }, [current, idx]);

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correctIdx = options.findIndex((o) => o.name === current.name);
    const isCorrect = i === correctIdx;
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    setHistory((h) => [...h, isCorrect]);
    // guarda progreso (Fase 2 backend + local)
    const newCorrect = (isCorrect ? 1 : 0) + score.correct;
    const newTotal = score.total + 1;
    save("04_iupac", newCorrect, newTotal);
  };

  const next = () => {
    setPicked(null);
    setShowHint(false);
    setIdx((i) => i + 1);
  };

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setIdx(0);
    setPicked(null);
    setShowHint(false);
    setHistory([]);
  };

  const changeFilter = (f: "all" | "inorgánico" | "orgánico") => {
    setFilter(f);
    setIdx(0);
    setPicked(null);
    setShowHint(false);
  };

  const toggleDirection = () => {
    setDirection((d) => (d === "formula-name" ? "name-formula" : "formula-name"));
    setPicked(null);
    setShowHint(false);
  };

  const correctIdx = options.findIndex((o) => o.name === current.name);
  const typeMeta = TYPE_META[current.type];
  const streak = history.length >= 2 && history.slice(-2).every(Boolean) ? history.length - history.lastIndexOf(false) - 1 : (history.length > 0 && history[history.length - 1] ? 1 : 0);

  return (
    <div className="space-y-5">
      <SimHeader
        title="Nomenclatura IUPAC · Orgánica e Inorgánica"
        description="Entrenador bidireccional: te muestra la fórmula y eliges el nombre, o al revés. 25 compuestos entre óxidos, hidróxidos, ácidos, sales, alcanos, alquenos, alcoholes, cetonas y ácidos carboxílicos."
        badge="Química · 25 compuestos"
        color="fuchsia"
      />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Aciertos</div>
          <div className="mt-0.5 text-xl font-bold font-mono text-fuchsia-600">
            {score.correct}<span className="text-sm text-muted-foreground">/{score.total}</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Racha</div>
          <div className="mt-0.5 text-xl font-bold font-mono text-amber-600 inline-flex items-center gap-1">
            {streak > 0 && <Trophy className="h-3.5 w-3.5" />}
            {streak}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Progreso</div>
          <div className="mt-0.5 text-xl font-bold font-mono text-foreground">
            {(idx % pool.length) + 1}<span className="text-sm text-muted-foreground">/{pool.length}</span>
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-sm">
          {[
            { id: "all" as const, label: "Todos" },
            { id: "inorgánico" as const, label: "Inorgánicos" },
            { id: "orgánico" as const, label: "Orgánicos" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => changeFilter(t.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                filter === t.id
                  ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={toggleDirection}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-fuchsia-50 transition-colors"
        >
          <ArrowRightLeft className="h-3.5 w-3.5 text-fuchsia-500" />
          {direction === "formula-name" ? "Fórmula → Nombre" : "Nombre → Fórmula"}
        </button>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50 p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-fuchsia-700">
          <FlaskConical className="h-3.5 w-3.5" />
          {direction === "formula-name" ? "¿Cuál es el nombre IUPAC de:" : "¿Cuál es la fórmula de:"}
        </div>
        <div className="mt-3 text-5xl sm:text-6xl font-bold font-mono text-foreground tracking-tight break-all">
          {direction === "formula-name" ? current.formula : current.name}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 rounded-full ${typeMeta.bgSoft} ${typeMeta.color} border ${typeMeta.border} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide`}>
            {typeMeta.group}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full ${typeMeta.bgSoft} ${typeMeta.color} border ${typeMeta.border} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide`}>
            {typeMeta.label}
          </span>
        </div>
      </div>

      {/* 3D Viewer for orgánicos (VSEPR) */}
      {["alcano", "alqueno", "alcohol", "cetona", "acido_org"].includes(current.type) && (
        <MolViewer
          sdf={
            current.formula === "CH₄" ? SDFS.CH4 :
            current.formula === "C₂H₆" ? SDFS.C2H6 :
            current.formula === "C₂H₅OH" || current.formula === "CH₃OH" ? SDFS.C2H5OH :
            SDFS.CH4
          }
          formula={current.formula}
          name={current.name}
        />
      )}

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-2.5">
        {options.map((o, i) => {
          const isCorrect = i === correctIdx;
          const isPicked = picked === i;
          const showCorrect = picked !== null && isCorrect;
          const showWrong = picked !== null && isPicked && !isCorrect;
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              disabled={picked !== null}
              className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                showCorrect
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : showWrong
                  ? "border-rose-400 bg-rose-50 text-rose-700"
                  : "border-border bg-white hover:border-fuchsia-300 hover:bg-fuchsia-50/40 text-foreground"
              } ${picked !== null && !isPicked && !isCorrect ? "opacity-50" : ""}`}
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
              <span className="font-mono">
                {direction === "formula-name" ? o.name : o.formula}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hint + Next */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowHint((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-600 hover:text-fuchsia-700 rounded-full bg-fuchsia-50 px-3 py-1.5 border border-fuchsia-200"
        >
          <Lightbulb className="h-3.5 w-3.5" />
          {showHint ? "Ocultar pista" : "Ver pista"}
        </button>
        {picked !== null && (
          <button
            onClick={next}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
          >
            Siguiente <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showHint && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Pista:</strong> {current.hint}
            </div>
          </div>
        </div>
      )}

      {picked !== null && (
        <div
          className={`rounded-xl p-4 text-sm border ${
            picked === correctIdx
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-start gap-2">
            {picked === correctIdx ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-bold mb-1">
                {picked === correctIdx ? "¡Correcto!" : `Era: ${current.name} (${current.formula})`}
              </div>
              <div className="leading-relaxed">{current.explanation}</div>
            </div>
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetScore}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" />
          Reiniciar marcador
        </button>
        <span className="text-[10px] text-muted-foreground/70">
          {pool.length} compuestos en el banco
        </span>
      </div>

      <Insight color="fuchsia" title="¿Cómo se nombran?" icon={<Atom className="h-4 w-4" />}>
        <strong>Inorgánicos:</strong> Óxidos (metal/no-metal + O, prefijos mono/di/tri si hace falta), Hidróxidos (OH⁻), Ácidos (H + no-metal → -hídrico; H + O + no-metal → -ico/-oso), Sales (terminación -uro para binarias, -ato/-ito para oxosales).<br />
        <strong>Orgánicos:</strong> cuenta los C: met-(1), et-(2), prop-(3), but-(4)... y agrega el sufijo: -ano (alcanos), -eno (alquenos), -anol (alcoholes), -anona (cetonas), ácido -anoico (carboxílicos).
      </Insight>
    </div>
  );
}
