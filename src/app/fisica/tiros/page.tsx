import { Breadcrumb } from "@/components/site/ui";
import TirosSimulator from "@/components/simulators/tiros-simulator";

export const metadata = {
  title: "Los 3 Tiros · Cinemática 2D — CECyT No. 3 Lab",
  description: "Laboratorio de lanzamientos: tiro vertical, horizontal y parabólico en la Tierra, la Luna, Marte y Júpiter, con historial comparativo.",
};

export default function TirosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Física", href: "/fisica" },
        { label: "Los 3 tiros" },
      ]} />
      <TirosSimulator />
    </div>
  );
}
