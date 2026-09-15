import Link from "next/link";
import { Atom, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/cecyt3-logo.png" alt="CECyT No. 3 — Estanislao Ramírez Ruiz — IPN" width={40} height={40} className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-white/20 bg-white" />
              <div>
                <div className="text-base font-bold text-background">CECyT No. 3 IPN</div>
                <div className="text-[10px] uppercase tracking-[0.18em] opacity-70 font-semibold">
                  Laboratorio virtual
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-md">
              Simuladores, retos y ejemplos resueltos de Física, Química e Inglés con
              secuencia didáctica basada en evidencia: falla productiva, simulador,
              ejemplo resuelto.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
              <span className="opacity-80">Plan DEMS · IPN</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-background/60">
              Plataforma
            </div>
            <ul className="mt-4 space-y-2 text-sm">
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
                  <Link href={it.h} className="hover:text-background transition-colors inline-flex items-center gap-1.5">
                    <span className="text-fuchsia-400">›</span>
                    {it.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-background/60">
              Institución
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-background transition-colors inline-flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  Sitio oficial CECyT No. 3
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors inline-flex items-center gap-1.5">
                  <span className="text-amber-400">›</span>
                  Instituto Politécnico Nacional
                </a>
              </li>
            </ul>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed">
              <div className="font-semibold text-background">Dirección técnica y desarrollo</div>
              <div className="mt-1 opacity-70">
                Alan Antonio Molina Villar — Servicio Social / Portafolio
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="opacity-70">
            CECyT No. 3 «Estanislao Ramírez Ruiz» · Av. Carlos Hank González S/N ·
            Ecatepec de Morelos
          </div>
          <div className="opacity-60">
            Codebase con generación y sintaxis asistida por IA · QA, auditoría y
            validación bajo supervisión directa
          </div>
        </div>
      </div>
    </footer>
  );
}
