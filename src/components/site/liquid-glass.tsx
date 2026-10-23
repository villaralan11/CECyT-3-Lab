"use client";

/**
 * ===================================================================
 * LIQUID GLASS v2 — material de interfaz con pipeline óptico real
 * ===================================================================
 * Técnica transcrita del estudio de referencia liquid-glass
 * (bundle `index-BaI80U2e.js`, shader f4 — extraído con REA CLI +
 * análisis manual del bundle):
 *
 *   SDF superelipse → campo de distancia → refracción con Snell
 *   (thetaI = asin(xR²), thetaT = asin(1/IOR·sin θI), bend ∝ tan Δθ)
 *   → dispersión por canal N_R=0.98 · N_G=1.0 · N_B=1.02
 *   → fresnel en banda (rim light) → glare especular por ángulo.
 *
 * Adaptación DOM (Chromium):
 *   • Mapa de desplazamiento (canvas→PNG dataURL): codifica la bend
 *     de arista con perfil pow(1−t, 2.4) — equivalente discreto del
 *     tan Δθ snelliano — MÁS una lente local alrededor del cursor
 *     (bulga gaussiana σ≈55px) que se regenera con rAF.
 *   • Aberración cromática: tres feColorMatrix separan R/G/B y tres
 *     feDisplacementMap los desplazan con escala ±2% antes de
 *     recomponerlos con feComposite arithmetic — el mismo split
 *     (1 − (N_c−1)·factor) del shader original.
 *   • Fresnel + glare: hairline cenital, oclusión inferior y un
 *     especular radial que sigue al puntero (rAF, mix soft-light).
 *
 * Degradación: Safari/Firefox o hardware débil reciben blur+saturate
 * elegante sin refracción. prefers-reduced-motion congela la lente.
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
/* Generación del filtro                                               */
/* ------------------------------------------------------------------ */

let filterUid = 0;
let noiseUrl: string | null = null;

type GlassFilter = { id: string; svg: SVGSVGElement; feImage: SVGFEImageElement; wq: number; hq: number };

const glassFilters = new Map<string, GlassFilter>();

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
/** Grosor de la banda de refracción en px CSS (≈ u_refThickness del estudio). */
const BEND_EDGE_PX = 26;
const CURSOR_SIGMA = 55;
const CURSOR_BEND = 0.55; // fracción del bend máximo para la bulga del cursor

type Cursor = { x: number; y: number } | null;

/**
 * Mapa RGBA (R = offset X, G = offset Y; 0.5 = neutral).
 *  • Aristas: dirección hacia la arista más cercana, peso pow(1−t,2.4)
 *    — el perfil de refracción del shader (tan Δθ) en su forma discreta.
 *  • Cursor: convergencia gaussiana alrededor del puntero (lente bulga).
 */
