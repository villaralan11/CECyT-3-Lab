import { Breadcrumb } from "@/components/site/ui";
import ModalVerbsTrainer from "@/components/simulators/modal-verbs-trainer";

export const metadata = {
  title: "Grammar · Modal Verbs — CECyT No. 3 Lab",
  description: "10 ejercicios sobre must, can, might, should: obligación, prohibición, posibilidad, deducción, permiso.",
};

export default function ModalVerbsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Inglés", href: "/ingles" },
        { label: "Modal Verbs" },
      ]} />
      <ModalVerbsTrainer />
    </div>
  );
}
