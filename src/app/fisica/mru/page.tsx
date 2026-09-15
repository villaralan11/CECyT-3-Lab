import { Breadcrumb } from "@/components/site/ui";
import MRUSimulator from "@/components/simulators/mru-simulator";

export const metadata = {
  title: "MRU · Movimiento Rectilíneo Uniforme — CECyT No. 3 Lab",
  description: "Simulador interactivo de MRU: velocidad constante, aceleración cero, gráficas x-t y v-t con área sombreada.",
};

export default function MRUPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Física", href: "/fisica" },
        { label: "MRU" },
      ]} />
      <MRUSimulator />
    </div>
  );
}
