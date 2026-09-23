"use client";

import { useEffect, useRef } from "react";

// Paso fijo de física compartido por los simuladores (Euler-Cromer estable).
export const FIXED_DT = 1 / 120;
// Recorte anti-espiral: una pestaña en background no debe avanzar la sim de golpe.
const MAX_FRAME_DT = 0.05;

/**
 * Bucle de animación con paso fijo y acumulador.
 * - La callback vive en un ref: cambiar config NO reinicia el bucle.
 * - El efecto principal depende solo de `active`.
 */
export function useAnimationLoop(
  active: boolean,
  onTick: (dt: number, tsMs: number) => void,
) {
  const onTickRef = useRef(onTick);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let lastTs: number | null = null;
    let acc = 0;
    const step = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const frameDt = Math.min(MAX_FRAME_DT, (ts - lastTs) / 1000);
      lastTs = ts;
      acc += frameDt;
      const steps = Math.floor(acc / FIXED_DT);
      if (steps > 0) {
        acc -= steps * FIXED_DT;
        onTickRef.current(steps * FIXED_DT, ts);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
