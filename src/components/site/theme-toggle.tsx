"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Conmutador de tema claro/oscuro. El estado inicial lo fija un       */
/* script en <head> antes del primer pintado; aquí solo se alterna     */
/* la clase .dark en <html> y se persiste la preferencia.              */
/* ------------------------------------------------------------------ */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el tema vive en <html> (script pre-pintado); se lee solo tras montar para evitar mismatch de hidratación
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cecyt3-theme", next ? "dark" : "light");
    } catch {
      /* almacenamiento no disponible */
    }
  };

  return (
    <button
      type="button"
      className="lab-theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
