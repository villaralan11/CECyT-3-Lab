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
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const rad = (angle * Math.PI) / 180;
  const v0x = mode === "vertical" ? 0 : mode === "horizontal" ? v0 : v0 * Math.cos(rad);
  const v0y = mode === "vertical" ? v0 : mode === "horizontal" ? 0 : v0 * Math.sin(rad);
  const airPosRef = useRef({ x: 0, y: h0, vx: v0x, vy: v0y });
  useEffect(() => { airPosRef.current = { x: 0, y: h0, vx: v0x, vy: v0y }; }, [v0x, v0y, h0, air]);

  const tEnd = useMemo(() => {
    const disc = v0y * v0y + 2 * G * h0;
    if (disc < 0) return 0.1;
    return Math.max(0.1, (v0y + Math.sqrt(disc)) / G);
  }, [v0y, h0]);

  const xA = air ? airPosRef.current.x : v0x * t;
  const yA = air ? airPosRef.current.y : Math.max(0, h0 + v0y * t - 0.5 * G * t * t);
  const x = xA;
  const y = yA;
  const yRaw = h0 + v0y * t - 0.5 * G * t * t;
  const vyA = air ? airPosRef.current.vy : v0y - G * t;
  const vxA = air ? airPosRef.current.vx : v0x;
  const vy = vyA;
  const vx = vxA;
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
          for (let k = 0; k < steps; k++) {
            const v = Math.hypot(airPosRef.current.vx, airPosRef.current.vy);
            const ax = -K_DRAG * airPosRef.current.vx * v;
            const ay = -G - K_DRAG * airPosRef.current.vy * v;
            airPosRef.current.vx += ax * FIXED_DT;
            airPosRef.current.vy += ay * FIXED_DT;
            airPosRef.current.x += airPosRef.current.vx * FIXED_DT;
            airPosRef.current.y += airPosRef.current.vy * FIXED_DT;
            if (airPosRef.current.y < 0) {
              airPosRef.current.y = 0;
              // detiene en suelo
              break;
            }
          }
        }
        setT((prev) => {
          const next = prev + delta;
          if (!air && next >= tEnd) {
            setRunning(false);
            return tEnd;
          }
          if (air && airPosRef.current.y <= 0 && prev > 0.1) {
            setRunning(false);
            return prev + delta;
          }
          return next;
        });
        if (ts - lastTrailTs > 50) {
          lastTrailTs = ts;
          const curT = tRef.current + delta;
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
  }, [running, tEnd, v0x, v0y, h0]);

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
              className={`text-left rounded-xl border-2 px-3 py-2.5 transition-all ${
                active
                  ? "border-emerald-400 bg-emerald-50 shadow-md scale-[1.02]"
                  : "border-border bg-white hover:border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${active ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                  <m.icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${active ? "text-emerald-700" : "text-foreground"}`}>
                    {m.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{m.desc}</div>
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
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${air ? "bg-sky-500 text-white border-sky-500" : "bg-white border-border text-muted-foreground hover:text-foreground"}`}
        >
          <Wind className="h-3.5 w-3.5" />
          Aire: {air ? "ON (arrastre v²)" : "OFF (vacío)"}
        </button>
        <span className="text-[11px] text-muted-foreground">{air ? "F_drag = -k·v·|v|  k=0.02" : "Vacío ideal DEMS"}</span>
      </div>

      {/* ============ CINEMATIC SCENE ============ */}
      <div ref={sceneRef} className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 shadow-xl scroll-mt-20 max-sm:max-h-[42vh] max-sm:sticky max-sm:top-16 max-sm:z-10">
        {/* Sky gradient with sunset feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-cyan-200 to-emerald-100" />

        {/* Sun */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 right-8 h-16 w-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_0_80px_25px_rgba(253,224,71,0.5)]"
        />

        {/* Sun rays */}
        <svg className="absolute top-2 right-4 h-20 w-20" viewBox="0 0 80 80">
          {Array.from({ length: 8 }, (_, i) => {
            const angle = i * 45;
            return (
              <line
                key={i}
                x1="40"
                y1="40"
                x2={40 + Math.cos((angle * Math.PI) / 180) * 38}
                y2={40 + Math.sin((angle * Math.PI) / 180) * 38}
                stroke="#fef3c7"
                strokeWidth="2"
                opacity="0.5"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 40 40"
                  to="360 40 40"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </line>
            );
          })}
        </svg>

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

        {/* Mountains far */}
        <svg className="absolute bottom-[35%] left-0 w-full" viewBox="0 0 600 80" preserveAspectRatio="none" style={{ height: "70px" }}>
          <polygon points="0,80 60,30 130,55 200,20 280,45 360,15 450,40 540,25 600,50 600,80" fill="#0c4a6e" opacity="0.35" />
        </svg>
        {/* Hills near */}
        <svg className="absolute bottom-[30%] left-0 w-full" viewBox="0 0 600 60" preserveAspectRatio="none" style={{ height: "55px" }}>
          <polygon points="0,60 50,40 120,25 200,42 280,20 360,38 460,18 540,32 600,22 600,60" fill="#047857" opacity="0.6" />
        </svg>

        {/* SVG Scene */}
        <svg role="img" aria-label="Simulador tiros" viewBox={`0 0 ${W} ${Hsvg}`} className="relative w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Ground with gradient */}
          <defs>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#365314" />
            </linearGradient>
            <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
            </linearGradient>
            <radialGradient id="projGrad2" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ground */}
          <rect x="0" y={padT + plotH} width={W} height={padB} fill="url(#ground)" />
          {/* Grass texture (small lines) */}
          {Array.from({ length: 40 }, (_, i) => {
            const px = (i / 40) * W;
            return (
              <line key={i} x1={px} y1={padT + plotH} x2={px - 1} y2={padT + plotH - 3} stroke="#365314" strokeWidth="0.8" opacity="0.6" />
            );
          })}

          {/* Grid (subtle) */}
          {Array.from({ length: 7 }, (_, i) => {
            const px = padL + (i / 6) * plotW;
            return <line key={`gx${i}`} x1={px} y1={padT} x2={px} y2={padT + plotH} stroke="#10b981" strokeWidth="0.4" opacity="0.2" />;
          })}
          {Array.from({ length: 5 }, (_, i) => {
            const py = padT + (i / 4) * plotH;
            return <line key={`gy${i}`} x1={padL} y1={py} x2={padL + plotW} y2={py} stroke="#10b981" strokeWidth="0.4" opacity="0.2" />;
          })}

          {/* Axes labels */}
          <text x={padL + plotW / 2} y={Hsvg - 6} textAnchor="middle" fontSize="10" fill="#064e3b" fontWeight="700">
            x (m) · alcance máx = {range.toFixed(1)} m
          </text>
          <text x={10} y={padT + plotH / 2} textAnchor="middle" fontSize="10" fill="#064e3b" fontWeight="700" transform={`rotate(-90 10 ${padT + plotH / 2})`}>
            y (m) · altura máx = {maxH.toFixed(1)} m
          </text>

          {/* Tick labels */}
          {Array.from({ length: 4 }, (_, i) => {
            const val = ((i + 1) / 4) * XMAX;
            const px = sx(val);
            return <text key={`tx${i}`} x={px} y={padT + plotH + 14} textAnchor="middle" fontSize="8" fill="#064e3b">{val.toFixed(0)}</text>;
          })}
          {Array.from({ length: 4 }, (_, i) => {
            const val = ((i + 1) / 4) * YMAX;
            const py = sy(val);
            return <text key={`ty${i}`} x={padL - 5} y={py + 3} textAnchor="end" fontSize="8" fill="#064e3b">{val.toFixed(0)}</text>;
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
                fill="#fbbf24"
                opacity={age * 0.7}
                filter="url(#glow)"
              />
            );
          })}

          {/* Traveled trajectory (solid, glowing) */}
          <path d={traveledPath} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

          {/* Apex marker */}
          {maxH > 0.5 && tApex > 0 && tApex < tEnd && (
            <g>
              <circle cx={sx(v0x * tApex)} cy={sy(maxH)} r="4" fill="#fbbf24" stroke="#fff" strokeWidth="2" filter="url(#glow)" />
              <line x1={sx(v0x * tApex)} y1={sy(maxH)} x2={sx(v0x * tApex)} y2={sy(0)} stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
              <text x={sx(v0x * tApex)} y={sy(maxH) - 8} textAnchor="middle" fontSize="10" fill="#d97706" fontWeight="bold">
                ↑ {maxH.toFixed(1)} m
              </text>
            </g>
          )}

          {/* Landing marker */}
          {range > 0.5 && (
            <g>
              <line x1={sx(range)} y1={padT + plotH - 10} x2={sx(range)} y2={padT + plotH} stroke="#dc2626" strokeWidth="2.5" />
              <text x={sx(range)} y={padT + plotH - 14} textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="bold">
                {range.toFixed(1)} m
              </text>
            </g>
          )}

          {/* Launch point (cannon) */}
          <g transform={`translate(${sx(0)}, ${sy(h0)})`}>
            {/* Cannon base */}
            <rect x="-8" y="0" width="16" height="8" fill="#1f2937" rx="2" />
            {/* Cannon barrel (rotates with angle) */}
            {mode !== "horizontal" && (
              <g transform={`rotate(${-angle})`}>
                <rect x="0" y="-3" width="20" height="6" fill="#374151" rx="2" />
                <circle cx="20" cy="0" r="3" fill="#dc2626" />
              </g>
            )}
            {mode === "horizontal" && (
              <rect x="0" y="-3" width="20" height="6" fill="#374151" rx="2" />
            )}
            <text x="0" y="-12" textAnchor="middle" fontSize="9" fill="#d97706" fontWeight="bold">
              {h0 > 0 ? `h₀=${h0}m` : "lanzamiento"}
            </text>
          </g>

          {/* Projectile + vectors */}
          {y >= 0 && (
            <g transform={`translate(${sx(x)}, ${sy(y)})`}>
              {/* Glow halo */}
              <circle r="12" fill="#fbbf24" opacity="0.3" filter="url(#glow)" />
              {/* Projectile */}
              <circle r="7" fill="url(#projGrad2)" stroke="#fff" strokeWidth="2" filter="url(#glow)" />

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
                  stroke="white"
                  strokeWidth="1.8"
                  strokeDasharray="3 2"
                  opacity="0.8"
                />
              )}
            </g>
          )}
        </svg>

        {/* Overlay info cards */}
        <div className="absolute top-3 left-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 px-3 py-2 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">Tiempo</div>
          <div className="font-mono font-bold text-lg text-foreground">{t.toFixed(2)}s / {tEnd.toFixed(2)}s</div>
        </div>
        <div className="absolute top-3 right-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 px-3 py-2 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">Altura</div>
          <div className="font-mono font-bold text-lg text-emerald-600">{y.toFixed(2)}m</div>
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
            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
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
        <div className="text-xs text-muted-foreground italic">
          ↑ Usa los controles flotantes sobre la escena para iniciar la simulación
        </div>
        <div className="text-xs text-muted-foreground font-mono bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-3 py-2 rounded-lg">
          v₀ₓ = <span className="text-sky-600 font-bold">{v0x.toFixed(1)}</span> m/s · v₀ᵧ = <span className="text-rose-600 font-bold">{v0y.toFixed(1)}</span> m/s · g = <span className="text-foreground font-bold">{G}</span> m/s²
        </div>
      </div>

      {/* ============ GRAPHS ============ */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
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
            markers={[{ x: t, color: "#f43f5e", label: "t" }]}
            caption="Parábola: sube, llega al ápice, baja"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
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
            markers={[{ x: t, color: "#f43f5e", label: "t" }]}
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
      <div className="rounded-xl border border-border bg-gradient-to-r from-emerald-50/50 to-sky-50/50 p-3">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
          Ecuaciones (componentes)
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm font-mono">
          <div>
            <span className="text-muted-foreground">x(t) =</span>{" "}
            <span className="font-bold text-sky-600">v₀ₓ · t</span>
            <span className="text-xs text-muted-foreground ml-2">(MRU)</span>
          </div>
          <div>
            <span className="text-muted-foreground">y(t) =</span>{" "}
            <span className="font-bold text-rose-600">h₀ + v₀ᵧ · t − ½ · g · t²</span>
            <span className="text-xs text-muted-foreground ml-2">(MRUV)</span>
          </div>
          <div>
            <span className="text-muted-foreground">vₓ(t) =</span>{" "}
            <span className="font-bold text-sky-600">v₀ₓ</span>
            <span className="text-xs text-muted-foreground ml-2">(constante)</span>
          </div>
          <div>
            <span className="text-muted-foreground">vᵧ(t) =</span>{" "}
            <span className="font-bold text-rose-600">v₀ᵧ − g · t</span>
          </div>
        </div>
      </div>

      {/* ============ FUN FACTS ============ */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-3">
          <Gauge className="h-4 w-4 text-amber-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-amber-700">Rapidez actual</div>
          <div className="text-sm font-bold text-foreground">{speed.toFixed(2)} m/s = {(speed * 3.6).toFixed(1)} km/h</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 p-3">
          <Maximize2 className="h-4 w-4 text-sky-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-sky-700">Alcance máx</div>
          <div className="text-sm font-bold text-foreground">{range.toFixed(2)} m</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-3">
          <Zap className="h-4 w-4 text-rose-600" />
          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-rose-700">Tiempo vuelo</div>
          <div className="text-sm font-bold text-foreground">{tEnd.toFixed(2)} s</div>
        </div>
      </div>
    </div>
  );
}
