"use client";

/**
 * ===================================================================
 * LIQUID GLASS — material de interfaz
 * ===================================================================
 * Composición (de atrás hacia adelante):
 *
 *  1. BASE (todos los navegadores): backdrop-filter blur + saturate
 *     sobre un tinte blanco translúcido. Estable y barato (GPU).
 *
 *  2. REFRACCIÓN (solo Chromium): el `backdrop` se distorsiona con
 *     feDisplacementMap. El mapa se genera con un canvas: para cada
 *     píxel se calcula la distancia real (en px) a la arista más
 *     cercana; la bend hacia el interior crece con peso pow(1−t, 1.6)
 *     cerca del borde — el "grosor" de una lente. Es agnóstico del
 *     border-radius (el campo de distancia redondea las esquinas solo)
 *     y se cachea por tamaño/debés de fuerza.
 *
 *  3. LUZ: hairline cenital + ocusión inferior, grano sutil y —
 *     opcionalmente — un especular que sigue al puntero (rAF,
 *     desktop only, se desactiva con reduced-motion).
 *
 * Degradación: Safari/Firefox, hardware de ≤2 núcleos o poca memoria
 * reciben las capas 1+3. El material sigue siendo vidrio; solo se
 * omite la refracción. Nada de glass en superficies de contenido.
 * ===================================================================
 */

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Utilidades del filtro                                               */
/* ------------------------------------------------------------------ */

let filterUid = 0;
let noiseUrl: string | null = null;

type LensFilter = { id: string; svg: SVGSVGElement };

const lensFilters = new Map<string, LensFilter>();

function needsLens(): boolean {
  if (typeof window === "undefined") return false;
  if ((window as { __lgNoLens?: boolean }).__lgNoLens) return false;
  const nav = navigator as { hardwareConcurrency?: number; deviceMemory?: number };
  if ((nav.hardwareConcurrency ?? 8) <= 2) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  if (!CSS.supports?.("backdrop-filter", "blur(1px)")) return false;
  const ua = navigator.userAgent;
  const isFirefox = ua.includes("Firefox");
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  if (isFirefox || isSafari) return false; // url() en backdrop-filter solo Chromium
  return true;
}

const MAP_SIZE = 128;
/** Grosor físico de la lente, en px CSS. */
const LENS_EDGE_PX = 16;

/**
 * Mapa RGBA: R = desplazamiento X, G = desplazamiento Y.
 * Codificación: feDisplacementMap aplica offset = scale · (canal − 0.5),
 * así que canal 0.5 = sin desplazamiento, 1.0 = +scale, 0.0 = −scale.
 * La magnitud codificada es constante (mitad de la escala, hacia dentro)
 * y el *peso* decrece con la distancia al borde: b@edge → 0 interior.
 */
function drawLensMap(w: number, h: number): string {
  const S = MAP_SIZE;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(S, S);
  const data = img.data;
  // conversión uv(canvas) → px reales del elemento
  const pxPerUvX = w / S;
  const pxPerUvY = h / S;
  const maxSpan = Math.min(w, h) / 2;
  const edge = Math.min(LENS_EDGE_PX, maxSpan);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      // distancia REAL (px CSS) a cada arista
      const dxE = Math.min(x, S - 1 - x) * pxPerUvX;
      const dyE = Math.min(y, S - 1 - y) * pxPerUvY;
      const d = Math.min(dxE, dyE);
      const t = Math.max(0, Math.min(d / edge, 1));
      const wgt = Math.pow(1 - t, 1.6);
      // feDisplacementMap muestrea SourceGraphic en (x + offset, y + offset):
      // samplear más allá de la arista simula la refracción de una lente
      // convergente (el borde "arrastra" el contenido de afuera hacia adentro).
      const dirX = dxE <= dyE ? (x < S / 2 ? 1 : -1) : 0;
      const dirY = dyE < dxE ? (y < S / 2 ? 1 : -1) : 0;
      const i = (y * S + x) * 4;
      // R/G: 0.5 = neutral; 0.5 ± wgt/2 = bend máxima en la arista, ~0 en el interior
      const rEnc = 0.5 + (dirX * wgt) / 2;
      const gEnc = 0.5 + (dirY * wgt) / 2;
      data[i] = Math.round(rEnc * 255);
      data[i + 1] = Math.round(gEnc * 255);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function ensureLensFilter(w: number, h: number, strength: number): LensFilter | null {
  if (!needsLens()) return null;
  // keys cuantizadas: pocas variantes vivas, sin GC-pressure
  const wq = Math.max(64, Math.min(1600, Math.round(w / 64) * 64));
  const hq = Math.max(32, Math.min(300, Math.round(h / 12) * 12));
  const key = `${wq}x${hq}s${strength}`;
  const cached = lensFilters.get(key);
  if (cached) return cached;
  const id = `lg-lens-${(filterUid++).toString(36)}`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "-5%");
  filter.setAttribute("y", "-5%");
  filter.setAttribute("width", "110%");
  filter.setAttribute("height", "110%");
  filter.setAttribute("color-interpolation-filters", "sRGB");
  const feImg = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
  const map = drawLensMap(wq, hq);
  if (!map) return null;
  feImg.setAttribute("href", map);
  feImg.setAttribute("preserveAspectRatio", "none");
  feImg.setAttribute("result", "map");
  const feDisp = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
  feDisp.setAttribute("in", "SourceGraphic");
  feDisp.setAttribute("in2", "map");
  // bend máxima ≈ strength px CSS; el backdrop está en unidades dpr
  feDisp.setAttribute("scale", String(strength * (window.devicePixelRatio || 1)));
  feDisp.setAttribute("xChannelSelector", "R");
  feDisp.setAttribute("yChannelSelector", "G");
  filter.appendChild(feImg);
  filter.appendChild(feDisp);
  svg.appendChild(filter);
  document.body.appendChild(svg);
  const ref: LensFilter = { id, svg };
  lensFilters.set(key, ref);
  return ref;
}

