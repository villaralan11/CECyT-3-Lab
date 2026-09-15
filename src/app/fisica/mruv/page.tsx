import { Breadcrumb } from "@/components/site/ui";
import MRUVSimulator from "@/components/simulators/mruv-simulator";

export const metadata = {
  title: "MRUV · Aceleración Constante — CECyT No. 3 Lab",
  description: "Simulador interactivo de MRUV: parábola en x-t, recta en v-t, distinción Acelerando/Frenando en vivo.",
};

export default function MRUVPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Física", href: "/fisica" },
        { label: "MRUV" },
      ]} />
      <MRUVSimulator />
    </div>
  );
}
