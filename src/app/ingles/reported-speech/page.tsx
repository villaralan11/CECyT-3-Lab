import { Breadcrumb } from "@/components/site/ui";
import ReportedSpeechTrainer from "@/components/simulators/reported-speech-trainer";

export const metadata = {
  title: "Grammar · Reported Speech — CECyT No. 3 Lab",
  description: "8 transformaciones con backshift, ajuste de pronombres, marcadores temporales y preguntas sin auxiliar.",
};

export default function ReportedSpeechPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Inglés", href: "/ingles" },
        { label: "Reported Speech" },
      ]} />
      <ReportedSpeechTrainer />
    </div>
  );
}
