import Link from "next/link";

/**
 * Cierre del producto: sobrio, estructurado, sin decoración.
 * La única concesión cromática es el acento guinda institucional.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-black/[0.07] bg-[#fbf8fa] text-foreground">
      {/* hairline institucional */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-guinda-600" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marca + descripción */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/cecyt3-logo.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-black/[0.08] bg-white"
              />
              <span className="leading-tight">
                <span className="block text-[15px] font-semibold tracking-tight">CECyT No. 3 «Estanislao Ramírez Ruiz»</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Instituto Politécnico Nacional
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-[44ch] text-[13.5px] leading-[1.75] text-muted-foreground">
              Laboratorio virtual con simuladores, retos y ejemplos resueltos de
              Física, Química e Inglés — construido sobre la secuencia didáctica
              de falla productiva, experimentación y explicación.
            </p>
          </div>

          {/* Navegación */}
          <nav aria-label="Navegación del pie">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Laboratorio</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              {[
                { l: "Inicio", h: "/" },
                { l: "Física", h: "/fisica" },
                { l: "Química", h: "/quimica" },
                { l: "Inglés", h: "/ingles" },
                { l: "Laboratorios", h: "/laboratorios" },
                { l: "Retos", h: "/retos" },
                { l: "Progreso", h: "/progreso" },
              ].map((it) => (
                <li key={it.l}>
                  <Link href={it.h} className="transition-colors hover:text-guinda-700">
                    {it.l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Institución */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Institución</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li>
                <a
                  href="https://www.cecyt3.ipn.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-guinda-700"
                >
                  Sitio oficial CECyT No. 3
                </a>
              </li>
              <li>
                <a
                  href="https://www.ipn.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-guinda-700"
                >
                  Instituto Politécnico Nacional
                </a>
              </li>
            </ul>
            <p className="mt-6 max-w-[34ch] text-[12px] leading-[1.7] text-muted-foreground">
              Av. Carlos Hank González S/N, Col. Vista Hermosa,
              Ecatepec de Morelos, Estado de México.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-black/[0.07] pt-6 text-[11.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>CECyT No. 3 · IPN — Laboratorio Virtual</p>
          <p className="opacity-70">
            Dirección técnica: Alan Antonio Molina Villar · Plan DEMS · Servicio social
          </p>
        </div>
      </div>
    </footer>
  );
}
