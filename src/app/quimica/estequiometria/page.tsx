import { Breadcrumb } from "@/components/site/ui";
import EstequiometriaSimulator from "@/components/simulators/estequiometria-simulator";
import { FailureWithSave } from "@/components/didactic/failure-with-save";
import { WorkedExampleCard } from "@/components/didactic/worked-example";

export const metadata = {
  title: "Estequiometría · Reactivo Limitante — CECyT No. 3 Lab",
  description: "Secuencia falla → simulador reactivo limitante → ejemplo: 4 reacciones, masas molares reales, cálculo de rondas y rendimiento teórico.",
};

const FAILURE = {
  question: "Tienes 10 g de H₂ y 10 g de O₂ para 2H₂ + O₂ → 2H₂O. ¿Cuál limita?",
  options: [
    "El H₂ (porque tiene más moles)",
    "El O₂ (aunque tienen igual masa, O₂ pesa 16× más por mol)",
    "Ninguno, sobra igual",
    "El H₂O (es el producto)",
  ],
  correct: 1,
  reveal: "10 g H₂ = 4.96 mol ÷ 2 = 2.48 rondas; 10 g O₂ = 0.31 mol ÷ 1 = 0.31 rondas. Gana el O₂ con menos rondas. La masa engaña: lo que cuenta es moles ÷ coeficiente. Prueba abajo moviendo los sliders de 8 a 10 g.",
};

const EXAMPLE = {
  title: "Agua con 8 g de cada reactivo — 2H₂ + O₂ → 2H₂O",
  problem: "Con 8 g de H₂ y 8 g de O₂, ¿cuánto H₂O obtienes y cuánto sobra? Sigue el flujo masa→moles→rondas.",
  steps: [
    {
      title: "Convierte masa a moles",
      math: "H₂: 8 ÷ 2.016 = 3.97 mol;  O₂: 8 ÷ 31.998 = 0.25 mol",
      prompt: "¿Cuántos moles son 8 g de H₂?",
      options: ["0.25 mol", "3.97 mol", "8 mol"],
      correct: 1,
      explanation: "moles = masa ÷ masa molar. H₂ es liviano (2 g/mol) → muchos moles; O₂ pesado (32 g/mol) → pocos moles.",
    },
    {
      title: "Divide por coeficiente → rondas",
      math: "H₂: 3.97 ÷ 2 = 1.98 rondas;  O₂: 0.25 ÷ 1 = 0.25 rondas",
      prompt: "¿Qué es 'rondas' y cuál es menor?",
      options: ["Rondas = moles × coef, menor es H₂", "Rondas = moles ÷ coef, menor es O₂", "Rondas = masa ÷ coef"],
      correct: 1,
      explanation: "Rondas = moles disponibles ÷ lo que pide la ecuación. Min(1.98, 0.25) = 0.25 → O₂ limita. Solo 0.25 veces puedes hacer la reacción.",
    },
    {
      title: "Rendimiento y sobrante",
      math: "H₂O: 0.25×2×18.015 = 9.01 g;  H₂ sobra: 8 − 0.25×2×2.016 = 7.0 g",
      prompt: "¿Cuánto H₂O teórico obtienes?",
      options: ["4.5 g", "9.0 g", "16 g"],
      correct: 1,
      explanation: "moles H₂O = rondas × coef = 0.25×2 = 0.5 mol → 0.5×18.015 = 9.0 g. H₂ consumido = 0.25×2 mol = 0.5 mol → 1.0 g, sobran ~7 g.",
    },
  ],
};

export default function EstequiometriaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Química", href: "/quimica" },
        { label: "Estequiometría" },
      ]} />

      <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-4 py-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-fuchsia-700">DEM S Química I · Unidad 3</span>
        <span className="text-muted-foreground">· Cálculos estequiométricos · 4 reacciones con masas molares reales ·</span>
        <span className="text-muted-foreground">Falla → Simulador → Ejemplo</span>
      </div>

      <FailureWithSave data={FAILURE} accent="fuchsia" topicId="06_estequiometria" />

      <EstequiometriaSimulator />

      <WorkedExampleCard data={EXAMPLE} accent="fuchsia" />
    </div>
  );
}
