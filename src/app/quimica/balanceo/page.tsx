import { Breadcrumb } from "@/components/site/ui";
import BalanceoSimulator from "@/components/simulators/balanceo-simulator";
import { FailureWithSave } from "@/components/didactic/failure-with-save";
import { WorkedExampleCard } from "@/components/didactic/worked-example";

export const metadata = {
  title: "Balanceo de Ecuaciones — CECyT No. 3 Lab",
  description: "Secuencia falla → balanceador con conteo vivo → ejemplo resuelto: 8 reacciones (combustión, síntesis, oxidación) verificadas ley de Lavoisier.",
};

const FAILURE = {
  question: "Tu compañero balancea CH₄ + O₂ → CO₂ + H₂O como CH₄ + O₂ → CO₂ + 2H₂O y dice 'ya está, H está ok'. ¿Es correcto?",
  options: [
    "Sí, con 2H₂O ya cuadra todo",
    "No, falta balancear O: la izquierda tiene 2 O y la derecha 4 O",
    "No, hay que cambiar el subíndice del O₂ a O₄",
    "Sí, pero falta poner 2CO₂",
  ],
  correct: 1,
  reveal: "Balanceando H sin revisar O es el error #1. Derecha: CO₂ (2 O) + 2H₂O (2 O) = 4 O, izquierda solo 2 O. Hay que ajustar el coeficiente del O₂ a 2. Y nunca toques subíndices (O₂→O₄ cambia la sustancia). Practícalo abajo con el conteo vivo.",
};

const EXAMPLE = {
  title: "Combustión de etano — C₂H₆ + O₂ → CO₂ + H₂O",
  problem: "Balancea la combustión del etano paso a paso sin tocar subíndices. Solo coeficientes. Usa el método de tanteo.",
  steps: [
    {
      title: "Empieza por el C (aparece en pocas sustancias)",
      math: "C₂H₆ → 2 CO₂   (2 C a la derecha para 2 C a la izquierda)",
      prompt: "¿Qué coeficiente en CO₂ iguala los 2 C del etano?",
      options: ["1 CO₂", "2 CO₂", "3 CO₂"],
      correct: 1,
      explanation: "C₂H₆ tiene 2 C, cada CO₂ tiene 1 C → necesitas 2 CO₂. Ya no toques C.",
    },
    {
      title: "Balancea el H",
      math: "C₂H₆ (6 H) → 3 H₂O  (3 × 2 H = 6 H)",
      prompt: "¿Cuántas H₂O para 6 H?",
      options: ["2 H₂O", "3 H₂O", "6 H₂O"],
      correct: 1,
      explanation: "6 H a la izquierda, cada H₂O aporta 2 H → 6/2 = 3 H₂O.",
    },
    {
      title: "Deja el O al final y verifica",
      math: "2 CO₂ (4 O) + 3 H₂O (3 O) = 7 O → 3.5 O₂ → ×2 → 2C₂H₆+7O₂→4CO₂+6H₂O",
      prompt: "¿Cuál es el balance final entero más simple?",
      options: ["C₂H₆+3.5O₂→2CO₂+3H₂O", "2C₂H₆+7O₂→4CO₂+6H₂O", "C₂H₆+7O₂→2CO₂+3H₂O"],
      correct: 1,
      explanation: "4+3=7 O a la derecha → 7/2=3.5 O₂. Para evitar ½, multiplica todo ×2. Prueba ahora en el simulador con 'Combustión de etano'.",
    },
  ],
};

export default function BalanceoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Química", href: "/quimica" },
        { label: "Balanceo" },
      ]} />

      <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-4 py-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-fuchsia-700">DEM S Química I · Unidad 3</span>
        <span className="text-muted-foreground">· Ley de conservación de la masa · 8 reacciones validadas (RH 2024) ·</span>
        <span className="text-muted-foreground">Falla → Simulador → Ejemplo</span>
      </div>

      <FailureWithSave data={FAILURE} accent="fuchsia" topicId="05_balanceo" />

      <BalanceoSimulator />

      <WorkedExampleCard data={EXAMPLE} accent="fuchsia" />
    </div>
  );
}