function drawBendMap(wq: number, hq: number, cursor: Cursor): string {
  const S = MAP_SIZE;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(S, S);
  const data = img.data;
  const pxPerUvX = wq / S; // px CSS reales por unidad del mapa
  const pxPerUvY = hq / S;
  const maxSpan = Math.min(wq, hq) / 2;
  const edge = Math.min(BEND_EDGE_PX, maxSpan);
  // cursor e y ya vienen en px CSS del elemento — el bucle usa ese espacio
  const cur = cursor;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      // distancias REALES (px CSS) a las aristas
      const dxE = Math.min(x, S - 1 - x) * pxPerUvX;
      const dyE = Math.min(y, S - 1 - y) * pxPerUvY;
      const d = Math.min(dxE, dyE);
      const t = Math.max(0, Math.min(d / edge, 1));
      const edgeWgt = Math.pow(1 - t, 2.4);
      // dirección de muestreo: hacia la arista más cercana (solo eje dominante)
      const dirX = dxE <= dyE ? (x < S / 2 ? 1 : -1) : 0;
      const dirY = dyE < dxE ? (y < S / 2 ? 1 : -1) : 0;
      // lente del cursor: converger hacia el puntero con falloff gaussiano
      let lensX = 0;
      let lensY = 0;
      if (cur) {
        // coordenada uv → en el espacio del elemento (px)
        const px = (x + 0.5) * pxPerUvX;
        const py = (y + 0.5) * pxPerUvY;
        const dx = cur.x - px;
        const dy = cur.y - py;
        const dist = Math.hypot(dx, dy);
        const g = Math.exp(-(dist * dist) / (2 * CURSOR_SIGMA * CURSOR_SIGMA));
        const inv = dist > 1e-3 ? 1 / dist : 0;
        lensX = dx * inv * g * CURSOR_BEND;
        lensY = dy * inv * g * CURSOR_BEND;
      }
      // codificación feDisplacementMap: canal = 0.5 + offset_unitario/2
      const rEnc = Math.max(-1, Math.min(1, dirX * edgeWgt + lensX));
      const gEnc = Math.max(-1, Math.min(1, dirY * edgeWgt + lensY));
      const i = (y * S + x) * 4;
      data[i] = Math.round((0.5 + rEnc / 2) * 255);
      data[i + 1] = Math.round((0.5 + gEnc / 2) * 255);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function ensureGlassFilter(w: number, h: number, bend: number): GlassFilter | null {
  if (!needsLens()) return null;
  const wq = Math.max(64, Math.min(1600, Math.round(w / 64) * 64));
  const hq = Math.max(32, Math.min(300, Math.round(h / 12) * 12));
  const key = `${wq}x${hq}b${bend}`;
  const cached = glassFilters.get(key);
  if (cached) return cached;
  const dpr = window.devicePixelRatio || 1;
  const id = `lg-lens-${(filterUid++).toString(36)}`;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  const filter = document.createElementNS(NS, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "-5%");
  filter.setAttribute("y", "-5%");
  filter.setAttribute("width", "110%");
  filter.setAttribute("height", "110%");
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const feImg = document.createElementNS(NS, "feImage");
  const map = drawBendMap(wq, hq, null);
  if (!map) return null;
  feImg.setAttribute("href", map);
  feImg.setAttribute("preserveAspectRatio", "none");
  feImg.setAttribute("result", "map");

  // separación de canales (para la dispersión N_R/N_G/N_B)
  const chan = (chanIdx: 0 | 1 | 2, result: string) => {
    const m = document.createElementNS(NS, "feColorMatrix");
    m.setAttribute("in", "SourceGraphic");
    m.setAttribute("type", "matrix");
    m.setAttribute("values", chanIdx === 0
      ? "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1"
      : chanIdx === 1
      ? "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0 1"
      : "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0 1");
    m.setAttribute("result", result);
    return m;
  };
  const rOnly = chan(0, "rOnly");
  const gOnly = chan(1, "gOnly");
  const bOnly = chan(2, "bOnly");

  // desplazamiento por canal: escala ±2% ≈ dispersión del shader
  const disp = (inName: string, scale: number, result: string) => {
    const d = document.createElementNS(NS, "feDisplacementMap");
    d.setAttribute("in", inName);
    d.setAttribute("in2", "map");
    d.setAttribute("scale", String(scale));
    d.setAttribute("xChannelSelector", "R");
    d.setAttribute("yChannelSelector", "G");
    d.setAttribute("result", result);
    return d;
  };
  const bendScale = bend * 2 * dpr;
  const rDisp = disp("rOnly", bendScale * 0.98, "rDisp");
  const gDisp = disp("gOnly", bendScale * 1.0, "gDisp");
  const bDisp = disp("bOnly", bendScale * 1.02, "bDisp");

  // recomposición aditiva
  const merge = (inName: string, in2: string, result: string) => {
    const m = document.createElementNS(NS, "feComposite");
    m.setAttribute("in", inName);
    m.setAttribute("in2", in2);
    m.setAttribute("operator", "arithmetic");
    m.setAttribute("k1", "0");
    m.setAttribute("k2", "1");
    m.setAttribute("k3", "1");
    m.setAttribute("k4", "0");
    m.setAttribute("result", result);
    return m;
  };
  const rgMerge = merge("rDisp", "gDisp", "rgMerge");
  const full = merge("rgMerge", "bDisp", "");

  filter.appendChild(feImg);
  filter.appendChild(rOnly);
  filter.appendChild(gOnly);
  filter.appendChild(bOnly);
  filter.appendChild(rDisp);
  filter.appendChild(gDisp);
  filter.appendChild(bDisp);
  filter.appendChild(rgMerge);
  filter.appendChild(full);
  svg.appendChild(filter);
  document.body.appendChild(svg);
  const ref: GlassFilter = { id, svg, feImage: feImg, wq, hq };
  glassFilters.set(key, ref);
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
/* Efectos reactivos (rAF-throttled)                                   */
/* ------------------------------------------------------------------ */

function usePointerSpecular(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100;
      const ny = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100;
      el.style.setProperty("--lg-mx", `${nx}%`);
      el.style.setProperty("--lg-my", `${ny}%`);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);
  return ref;
}

/**
 * Lente local que sigue al puntero: regenera el mapa de bend con la
 * bulga gaussiana. Cuantizado a 10px con rate-limit temporal (~24ms)
 * para no saturar el hilo: una regeneración son ~2ms de canvas.
 */
function useCursorLens(
  enabled: boolean,
  glass: GlassFilter | null,
  bend: number
) {
  const ref = useRef<HTMLElement | null>(null);
  const lastPos = useRef<{ x: number; y: number; t: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !glass) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const regen = (cursor: { x: number; y: number } | null) => {
      const data = drawBendMap(glass.wq, glass.hq, cursor);
      // referencia en vivo: inmune a remontajes/HMR de la gráfica SVG
      const fe = document.querySelector(`svg filter[id="${glass.id}"] feImage`);
      if (data && fe) fe.setAttribute("href", data);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = performance.now();
      const last = lastPos.current;
      if (
        last &&
        Math.abs(last.x - x) < 10 &&
        Math.abs(last.y - y) < 10 &&
        now - last.t < 24
      ) {
        return;
      }
      lastPos.current = { x, y, t: now };
      regen({ x, y });
    };
    const onLeave = () => {
      lastPos.current = null;
      regen(null);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, glass, bend]);
  return ref;
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export type GlassVariant = "nav" | "panel" | "button" | "sheet";

const VARIANT_OPTS: Record<
  GlassVariant,
  { blur: string; saturate: number; tint: number; bend: number }
> = {
  nav: { blur: "18px", saturate: 1.9, tint: 0.46, bend: 16 },
  panel: { blur: "14px", saturate: 1.75, tint: 0.4, bend: 20 },
  button: { blur: "10px", saturate: 1.65, tint: 0.38, bend: 12 },
  sheet: { blur: "24px", saturate: 2.0, tint: 0.6, bend: 18 },
};

export type LiquidGlassProps = React.HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: GlassVariant;
  /** Especular + lente que siguen al puntero */
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
  const bend = refraction ?? opts.bend;
  const rootRef = useRef<HTMLElement | null>(null);
  const specRef = usePointerSpecular(interactive);
  const [filter, setFilter] = useState<GlassFilter | null>(null);
  const [noise, setNoise] = useState<string>("");
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const lensRef = useCursorLens(interactive, filter, bend);

  const measure = () => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width);
    const h = Math.max(12, Math.round(r.height));
    setDims((prev) =>
      prev && Math.abs(prev.w - w) < 64 && Math.abs(prev.h - h) < 8 ? prev : { w, h }
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
    setFilter(ensureGlassFilter(dims.w, dims.h, bend));
  }, [dims, bend]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        rootRef.current = node;
        specRef.current = node;
        lensRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef && typeof forwardedRef === "object") {
          (forwardedRef as { current: HTMLElement | null }).current = node;
        }
      }}
      className={cn("relative isolate overflow-hidden", className)}
      style={style}
      {...rest}
    >
      {/* Capas 1+2 — material óptico (bend → dispersión → blur → saturate) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={
          {
            background: `linear-gradient(to bottom, rgb(255 255 255 / ${(opts.tint + 0.1).toFixed(3)}), rgb(255 255 255 / ${opts.tint.toFixed(3)}))`,
            backdropFilter: filter
              ? `url(#${filter.id}) blur(${opts.blur}) saturate(${opts.saturate})`
              : `blur(${opts.blur}) saturate(${opts.saturate})`,
            WebkitBackdropFilter: `blur(${opts.blur}) saturate(${opts.saturate})`,
          } as CSSProperties
        }
      />
      {/* Capa 3 — fresnel: rim cenital + oclusión inferior (LCH del shader) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow:
            "inset 0 1.5px 0.5px -0.5px rgb(255 255 255 / 0.95), inset 0 -1px 0 rgb(60 45 55 / 0.11), inset 1px 0 0.5px rgb(255 255 255 / 0.35), inset -1px 0 0.5px rgb(255 255 255 / 0.35)",
        }}
      />
      {/* Capa 3b — glare especular reactivo al puntero */}
      {interactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(240px circle at var(--lg-mx, 50%) var(--lg-my, -30%), rgb(255 255 255 / 0.65), transparent 72%)",
            opacity: 0.45,
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
            opacity: 0.045,
            mixBlendMode: "overlay",
          }}
        />
      )}
      {children}
    </Tag>
  );
});
