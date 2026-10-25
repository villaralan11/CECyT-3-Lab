"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Car, TrendingUp, Square, Zap, Gauge, MapPin, Flag, Pause, Play, StepBack, StepForward, RotateCcw } from "lucide-react";
import { Readout, SimHeader, Slider, Graph, Insight } from "./shared";

export default function MRUSimulator() {
  const TMAX = 10;
  const TRACK_LEN = 60;

  const [v, setV] = useState(5);
  const [x0, setX0] = useState(0);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [trail, setTrail] = useState<{ x: number; o: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const accumulatorRef = useRef(0);
  const trailRef = useRef<{ x: number; o: number }[]>([]);
  const lastTrailT = useRef(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const x = x0 + v * t;
  const distance = v * t;

  const FIXED_DT = 1 / 120;
  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      accumulatorRef.current = 0;
      return;
    }
    let lastTrailTs = performance.now();
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const frameDt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      accumulatorRef.current += frameDt;
      const steps = Math.floor(accumulatorRef.current / FIXED_DT);
      if (steps > 0) {
        const delta = steps * FIXED_DT;
        accumulatorRef.current -= delta;
        setT((prev) => {
          const next = prev + delta;
          if (next >= TMAX || x0 + v * next >= TRACK_LEN) {
            setRunning(false);
            return Math.min(next, TMAX);
          }
          return next;
        });
        // Trail every ~100ms using fixed steps
        if (ts - lastTrailTs > 100) {
          lastTrailTs = ts;
          const curT = tRef.current + delta;
          const xn = x0 + v * curT;
          trailRef.current = [...trailRef.current.slice(-25), { x: xn, o: 1 }];
          setTrail([...trailRef.current]);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, v, x0]);

  const reset = useCallback(() => {
    setRunning(false);
    setT(0);
    trailRef.current = [];
    setTrail([]);
  }, []);

  const stepBack = useCallback(() => {
    setRunning(false);
    setT((p) => Math.max(0, p - 0.1));
  }, []);
  const stepFwd = useCallback(() => {
    setRunning(false);
    setT((p) => Math.min(TMAX, p + 0.1));
  }, []);

  // Scroll scene into view when play starts
  const scrollToScene = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (t >= TMAX) {
      reset();
      return;
    }
    if (!running) {
      // Starting: scroll to scene first so user can see the animation
      scrollToScene();
    }
    setRunning(!running);
  }, [running, t, TMAX, reset, scrollToScene]);

  const xtPoints = Array.from({ length: 101 }, (_, i) => {
    const tt = (i / 100) * TMAX;
    return { x: tt, y: x0 + v * tt };
  }).filter((p) => p.x <= t + 0.01);
  if (t > 0 && xtPoints[xtPoints.length - 1]?.x < t) {
    xtPoints.push({ x: t, y: x0 + v * t });
  }

  const vtPoints = Array.from({ length: 101 }, (_, i) => {
    const tt = (i / 100) * TMAX;
    return { x: tt, y: v };
  }).filter((p) => p.x <= t + 0.01);
  if (t > 0 && vtPoints[vtPoints.length - 1]?.x < t) {
    vtPoints.push({ x: t, y: v });
  }

  const trackFrac = Math.max(0, Math.min(1, x / TRACK_LEN));

  return (
    <div className="space-y-5">
      <SimHeader
        title="MRU · Movimiento Rectilíneo Uniforme"
        description="Velocidad constante, aceleración cero. Observa el auto recorrer la pista, la gráfica x–t crecer en línea recta y comprueba que el área bajo v–t ES la distancia recorrida."
        badge="Física · Cinemática"
        color="emerald"
      />

      {/* ============ CINEMATIC SCENE ============ */}
      <div ref={sceneRef} className="relative overflow-hidden rounded-3xl border border-border shadow-sm bg-background scroll-mt-20 max-sm:max-h-[42vh] max-sm:sticky max-sm:top-16 max-sm:z-10">
        {/* Cielo papel */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-emerald-50" />

        {/* Silueta lejana baja-contraste */}
        <svg className="absolute bottom-[38%] left-0 w-full" viewBox="0 0 600 80" preserveAspectRatio="none" style={{ height: "64px" }}>
          <polygon points="0,80 70,38 140,58 210,26 290,48 370,20 460,44 540,30 600,52 600,80" fill="#0f766e" opacity="0.1" />
        </svg>

        {/* Distance markers floating above the track */}
        <div className="absolute top-[45%] left-0 right-0 h-6 flex items-end pointer-events-none">
          {Array.from({ length: 7 }, (_, i) => {
            const val = (i / 6) * TRACK_LEN;
            const px = 20 + (i / 6) * 560;
            return (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: `${((px - 20) / 560) * 100}%`, transform: "translateX(-50%)" }}>
                <div className="app-caption tabular-nums text-muted-foreground">{val.toFixed(0)}m</div>
                <div className="h-3 w-px bg-foreground/20" />
              </div>
            );
          })}
        </div>

        {/* SVG Scene with car + track + trail */}
        <svg role="img" aria-label="Simulador cinemático" viewBox="0 0 600 240" className="relative w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Track (road) */}
          <rect x="0" y="170" width="600" height="70" fill="#334155" />
          {/* Lane stripes (moving illusion when car moves) */}
          {Array.from({ length: 12 }, (_, i) => {
            const baseX = i * 60;
            const offset = running ? (t * v * 12) % 60 : 0;
            const xPos = ((baseX - offset) % 600 + 600) % 600;
            return (
              <rect key={i} x={xPos} y="200" width="32" height="4" fill="white" opacity="0.35" rx="2" />
            );
          })}

          {/* Trail particles behind car */}
          {trail.map((p, i) => {
            const px = 20 + (Math.max(0, Math.min(1, p.x / TRACK_LEN)) * 560);
            const age = (trail.length - i) / trail.length;
            return (
              <circle
                key={i}
                cx={px}
                cy={155}
                r={3 + age * 4}
                fill="#10b981"
                opacity={age * 0.5}
              />
            );
          })}

          {/* Start flag */}
          <g transform={`translate(${20 + (x0 / TRACK_LEN) * 560}, 150)`}>
            <line x1="0" y1="-30" x2="0" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <rect x="0" y="-30" width="14" height="10" fill="#a7f3d0" stroke="#10b981" strokeWidth="1" />
            <rect x="0" y="-20" width="14" height="10" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
            <text x="0" y="-36" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">x₀</text>
          </g>

          {/* Finish flag */}
          <g transform="translate(576, 150)">
            <line x1="0" y1="-30" x2="0" y2="20" stroke="#64748b" strokeWidth="2" />
            <g className="finish-flag">
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={i % 2 === 0 ? 0 : 7} y={-30 + Math.floor(i / 2) * 7} width="7" height="7" fill={i % 2 === 0 ? "#334155" : "white"} />
              ))}
            </g>
            <text x="0" y="-36" textAnchor="end" fontSize="9" fill="#64748b" fontWeight="600">META</text>
          </g>

          {/* Car */}
          <g transform={`translate(${20 + trackFrac * 560}, 0)`}>
            {/* Shadow */}
            <ellipse cx="0" cy="172" rx="22" ry="3" fill="#0f172a" opacity="0.18" />
            {/* Car body */}
            <g transform="translate(0, 140)">
              {/* Body */}
              <path d="M -22 15 L -18 5 L -10 -3 L 10 -3 L 18 5 L 22 15 L 22 22 L -22 22 Z" fill="url(#carBody)" stroke="#047857" strokeWidth="1" />
              {/* Cabin */}
              <path d="M -10 -3 L -6 -12 L 8 -12 L 10 -3 Z" fill="url(#carCabin)" stroke="#047857" strokeWidth="1" />
              {/* Window highlight */}
              <path d="M -7 -4 L -4 -10 L 0 -10 L 0 -4 Z" fill="#a7f3d0" opacity="0.6" />
              {/* Wheels */}
              <circle cx="-12" cy="22" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
              <circle cx="-12" cy="22" r="2" fill="#6b7280" />
              <circle cx="12" cy="22" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
              <circle cx="12" cy="22" r="2" fill="#6b7280" />
              {/* Headlight */}
              <circle cx="20" cy="10" r="2" fill="#fef3c7" />
              {/* Velocity vector arrow */}
              {v > 0 && (
                <g>
                  <line x1="22" y1="8" x2={22 + Math.min(40, v * 4)} y2="8" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon
                    points={`${22 + Math.min(40, v * 4)},8 ${22 + Math.min(40, v * 4) - 7},4 ${22 + Math.min(40, v * 4) - 7},12`}
                    fill="#059669"
                  />
                  <text x={22 + Math.min(40, v * 4) / 2} y="0" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="600">v</text>
                </g>
              )}
            </g>
          </g>

          {/* Car icon overlay (hidden, fallback) */}
          <defs>
            <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="carCabin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>

        {/* Overlay info card */}
        <div className="app-glass absolute top-3 left-3 rounded-2xl border border-black/5 px-3.5 py-2 shadow-sm">
          <div className="app-caption uppercase tracking-wider font-semibold text-foreground/55">Tiempo</div>
          <div className="font-mono app-title3 tabular-nums text-foreground">{t.toFixed(2)}s</div>
        </div>
        <div className="app-glass absolute top-3 right-3 rounded-2xl border border-black/5 px-3.5 py-2 shadow-sm">
          <div className="app-caption uppercase tracking-wider font-semibold text-foreground/55">Posición</div>
          <div className="font-mono app-title3 tabular-nums text-foreground">{x.toFixed(2)}m</div>
        </div>

        {/* Floating play controls overlay (bottom-center, like a video player) */}
        <div className="app-dock absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-2 py-1.5">
          <button
            onClick={handleToggle}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 active:bg-emerald-700"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            {running ? "Pausar" : "Iniciar"}
          </button>
          <button
            onClick={stepBack}
            className="inline-flex items-center justify-center h-11 w-11 rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            title="Retroceder 0.1 s"
          >
            <StepBack className="h-4 w-4" />
          </button>
          <button
            onClick={stepFwd}
            className="inline-flex items-center justify-center h-11 w-11 rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            title="Avanzar 0.1 s"
          >
            <StepForward className="h-4 w-4" />
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-11 w-11 rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            title="Reiniciar"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-1.5 left-3 right-3 h-1 rounded-full bg-white/25 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400"
            animate={{ width: `${trackFrac * 100}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Tiempo ${t.toFixed(1)}s, posición ${x.toFixed(1)}m, velocidad ${v.toFixed(1)}m/s`}
      </div>

      {/* ============ READOUTS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Readout label="Tiempo" value={t} unit="s" color="foreground" formula="variable independiente" />
        <Readout label="Posición x" value={x} unit="m" color="emerald" formula={`x₀ + v·t`} />
        <Readout label="Velocidad" value={v} unit="m/s" color="emerald" formula="constante" />
        <Readout label="Distancia" value={distance} unit="m" color="amber" formula="área bajo v-t" />
      </div>

      {/* ============ CONTROLS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider label="Velocidad (v)" value={v} min={0} max={10} step={0.5} unit="m/s" onChange={setV} color="emerald" description="Rapidez constante del auto" />
        <Slider label="Posición inicial (x₀)" value={x0} min={0} max={10} step={1} unit="m" onChange={setX0} color="emerald" description="Dónde arranca el auto" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="app-caption text-muted-foreground">
          ↑ Usa los controles flotantes sobre la escena para iniciar la simulación
        </div>
        <div className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-mono tabular-nums text-foreground">
          x(t) = <span className="text-emerald-700 font-semibold">{x0.toFixed(0)}</span> + <span className="text-emerald-700 font-semibold">{v.toFixed(1)}</span> × <span className="text-emerald-700 font-semibold">{t.toFixed(2)}</span> = <span className="font-semibold">{x.toFixed(2)} m</span>
        </div>
      </div>

      {/* ============ GRAPHS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 app-caption font-semibold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Posición vs Tiempo
          </div>
          <Graph
            series={[{ points: xtPoints, color: "#10b981", label: "x(t) = x₀ + v·t" }]}
            xLabel="tiempo t (s)"
            yLabel="posición x (m)"
            xDomain={[0, TMAX]}
            yDomain={[0, TRACK_LEN]}
            markers={[{ x: t, color: "#334155", label: "t actual" }]}
            caption="Pendiente de la recta = velocidad v"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 app-caption font-semibold uppercase tracking-wider text-muted-foreground">
            <Square className="h-3.5 w-3.5" />
            Velocidad vs Tiempo
          </div>
          <Graph
            series={[{ points: vtPoints, color: "#0d9488", label: "v(t) = cte" }]}
            xLabel="tiempo t (s)"
            yLabel="velocidad v (m/s)"
            xDomain={[0, TMAX]}
            yDomain={[0, 12]}
            markers={[{ x: t, color: "#334155", label: "t actual" }]}
            shadedAreas={[{ x0: 0, x1: Math.max(0.01, t), color: "#f59e0b", label: `d = ${distance.toFixed(1)} m` }]}
            caption="El área sombreada = distancia recorrida"
          />
        </div>
      </div>

      {/* ============ INSIGHTS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Insight color="emerald" title="Pendiente = velocidad" icon={<TrendingUp className="h-4 w-4" />}>
          En x–t, la <strong>pendiente</strong> (Δx/Δt) <strong>ES</strong> la velocidad. Si v=5 m/s, por cada segundo que pasa, x sube 5 m. Por eso la recta es recta: la rapidez de cambio nunca varía.
        </Insight>
        <Insight color="amber" title="Área = distancia" icon={<Square className="h-4 w-4" />}>
          En v–t, el <strong>área del rectángulo</strong> (base t × altura v) <strong>ES</strong> la distancia recorrida. Como v nunca cambia, el área es un rectángulo perfecto: d = v · t = <span className="font-mono font-bold">{(v * t).toFixed(2)} m</span>.
        </Insight>
      </div>

      {/* ============ FUN FACTS ============ */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <Gauge className="h-4 w-4 text-emerald-600" />
          <div className="mt-1 app-caption uppercase tracking-wider font-semibold text-muted-foreground">Velocidad</div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{v.toFixed(1)} m/s = {(v * 3.6).toFixed(1)} km/h</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <MapPin className="h-4 w-4 text-amber-600" />
          <div className="mt-1 app-caption uppercase tracking-wider font-semibold text-muted-foreground">Recorrido</div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{distance.toFixed(2)} m en {t.toFixed(2)} s</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Flag className="h-4 w-4 text-rose-600" />
          <div className="mt-1 app-caption uppercase tracking-wider font-semibold text-muted-foreground">Restante</div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{Math.max(0, TRACK_LEN - x).toFixed(2)} m</div>
        </div>
      </div>
    </div>
  );
}
