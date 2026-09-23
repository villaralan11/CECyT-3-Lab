"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Car, TrendingUp, TrendingDown, Square, Gauge, Flame, Zap, Pause, Play, StepBack, StepForward, RotateCcw } from "lucide-react";
import { Readout, SimHeader, Slider, Graph, Insight } from "./shared";
import { useAnimationLoop } from "@/hooks/use-animation-loop";
import { useProgress } from "@/hooks/use-progress";

export default function MRUVSimulator() {
  const [v0, setV0] = useState(0);
  const [a, setA] = useState(2);
  const [x0, setX0] = useState(0);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [trail, setTrail] = useState<{ x: number; o: number; speed: number }[]>([]);
  const lastTrailTsRef = useRef(0);
  const trailRef = useRef<{ x: number; o: number; speed: number }[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);
  const { save } = useProgress();
  const completedRef = useRef(false);

  const TMAX = 8;
  const TRACK_LEN = 80;

  const x = x0 + v0 * t + 0.5 * a * t * t;
  const v = v0 + a * t;
  const vMax = Math.max(Math.abs(v0), Math.abs(v0 + a * TMAX));
  const vMin = Math.min(v0, v0 + a * TMAX);

  let motionState: "acelerando" | "frenando" | "reposo";
  if (Math.abs(v) < 0.01 && Math.abs(a) < 0.01) motionState = "reposo";
  else if (Math.abs(v) < 0.01) motionState = "acelerando";
  else if (v * a >= 0) motionState = "acelerando";
  else motionState = "frenando";

  const handleTick = useCallback((dt: number, ts: number) => {
    const curT = tRef.current + dt;
    const xnC = x0 + v0 * curT + 0.5 * a * curT * curT;
    if ((curT >= TMAX || xnC >= TRACK_LEN || xnC < -5) && !completedRef.current) {
      completedRef.current = true;
      void save("02_mruv", 1, 1);
    }
    setT((prev) => {
      const next = prev + dt;
      const xn = x0 + v0 * next + 0.5 * a * next * next;
      if (next >= TMAX || xn >= TRACK_LEN || xn < -5) {
        setRunning(false);
        return Math.min(next, TMAX);
      }
      return next;
    });
    if (ts - lastTrailTsRef.current > 80) {
      lastTrailTsRef.current = ts;
      const curT = tRef.current + dt;
      const xn = x0 + v0 * curT + 0.5 * a * curT * curT;
      const vn = v0 + a * curT;
      trailRef.current = [...trailRef.current.slice(-20), { x: xn, o: 1, speed: Math.abs(vn) }];
      setTrail([...trailRef.current]);
    }
  }, [x0, v0, a, save]);

  useAnimationLoop(running, handleTick);

  const reset = useCallback(() => {
    completedRef.current = false;
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
      scrollToScene();
    }
    setRunning(!running);
  }, [running, t, TMAX, reset, scrollToScene]);

  const xtPoints = Array.from({ length: 101 }, (_, i) => {
    const tt = (i / 100) * TMAX;
    return { x: tt, y: x0 + v0 * tt + 0.5 * a * tt * tt };
  }).filter((p) => p.x <= t + 0.01);
  if (t > 0 && xtPoints[xtPoints.length - 1]?.x < t) {
    xtPoints.push({ x: t, y: x0 + v0 * t + 0.5 * a * t * t });
  }

  const vtPoints = Array.from({ length: 101 }, (_, i) => {
    const tt = (i / 100) * TMAX;
    return { x: tt, y: v0 + a * tt };
  }).filter((p) => p.x <= t + 0.01);
  if (t > 0 && vtPoints[vtPoints.length - 1]?.x < t) {
    vtPoints.push({ x: t, y: v0 + a * t });
  }

  const trackFrac = Math.max(0, Math.min(1, x / TRACK_LEN));
  const vDomain: [number, number] = [Math.min(0, vMin) - 2, Math.max(0, vMax) + 2];
  const goingRight = v >= 0;

  // Dynamic scene colors based on motion state
  const sceneColors = {
    acelerando: {
      sky: "from-emerald-300 via-emerald-200 to-amber-100",
      mountain: "#047857",
      hill: "#059669",
      accent: "#10b981",
      glow: "rgba(16, 185, 129, 0.4)",
    },
    frenando: {
      sky: "from-rose-300 via-orange-200 to-amber-100",
      mountain: "#9f1239",
      hill: "#be123c",
      accent: "#f43f5e",
      glow: "rgba(244, 63, 94, 0.4)",
    },
    reposo: {
      sky: "from-slate-300 via-slate-200 to-slate-100",
      mountain: "#475569",
      hill: "#64748b",
      accent: "#64748b",
      glow: "rgba(100, 116, 139, 0.3)",
    },
  };
  const sc = sceneColors[motionState];

  return (
    <div className="space-y-5">
      <SimHeader
        title="MRUV · Aceleración Constante"
        description="Aceleración fija: la gráfica x–t es una parábola y v–t una recta cuya pendiente ES la aceleración. La escena cambia de color: verde cuando acelera, rojo cuando frena."
        badge="Física · Cinemática"
        color="emerald"
      />

      {/* ============ CINEMATIC SCENE ============ */}
      <div ref={sceneRef} className="relative overflow-hidden rounded-3xl border-2 shadow-xl transition-colors duration-700 scroll-mt-20 max-sm:max-h-[42vh] max-sm:sticky max-sm:top-16 max-sm:z-10" style={{
        borderColor: motionState === "frenando" ? "#fda4af" : motionState === "acelerando" ? "#6ee7b7" : "#cbd5e1",
      }}>
        {/* Sky gradient (changes with motion) */}
        <div className={`absolute inset-0 bg-gradient-to-b ${sc.sky} transition-all duration-700`} />

        {/* Sun/Moon */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 right-8 h-14 w-14 rounded-full shadow-[0_0_60px_20px] transition-colors duration-700"
          style={{
            background: motionState === "frenando"
              ? "linear-gradient(135deg, #fb923c, #dc2626)"
              : "linear-gradient(135deg, #fde047, #f59e0b)",
            boxShadow: `0 0 60px 20px ${sc.glow}`,
          }}
        />

        {/* Clouds */}
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

        {/* Mountains */}
        <svg className="absolute bottom-[40%] left-0 w-full" viewBox="0 0 600 80" preserveAspectRatio="none" style={{ height: "60px" }}>
          <polygon points="0,80 60,30 130,55 200,20 280,45 360,15 450,40 540,25 600,50 600,80" fill={sc.mountain} opacity="0.4" />
        </svg>
        <svg className="absolute bottom-[35%] left-0 w-full" viewBox="0 0 600 60" preserveAspectRatio="none" style={{ height: "50px" }}>
          <polygon points="0,60 50,40 120,25 200,42 280,20 360,38 460,18 540,32 600,22 600,60" fill={sc.hill} opacity="0.6" />
        </svg>

        {/* Distance markers */}
        <div className="absolute top-[45%] left-0 right-0 h-6 flex items-end pointer-events-none">
          {Array.from({ length: 7 }, (_, i) => {
            const val = (i / 6) * TRACK_LEN;
            return (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: `${(i / 6) * 100}%`, transform: "translateX(-50%)" }}>
                <div className="text-[9px] font-bold text-emerald-900/70 font-mono">{val.toFixed(0)}m</div>
                <div className="h-3 w-px bg-emerald-900/30" />
              </div>
            );
          })}
        </div>

        {/* SVG Scene */}
        <svg role="img" aria-label="Simulador cinemático" viewBox="0 0 600 240" className="relative w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Track */}
          <rect x="0" y="170" width="600" height="70" fill="#1f2937" />
          <rect x="0" y="170" width="600" height="4" fill="#fbbf24" />
          <rect x="0" y="236" width="600" height="4" fill="#fbbf24" />
          {/* Lane stripes (move faster when v is high) */}
          {Array.from({ length: 12 }, (_, i) => {
            const baseX = i * 60;
            const offset = running ? (t * v * 12) % 60 : 0;
            const xPos = ((baseX - offset) % 600 + 600) % 600;
            return <rect key={i} x={xPos} y="200" width="32" height="4" fill="white" opacity="0.85" rx="2" />;
          })}

          {/* Trail particles - color and size depend on speed */}
          {trail.map((p, i) => {
            const px = 20 + (Math.max(0, Math.min(1, p.x / TRACK_LEN)) * 560);
            const age = (trail.length - i) / trail.length;
            const color = motionState === "frenando" ? "#f43f5e" : "#10b981";
            return (
              <circle
                key={i}
                cx={px}
                cy={155}
                r={2 + age * (3 + p.speed * 0.4)}
                fill={color}
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

          {/* Motion state badge floating above scene */}
          {motionState !== "reposo" && (
            <g transform="translate(300, 30)">
              <rect x="-60" y="-12" width="120" height="24" rx="12" fill={motionState === "acelerando" ? "#10b981" : "#f43f5e"} opacity="0.95" />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
                {motionState === "acelerando" ? "⚡ ACELERANDO" : "🛑 FRENANDO"}
              </text>
            </g>
          )}

          {/* Car */}
          <g style={{ transform: `translateX(${20 + trackFrac * 560}px)` }}>
            <ellipse cx="0" cy="172" rx="22" ry="3" fill="#000" opacity="0.3" />
            <g transform="translate(0, 140)">
              {/* Body color depends on motion */}
              <path d="M -22 15 L -18 5 L -10 -3 L 10 -3 L 18 5 L 22 15 L 22 22 L -22 22 Z"
                fill={motionState === "frenando" ? "url(#carBodyFreno)" : "url(#carBodyAcel)"}
                stroke={motionState === "frenando" ? "#9f1239" : "#047857"} strokeWidth="1"
              />
              <path d="M -10 -3 L -6 -12 L 8 -12 L 10 -3 Z"
                fill={motionState === "frenando" ? "url(#carCabinFreno)" : "url(#carCabinAcel)"}
                stroke={motionState === "frenando" ? "#9f1239" : "#047857"} strokeWidth="1"
              />
              <path d="M -7 -4 L -4 -10 L 0 -10 L 0 -4 Z" fill={motionState === "frenando" ? "#fecaca" : "#a7f3d0"} opacity="0.6" />
              <circle cx="-12" cy="22" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
              <circle cx="-12" cy="22" r="2" fill="#6b7280" />
              <circle cx="12" cy="22" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
              <circle cx="12" cy="22" r="2" fill="#6b7280" />
              {/* Headlight */}
              <circle cx="20" cy="10" r="2" fill="#fef3c7" />
              {/* Brake lights when braking */}
              {motionState === "frenando" && (
                <>
                  <circle cx="-22" cy="10" r="2.5" fill="#ef4444">
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              {/* Velocity vector */}
              {Math.abs(v) > 0.1 && (
                <g>
                  <line x1={goingRight ? 22 : -22} y1="8" x2={goingRight ? 22 + Math.min(40, Math.abs(v) * 3) : -22 - Math.min(40, Math.abs(v) * 3)} y2="8"
                    stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round"
                  />
                  <polygon
                    points={goingRight
                      ? `${22 + Math.min(40, Math.abs(v) * 3)},8 ${22 + Math.min(40, Math.abs(v) * 3) - 7},4 ${22 + Math.min(40, Math.abs(v) * 3) - 7},12`
                      : `${-22 - Math.min(40, Math.abs(v) * 3)},8 ${-22 - Math.min(40, Math.abs(v) * 3) + 7},4 ${-22 - Math.min(40, Math.abs(v) * 3) + 7},12`
                    }
                    fill="#f43f5e"
                  />
                  <text x={goingRight ? 22 + Math.min(40, Math.abs(v) * 3) / 2 : -22 - Math.min(40, Math.abs(v) * 3) / 2} y="0" textAnchor="middle" fontSize="10" fill="#f43f5e" fontWeight="bold">v</text>
                </g>
              )}
              {/* Acceleration vector (below car) */}
              {Math.abs(a) > 0.1 && (
                <g>
                  <line x1="0" y1="32" x2={a > 0 ? 30 : -30} y2="32" stroke={a > 0 ? "#10b981" : "#f43f5e"} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
                  <polygon
                    points={a > 0 ? `30,32 24,28 24,36` : `-30,32 -24,28 -24,36`}
                    fill={a > 0 ? "#10b981" : "#f43f5e"}
                  />
                  <text x={a > 0 ? 15 : -15} y="46" textAnchor="middle" fontSize="9" fill={a > 0 ? "#10b981" : "#f43f5e"} fontWeight="bold">a</text>
                </g>
              )}
            </g>
          </g>

          <defs>
            <linearGradient id="carBodyAcel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="carCabinAcel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="carBodyFreno" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <linearGradient id="carCabinFreno" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
          </defs>
        </svg>

        {/* Overlay info cards */}
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
            className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${motionState === "frenando" ? "from-rose-500 to-orange-500" : "from-fuchsia-500 to-pink-500"} px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-105 transition-transform`}
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            {running ? "Pausar" : "Iniciar"}
          </button>
          <button onClick={stepBack} className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white/90 hover:bg-white/15 transition-colors" title="Retroceder 0.1 s">
            <StepBack className="h-3 w-3" />
          </button>
          <button onClick={stepFwd} className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white/90 hover:bg-white/15 transition-colors" title="Avanzar 0.1 s">
            <StepForward className="h-3 w-3" />
          </button>
          <button onClick={reset} className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white/90 hover:bg-white/15 transition-colors" title="Reiniciar">
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-2 left-3 right-3 h-1.5 rounded-full bg-black/20 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${motionState === "frenando" ? "from-rose-400 to-orange-400" : "from-emerald-400 to-amber-400"}`}
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
        <Readout label="Tiempo" value={t} unit="s" color="foreground" formula="t independiente" />
        <Readout label="Posición x" value={x} unit="m" color="emerald" formula="x₀ + v₀t + ½at²" />
        <Readout label="Velocidad v" value={v} unit="m/s" color={motionState === "frenando" && Math.abs(v) < Math.abs(v0) ? "rose" : "emerald"} formula="v₀ + a·t" />
        <Readout label="Aceleración a" value={a} unit="m/s²" color={a >= 0 ? "emerald" : "rose"} formula="constante" />
      </div>

      {/* ============ CONTROLS ============ */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Slider label="Velocidad inicial (v₀)" value={v0} min={-5} max={10} step={0.5} unit="m/s" onChange={setV0} color="emerald" description="Negativa = viaja a la izquierda" />
        <Slider label="Aceleración (a)" value={a} min={-5} max={5} step={0.5} unit="m/s²" onChange={setA} color={a >= 0 ? "emerald" : "rose"} description={a >= 0 ? "Acelera hacia la derecha" : "Acelera hacia la izquierda"} />
        <Slider label="Posición inicial (x₀)" value={x0} min={0} max={10} step={1} unit="m" onChange={setX0} color="emerald" description="Dónde arranca el auto" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-muted-foreground italic">
          ↑ Usa los controles flotantes sobre la escena para iniciar la simulación
        </div>
        <div className="flex items-center gap-2">
          {motionState === "acelerando" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-bold border border-emerald-200">
              <TrendingUp className="h-3 w-3" /> Acelerando
            </span>
          ) : motionState === "frenando" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-700 px-2.5 py-1 text-xs font-bold border border-rose-200">
              <TrendingDown className="h-3 w-3" /> Frenando
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary text-muted-foreground px-2.5 py-1 text-xs font-bold">
              Reposo
            </span>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            v·a {v * a > 0 ? "> 0" : v * a < 0 ? "< 0 (frenado)" : "= 0"}
          </span>
        </div>
      </div>

      {/* ============ GRAPHS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5" />
            Posición vs Tiempo (parábola)
          </div>
          <Graph
            series={[{ points: xtPoints, color: motionState === "frenando" ? "#f43f5e" : "#10b981", label: "x(t) parábola" }]}
            xLabel="tiempo t (s)"
            yLabel="posición x (m)"
            xDomain={[0, TMAX]}
            yDomain={[0, TRACK_LEN]}
            markers={[{ x: t, color: "#f59e0b", label: "t" }]}
            caption="Si a≠0 la curva es parábola; si a=0 se vuelve recta (MRU)"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Square className="h-3.5 w-3.5" />
            Velocidad vs Tiempo (recta)
          </div>
          <Graph
            series={[{ points: vtPoints, color: "#0d9488", label: "v(t) recta" }]}
            xLabel="tiempo t (s)"
            yLabel="velocidad v (m/s)"
            xDomain={[0, TMAX]}
            yDomain={vDomain}
            markers={[{ x: t, color: "#f59e0b", label: "t" }]}
            shadedAreas={[{ x0: 0, x1: Math.max(0.01, t), color: "#10b981", label: `Δx = ${(x - x0).toFixed(1)} m` }]}
            caption="Pendiente = aceleración · Área = cambio de posición"
          />
        </div>
      </div>

      {/* ============ INSIGHTS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Insight color="emerald" title="Pendiente de v-t = aceleración" icon={<TrendingUp className="h-4 w-4" />}>
          La <strong>pendiente</strong> de la recta en v–t (Δv/Δt) <strong>ES</strong> la aceleración. Aquí: <span className="font-mono font-bold">a = {a.toFixed(1)} m/s²</span>. Como a es constante, la pendiente es la misma en todo el tramo.
        </Insight>
        <Insight color={motionState === "frenando" ? "rose" : "emerald"} title={motionState === "frenando" ? "Caso frenado" : "Caso acelerado"} icon={motionState === "frenando" ? <TrendingDown className="h-4 w-4" /> : <Square className="h-4 w-4" />}>
          {motionState === "frenando" ? (
            <>Cuando <strong>v₀ y a tienen signos opuestos</strong>, el objeto frena. La velocidad tiende a cero; si se prolonga, el objeto se detiene y luego acelera en sentido contrario. Es lo que hace un auto cuando frenas.</>
          ) : (
            <>Cuando <strong>v₀ y a tienen el mismo signo</strong> (o v₀=0), el objeto acelera: su rapidez crece. La parábola x–t se curva hacia arriba porque cada segundo avanza más que el anterior.</>
          )}
        </Insight>
      </div>

      {/* ============ EQUATIONS REFERENCE ============ */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-3">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
          Ecuaciones del MRUV
        </div>
        <div className="grid sm:grid-cols-3 gap-2 text-sm font-mono">
          <div>
            <span className="text-muted-foreground">v(t) =</span>{" "}
            <span className="font-bold text-foreground">v₀ + a·t</span>
          </div>
          <div>
            <span className="text-muted-foreground">x(t) =</span>{" "}
            <span className="font-bold text-foreground">x₀ + v₀·t + ½·a·t²</span>
          </div>
          <div>
            <span className="text-muted-foreground">v² =</span>{" "}
            <span className="font-bold text-foreground">v₀² + 2·a·Δx</span>
          </div>
        </div>
      </div>

      {/* ============ FUN FACTS ============ */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-3">
          <Gauge className="h-4 w-4 text-emerald-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-emerald-700">Velocidad actual</div>
          <div className="text-sm font-bold text-foreground">{v.toFixed(2)} m/s = {(v * 3.6).toFixed(1)} km/h</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-3">
          <Zap className="h-4 w-4 text-amber-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-amber-700">Δv en T segundos</div>
          <div className="text-sm font-bold text-foreground">{(a * t).toFixed(2)} m/s</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-3">
          <Flame className="h-4 w-4 text-rose-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-rose-700">Cambio de posición</div>
          <div className="text-sm font-bold text-foreground">{(x - x0).toFixed(2)} m</div>
        </div>
      </div>
    </div>
  );
}