/** Grano sutil del material (una sola textura, cacheada). */
function getNoiseUrl(): string {
  if (noiseUrl) return noiseUrl;
  const S = 64;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + Math.random() * 18;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  noiseUrl = c.toDataURL();
  return noiseUrl;
}

/* ------------------------------------------------------------------ */
/* Especular que sigue al puntero                                      */
/* ------------------------------------------------------------------ */

function usePointerSpecular(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const raf = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100;
      const ny = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        el.style.setProperty("--lg-mx", `${nx}%`);
        el.style.setProperty("--lg-my", `${ny}%`);
      });
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);
  return ref;
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export type GlassVariant = "nav" | "panel" | "button" | "sheet";

const VARIANT_OPTS: Record<GlassVariant, { blur: string; saturate: number; tint: number; strength: number }> = {
  nav: { blur: "20px", saturate: 1.8, tint: 0.5, strength: 5 },
  panel: { blur: "14px", saturate: 1.7, tint: 0.42, strength: 8 },
  button: { blur: "10px", saturate: 1.6, tint: 0.4, strength: 4 },
  sheet: { blur: "24px", saturate: 1.9, tint: 0.62, strength: 7 },
};

export type LiquidGlassProps = React.HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: GlassVariant;
  /** Especular que reacciona al puntero */
  interactive?: boolean;
  /** Bend máxima de refracción en px (solo Chromium; ignora en fallback) */
  refraction?: number;
};

export const LiquidGlass = forwardRef<HTMLElement, LiquidGlassProps>(function LiquidGlass(
  {
    as,
    variant = "panel",
    interactive = false,
    refraction,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const Tag = (as ?? "div") as ElementType;
  const opts = VARIANT_OPTS[variant];
  const rootRef = useRef<HTMLElement | null>(null);
  const specRef = usePointerSpecular(interactive);
  const [lensId, setLensId] = useState<string | null>(null);
  const [noise, setNoise] = useState<string>("");
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  const measure = () => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width);
    const h = Math.max(12, Math.round(r.height));
    setDims((prev) =>
      prev && Math.abs(prev.w - w) < 64 && prev.h === h ? prev : { w, h }
    );
  };

  useEffect(() => {
    setNoise(getNoiseUrl());
    measure();
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dims) return;
    const f = ensureLensFilter(dims.w, dims.h, refraction ?? opts.strength);
    setLensId(f ? f.id : null);
  }, [dims, refraction, opts.strength]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        rootRef.current = node;
        specRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef && typeof forwardedRef === "object") {
          (forwardedRef as { current: HTMLElement | null }).current = node;
        }
      }}
      className={cn("relative isolate overflow-hidden", className)}
      style={style}
      {...rest}
    >
      {/* Capas 1+2 — material óptico */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={
          {
            background: `linear-gradient(to bottom, rgb(255 255 255 / ${(opts.tint + 0.1).toFixed(3)}), rgb(255 255 255 / ${opts.tint.toFixed(3)}))`,
            backdropFilter: lensId
              ? `blur(${opts.blur}) saturate(${opts.saturate}) url(#${lensId})`
              : `blur(${opts.blur}) saturate(${opts.saturate})`,
            WebkitBackdropFilter: `blur(${opts.blur}) saturate(${opts.saturate})`,
          } as CSSProperties
        }
      />
      {/* Capa 3 — iluminación: hairline cenital + oclusión inferior */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgb(255 255 255 / 0.72), inset 0 -1px 0 rgb(60 45 55 / 0.10), inset 1px 0 0 rgb(255 255 255 / 0.22), inset -1px 0 0 rgb(255 255 255 / 0.22)",
        }}
      />
      {/* Capa 3b — especular reactivo al puntero */}
      {interactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background:
              "radial-gradient(220px circle at var(--lg-mx, 50%) var(--lg-my, -30%), rgb(255 255 255 / 0.55), transparent 72%)",
            opacity: 0.4,
            mixBlendMode: "soft-light",
          }}
        />
      )}
      {/* Capa 4 — grano */}
      {noise && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            backgroundImage: `url(${noise})`,
            backgroundSize: "64px 64px",
            opacity: 0.05,
            mixBlendMode: "overlay",
          }}
        />
      )}
      {children}
    </Tag>
  );
});
