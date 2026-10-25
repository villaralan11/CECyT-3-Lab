import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary">
      <div className="module-col py-12">
        {/* Marca */}
        <div className="flex items-center gap-3">
          <img
            src="/cecyt3-logo.png"
            alt="CECyT No. 3 — Estanislao Ramírez Ruiz — IPN"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover ring-1 ring-border bg-white"
          />
          <div>
            <div className="app-subhead font-semibold text-foreground">CECyT No. 3 IPN</div>
            <div className="app-caption uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              Laboratorio virtual
            </div>
          </div>
        </div>

        {/* Notas al pie */}
        <div className="mt-6 max-w-3xl space-y-2 app-footnote text-muted-foreground">
          <p>
            Simuladores, retos y ejemplos resueltos de Física, Química e Inglés con
            secuencia didáctica basada en evidencia: falla productiva, simulador,
            ejemplo resuelto.
          </p>
          <p>
            Codebase con generación y sintaxis asistida por IA · QA, auditoría y
            validación bajo supervisión directa.
          </p>
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 app-footnote text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
          Plan DEMS · IPN
        </div>

        {/* Directorio */}
        <div className="mt-8 grid gap-10 border-t border-border pt-8 sm:grid-cols-3">
          <nav aria-label="Plataforma">
            <h3 className="app-footnote font-semibold text-foreground">Plataforma</h3>
            <ul className="mt-4 space-y-2.5 app-footnote">
              {[
                { l: "Explorar materias", h: "/" },
                { l: "Física", h: "/fisica" },
                { l: "Química", h: "/quimica" },
                { l: "Inglés", h: "/ingles" },
                { l: "Laboratorios", h: "/laboratorios" },
                { l: "Retos de 5 minutos", h: "/retos" },
                { l: "Mi progreso", h: "/progreso" },
              ].map((it) => (
                <li key={it.l}>
                  <Link
                    href={it.h}
                    className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-2"
                  >
                    {it.l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Institución">
            <h3 className="app-footnote font-semibold text-foreground">Institución</h3>
            <ul className="mt-4 space-y-2.5 app-footnote">
              <li>
                <a
                  href="https://cecyt3.ipn.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-2"
                >
                  Sitio oficial CECyT No. 3
                  <span className="sr-only">(abre en nueva pestaña)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.ipn.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-2"
                >
                  Instituto Politécnico Nacional
                  <span className="sr-only">(abre en nueva pestaña)</span>
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="app-footnote font-semibold text-foreground">
              Dirección técnica y desarrollo
            </h3>
            <p className="mt-4 app-footnote text-muted-foreground">
              Alan Antonio Molina Villar — Servicio Social / Portafolio
            </p>
          </div>
        </div>

        {/* Dirección */}
        <div className="mt-8 border-t border-border pt-4 app-footnote text-muted-foreground">
          CECyT No. 3 «Estanislao Ramírez Ruiz» · Av. Carlos Hank González S/N ·
          Ecatepec de Morelos
        </div>

        {/* Barra final */}
        <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 app-footnote text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>Copyright © 2026 CECyT No. 3 — Estanislao Ramírez Ruiz — IPN</div>
          <div>México</div>
        </div>
      </div>
    </footer>
  );
}
