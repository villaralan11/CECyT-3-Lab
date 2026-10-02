import { Breadcrumb } from "@/components/site/ui";
import VerbTensesTrainer from "@/components/simulators/verb-tenses-trainer";

export const metadata = {
  title: "Grammar · Verb Tenses — CECyT No. 3 Lab",
  description: "12 ejercicios de tiempos verbales con marcadores: since, last year, look!, by+fecha, yet, while.",
};

export default function VerbTensesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Inglés", href: "/ingles" },
        { label: "Verb Tenses" },
      ]} />
      <VerbTensesTrainer />
    </div>
  );
}
