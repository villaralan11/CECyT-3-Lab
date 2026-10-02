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
      <div ref={sceneRef} className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 shadow-xl scroll-mt-20 max-sm:max-h-[42vh] max-sm:sticky max-sm:top-16 max-sm:z-10">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-100" />

        {/* Sun */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 right-8 h-14 w-14 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_0_60px_20px_rgba(253,224,71,0.5)]"
        />

        {/* Clouds (parallax) */}
        {[
          { top: "12%", left: "10%", scale: 1, dur: 60 },
          { top: "20%", left: "60%", scale: 0.7, dur: 45 },
          { top: "8%", left: "85%", scale: 0.5, dur: 80 },
        ].map((c, i) => (
          <motion.div
            key={i}
            animate={{ x: [-50, 700] }}
            transition={{ duration: c.dur, repeat: Infinity, ease: "linear" }}
            style={{ top: c.top, left: c.left, transform: `scale(${c.scale})` }}
            className="absolute"
          >
            <svg width="80" height="36" viewBox="0 0 80 36">
              <ellipse cx="20" cy="22" rx="20" ry="11" fill="white" opacity="0.85" />
              <ellipse cx="42" cy="18" rx="22" ry="13" fill="white" opacity="0.85" />
              <ellipse cx="62" cy="22" rx="16" ry="10" fill="white" opacity="0.85" />
            </svg>
          </motion.div>
        ))}

        {/* Mountains (back layer) */}
        <svg className="absolute bottom-[40%] left-0 w-full" viewBox="0 0 600 80" preserveAspectRatio="none" style={{ height: "60px" }}>
          <polygon points="0,80 60,30 130,55 200,20 280,45 360,15 450,40 540,25 600,50 600,80" fill="#047857" opacity="0.4" />
        </svg>
        {/* Hills (mid layer) */}
        <svg className="absolute bottom-[35%] left-0 w-full" viewBox="0 0 600 60" preserveAspectRatio="none" style={{ height: "50px" }}>
          <polygon points="0,60 50,40 120,25 200,42 280,20 360,38 460,18 540,32 600,22 600,60" fill="#059669" opacity="0.6" />
        </svg>

        {/* Distance markers floating above the track */}
        <div className="absolute top-[45%] left-0 right-0 h-6 flex items-end pointer-events-none">
          {Array.from({ length: 7 }, (_, i) => {
            const val = (i / 6) * TRACK_LEN;
            const px = 20 + (i / 6) * 560;
            return (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: `${((px - 20) / 560) * 100}%`, transform: "translateX(-50%)" }}>
                <div className="text-[9px] font-bold text-emerald-900/70 font-mono">{val.toFixed(0)}m</div>
                <div className="h-3 w-px bg-emerald-900/30" />
              </div>
            );
          })}
        </div>

        {/* SVG Scene with car + track + trail */}
        <svg role="img" aria-label="Simulador cinemático" viewBox="0 0 600 240" className="relative w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Track (road) */}
          <rect x="0" y="170" width="600" height="70" fill="#1f2937" />
          {/* Road shoulder */}
          <rect x="0" y="170" width="600" height="4" fill="#fbbf24" />
          <rect x="0" y="236" width="600" height="4" fill="#fbbf24" />
          {/* Lane stripes (moving illusion when car moves) */}
          {Array.from({ length: 12 }, (_, i) => {
            const baseX = i * 60;
            const offset = running ? (t * v * 12) % 60 : 0;
            const xPos = ((baseX - offset) % 600 + 600) % 600;
            return (
              <rect key={i} x={xPos} y="200" width="32" height="4" fill="white" opacity="0.85" rx="2" />
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
            <line x1="0" y1="-30" x2="0" y2="20" stroke="#4b5563" strokeWidth="2" />
            <rect x="0" y="-30" width="14" height="10" fill="#fbbf24" />
            <rect x="0" y="-20" width="14" height="10" fill="#1f2937" />
            <text x="0" y="-36" textAnchor="middle" fontSize="9" fill="#1f2937" fontWeight="bold">x₀</text>
          </g>

          {/* Finish flag */}
          <g transform="translate(580, 150)">
            <line x1="0" y1="-30" x2="0" y2="20" stroke="#dc2626" strokeWidth="2.5" />
            <g className="finish-flag">
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={i % 2 === 0 ? 0 : 7} y={-30 + Math.floor(i / 2) * 7} width="7" height="7" fill={i % 2 === 0 ? "#1f2937" : "white"} />
              ))}
            </g>
            <text x="0" y="-36" textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="bold">META</text>
          </g>

          {/* Car */}
          <g transform={`translate(${20 + trackFrac * 560}, 0)`}>
            {/* Shadow */}
            <ellipse cx="0" cy="172" rx="22" ry="3" fill="#000" opacity="0.3" />
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
                  <line x1="22" y1="8" x2={22 + Math.min(40, v * 4)} y2="8" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon
                    points={`${22 + Math.min(40, v * 4)},8 ${22 + Math.min(40, v * 4) - 7},4 ${22 + Math.min(40, v * 4) - 7},12`}
                    fill="#f43f5e"
                  />
                  <text x={22 + Math.min(40, v * 4) / 2} y="0" textAnchor="middle" fontSize="10" fill="#f43f5e" fontWeight="bold">v</text>
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
        <div className="absolute top-3 left-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 px-3 py-2 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">Tiempo</div>
          <div className="font-mono font-bold text-lg text-foreground">{t.toFixed(2)}s</div>
        </div>
        <div className="absolute top-3 right-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 px-3 py-2 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">Posición</div>
          <div className="font-mono font-bold text-lg text-emerald-600">{x.toFixed(2)}m</div>
        </div>

        {/* Floating play controls overlay (bottom-center, like a video player) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 px-2 py-1.5 shadow-2xl">
          <button
            onClick={handleToggle}
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-105 transition-transform"
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            {running ? "Pausar" : "Iniciar"}
          </button>
          <button
            onClick={stepBack}
            className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white/90 hover:bg-white/15 transition-colors"
            title="Retroceder 0.1 s"
          >
            <StepBack className="h-3 w-3" />
          </button>
          <button
            onClick={stepFwd}
            className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white/90 hover:bg-white/15 transition-colors"
            title="Avanzar 0.1 s"
          >
            <StepForward className="h-3 w-3" />
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white/90 hover:bg-white/15 transition-colors"
            title="Reiniciar"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-2 left-3 right-3 h-1.5 rounded-full bg-black/20 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-amber-400"
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
        <div className="text-xs text-muted-foreground italic">
          ↑ Usa los controles flotantes sobre la escena para iniciar la simulación
        </div>
        <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-4 py-2.5 text-xs font-mono text-foreground shadow-sm">
          x(t) = <span className="text-emerald-600 font-bold">{x0.toFixed(0)}</span> + <span className="text-emerald-600 font-bold">{v.toFixed(1)}</span> × <span className="text-emerald-600 font-bold">{t.toFixed(2)}</span> = <span className="text-emerald-700 font-bold text-base">{x.toFixed(2)} m</span>
        </div>
      </div>

      {/* ============ GRAPHS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5" />
            Posición vs Tiempo
          </div>
          <Graph
            series={[{ points: xtPoints, color: "#10b981", label: "x(t) = x₀ + v·t" }]}
            xLabel="tiempo t (s)"
            yLabel="posición x (m)"
            xDomain={[0, TMAX]}
            yDomain={[0, TRACK_LEN]}
            markers={[{ x: t, color: "#f43f5e", label: "t actual" }]}
            caption="Pendiente de la recta = velocidad v"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Square className="h-3.5 w-3.5" />
            Velocidad vs Tiempo
          </div>
          <Graph
            series={[{ points: vtPoints, color: "#0d9488", label: "v(t) = cte" }]}
            xLabel="tiempo t (s)"
            yLabel="velocidad v (m/s)"
            xDomain={[0, TMAX]}
            yDomain={[0, 12]}
            markers={[{ x: t, color: "#f43f5e", label: "t actual" }]}
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
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-3">
          <Gauge className="h-4 w-4 text-emerald-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-emerald-700">Velocidad</div>
          <div className="text-sm font-bold text-foreground">{v.toFixed(1)} m/s = {(v * 3.6).toFixed(1)} km/h</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-3">
          <MapPin className="h-4 w-4 text-amber-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-amber-700">Recorrido</div>
          <div className="text-sm font-bold text-foreground">{distance.toFixed(2)} m en {t.toFixed(2)} s</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-3">
          <Flag className="h-4 w-4 text-rose-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-rose-700">Restante</div>
          <div className="text-sm font-bold text-foreground">{Math.max(0, TRACK_LEN - x).toFixed(2)} m</div>
        </div>
      </div>
    </div>
  );
}
