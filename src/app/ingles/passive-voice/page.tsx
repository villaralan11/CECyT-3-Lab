import { Breadcrumb } from "@/components/site/ui";
import PassiveVoiceTrainer from "@/components/simulators/passive-voice-trainer";

export const metadata = {
  title: "Grammar · Passive Voice — CECyT No. 3 Lab",
  description: "8 transformaciones activa → pasiva cubriendo todos los tiempos y modales.",
};

export default function PassiveVoicePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Inglés", href: "/ingles" },
        { label: "Passive Voice" },
      ]} />
      <PassiveVoiceTrainer />
    </div>
  );
}
