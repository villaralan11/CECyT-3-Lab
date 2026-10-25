import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Library } from "lucide-react";
import { Breadcrumb, CtaStrip, PageHeader } from "@/components/site/ui";
import { PhetGallery } from "@/components/simulators/phet-gallery";
import { PHET_SIMS, PHET_SITE } from "@/components/simulators/phet-registry";

export const metadata: Metadata = {
  title: "Biblioteca PhET · Física — CECyT No. 3 Lab",
  description:
    "35 simulaciones de física embebidas oficialmente desde PhET: mecánica, oscilaciones, energía, ondas, óptica, electricidad, fluidos y más, con filtros por área del temario.",
};

export default function PhetLibraryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Física", href: "/fisica" },
          { label: "Biblioteca PhET" },
        ]}
      />

      <PageHeader
        eyebrow="Física"
        accent="emerald"
        title={
          <>
            Física ·{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Biblioteca PhET
            </span>
          </>
        }
        subtitle={`${PHET_SIMS.length} simulaciones corriendo embebidas desde los servidores oficiales de PhET (Universidad de Colorado Boulder): péndulo, resortes, circuitos, ondas, óptica y más, organizadas por área del temario.`}
      />

      {/* Cómo funciona la biblioteca */}
      <div className="mt-10 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <Library className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              ¿Cómo funciona esta biblioteca?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Cada tarjeta abre una simulación en su iframe oficial, cargada en
              vivo desde phet.colorado.edu. No descargamos ni copiamos ninguna
              simulación: corren en los servidores originales de PhET dentro de
              un marco embebido, con atribución visible y un enlace para
              abrirlas directamente en su sitio.
            </p>
          </div>
        </div>
      </div>

      <PhetGallery />

      {/* Atribución */}
      <div className="mt-12 rounded-2xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Las simulaciones de esta biblioteca pertenecen a{" "}
          <Link
            href={PHET_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
          >
            PhET Interactive Simulations · University of Colorado Boulder
            <ExternalLink className="h-3 w-3" />
          </Link>{" "}
          y se muestran mediante sus iframes oficiales con fines educativos y
          atribución. Este sitio no está afiliado a PhET ni a la Universidad de
          Colorado.
        </p>
      </div>

      <div className="mt-12">
        <CtaStrip
          title="¿Quieres ir más a fondo?"
          description="Nuestros simuladores propios de cinemática tienen gráficas en vivo, botones de paso y notas pedagógicas escritas a la medida del temario."
          primaryLabel="Ir a nuestros simuladores"
          primaryHref="/fisica"
          secondaryLabel="Ver retos"
          secondaryHref="/retos"
        />
      </div>
    </div>
  );
}
