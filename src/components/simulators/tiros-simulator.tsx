"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowUp, ArrowRight, Crosshair, Target, Zap, Gauge, Maximize2, Pause, Play, StepBack, StepForward, RotateCcw, Wind } from "lucide-react";
import { Readout, SimHeader, Slider, Graph, Insight } from "./shared";

type Mode = "vertical" | "horizontal" | "parabolico";

const G = 9.81;

export default function TirosSimulator() {
  const [mode, setMode] = useState<Mode>("parabolico");
  const [v0, setV0] = useState(25);
  const [angle, setAngle] = useState(45);
  const [h0, setH0] = useState(0);
  const [air, setAir] = useState(false);
  const K_DRAG = 0.02;
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; age: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const accumulatorRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number; age: number }[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);

  const rad = (angle * Math.PI) / 180;
  const v0x = mode === "vertical" ? 0 : mode === "horizontal" ? v0 : v0 * Math.cos(rad);
  const v0y = mode === "vertical" ? v0 : mode === "horizontal" ? 0 : v0 * Math.sin(rad);

  const initialAirPos = useMemo(() => ({ x: 0, y: h0, vx: v0x, vy: v0y }), [v0x, v0y, h0]);
  const [airPos, setAirPos] = useState(initialAirPos);

  const tEnd = useMemo(() => {
    const disc = v0y * v0y + 2 * G * h0;
    if (disc < 0) return 0.1;
    return Math.max(0.1, (v0y + Math.sqrt(disc)) / G);
  }, [v0y, h0]);

  const x = air ? airPos.x : v0x * t;
  const y = air ? Math.max(0, airPos.y) : Math.max(0, h0 + v0y * t - 0.5 * G * t * t);
  const yRaw = h0 + v0y * t - 0.5 * G * t * t;
  const vx = air ? airPos.vx : v0x;
  const vy = air ? airPos.vy : v0y - G * t;
  const speed = Math.sqrt(vx * vx + vy * vy);

  const range = v0x * tEnd;
  const tApex = Math.max(0, v0y / G);
  const maxH = mode === "horizontal" ? h0 : h0 + (v0y * v0y) / (2 * G);

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
        if (air) {
          // Integración Euler-Cromer con arrastre cuadrático
          setAirPos((prev) => {
            let { x, y, vx, vy } = prev;
            for (let k = 0; k < steps; k++) {
              const v = Math.hypot(vx, vy);
              const ax = -K_DRAG * vx * v;
              const ay = -G - K_DRAG * vy * v;
              vx += ax * FIXED_DT;
              vy += ay * FIXED_DT;
              x += vx * FIXED_DT;
              y += vy * FIXED_DT;
              if (y < 0) {
                y = 0;
                break;
              }
            }
            return { x, y, vx, vy };
          });
        }
        setT((prev) => {
          const next = prev + delta;
          if (!air && next >= tEnd) {
            setRunning(false);
            return tEnd;
          }
          if (air) {
            // Check if projectile hit ground
            setAirPos((current) => {
              if (current.y <= 0 && prev > 0.1) {
                setRunning(false);
              }
              return current;
            });
            return next;
          }
          return next;
        });
        if (ts - lastTrailTs > 50) {
          lastTrailTs = ts;
          const curT = t + delta;
          const xn = v0x * curT;
          const yn = h0 + v0y * curT - 0.5 * G * curT * curT;
          trailRef.current = [...trailRef.current.slice(-30), { x: xn, y: yn, age: 0 }];
          setTrail([...trailRef.current]);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, tEnd, v0x, v0y, h0, air]);

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
    setT((p) => Math.min(tEnd, p + 0.1));
  }, [tEnd]);

  // Scroll scene into view when play starts
  const scrollToScene = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (t >= tEnd - 0.01) {
      reset();
      return;
    }
    if (!running) {
      scrollToScene();
    }
    setRunning(!running);
  }, [running, t, tEnd, reset, scrollToScene]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setRunning(false);
    setT(0);
    trailRef.current = [];
    setTrail([]);
    if (m === "horizontal") setH0(20);
    else setH0(0);
    if (m === "vertical") setAngle(90);
    else if (m === "horizontal") setAngle(0);
    else setAngle(45);
  };

  const trajPoints: { x: number; y: number }[] = [];
  const N = 100;
  if (!air) {
    for (let i = 0; i <= N; i++) {
      const tt = (i / N) * tEnd;
      trajPoints.push({ x: v0x * tt, y: h0 + v0y * tt - 0.5 * G * tt * tt });
    }
  } else {
    // Numérico con arrastre para preview
    let ax = 0, ay = 0, xv = v0x, yv = v0y, xx = 0, yy = h0;
    const dtPrev = tEnd / N;
    for (let i = 0; i <= N; i++) {
      trajPoints.push({ x: xx, y: yy });
      const v = Math.hypot(xv, yv);
      ax = -0.02 * xv * v;
      ay = -9.81 - 0.02 * yv * v;
      xv += ax * dtPrev;
      yv += ay * dtPrev;
      xx += xv * dtPrev;
      yy += yv * dtPrev;
      if (yy < 0) { trajPoints.push({ x: xx, y: 0 }); break; }
    }
  }
  const XMAX = Math.max(10, range * 1.15);
  const YMAX = Math.max(10, maxH * 1.25);

  const W = 600;
  const Hsvg = 320;
  const padL = 36;
  const padB = 30;
  const padT = 16;
  const padR = 14;
  const plotW = W - padL - padR;
  const plotH = Hsvg - padT - padB;
  const sx = (xv: number) => padL + (xv / XMAX) * plotW;
  const sy = (yv: number) => padT + (1 - Math.max(0, yv) / YMAX) * plotH;

  const trajPath = trajPoints
    .filter((p) => p.y >= -1)
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
    .join(" ");

  const traveled = trajPoints.filter((_, i) => (i / N) * tEnd <= t + 0.02);
  const traveledPath = traveled
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
    .join(" ");

  const ytGraph = trajPoints.map((p, i) => ({ x: (i / N) * tEnd, y: p.y }));
  const ytTraveled = ytGraph.filter((p) => p.x <= t + 0.02);

  const xtGraph = trajPoints.map((p, i) => ({ x: (i / N) * tEnd, y: p.x }));
  const xtTraveled = xtGraph.filter((p) => p.x <= t + 0.02);

  const modes: { id: Mode; label: string; desc: string; icon: typeof Rocket }[] = [
    { id: "vertical", label: "Tiro Vertical", desc: "Solo sube y baja", icon: ArrowUp },
    { id: "horizontal", label: "Tiro Horizontal", desc: "Cae desde altura", icon: ArrowRight },
    { id: "parabolico", label: "Tiro Parabólico", desc: "Ángulo arbitrario", icon: Rocket },
  ];

  return (
    <div className="space-y-5">
      <SimHeader
        title="Los 3 tiros · Vertical, Horizontal y Parabólico"
        description="El mismo instrumento en 2D con escena cinematográfica: cielo, montañas, sol y estela del proyectil. Vectores vₓ y vᵧ descompuestos en vivo. Tiempo de vuelo calculado con la fórmula analítica exacta."
        badge="Física · Cinemática"
        color="emerald"
      />

      {/* ============ MODE SELECTOR ============ */}
      <div className="grid sm:grid-cols-3 gap-2">
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                active
                  ? "border-emerald-500 bg-emerald-50/70"
                  : "border-border bg-card hover:border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${active ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                  <m.icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${active ? "text-emerald-700" : "text-foreground"}`}>
                    {m.label}
                  </div>
                  <div className="app-caption text-muted-foreground">{m.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Air toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAir(!air)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${air ? "bg-emerald-500 text-white border-emerald-500" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
        >
          <Wind className="h-3.5 w-3.5" />
          Aire: {air ? "ON (arrastre v²)" : "OFF (vacío)"}
        </button>
        <span className="app-caption text-muted-foreground">{air ? "F_drag = -k·v·|v|  k=0.02" : "Vacío ideal DEMS"}</span>
      </div>

      {/* ============ CINEMATIC SCENE ============ */}
      <div ref={sceneRef} className="relative overflow-hidden rounded-3xl border border-border shadow-sm bg-background scroll-mt-20 max-sm:max-h-[42vh] max-sm:sticky max-sm:top-16 max-sm:z-10">
        {/* Cielo papel */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-emerald-50" />

        {/* Silueta lejana baja-contraste */}
        <svg className="absolute bottom-[34%] left-0 w-full" viewBox="0 0 600 80" preserveAspectRatio="none" style={{ height: "68px" }}>
          <polygon points="0,80 70,38 140,58 210,26 290,48 370,20 460,44 540,30 600,52 600,80" fill="#0f766e" opacity="0.1" />
        </svg>

        {/* SVG Scene */}
        <svg role="img" aria-label="Simulador tiros" viewBox={`0 0 ${W} ${Hsvg}`} className="relative w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Ground with gradient */}
          {/* Material plano: sin filtros ni gradientes cargados */}

          {/* Ground */}
          <rect x="0" y={padT + plotH} width={W} height={padB} fill="#d9e5de" />
          {/* Grass texture (small lines) */}
          {Array.from({ length: 40 }, (_, i) => {
            const px = (i / 40) * W;
            return (
              <line key={i} x1={px} y1={padT + plotH} x2={px - 1} y2={padT + plotH - 3} stroke="#8aa697" strokeWidth="0.8" opacity="0.5" />
            );
          })}

          {/* Grid (subtle) */}
          {Array.from({ length: 7 }, (_, i) => {
            const px = padL + (i / 6) * plotW;
            return <line key={`gx${i}`} x1={px} y1={padT} x2={px} y2={padT + plotH} stroke="#0f172a" strokeWidth="0.4" opacity="0.06" />;
          })}
          {Array.from({ length: 5 }, (_, i) => {
            const py = padT + (i / 4) * plotH;
            return <line key={`gy${i}`} x1={padL} y1={py} x2={padL + plotW} y2={py} stroke="#0f172a" strokeWidth="0.4" opacity="0.06" />;
          })}

          {/* Axes labels */}
          <text x={padL + plotW / 2} y={Hsvg - 6} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">
            x (m) · alcance máx = {range.toFixed(1)} m
          </text>
          <text x={10} y={padT + plotH / 2} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600" transform={`rotate(-90 10 ${padT + plotH / 2})`}>
            y (m) · altura máx = {maxH.toFixed(1)} m
          </text>

          {/* Tick labels */}
          {Array.from({ length: 4 }, (_, i) => {
            const val = ((i + 1) / 4) * XMAX;
            const px = sx(val);
            return <text key={`tx${i}`} x={px} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#64748b">{val.toFixed(0)}</text>;
          })}
          {Array.from({ length: 4 }, (_, i) => {
            const val = ((i + 1) / 4) * YMAX;
            const py = sy(val);
            return <text key={`ty${i}`} x={padL - 5} y={py + 3} textAnchor="end" fontSize="9" fill="#64748b">{val.toFixed(0)}</text>;
          })}

          {/* Trajectory ghost (dotted) */}
          <path d={trajPath} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

          {/* Trail particles (fading) */}
          {trail.map((p, i) => {
            const age = (trail.length - i) / trail.length;
            return (
              <circle
                key={i}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={1.5 + age * 3}
                fill="#34d399"
                opacity={age * 0.5}
              />
            );
          })}

          {/* Traveled trajectory (solid) */}
          <path d={traveledPath} fill="none" stroke="#334155" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />

          {/* Apex marker */}
          {maxH > 0.5 && tApex > 0 && tApex < tEnd && (
            <g>
              <circle cx={sx(v0x * tApex)} cy={sy(maxH)} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <line x1={sx(v0x * tApex)} y1={sy(maxH)} x2={sx(v0x * tApex)} y2={sy(0)} stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
              <text x={sx(v0x * tApex)} y={sy(maxH) - 8} textAnchor="middle" fontSize="10" fill="#b45309" fontWeight="600">
                ↑ {maxH.toFixed(1)} m
              </text>
            </g>
          )}

          {/* Landing marker */}
          {range > 0.5 && (
            <g>
              <line x1={sx(range)} y1={padT + plotH - 10} x2={sx(range)} y2={padT + plotH} stroke="#475569" strokeWidth="2.5" />
              <text x={sx(range)} y={padT + plotH - 14} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="600">
                {range.toFixed(1)} m
              </text>
            </g>
          )}

          {/* Launch point (cannon) */}
          <g transform={`translate(${sx(0)}, ${sy(h0)})`}>
            {/* Cannon base */}
            <rect x="-8" y="0" width="16" height="8" fill="#334155" rx="2" />
            {/* Cannon barrel (rotates with angle) */}
            {mode !== "horizontal" && (
              <g transform={`rotate(${-angle})`}>
                <rect x="0" y="-3" width="20" height="6" fill="#475569" rx="2" />
                <circle cx="20" cy="0" r="3" fill="#10b981" />
              </g>
            )}
            {mode === "horizontal" && (
              <rect x="0" y="-3" width="20" height="6" fill="#475569" rx="2" />
            )}
            <text x="0" y="-12" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600">
              {h0 > 0 ? `h₀=${h0}m` : "lanzamiento"}
            </text>
          </g>

          {/* Projectile + vectors */}
          {y >= 0 && (
            <g transform={`translate(${sx(x)}, ${sy(y)})`}>
              {/* Projectile */}
              <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              {/* Horizontal velocity vector vₓ (blue) */}
              {Math.abs(vx) > 0.1 && (
                <g>
                  <line x1="0" y1="0" x2={Math.sign(vx) * Math.min(35, Math.abs(vx) * 1.4)} y2="0" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon
                    points={`${Math.sign(vx) * Math.min(35, Math.abs(vx) * 1.4)},0 ${Math.sign(vx) * (Math.min(35, Math.abs(vx) * 1.4) - 6)},-3 ${Math.sign(vx) * (Math.min(35, Math.abs(vx) * 1.4) - 6)},3`}
                    fill="#0ea5e9"
                  />
                  <text x={Math.sign(vx) * Math.min(35, Math.abs(vx) * 1.4) / 2} y="-6" textAnchor="middle" fontSize="9" fill="#0284c7" fontWeight="bold">
                    vₓ
                  </text>
                </g>
              )}

              {/* Vertical velocity vector vᵧ (rose) */}
              {Math.abs(vy) > 0.1 && (
                <g>
                  <line x1="0" y1="0" x2="0" y2={-Math.sign(vy) * Math.min(35, Math.abs(vy) * 1.4)} stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon
                    points={`0,${-Math.sign(vy) * Math.min(35, Math.abs(vy) * 1.4)} -3,${-Math.sign(vy) * (Math.min(35, Math.abs(vy) * 1.4) - 6)} 3,${-Math.sign(vy) * (Math.min(35, Math.abs(vy) * 1.4) - 6)}`}
                    fill="#f43f5e"
                  />
                  <text x="8" y={-Math.sign(vy) * Math.min(35, Math.abs(vy) * 1.4) / 2 + 3} textAnchor="start" fontSize="9" fill="#be123c" fontWeight="bold">
                    vᵧ
                  </text>
                </g>
              )}

              {/* Resultant velocity (white dashed) */}
              {speed > 0.1 && (
                <line
                  x1="0"
                  y1="0"
                  x2={(vx / Math.max(speed, 1)) * 30}
                  y2={-(vy / Math.max(speed, 1)) * 30}
                  stroke="#334155"
                  strokeWidth="1.6"
                  strokeDasharray="3 2"
                  opacity="0.55"
                />
              )}
            </g>
          )}
        </svg>

        {/* Overlay info cards */}
        <div className="app-glass absolute top-3 left-3 rounded-2xl border border-black/5 px-3.5 py-2 shadow-sm">
          <div className="app-caption uppercase tracking-wider font-semibold text-foreground/55">Tiempo</div>
          <div className="font-mono app-title3 tabular-nums text-foreground">{t.toFixed(2)}s / {tEnd.toFixed(2)}s</div>
        </div>
        <div className="app-glass absolute top-3 right-3 rounded-2xl border border-black/5 px-3.5 py-2 shadow-sm">
          <div className="app-caption uppercase tracking-wider font-semibold text-foreground/55">Altura</div>
          <div className="font-mono app-title3 tabular-nums text-foreground">{y.toFixed(2)}m</div>
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
          <button onClick={stepBack} className="inline-flex items-center justify-center h-11 w-11 rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white" title="Retroceder 0.1 s">
            <StepBack className="h-4 w-4" />
          </button>
          <button onClick={stepFwd} className="inline-flex items-center justify-center h-11 w-11 rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white" title="Avanzar 0.1 s">
            <StepForward className="h-4 w-4" />
          </button>
          <button onClick={reset} className="inline-flex items-center justify-center h-11 w-11 rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white" title="Reiniciar">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-1.5 left-3 right-3 h-1 rounded-full bg-white/25 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400"
            animate={{ width: `${(t / tEnd) * 100}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Tiempo ${t.toFixed(1)}s, altura ${y.toFixed(1)}m, alcance ${x.toFixed(1)}m`}
      </div>

      {/* ============ READOUTS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Readout label="Tiempo" value={t} unit="s" color="foreground" formula={`de ${tEnd.toFixed(2)} s`} />
        <Readout label="Altura y" value={y} unit="m" color="emerald" formula="h₀ + v₀ᵧt − ½gt²" />
        <Readout label="Alcance x" value={x} unit="m" color="emerald" formula="v₀ₓ · t" />
        <Readout label="|v| rapidez" value={speed} unit="m/s" color="amber" formula="√(vₓ² + vᵧ²)" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Readout label="vₓ (horizontal)" value={vx} unit="m/s" color="teal" formula={mode === "vertical" ? "0 (no hay)" : "constante"} />
        <Readout label="vᵧ (vertical)" value={vy} unit="m/s" color={vy >= 0 ? "emerald" : "rose"} formula={vy >= 0 ? "subiendo" : "bajando"} />
        <Readout label="Altura máx" value={maxH} unit="m" color="amber" formula={`en t = ${tApex.toFixed(2)} s`} />
        <Readout label="Alcance máx" value={range} unit="m" color="amber" formula={`en t = ${tEnd.toFixed(2)} s`} />
      </div>

      {/* ============ CONTROLS ============ */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Slider label="Velocidad inicial (v₀)" value={v0} min={5} max={40} step={1} unit="m/s" onChange={setV0} color="emerald" description="Magnitud del lanzamiento" />
        {mode === "parabolico" && (
          <Slider label="Ángulo (θ)" value={angle} min={0} max={90} step={1} unit="°" onChange={setAngle} color="emerald" description="0° = horizontal, 90° = vertical" />
        )}
        <Slider label="Altura inicial (h₀)" value={h0} min={0} max={30} step={1} unit="m" onChange={setH0} color="emerald" description="Desde dónde se lanza" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="app-caption text-muted-foreground">
          ↑ Usa los controles flotantes sobre la escena para iniciar la simulación
        </div>
        <div className="app-caption font-mono tabular-nums bg-secondary px-3 py-2 rounded-xl text-foreground">
          v₀ₓ = <span className="text-sky-700 font-semibold">{v0x.toFixed(1)}</span> m/s · v₀ᵧ = <span className="text-rose-700 font-semibold">{v0y.toFixed(1)}</span> m/s · g = <span className="font-semibold">{G}</span> m/s²
        </div>
      </div>

      {/* ============ GRAPHS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 app-caption font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowUp className="h-3.5 w-3.5" />
            Altura vs Tiempo (parábola)
          </div>
          <Graph
            series={[
              { points: ytGraph, color: "#a7f3d0", label: "trayectoria", dashed: true },
              { points: ytTraveled, color: "#10b981", label: "y(t) recorrido" },
            ]}
            xLabel="tiempo t (s)"
            yLabel="altura y (m)"
            xDomain={[0, tEnd]}
            yDomain={[0, YMAX]}
            markers={[{ x: t, color: "#334155", label: "t" }]}
            caption="Parábola: sube, llega al ápice, baja"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 app-caption font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowRight className="h-3.5 w-3.5" />
            Alcance vs Tiempo (MRU)
          </div>
          <Graph
            series={[
              { points: xtGraph, color: "#bae6fd", label: "MRU horizontal", dashed: true },
              { points: xtTraveled, color: "#0ea5e9", label: "x(t) recorrido" },
            ]}
            xLabel="tiempo t (s)"
            yLabel="alcance x (m)"
            xDomain={[0, tEnd]}
            yDomain={[0, XMAX]}
            markers={[{ x: t, color: "#334155", label: "t" }]}
            caption="x(t) siempre es línea recta (MRU horizontal)"
          />
        </div>
      </div>

      {/* ============ INSIGHTS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Insight color="emerald" title="Independencia de movimientos" icon={<Crosshair className="h-4 w-4" />}>
          El tiro parabólico es la suma de <strong>MRU horizontal</strong> (vₓ constante, sin aceleración) y <strong>MRUV vertical</strong> (a = −g). El movimiento horizontal no afecta al vertical ni viceversa. Por eso puedes analizarlos por separado.
        </Insight>
        <Insight color="amber" title="En el ápice vᵧ = 0" icon={<Target className="h-4 w-4" />}>
          En el punto más alto, la velocidad vertical se anula (solo queda vₓ). Por eso <span className="font-mono font-bold">t_apex = v₀ᵧ/g</span>. Si el tiro es puramente vertical (vₓ=0), en el ápice la rapidez es cero: el objeto se detiene un instante antes de caer.
        </Insight>
      </div>

      {/* ============ EQUATIONS REFERENCE ============ */}
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="app-caption uppercase tracking-wider font-semibold text-muted-foreground mb-2">
          Ecuaciones (componentes)
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm font-mono">
          <div>
            <span className="text-muted-foreground">x(t) =</span>{" "}
            <span className="font-semibold text-sky-700">v₀ₓ · t</span>
            <span className="text-xs text-muted-foreground ml-2">(MRU)</span>
          </div>
          <div>
            <span className="text-muted-foreground">y(t) =</span>{" "}
            <span className="font-semibold text-rose-700">h₀ + v₀ᵧ · t − ½ · g · t²</span>
            <span className="text-xs text-muted-foreground ml-2">(MRUV)</span>
          </div>
          <div>
            <span className="text-muted-foreground">vₓ(t) =</span>{" "}
            <span className="font-semibold text-sky-700">v₀ₓ</span>
            <span className="text-xs text-muted-foreground ml-2">(constante)</span>
          </div>
          <div>
            <span className="text-muted-foreground">vᵧ(t) =</span>{" "}
            <span className="font-semibold text-rose-700">v₀ᵧ − g · t</span>
          </div>
        </div>
      </div>

      {/* ============ FUN FACTS ============ */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <Gauge className="h-4 w-4 text-amber-600" />
          <div className="mt-1 app-caption uppercase tracking-wider font-semibold text-muted-foreground">Rapidez actual</div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{speed.toFixed(2)} m/s = {(speed * 3.6).toFixed(1)} km/h</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Maximize2 className="h-4 w-4 text-sky-600" />
          <div className="mt-1 app-caption uppercase tracking-wider font-semibold text-muted-foreground">Alcance máx</div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{range.toFixed(2)} m</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Zap className="h-4 w-4 text-rose-600" />
          <div className="mt-1 app-caption uppercase tracking-wider font-semibold text-muted-foreground">Tiempo vuelo</div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{tEnd.toFixed(2)} s</div>
        </div>
      </div>
    </div>
  );
}
