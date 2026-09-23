import { Breadcrumb } from "@/components/site/ui";
import IUPACTrainer from "@/components/simulators/iupac-trainer";
import { FailureWithSave } from "@/components/didactic/failure-with-save";
import { WorkedExampleCard } from "@/components/didactic/worked-example";

export const metadata = {
  title: "Nomenclatura IUPAC — CECyT No. 3 Lab",
  description: "Secuencia completa falla productiva → simulador → ejemplo resuelto: 25 compuestos orgánicos e inorgánicos (DEM S Química I, Unidad 2).",
};

const FAILURE = {
  question: "Tu compañero dice que Fe₂O₃ es «óxido de hierro (II)». ¿Tiene razón?",
  options: [
    "Sí, el hierro siempre actúa con valencia II",
    "No: cada O aporta −2 (×3 = −6), así que cada Fe es +3 → óxido de hierro (III)",
    "No, lo correcto es trióxido de dihierro",
    "Sí, (II) y (III) son equivalentes",
  ],
  correct: 1,
  reveal: "3 oxígenos × (−2) = −6 y la fórmula es neutra, así que los 2 Fe deben sumar +6: cada uno es Fe³⁺. Por eso el DEMS pide el nombre Stock óxido de hierro (III); (II) correspondería a FeO. Ojo: «trióxido de dihierro» es un nombre sistemático válido, pero no es el que se evalúa aquí. Confundir la valencia es justo el error que entrenarás abajo.",
};

const EXAMPLE = {
  title: "Sulfato de hierro (II) — FeSO₄",
  problem: "Nombra FeSO₄ paso a paso. Es la sal verde que se usa en laboratorio. ¿Por qué no es 'sulfato de hierro (III)' ni 'sulfito'?",
  steps: [
    {
      title: "Separa los iones",
      math: "FeSO₄ → Fe²⁺ + SO₄²⁻  (catión + anión)",
      prompt: "¿Qué anión es SO₄²⁻?",
      options: ["Sulfito (SO₃²⁻)", "Sulfato (SO₄²⁻)", "Sulfuro (S²⁻)"],
      correct: 1,
      explanation: "SO₄²⁻ es sulfato (viene de H₂SO₄ ácido sulfúrico → -ico → -ato). Sulfito sería SO₃²⁻, sulfuro S²⁻.",
    },
    {
      title: "Determina la valencia del metal",
      math: "SO₄²⁻ es 2−, la sal es neutra → Fe debe ser 2+",
      prompt: "¿Qué valencia del hierro compensa exactamente al sulfato?",
      options: ["Fe⁺ (I)", "Fe²⁺ (II)", "Fe³⁺ (III)"],
      correct: 1,
      explanation: "Para neutralizar 2− necesitas 2+. Si Fe fuera 3+, necesitarías otra proporción. Por eso es hierro (II).",
    },
    {
      title: "Aplica la regla de sales oxosal",
      math: "Metal + oxoanión → '...ato de metal (valencia)'",
      prompt: "¿Cuál es el nombre IUPAC correcto?",
      options: ["Sulfito de hierro (II)", "Sulfato de hierro (III)", "Sulfato de hierro (II)"],
      correct: 2,
      explanation: "Ácido sulfúrico → sulfato. Hierro con valencia II → (II). Correcto: sulfato de hierro (II). Practica ahora en el simulador con FeSO₄ y compáralo con Fe₂O₃.",
    },
  ],
};

export default function IUPACPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Química", href: "/quimica" },
        { label: "Nomenclatura IUPAC" },
      ]} />

      <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-4 py-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-fuchsia-700">DEM S Química I · Unidad 2</span>
        <span className="text-muted-foreground">· Nomenclatura sistemática y Stock · 25 compuestos validados (RH 2024) ·</span>
        <span className="text-muted-foreground">Falla → Simulador → Ejemplo</span>
      </div>

      <FailureWithSave data={FAILURE} accent="fuchsia" topicId="04_iupac" />

      <IUPACTrainer />

      <WorkedExampleCard data={EXAMPLE} accent="fuchsia" />
    </div>
  );
}
