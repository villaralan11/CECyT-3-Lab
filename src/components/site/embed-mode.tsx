"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* ------------------------------------------------------------------ */
/* Modo embed: cuando una página se muestra dentro de un iframe del    */
/* catálogo (?embed=1), oculta la barra, el pie y el botón «subir».    */
/* ------------------------------------------------------------------ */
export function EmbedMode() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const embed = new URLSearchParams(window.location.search).get("embed") === "1";
      document.documentElement.classList.toggle("embed", embed);
    } catch {
      /* sin acceso a la URL: ignorar */
    }
  }, [pathname]);

  return null;
}
