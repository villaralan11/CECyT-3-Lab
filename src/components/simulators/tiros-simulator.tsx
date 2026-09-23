"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SimHeader } from "./shared";
import { useProgress } from "@/hooks/use-progress";
import styles from "./tiros-lab.module.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/* ================= Tipos ================= */

type Mode = "parabolico" | "horizontal" | "vertical";
type Phase = "idle" | "flying" | "done";

type ShotParams = {
  mode: Mode;
  v0: number;
  ang: number;
  h0: number;
  g: number;
  vx0: number;
  vy0: number;
  t: number;
  range: number;
  apex: number;
};

type Flight = {
  p: ShotParams;
  id: number;
  color: string;
  mode: Mode;
  v0: number;
  ang: number;
  h0: number;
  g: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; g: number; life: number; r: number };
type TrailPt = { x: number; y: number; t: number };
type Star = { x: number; y: number; r: number; ph: number; sp: number };
type TeleVals = { t: number; x: number; y: number; vx: number; vy: number; v: number };

type SimState = {
  phase: Phase;
  tSim: number;
  paused: boolean;
  flight: Flight | null;
  shots: Flight[];
  shotId: number;
  particles: Particle[];
  trailPts: TrailPt[];
  impact: { x: number; t: number } | null;
  flash: number;
  cam: { scale: number; target: number; ox: number; oxT: number; shakeT: number; sx: number; sy: number };
  env: string;
  envNow: number[];
  envGoal: number[];
  aim: { px: number; py: number } | null;
  W: number;
  H: number;
  OX: number;
  OY: number;
  stars: Star[];
  stars2: Star[];
};

type LiveParams = {
  mode: Mode;
  v0: number;
  ang: number;
  h0: number;
  g: number;
  timeScale: number;
  vectors: boolean;
  trail: boolean;
  ghosts: boolean;
  sound: boolean;
};

/* ================= Constantes ================= */

const MODES: Record<Mode, { color: string; fixedAngle: number | null }> = {
  parabolico: { color: "#ff5c4d", fixedAngle: null },
  horizontal: { color: "#2fd6c0", fixedAngle: 0 },
  vertical: { color: "#ffb340", fixedAngle: 90 },
};

const ENV: Record<string, {
  label: string; g: number;
  sky: [number, number, number][];
  stars: number;
  sun: { a: number; r: number; core: [number, number, number]; halo: [number, number, number] };
  hills: [number, number, number][];
  ground: [number, number, number];
  ink: { grid: [number, number, number, number]; dim: [number, number, number, number]; label: [number, number, number, number]; strong: [number, number, number, number] };
  clouds: number; earth: number; craters: number; bands: number; spot: number;
}> = {
  tierra: {
    label: "Tierra", g: 9.81,
    sky: [[52, 120, 190], [110, 170, 225], [190, 222, 238]],
    stars: 0,
    sun: { a: 1, r: 1, core: [255, 246, 214], halo: [255, 228, 150] },
    hills: [[122, 158, 190], [86, 134, 94]], ground: [26, 48, 34],
    ink: { grid: [15, 45, 85, .13], dim: [15, 45, 85, .38], label: [12, 40, 78, .66], strong: [8, 30, 64, .95] },
    clouds: 1, earth: 0, craters: 0, bands: 0, spot: 0,
  },
  luna: {
    label: "Luna", g: 1.62,
    sky: [[4, 5, 9], [8, 10, 15], [13, 16, 22]],
    stars: 1,
    sun: { a: 0, r: .6, core: [210, 210, 215], halo: [160, 160, 170] },
    hills: [[58, 62, 72], [34, 38, 46]], ground: [15, 16, 20],
    ink: { grid: [255, 255, 255, .07], dim: [255, 255, 255, .32], label: [255, 255, 255, .42], strong: [235, 240, 248, .95] },
    clouds: 0, earth: 1, craters: 1, bands: 0, spot: 0,
  },
  marte: {
    label: "Marte", g: 3.71,
    sky: [[156, 72, 42], [193, 109, 62], [214, 150, 104]],
    stars: .18,
    sun: { a: 1, r: .5, core: [238, 232, 224], halo: [170, 205, 238] },
    hills: [[150, 80, 52], [104, 50, 28]], ground: [54, 25, 15],
    ink: { grid: [55, 22, 10, .13], dim: [55, 22, 10, .42], label: [52, 20, 9, .68], strong: [46, 16, 6, .95] },
    clouds: 0, earth: 0, craters: 0, bands: 0, spot: 0,
  },
  jupiter: {
    label: "Júpiter", g: 24.79,
    sky: [[199, 158, 105], [221, 190, 143], [234, 212, 170]],
    stars: 0,
    sun: { a: 0, r: .6, core: [210, 210, 215], halo: [160, 160, 170] },
    hills: [[166, 118, 76], [128, 86, 52]], ground: [74, 50, 28],
    ink: { grid: [80, 50, 22, .13], dim: [80, 50, 22, .42], label: [72, 45, 18, .68], strong: [62, 38, 14, .95] },
    clouds: 0, earth: 0, craters: 0, bands: 1, spot: 1,
  },
};

const OFF = {
  SKY: 0, STARS: 9, SUN_A: 10, SUN_R: 11, SUN_C: 12, SUN_H: 15,
  H0: 18, H1: 21, GRD: 24, IG: 27, ID: 31, IL: 35, IS: 39,
  CL: 43, EA: 44, CR: 45, BA: 46, SP: 47,
};

function envVec(e: (typeof ENV)[string]): number[] {
  return [
    ...e.sky[0], ...e.sky[1], ...e.sky[2],
    e.stars, e.sun.a, e.sun.r, ...e.sun.core, ...e.sun.halo,
    ...e.hills[0], ...e.hills[1], ...e.ground,
    ...e.ink.grid, ...e.ink.dim, ...e.ink.label, ...e.ink.strong,
    e.clouds, e.earth, e.craters, e.bands, e.spot,
  ];
}

const G2ENV: Record<number, string> = {};
for (const [k, v] of Object.entries(ENV)) G2ENV[v.g] = k;

const GRAV_CHIPS = [
  { label: "Tierra", g: 9.81, c: "#4f96d8" },
  { label: "Luna", g: 1.62, c: "#9aa3b2" },
  { label: "Marte", g: 3.71, c: "#c4703f" },
  { label: "Júpiter", g: 24.79, c: "#c9a06b" },
];

const SPEEDS = [0.25, 0.5, 1, 2];

/* ================= Utilidades puras ================= */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function computeParams(v0: number, ang: number, h0: number, g: number, mode: Mode): ShotParams {
  const th = (ang * Math.PI) / 180;
  let vx0: number, vy0: number;
  if (mode === "horizontal") { vx0 = v0; vy0 = 0; }
  else if (mode === "vertical") { vx0 = 0; vy0 = v0; }
  else { vx0 = v0 * Math.cos(th); vy0 = v0 * Math.sin(th); }
  const disc = Math.max(vy0 * vy0 + 2 * g * h0, 0);
  const t = Math.max((vy0 + Math.sqrt(disc)) / g, .05);
  const range = vx0 * t;
  const apex = h0 + (vy0 > 0 ? (vy0 * vy0) / (2 * g) : 0);
  return { mode, v0, ang, h0, g, vx0, vy0, t, range, apex };
}

function posAt(p: ShotParams, t: number) {
  return { x: p.vx0 * t, y: p.h0 + p.vy0 * t - .5 * p.g * t * t };
}

function niceStep(range: number, n: number) {
  const raw = range / n;
  if (raw <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const r = raw / mag;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * mag;
}

const fmtAxis = (v: number) => (Math.abs(v % 1) > 1e-9 ? v.toFixed(1) : String(Math.round(v)));

/* ================= Sonido sintetizado ================= */

const Sound = {
  ctx: null as AudioContext | null,
  ensure(enabled: boolean): AudioContext | null {
    if (!enabled) return null;
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AC();
      } catch { return null; }
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  },
  launch(enabled: boolean) {
    const c = this.ensure(enabled); if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(340, t);
    o.frequency.exponentialRampToValueAtTime(70, t + .22);
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(.22, t + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t + .24);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .26);
  },
  impact(enabled: boolean) {
    const c = this.ensure(enabled); if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(44, t + .16);
    g.gain.setValueAtTime(.001, t);
    g.gain.exponentialRampToValueAtTime(.32, t + .012);
    g.gain.exponentialRampToValueAtTime(.001, t + .18);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .2);
    const len = Math.floor(c.sampleRate * .12), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 620;
    const g2 = c.createGain(); g2.gain.value = .24;
    src.connect(f); f.connect(g2); g2.connect(c.destination); src.start(t);
  },
};

/* ================= Dibujo (canvas) ================= */

type Frame = {
  ctx: CanvasRenderingContext2D;
  S: SimState;
  W: number;
  H: number;
  OX: number;
  OY: number;
  tele: (v: TeleVals) => void;
};

function w2s(F: Frame, x: number, y: number) {
  return { x: F.S.cam.ox + x * F.S.cam.scale + F.S.cam.sx, y: F.OY - y * F.S.cam.scale + F.S.cam.sy };
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const c3 = (S: SimState, o: number) => {
  const v = S.envNow;
  return `rgb(${v[o] | 0},${v[o + 1] | 0},${v[o + 2] | 0})`;
};
const c4 = (S: SimState, o: number) => {
  const v = S.envNow;
  return `rgba(${v[o] | 0},${v[o + 1] | 0},${v[o + 2] | 0},${clamp(v[o + 3], 0, 1).toFixed(3)})`;
};
const cA = (S: SimState, o: number, a: number) => {
  const v = S.envNow;
  return `rgba(${v[o] | 0},${v[o + 1] | 0},${v[o + 2] | 0},${clamp(a, 0, 1).toFixed(3)})`;
};
const lightSky = (S: SimState) => {
  const v = S.envNow;
  return ((v[OFF.SKY + 3] * .299 + v[OFF.SKY + 4] * .587 + v[OFF.SKY + 5] * .114) / 255) > .5;
};
function vecColors(S: SimState) {
  return lightSky(S)
    ? { vx: "#0e7a6c", vy: "#a06a10", v: "#1c2740", g: "rgba(30,42,66,.55)" }
    : { vx: "#5fe3c8", vy: "#ffc862", v: "#f4f6fb", g: "rgba(255,255,255,.45)" };
}

function computeCamTarget(S: SimState, P: LiveParams) {
  let xMax = 8, yMax = 5;
  const cur = computeParams(P.v0, P.ang, P.h0, P.g, P.mode);
  xMax = Math.max(xMax, cur.range); yMax = Math.max(yMax, cur.apex, cur.h0);
  if (S.flight) { xMax = Math.max(xMax, S.flight.p.range); yMax = Math.max(yMax, S.flight.p.apex, S.flight.p.h0); }
  if (P.ghosts) for (const sh of S.shots) {
    xMax = Math.max(xMax, sh.p.range); yMax = Math.max(yMax, sh.p.apex, sh.p.h0);
  }
  const vert = P.mode === "vertical";
  const topPad = S.W < 640 ? 152 : (vert ? 84 : 108);
  S.cam.oxT = vert ? S.W / 2 : S.OX;
  const uw = vert ? (S.W - S.cam.oxT - 36) : (S.W - S.OX - 84);
  const uh = S.OY - topPad;
  S.cam.target = clamp(Math.min(uw / xMax, uh / yMax), .4, 90);
}

function stepSim(S: SimState, P: LiveParams, dt: number, onImpact: () => void) {
  if (S.phase === "flying" && !S.paused && S.flight) {
    S.tSim = Math.min(S.tSim + dt * P.timeScale, S.flight.p.t);
    if (P.trail) {
      const pp = posAt(S.flight.p, S.tSim);
      S.trailPts.push({ x: pp.x, y: pp.y, t: S.tSim });
      while (S.trailPts.length && S.tSim - S.trailPts[0].t > 1.3) S.trailPts.shift();
    }
    if (S.tSim >= S.flight.p.t - 1e-9) {
      S.phase = "done";
      onImpact();
    }
  }
  if (!S.paused) {
    S.flash = Math.max(0, S.flash - dt);
    if (S.impact) { S.impact.t += dt; if (S.impact.t > .7) S.impact = null; }
    for (let i = S.particles.length - 1; i >= 0; i--) {
      const q = S.particles[i];
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy -= q.g * dt; q.life -= dt;
      if (q.y < 0) { q.y = 0; q.vy *= -.35; q.vx *= .7; }
      if (q.life <= 0) S.particles.splice(i, 1);
    }
  }
  if (S.cam.shakeT > 0) {
    S.cam.shakeT = Math.max(0, S.cam.shakeT - dt);
    const k = S.cam.shakeT / .4;
    S.cam.sx = (Math.random() - .5) * 14 * k; S.cam.sy = (Math.random() - .5) * 14 * k;
  } else { S.cam.sx = 0; S.cam.sy = 0; }
  S.cam.scale += (S.cam.target - S.cam.scale) * Math.min(1, dt * 4);
  S.cam.ox += (S.cam.oxT - S.cam.ox) * Math.min(1, dt * 4);
  const k = Math.min(1, dt * 2.2), nv = S.envNow, gv = S.envGoal;
  for (let i = 0; i < nv.length; i++) nv[i] += (gv[i] - nv[i]) * k;
}

function drawSky(F: Frame, time: number) {
  const { ctx, S, W: ANCHO, H: ALTO } = F;
  const g = ctx.createLinearGradient(0, 0, 0, ALTO);
  g.addColorStop(0, c3(S, OFF.SKY));
  g.addColorStop(.55, c3(S, OFF.SKY + 3));
  g.addColorStop(1, c3(S, OFF.SKY + 6));
  ctx.fillStyle = g; ctx.fillRect(0, 0, ANCHO, ALTO);
  if (S.envNow[OFF.BA] > .02) drawBands(F, time);
  drawStars(F, time);
  if (S.envNow[OFF.SP] > .02) drawSpot(F, time);
  if (S.envNow[OFF.SUN_A] > .02) drawSun(F);
  if (S.envNow[OFF.EA] > .02) drawEarthInSky(F);
  if (S.envNow[OFF.CL] > .02) drawClouds(F, time);
}

function drawStars(F: Frame, time: number) {
  const { ctx, S } = F;
  const base = clamp(S.envNow[OFF.STARS], 0, 1); if (base < .02) return;
  ctx.fillStyle = "#e7edff";
  for (const st of S.stars) {
    ctx.globalAlpha = base * (.18 + .32 * (.5 + .5 * Math.sin(time * st.sp + st.ph)));
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
  }
  for (const st of S.stars2) {
    ctx.globalAlpha = base * .35;
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawSun(F: Frame) {
  const { ctx, S, W: ANCHO, H: ALTO } = F;
  const a = clamp(S.envNow[OFF.SUN_A], 0, 1); if (a < .02) return;
  const sr = clamp(S.envNow[OFF.SUN_R], .15, 1.2);
  const x = ANCHO * .8, y = ALTO * .13;
  const hr = 14 + 80 * sr;
  const halo = ctx.createRadialGradient(x, y, 0, x, y, hr);
  halo.addColorStop(0, cA(S, OFF.SUN_H, .5 * a));
  halo.addColorStop(.35, cA(S, OFF.SUN_H, .22 * a));
  halo.addColorStop(1, cA(S, OFF.SUN_H, 0));
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, hr, 0, 6.283); ctx.fill();
  ctx.fillStyle = cA(S, OFF.SUN_C, .96 * a);
  ctx.beginPath(); ctx.arc(x, y, 4 + 10 * sr, 0, 6.283); ctx.fill();
}

function drawEarthInSky(F: Frame) {
  const { ctx, S, W: ANCHO, H: ALTO } = F;
  const a = clamp(S.envNow[OFF.EA], 0, 1); if (a < .02) return;
  const x = ANCHO * .63, y = ALTO * .12;
  ctx.globalAlpha = a;
  const at = ctx.createRadialGradient(x, y, 14, x, y, 44);
  at.addColorStop(0, "rgba(120,185,240,.5)"); at.addColorStop(1, "rgba(120,185,240,0)");
  ctx.fillStyle = at; ctx.beginPath(); ctx.arc(x, y, 44, 0, 6.283); ctx.fill();
  const p = ctx.createRadialGradient(x - 7, y - 8, 4, x, y, 21);
  p.addColorStop(0, "#a9d4f4"); p.addColorStop(.5, "#3f7fc1"); p.addColorStop(1, "#173f6e");
  ctx.fillStyle = p; ctx.beginPath(); ctx.arc(x, y, 20, 0, 6.283); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.5)";
  ctx.beginPath(); ctx.ellipse(x - 4, y + 3, 13, 4, -.3, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 6, y - 6, 9, 3, .2, 0, 6.283); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawSpot(F: Frame, time: number) {
  const { ctx, S, W: ANCHO, H: ALTO } = F;
  const a = clamp(S.envNow[OFF.SP], 0, 1); if (a < .02) return;
  const x = ANCHO * .72, y = ALTO * .34;
  const rx = 30 + Math.sin(time * .3) * 1.5;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.12); ctx.scale(1, .55);
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, rx);
  g.addColorStop(0, `rgba(196,90,58,${(.5 * a).toFixed(3)})`);
  g.addColorStop(.7, `rgba(196,90,58,${(.28 * a).toFixed(3)})`);
  g.addColorStop(1, "rgba(196,90,58,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 6.283); ctx.fill();
  ctx.restore();
}

function drawBands(F: Frame, time: number) {
  const { ctx, S, W: ANCHO, H: ALTO } = F;
  const a = clamp(S.envNow[OFF.BA], 0, 1); if (a < .02) return;
  const bands = [
    { y: .18, h: .06, dark: 1, al: .20 },
    { y: .30, h: .08, dark: 0, al: .16 },
    { y: .42, h: .07, dark: 1, al: .22 },
    { y: .55, h: .09, dark: 0, al: .14 },
    { y: .68, h: .06, dark: 1, al: .18 },
  ];
  for (const b of bands) {
    const base = ALTO * b.y, hh = ALTO * b.h;
    ctx.beginPath(); ctx.moveTo(-20, base);
    for (let x = -20; x <= ANCHO + 20; x += 48) ctx.lineTo(x, base + Math.sin(x * .006 + time * .12 + b.y * 9) * 7);
    for (let x = ANCHO + 20; x >= -20; x -= 48) ctx.lineTo(x, base + hh + Math.sin(x * .005 - time * .09 + b.y * 7) * 7);
    ctx.closePath();
    ctx.fillStyle = b.dark
      ? `rgba(150,100,58,${(b.al * a).toFixed(3)})`
      : `rgba(240,220,180,${(b.al * a).toFixed(3)})`;
    ctx.fill();
  }
}

function nube(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, a: number) {
  const blobs = [[0, 0, 26], [24, 5, 17], [-26, 7, 15], [10, -9, 16], [-10, -7, 13]];
  ctx.fillStyle = `rgba(255,255,255,${(.55 * a).toFixed(3)})`;
  ctx.beginPath();
  for (const [dx, dy, r] of blobs) {
    const rad = r * s;
    ctx.moveTo(x + dx * s + rad, y + dy * s);
    ctx.arc(x + dx * s, y + dy * s, rad, 0, 6.283);
  }
  ctx.fill();
}

function drawClouds(F: Frame, time: number) {
  const { ctx, S, W: ANCHO, H: ALTO } = F;
  const a = clamp(S.envNow[OFF.CL], 0, 1); if (a < .02) return;
  const defs = [{ y: .14, s: 1.05, v: 6, o: 60 }, { y: .25, s: .72, v: 9, o: 420 }, { y: .36, s: 1.35, v: 4, o: 780 }];
  const span = ANCHO + 280;
  for (const c of defs) {
    const x = (((c.o + time * c.v) % span) + span) % span - 140;
    nube(ctx, x, ALTO * c.y, c.s, a);
  }
}

function drawHills(F: Frame) {
  const { ctx, S, W: ANCHO } = F;
  const gy = F.OY + S.cam.sy;
  ctx.save(); ctx.translate(S.cam.sx * .35, 0);
  ctx.fillStyle = c3(S, OFF.H0);
  ctx.beginPath(); ctx.moveTo(0, gy + 2);
  for (let x = 0; x <= ANCHO + 36; x += 36) ctx.lineTo(x, gy - 24 - Math.sin(x * .006 + 2) * 34 - Math.cos(x * .013) * 16);
  ctx.lineTo(ANCHO, gy + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = c3(S, OFF.H1);
  ctx.beginPath(); ctx.moveTo(0, gy + 2);
  for (let x = 0; x <= ANCHO + 28; x += 28) ctx.lineTo(x, gy - 8 - Math.sin(x * .011 + .6) * 16 - Math.cos(x * .02 + 1) * 9);
  ctx.lineTo(ANCHO, gy + 2); ctx.closePath(); ctx.fill();
  const ca = clamp(S.envNow[OFF.CR], 0, 1);
  if (ca > .05) {
    for (let i = 0; i < 7; i++) {
      const cx = (i * 151 + 53) % ANCHO;
      const cy = gy - 14 - Math.sin(cx * .011 + .6) * 16 - Math.cos(cx * .02 + 1) * 9;
      const r = 4 + ((i * 37) % 9);
      ctx.fillStyle = `rgba(0,0,0,${(.28 * ca).toFixed(3)})`;
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * .36, 0, 0, 6.283); ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${(.12 * ca).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, cy - 1, r, r * .36, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawGrid(F: Frame, vert: boolean) {
  const { ctx, S, W: ANCHO } = F;
  const sc = S.cam.scale;
  const xVis = (ANCHO - S.cam.ox) / sc, yVis = F.OY / sc;
  const sx = niceStep(xVis, 10), sy = niceStep(yVis, 8);
  ctx.lineWidth = 1; ctx.strokeStyle = c4(S, OFF.IG);
  ctx.beginPath();
  const k0 = vert ? -Math.ceil(xVis / sx) : 0;
  for (let k = k0; k * sx <= xVis; k++) {
    const p = w2s(F, k * sx, 0);
    if (p.x >= 0 && p.x <= ANCHO) { ctx.moveTo(p.x, 0); ctx.lineTo(p.x, F.OY + S.cam.sy); }
  }
  for (let k = 0; k * sy <= yVis; k++) {
    const p = w2s(F, 0, k * sy);
    ctx.moveTo(0, p.y); ctx.lineTo(ANCHO, p.y);
  }
  ctx.stroke();
  ctx.font = "500 10px monospace";
  if (!vert) {
    ctx.fillStyle = "rgba(255,255,255,.34)"; ctx.textAlign = "center";
    for (let k = 1; k * sx <= xVis; k++) {
      const p = w2s(F, k * sx, 0);
      if (p.x < ANCHO - 30) ctx.fillText(fmtAxis(k * sx), p.x, F.OY + S.cam.sy + 17);
    }
  }
  ctx.fillStyle = c4(S, OFF.IL); ctx.textAlign = "right";
  const yLabX = vert ? Math.min(44, ANCHO * .12) : S.cam.ox - 8;
  for (let k = 1; k * sy <= yVis; k++) {
    const p = w2s(F, 0, k * sy);
    if (p.y > 34) ctx.fillText(fmtAxis(k * sy), yLabX, p.y + 3);
  }
  const ax = S.cam.ox + S.cam.sx;
  ctx.strokeStyle = c4(S, OFF.ID); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(ax, F.OY + S.cam.sy); ctx.lineTo(ax, 32); ctx.stroke();
  ctx.fillStyle = c4(S, OFF.ID);
  ctx.beginPath(); ctx.moveTo(ax, 25); ctx.lineTo(ax - 4, 33); ctx.lineTo(ax + 4, 33); ctx.closePath(); ctx.fill();
}

function arrow(F: Frame, x1: number, y1: number, x2: number, y2: number, color: string, w: number, label?: string) {
  const { ctx, S } = F;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (scale: number, fill: string) => {
    const hl = 8 * scale;
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(a - .45) * hl, y2 - Math.sin(a - .45) * hl);
    ctx.lineTo(x2 - Math.cos(a + .45) * hl, y2 - Math.sin(a + .45) * hl);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  };
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(8,12,20,.38)"; ctx.lineWidth = w + 3;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * 5, y2 - Math.sin(a) * 5); ctx.stroke();
  head(1.55, "rgba(8,12,20,.38)");
  ctx.strokeStyle = color; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * 5, y2 - Math.sin(a) * 5); ctx.stroke();
  head(1, color);
  if (label) {
    ctx.font = "600 10px monospace"; ctx.textAlign = "left";
    ctx.save();
    ctx.shadowColor = lightSky(S) ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.6)";
    ctx.shadowBlur = 3;
    ctx.fillStyle = color;
    ctx.fillText(label, x2 + Math.cos(a) * 7 + 2, y2 + Math.sin(a) * 7 + 3);
    ctx.restore();
  }
}

function drawLauncher(F: Frame, cur: ShotParams, col: string, mode: Mode, ang: number) {
  const { ctx, S } = F;
  const lp = w2s(F, 0, cur.h0);
  const deg = mode === "parabolico" ? ang : (MODES[mode].fixedAngle ?? 0);
  const rad = (deg * Math.PI) / 180, dx = Math.cos(rad), dy = -Math.sin(rad);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#8f97a8"; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(lp.x + dx * 30, lp.y + dy * 30); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(lp.x + dx * 21, lp.y + dy * 21); ctx.lineTo(lp.x + dx * 32, lp.y + dy * 32); ctx.stroke();
  if (S.flash > 0) {
    const a = clamp(S.flash / .25, 0, 1);
    const tx = lp.x + dx * 36, ty = lp.y + dy * 36;
    const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 34);
    g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(.45, col + "88"); g.addColorStop(1, col + "00");
    ctx.globalAlpha = a; ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(tx, ty, 34, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#242b3a"; ctx.strokeStyle = c4(S, OFF.IL); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(lp.x, lp.y, 7.5, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(lp.x, lp.y, 2.6, 0, 6.283); ctx.fill();
}

function drawProjectile(F: Frame, cur: ShotParams, col: string, time: number, P: LiveParams) {
  const { ctx, S, H: ALTO } = F;
  let sp: { x: number; y: number };
  if (S.flight) { const pp = posAt(S.flight.p, S.tSim); sp = w2s(F, pp.x, pp.y); }
  else sp = w2s(F, 0, cur.h0);

  const pul = 1 + Math.sin(time * 5) * .12;
  const halo = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, 40 * pul);
  halo.addColorStop(0, col + "55"); halo.addColorStop(.55, col + "18"); halo.addColorStop(1, col + "00");
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(sp.x, sp.y, 40 * pul, 0, 6.283); ctx.fill();

  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 22;
  ctx.beginPath(); ctx.arc(sp.x, sp.y, 9, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.beginPath(); ctx.arc(sp.x - 2.5, sp.y - 2.5, 3, 0, 6.283); ctx.fill();

  if (P.vectors) {
    const VC = vecColors(S);
    if (S.phase === "flying" && S.flight) {
      const p = S.flight.p, k = 2.1;
      const vx = p.vx0, vy = p.vy0 - p.g * S.tSim;
      const isVert = Math.abs(vx) < .05;
      if (!isVert) arrow(F, sp.x, sp.y, sp.x + vx * k, sp.y, VC.vx, 2, "vx");
      const off = isVert ? 18 : 0;
      arrow(F, sp.x - off, sp.y, sp.x - off, sp.y - vy * k, VC.vy, 2, "vy");
      arrow(F, sp.x + off, sp.y, sp.x + off + vx * k, sp.y - vy * k, VC.v, 2.2, "v");
      const gx = isVert ? 42 : 26;
      arrow(F, sp.x - gx, sp.y + 6, sp.x - gx, sp.y + 36, VC.g, 1.5, "g");
    } else if (S.phase === "idle") {
      const deg = P.mode === "parabolico" ? P.ang : (MODES[P.mode].fixedAngle ?? 0);
      const rad = (deg * Math.PI) / 180, k = 2.1;
      const off = P.mode === "vertical" ? 20 : 0;
      const bx = sp.x + Math.cos(rad) * 38 + off, by = sp.y - Math.sin(rad) * 38;
      arrow(F, bx, by, bx + Math.cos(rad) * cur.v0 * k, by - Math.sin(rad) * cur.v0 * k, VC.v, 2.2, "v0");
    }
  }
  if (S.phase === "flying" && S.flight) {
    const p = S.flight.p;
    const v = Math.hypot(p.vx0, p.vy0 - p.g * S.tSim);
    ctx.font = "500 10.5px monospace";
    ctx.fillStyle = c4(S, OFF.IS); ctx.textAlign = "left";
    ctx.shadowColor = lightSky(S) ? "rgba(255,255,255,.75)" : "rgba(0,0,0,.7)";
    ctx.shadowBlur = 4;
    ctx.fillText(`t ${S.tSim.toFixed(2)} s   v ${v.toFixed(1)} m/s`, sp.x + (P.mode === "vertical" ? 34 : 16), clamp(sp.y - 16, 42, ALTO - 16));
    ctx.shadowBlur = 0;
  }
}

function drawAim(F: Frame, cur: ShotParams, P: LiveParams) {
  const { ctx, S, W: ANCHO, H: ALTO } = F;
  if (!S.aim) return;
  const lp = w2s(F, 0, cur.h0);
  let ax = S.aim.px;
  const ay = S.aim.py;
  if (P.mode === "vertical") ax = lp.x;
  ctx.setLineDash([6, 6]); ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(ax, ay); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(ax, ay, 5, 0, 6.283); ctx.stroke();
  const txt = P.mode === "parabolico" ? `${P.ang}°  ·  ${P.v0} m/s` : `${P.v0} m/s`;
  ctx.font = "600 11px monospace";
  const bw = ctx.measureText(txt).width + 26, bh = 26;
  const bx = clamp(ax + 16, 8, ANCHO - bw - 8), by = clamp(ay - bh - 14, 8, ALTO - bh - 8);
  rr(ctx, bx, by, bw, bh, 8);
  ctx.fillStyle = "rgba(10,13,20,.88)"; ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.fillText(txt, bx + 13, by + 17);
}

function draw(F: Frame, time: number, P: LiveParams) {
  const { ctx, S, W: ANCHO } = F;
  const col = MODES[P.mode].color;
  const cur = computeParams(P.v0, P.ang, P.h0, P.g, P.mode);
  const vert = P.mode === "vertical";

  drawSky(F, time);
  drawHills(F);
  drawGrid(F, vert);

  const gy = F.OY + S.cam.sy;
  ctx.fillStyle = c3(S, OFF.GRD); ctx.fillRect(0, gy, ANCHO, Math.max(0, F.H - gy));
  const ca = clamp(S.envNow[OFF.CR], 0, 1);
  if (ca > .05) {
    ctx.fillStyle = `rgba(0,0,0,${(.26 * ca).toFixed(3)})`;
    for (let i = 0; i < 5; i++) {
      const cx = (i * 197 + 89) % ANCHO, cy = gy + 12 + ((i * 23) % 22), r = 7 + ((i * 31) % 10);
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * .3, 0, 0, 6.283); ctx.fill();
    }
  }
  ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha = .9;
  ctx.shadowColor = col; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.moveTo(-20, gy); ctx.lineTo(ANCHO + 20, gy); ctx.stroke();
  ctx.shadowBlur = 0; ctx.globalAlpha = 1;

  if (P.ghosts) {
    for (const sh of S.shots) {
      if (sh === S.flight) continue;
      ctx.beginPath();
      const n = 80;
      for (let i = 0; i <= n; i++) {
        const pp = posAt(sh.p, (sh.p.t * i) / n), s = w2s(F, pp.x, pp.y);
        if (i) ctx.lineTo(s.x, s.y); else ctx.moveTo(s.x, s.y);
      }
      ctx.strokeStyle = sh.color + "38"; ctx.lineWidth = 2;
      ctx.setLineDash([5, 6]); ctx.stroke(); ctx.setLineDash([]);
      const vshot = sh.p.mode === "vertical";
      const m = w2s(F, vshot ? 0 : sh.p.range, vshot ? sh.p.apex : 0);
      ctx.strokeStyle = sh.color + "66"; ctx.lineWidth = 2;
      ctx.beginPath();
      if (vshot) { ctx.moveTo(m.x - 7, m.y); ctx.lineTo(m.x + 7, m.y); }
      else { ctx.moveTo(m.x, m.y - 7); ctx.lineTo(m.x, m.y + 7); }
      ctx.stroke();
    }
  }

  if (cur.h0 > .25) {
    const lp = w2s(F, 0, cur.h0), g0 = w2s(F, 0, 0);
    ctx.setLineDash([3, 5]); ctx.strokeStyle = c4(S, OFF.ID); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(g0.x, g0.y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = c4(S, OFF.IL); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(lp.x - 14, lp.y); ctx.lineTo(lp.x + 14, lp.y); ctx.stroke();
    ctx.font = "500 10px monospace"; ctx.fillStyle = c4(S, OFF.IL); ctx.textAlign = "right";
    ctx.fillText(`h0 ${cur.h0} m`, lp.x - 20, lp.y + 3);
  }

  if (cur.mode !== "vertical") {
    ctx.beginPath();
    const n = 140;
    for (let i = 0; i <= n; i++) {
      const pp = posAt(cur, (cur.t * i) / n), s = w2s(F, pp.x, pp.y);
      if (i) ctx.lineTo(s.x, s.y); else ctx.moveTo(s.x, s.y);
    }
    const fin = w2s(F, cur.range, 0), ini = w2s(F, 0, 0);
    ctx.lineTo(fin.x, fin.y); ctx.lineTo(ini.x, ini.y); ctx.closePath();
    ctx.fillStyle = col + "12"; ctx.fill();
  }

  ctx.beginPath();
  {
    const n = 140;
    for (let i = 0; i <= n; i++) {
      const pp = posAt(cur, (cur.t * i) / n), s = w2s(F, pp.x, pp.y);
      if (i) ctx.lineTo(s.x, s.y); else ctx.moveTo(s.x, s.y);
    }
  }
  ctx.strokeStyle = col + "e6"; ctx.lineWidth = 2.5; ctx.setLineDash([9, 7]); ctx.lineCap = "round";
  ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0; ctx.setLineDash([]);

  if (cur.apex > .3) {
    const ta = cur.vy0 > 0 ? Math.min(cur.vy0 / cur.g, cur.t) : 0;
    const ap = w2s(F, cur.vx0 * ta, cur.apex), ay0 = w2s(F, 0, cur.apex);
    if (cur.mode !== "vertical") {
      ctx.setLineDash([4, 6]); ctx.strokeStyle = c4(S, OFF.ID); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ay0.x, ay0.y); ctx.lineTo(ap.x, ap.y); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(ap.x, ap.y, 3.5, 0, 6.283); ctx.fill();
    ctx.font = "600 10px monospace"; ctx.fillStyle = c4(S, OFF.IS);
    ctx.textAlign = cur.mode === "vertical" ? "left" : "center";
    ctx.fillText(`h max ${cur.apex.toFixed(1)} m`, ap.x + (cur.mode === "vertical" ? 12 : 0), ap.y - 10);
  }

  if (cur.mode !== "vertical") {
    const useFlight = S.phase === "done" && S.flight;
    const rp = useFlight && S.flight ? S.flight.p : cur;
    const rm = w2s(F, rp.range, 0);
    const mc = useFlight ? col : "rgba(255,255,255,.55)";
    ctx.strokeStyle = mc; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rm.x, rm.y); ctx.lineTo(rm.x, rm.y - 14); ctx.stroke();
    ctx.fillStyle = mc;
    ctx.beginPath(); ctx.moveTo(rm.x, rm.y - 14); ctx.lineTo(rm.x + 9, rm.y - 10.5); ctx.lineTo(rm.x, rm.y - 7); ctx.closePath(); ctx.fill();
    ctx.font = "700 11px monospace"; ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 3;
    ctx.fillText(`${rp.range.toFixed(1)} m`, rm.x, rm.y + 18);
    ctx.shadowBlur = 0;
  }

  if (S.impact) {
    const k = S.impact.t / .7, c = w2s(F, S.impact.x, 0);
    ctx.strokeStyle = col; ctx.globalAlpha = (1 - k) * .8; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(c.x, c.y, 8 + k * 54, 0, 6.283); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  if (S.flight) {
    const p = S.flight.p, tEnd = S.phase === "done" ? p.t : S.tSim;
    ctx.beginPath();
    const n = 160;
    for (let i = 0; i <= n; i++) {
      const tt = (tEnd * i) / n, pp = posAt(p, tt), s = w2s(F, pp.x, pp.y);
      if (i) ctx.lineTo(s.x, s.y); else ctx.moveTo(s.x, s.y);
    }
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
  }

  if (P.trail && S.trailPts.length) {
    ctx.fillStyle = col;
    for (const q of S.trailPts) {
      const a = Math.max(0, 1 - (S.tSim - q.t) / 1.3);
      if (a <= 0) continue;
      const s = w2s(F, q.x, q.y);
      ctx.globalAlpha = a * .85;
      ctx.beginPath(); ctx.arc(s.x, s.y, 1 + 4.2 * a, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = col;
  for (const q of S.particles) {
    const s = w2s(F, q.x, q.y);
    ctx.globalAlpha = clamp(q.life / .5, 0, 1) * .9;
    ctx.shadowColor = col; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(s.x, s.y, q.r, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;

  drawLauncher(F, cur, col, P.mode, P.ang);
  drawProjectile(F, cur, col, time, P);
  drawAim(F, cur, P);

  ctx.font = "600 10px monospace"; ctx.fillStyle = c4(S, OFF.IL);
  ctx.textAlign = "left"; ctx.fillText("y (m)", S.cam.ox + 9, 20);
  if (!vert) { ctx.textAlign = "right"; ctx.fillText("x (m)", ANCHO - 18, gy - 10); }

  let tt: number, xx: number, yy: number, vx: number, vy: number;
  if (S.flight) {
    const p = S.flight.p; tt = S.tSim;
    const pp = posAt(p, tt);
    xx = pp.x; yy = Math.max(pp.y, 0); vx = p.vx0; vy = p.vy0 - p.g * tt;
  } else { tt = 0; xx = 0; yy = cur.h0; vx = cur.vx0; vy = cur.vy0; }
  F.tele({ t: tt, x: xx, y: yy, vx, vy, v: Math.hypot(vx, vy) });
}

function onImpactFx(S: SimState, soundOn: boolean) {
  const f = S.flight;
  if (!f) return;
  S.impact = { x: f.p.range, t: 0 };
  S.cam.shakeT = .4;
  for (let i = 0; i < 18; i++) {
    S.particles.push({
      x: f.p.range, y: 0,
      vx: (Math.random() - .3) * 7, vy: 2 + Math.random() * 8.5, g: f.p.g,
      life: .6 + Math.random() * .55, r: 1.4 + Math.random() * 1.9,
    });
  }
  Sound.impact(soundOn);
}

/* ================= Componente ================= */

type ShotLog = {
  id: number; color: string; mode: Mode;
  v0: number; ang: number; h0: number; g: number;
  res: string; sub: string;
};

type Toast = { id: number; msg: string };

function makeSim(): SimState {
  return {
    phase: "idle", tSim: 0, paused: false,
    flight: null, shots: [], shotId: 0,
    particles: [], trailPts: [], impact: null, flash: 0,
    cam: { scale: 5, target: 5, ox: 64, oxT: 64, shakeT: 0, sx: 0, sy: 0 },
    env: "tierra", envNow: envVec(ENV.tierra), envGoal: envVec(ENV.tierra),
    aim: null, W: 800, H: 500, OX: 64, OY: 440, stars: [], stars2: [],
  };
}

export default function TirosSimulator() {
  const [mode, setModeState] = useState<Mode>("parabolico");
  const [v0, setV0] = useState(20);
  const [ang, setAng] = useState(45);
  const [h0, setH0] = useState(0);
  const [g, setGState] = useState(9.81);
  const [timeScale, setTimeScale] = useState(1);
  const [vectors, setVectors] = useState(true);
  const [trail, setTrail] = useState(true);
  const [ghosts, setGhosts] = useState(true);
  const [sound, setSound] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [paused, setPaused] = useState(false);
  const [used, setUsed] = useState(false);
  const [shotsLog, setShotsLog] = useState<ShotLog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const { save } = useProgress();
  const saveRef = useRef(save);
  const completedRef = useRef(false);
  const lastParaAngRef = useRef(45);
  const toastIdRef = useRef(0);
  const simRef = useRef<SimState | null>(null);
  if (simRef.current === null) simRef.current = makeSim();
  const pRef = useRef<LiveParams>({
    mode: "parabolico", v0: 20, ang: 45, h0: 0, g: 9.81,
    timeScale: 1, vectors: true, trail: true, ghosts: true, sound: true,
  });

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const teleRefs = useRef<Record<"t" | "x" | "y" | "vx" | "vy" | "v", HTMLSpanElement | null>>({
    t: null, x: null, y: null, vx: null, vy: null, v: null,
  });

  const pushToast = useCallback((msg: string) => {
    const id = ++toastIdRef.current;
    setToasts((ts) => [...ts.slice(-2), { id, msg }]);
    window.setTimeout(() => {
      setToasts((ts) => ts.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  /* Espejo de params para el bucle + recalibra cámara (corre cada render) */
  useEffect(() => {
    pRef.current = { mode, v0, ang, h0, g, timeScale, vectors, trail: trail, ghosts, sound };
    saveRef.current = save;
    const S = simRef.current;
    if (S && S.W > 10) computeCamTarget(S, pRef.current);
  });

  const setEnv = useCallback((name: string, silent?: boolean) => {
    const S = simRef.current;
    if (!S || !ENV[name] || name === S.env) return;
    S.env = name;
    S.envGoal = envVec(ENV[name]);
    if (!silent) pushToast(`Entorno: ${ENV[name].label} · g = ${ENV[name].g.toFixed(2)} m/s²`);
  }, [pushToast]);

  const setG = useCallback((gv: number) => {
    setGState(gv);
    for (const k of Object.keys(G2ENV)) {
      if (Math.abs(gv - +k) < .005) {
        const S = simRef.current;
        if (S && G2ENV[+k] !== S.env) setEnv(G2ENV[+k]);
        return;
      }
    }
  }, [setEnv]);

  const setMode = useCallback((m: Mode) => {
    if (m === pRef.current.mode || !MODES[m]) return;
    if (pRef.current.mode === "parabolico") lastParaAngRef.current = pRef.current.ang;
    setModeState(m);
    const fixed = MODES[m].fixedAngle;
    if (m === "parabolico") {
      setAng(lastParaAngRef.current);
    } else if (fixed !== null) {
      setAng(fixed);
    }
    if (m === "horizontal" && pRef.current.h0 < 5) {
      setH0(20);
      pushToast("El tiro horizontal necesita altura: ajustada a 20 m");
    }
  }, [pushToast]);

  const doFire = useCallback(() => {
    const S = simRef.current;
    if (!S) return;
    const P = pRef.current;
    const p = computeParams(P.v0, P.ang, P.h0, P.g, P.mode);
    S.shotId++;
    const flight: Flight = {
      p, id: S.shotId, color: MODES[P.mode].color,
      mode: P.mode, v0: P.v0, ang: P.ang, h0: P.h0, g: P.g,
    };
    S.flight = flight;
    S.shots.push(flight);
    if (S.shots.length > 8) S.shots.shift();
    setShotsLog(S.shots.map((sh) => ({
      id: sh.id, color: sh.color, mode: sh.mode,
      v0: sh.v0, ang: sh.ang, h0: sh.h0, g: sh.g,
      res: sh.mode === "vertical" ? `${sh.p.apex.toFixed(1)} m` : `${sh.p.range.toFixed(1)} m`,
      sub: `${sh.mode === "parabolico" ? `${sh.v0} m/s · ${sh.ang}°` : `${sh.v0} m/s`} · h₀ ${sh.h0} m · g ${sh.g.toFixed(2)}`,
    })));
    S.phase = "flying"; S.tSim = 0; S.paused = false;
    S.trailPts = []; S.particles = []; S.impact = null; S.flash = .25;
    completedRef.current = false;
    computeCamTarget(S, P);
    setPhase("flying"); setPaused(false); setUsed(true);
    Sound.launch(P.sound);
  }, []);

  const togglePause = useCallback(() => {
    const S = simRef.current;
    if (!S || S.phase !== "flying") return;
    S.paused = !S.paused;
    setPaused(S.paused);
  }, []);

  const resetCurrent = useCallback(() => {
    const S = simRef.current;
    if (!S) return;
    S.phase = "idle"; S.tSim = 0; S.flight = null; S.paused = false;
    S.trailPts = []; S.particles = []; S.impact = null;
    completedRef.current = false;
    computeCamTarget(S, pRef.current);
    setPhase("idle"); setPaused(false);
  }, []);

  const loadShot = useCallback((sh: ShotLog) => {
    setMode(sh.mode as Mode);
    setV0(sh.v0);
    if (sh.mode === "parabolico") setAng(sh.ang);
    setH0(sh.h0);
    setG(sh.g);
    pushToast(`Tiro ${sh.id} cargado en los controles`);
  }, [setMode, setG, pushToast]);

  const clearLog = useCallback(() => {
    const S = simRef.current;
    if (S) {
      S.shots = [];
      computeCamTarget(S, pRef.current);
    }
    setShotsLog([]);
    pushToast("Historial de tiros borrado");
  }, [pushToast]);

  const doFireRef = useRef(doFire);
  useEffect(() => { doFireRef.current = doFire; });

  /* Bucle principal + resize + puntero + teclado (una vez) */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const S = simRef.current;
    if (!S) return;

    const tele = (v: TeleVals) => {
      const r = teleRefs.current;
      if (r.t) r.t.textContent = v.t.toFixed(2);
      if (r.x) r.x.textContent = v.x.toFixed(1);
      if (r.y) r.y.textContent = v.y.toFixed(1);
      if (r.vx) r.vx.textContent = v.vx.toFixed(1);
      if (r.vy) r.vy.textContent = v.vy.toFixed(1);
      if (r.v) r.v.textContent = v.v.toFixed(1);
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) return;
      S.W = r.width; S.H = r.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(S.W * dpr); canvas.height = Math.round(S.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S.OX = S.W < 640 ? 42 : 64;
      S.OY = S.H - (S.W < 640 ? 66 : 56);
      S.stars = Array.from({ length: 90 }, () => ({
        x: Math.random() * S.W, y: Math.random() * S.OY * .6,
        r: .4 + Math.random() * .9, ph: Math.random() * 6.28, sp: .4 + Math.random() * 1.4,
      }));
      S.stars2 = Array.from({ length: 46 }, () => ({
        x: Math.random() * S.W, y: Math.random() * S.OY * .7, r: .3 + Math.random() * .5, ph: 0, sp: 0,
      }));
      computeCamTarget(S, pRef.current);
      S.cam.scale = S.cam.target;
      S.cam.ox = S.cam.oxT;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let raf = 0;
    let lastTs: number | null = null;
    const loop = (ts: number) => {
      const dt = lastTs === null ? .016 : Math.min((ts - lastTs) / 1000, .05);
      lastTs = ts;
      const P = pRef.current;
      stepSim(S, P, dt, () => onImpactFx(S, P.sound));
      if (S.phase === "done" && !completedRef.current) {
        completedRef.current = true;
        setPhase("done"); setPaused(false);
        void saveRef.current("03_tiros", 1, 1);
      }
      draw({ ctx, S, W: S.W, H: S.H, OX: S.OX, OY: S.OY, tele }, ts / 1000, P);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* Apuntado por arrastre */
    let aiming = false, aimTravel = 0;
    let lastAim = { x: 0, y: 0 };
    const aimMove = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      const px = clientX - r.left, py = clientY - r.top;
      const P = pRef.current;
      if (S) S.aim = { px, py };
      const lp = { x: S.cam.ox + S.cam.sx, y: S.OY - P.h0 * S.cam.scale + S.cam.sy };
      const dx = px - lp.x, dy = lp.y - py;
      if (P.mode === "parabolico") {
        const a = (Math.atan2(dy, Math.max(dx, 1e-6)) * 180) / Math.PI;
        setAng(Math.round(clamp(a, 0, 90)));
        setV0(clamp(Math.round(Math.hypot(dx, dy) / 3.4), 5, 40));
      } else if (P.mode === "horizontal") {
        setV0(clamp(Math.round(Math.abs(dx) / 3.4), 5, 40));
      } else {
        setV0(clamp(Math.round(Math.max(dy, 0) / 3.4), 5, 40));
      }
    };
    const onDown = (e: PointerEvent) => {
      aiming = true; aimTravel = 0; lastAim = { x: e.clientX, y: e.clientY };
      try { canvas.setPointerCapture(e.pointerId); } catch { /* noop */ }
      aimMove(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      if (!aiming) return;
      aimTravel += Math.hypot(e.clientX - lastAim.x, e.clientY - lastAim.y);
      lastAim = { x: e.clientX, y: e.clientY };
      aimMove(e.clientX, e.clientY);
    };
    const onUp = () => {
      if (!aiming) return;
      aiming = false;
      if (S) S.aim = null;
      if (aimTravel > 14) doFireRef.current();
    };
    const onCancel = () => { aiming = false; if (S) S.aim = null; };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onCancel);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
    };
  }, []);

  /* Atajos de teclado */
  const actionsRef = useRef({ doFire, togglePause, resetCurrent, setMode });
  useEffect(() => { actionsRef.current = { doFire, togglePause, resetCurrent, setMode }; });
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const a = actionsRef.current;
      if (e.code === "Space") {
        e.preventDefault();
        if (e.repeat) return;
        const S = simRef.current;
        if (S && S.phase === "flying") a.togglePause();
        else a.doFire();
      }
      else if (e.code === "KeyR") a.resetCurrent();
      else if (e.key === "1") a.setMode("parabolico");
      else if (e.key === "2") a.setMode("horizontal");
      else if (e.key === "3") a.setMode("vertical");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* Resultados teóricos (React, solo cambian con params) */
  const theory = useMemo(() => computeParams(v0, ang, h0, g, mode), [v0, ang, h0, g, mode]);
  const accent = MODES[mode].color;

  const sliderFill = (v: number, min: number, max: number) => {
    const p = ((v - min) / (max - min)) * 100;
    return `linear-gradient(90deg, var(--accent) ${p}%, #e8e5de ${p}%)`;
  };

  const toggleOpt = (set: (v: boolean) => void, v: boolean) => {
    set(!v);
  };

  return (
    <div className="space-y-5">
      <SimHeader
        title="Los 3 Tiros · parabólico, horizontal y vertical"
        description="Apunta arrastrando en el lienzo, dispara y compara tiros. Cambia de planeta para sentir otra gravedad: la misma velocidad inicial llega muy distinto en la Luna y en Júpiter."
        badge="Física · Cinemática 2D"
        color="emerald"
      />

      <div
        className={`${spaceGrotesk.className} ${styles.app} ${used ? styles.used : ""}`}
        style={{ "--accent": accent, "--mono-lab": jetbrainsMono.style.fontFamily } as CSSProperties}
      >
        {/* ============ PANEL ============ */}
        <aside className={styles.sidebar}>
          <section>
            <h2 className={styles.secTitle}>Modo de lanzamiento</h2>
            <div className={styles.modes}>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === "parabolico" ? styles.active : ""}`}
                onClick={() => setMode("parabolico")}
                aria-pressed={mode === "parabolico"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M3.5 18.5C6 7 18 7 20.5 18.5" /><path d="M2.5 20.5h19" opacity=".4" />
                </svg>
                <span>Parabólico</span>
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === "horizontal" ? styles.active : ""}`}
                onClick={() => setMode("horizontal")}
                aria-pressed={mode === "horizontal"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M3.5 5.5h10.5c4.5 0 6 6.5 6 13" /><path d="M2.5 20.5h19" opacity=".4" />
                </svg>
                <span>Horizontal</span>
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === "vertical" ? styles.active : ""}`}
                onClick={() => setMode("vertical")}
                aria-pressed={mode === "vertical"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.5V7" /><path d="M8.5 10.5 12 7l3.5 3.5" /><path d="M8 20.5h8" opacity=".4" />
                </svg>
                <span>Vertical</span>
              </button>
            </div>
          </section>

          <section>
            <h2 className={styles.secTitle}>Parámetros</h2>
            <div className={`${styles.control} `}>
              <div className={styles.head}>
                <label htmlFor="tiros-vel">Velocidad inicial</label>
                <output><b>{v0}</b><i>m/s</i></output>
              </div>
              <input
                type="range" id="tiros-vel" className={styles.slider}
                min={5} max={40} step={1} value={v0}
                style={{ background: sliderFill(v0, 5, 40) }}
                onChange={(e) => setV0(+e.target.value)}
                aria-label="Velocidad inicial en metros por segundo"
              />
            </div>
            <div className={`${styles.control} ${mode !== "parabolico" ? styles.locked : ""}`}>
              <div className={styles.head}>
                <label htmlFor="tiros-ang">Ángulo</label>
                <output><b>{ang}</b><i>°</i></output>
              </div>
              <input
                type="range" id="tiros-ang" className={styles.slider}
                min={0} max={90} step={1} value={ang}
                disabled={mode !== "parabolico"}
                style={{ background: sliderFill(ang, 0, 90) }}
                onChange={(e) => setAng(+e.target.value)}
                aria-label="Ángulo de lanzamiento en grados"
              />
            </div>
            <div className={styles.control}>
              <div className={styles.head}>
                <label htmlFor="tiros-alt">Altura inicial</label>
                <output><b>{h0}</b><i>m</i></output>
              </div>
              <input
                type="range" id="tiros-alt" className={styles.slider}
                min={mode === "horizontal" ? 5 : 0} max={50} step={1} value={h0}
                style={{ background: sliderFill(h0, mode === "horizontal" ? 5 : 0, 50) }}
                onChange={(e) => setH0(+e.target.value)}
                aria-label="Altura inicial en metros"
              />
            </div>
            <div className={styles.control}>
              <div className={styles.head}>
                <label htmlFor="tiros-grav">Gravedad</label>
                <output><b>{g.toFixed(2)}</b><i>m/s²</i></output>
              </div>
              <input
                type="range" id="tiros-grav" className={styles.slider}
                min={1} max={26} step={0.01} value={g}
                style={{ background: sliderFill(g, 1, 26) }}
                onChange={(e) => setG(+e.target.value)}
                aria-label="Gravedad en metros por segundo al cuadrado"
              />
            </div>
          </section>

          <section>
            <h2 className={styles.secTitle}>Entorno</h2>
            <div className={styles.chips}>
              {GRAV_CHIPS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  className={Math.abs(c.g - g) < .005 ? styles.active : ""}
                  style={{ "--c": c.c } as CSSProperties}
                  onClick={() => setG(c.g)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className={styles.secTitle}>Resultados teóricos</h2>
            <div className={styles.res}>
              <div className={styles.row} title="t = (v₀y + √(v₀y² + 2·g·h₀)) / g">
                <span>Tiempo de vuelo</span><output><b>{theory.t.toFixed(2)}</b><i>s</i></output>
              </div>
              <div className={styles.row} title="R = v₀x · t">
                <span>Alcance horizontal</span><output><b>{mode === "vertical" ? "—" : theory.range.toFixed(1)}</b><i>m</i></output>
              </div>
              <div className={styles.row} title="h máx = h₀ + v₀y² / (2g)">
                <span>Altura máxima</span><output><b>{theory.apex.toFixed(1)}</b><i>m</i></output>
              </div>
              <div className={styles.row} title="v = √(v₀x² + v₀y(t)²)">
                <span>Velocidad de impacto</span><output><b>{Math.hypot(theory.vx0, theory.vy0 - theory.g * theory.t).toFixed(1)}</b><i>m/s</i></output>
              </div>
            </div>
          </section>

          <section className={styles.grow}>
            <h2 className={styles.secTitle}>
              Comparativa de tiros
              <button type="button" className={styles.mini} onClick={clearLog} title="Borrar historial" aria-label="Borrar historial de tiros">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 7h15M9.5 7V4.5h5V7M7 7l.8 13h8.4L17 7" /><path d="M10.5 10.5v6M13.5 10.5v6" />
                </svg>
              </button>
            </h2>
            {shotsLog.length === 0 ? (
              <p className={styles.empty}>Dispara para registrar tiros y compararlos aquí. Haz clic en uno para volver a cargar sus parámetros.</p>
            ) : (
              <ul className={styles.shots}>
                {shotsLog.map((sh) => (
                  <li key={sh.id}>
                    <button type="button" className={styles.shot} onClick={() => loadShot(sh)} title={`Cargar tiro ${sh.id}`}>
                      <span className={styles.dot} style={{ background: sh.color }} />
                      <div className={styles.sMain}><b>Tiro {sh.id}</b><span>{sh.sub}</span></div>
                      <span className={styles.sRes}>{sh.res}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>

        {/* ============ ESCENARIO ============ */}
        <main className={`${styles.stage} ${mode === "vertical" ? styles.vertical : ""}`}>
          <div className={styles.canvasWrap} ref={wrapRef}>
            <canvas ref={canvasRef} role="img" aria-label="Simulación del lanzamiento" />
          </div>

          <div className={styles.tele} aria-hidden="true">
            <div className={styles.cell}><span className={styles.tl}>t</span><span className={styles.tv}><b ref={(el) => { teleRefs.current.t = el; }}>0.00</b><i>s</i></span></div>
            <div className={styles.cell}><span className={styles.tl}>x</span><span className={styles.tv}><b ref={(el) => { teleRefs.current.x = el; }}>0.0</b><i>m</i></span></div>
            <div className={styles.cell}><span className={styles.tl}>y</span><span className={styles.tv}><b ref={(el) => { teleRefs.current.y = el; }}>0.0</b><i>m</i></span></div>
            <div className={styles.cell}><span className={styles.tl}>vx</span><span className={styles.tv}><b ref={(el) => { teleRefs.current.vx = el; }}>0.0</b><i>m/s</i></span></div>
            <div className={styles.cell}><span className={styles.tl}>vy</span><span className={styles.tv}><b ref={(el) => { teleRefs.current.vy = el; }}>0.0</b><i>m/s</i></span></div>
            <div className={styles.cell}><span className={styles.tl}>|v|</span><span className={styles.tv}><b ref={(el) => { teleRefs.current.v = el; }}>0.0</b><i>m/s</i></span></div>
          </div>

          <div className={styles.viewTools}>
            <button
              type="button"
              className={`${styles.tool} ${vectors ? styles.active : ""}`}
              title="Vectores de velocidad y gravedad" aria-pressed={vectors} aria-label="Vectores de velocidad y gravedad"
              onClick={() => toggleOpt(setVectors, vectors)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 19V8M5 19h11M5 19 19 5" /><path d="M15.5 5H19v3.5" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.tool} ${trail ? styles.active : ""}`}
              title="Estela del proyectil" aria-pressed={trail} aria-label="Estela del proyectil"
              onClick={() => toggleOpt(setTrail, trail)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 19c3.5-9.5 12.5-9.5 16 0" strokeDasharray=".5 4.5" />
                <circle cx="4" cy="19" r="1.7" fill="currentColor" stroke="none" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.tool} ${ghosts ? styles.active : ""}`}
              title="Comparar con tiros anteriores" aria-pressed={ghosts} aria-label="Comparar con tiros anteriores"
              onClick={() => toggleOpt(setGhosts, ghosts)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3.5 20 8l-8 4.5L4 8z" /><path d="M4 12.5l8 4.5 8-4.5" /><path d="M4 16.5 12 21l8-4.5" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.tool} ${sound ? styles.active : ""}`}
              title="Sonido" aria-pressed={sound} aria-label="Sonido"
              onClick={() => toggleOpt(setSound, sound)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5z" /><path d="M16 9a4.5 4.5 0 0 1 0 6" /><path d="M18.5 6.5a8 8 0 0 1 0 11" />
              </svg>
            </button>
          </div>

          <div className={styles.transport}>
            <button
              type="button"
              className={`${styles.iconBtn} ${paused ? styles.paused : ""}`}
              title="Pausar / reanudar (espacio)" aria-label={paused ? "Reanudar" : "Pausar"}
              disabled={phase !== "flying"}
              onClick={togglePause}
            >
              <svg className={styles.icoPause} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 5.5v13M15 5.5v13" /></svg>
              <svg className={styles.icoPlay} viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" fill="currentColor" /></svg>
            </button>
            <button type="button" className={styles.fireBtn} onClick={doFire}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="6.5" /><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" />
              </svg>
              <span>Disparar</span>
              {!used && <span className={styles.pulse} />}
            </button>
            <div className={styles.speed}>
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={timeScale === s ? styles.active : ""}
                  onClick={() => setTimeScale(s)}
                  aria-pressed={timeScale === s}
                >
                  {s}×
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.iconBtn}
              title="Reiniciar tiro (R)" aria-label="Reiniciar tiro"
              onClick={resetCurrent}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 4v5h5" /><path d="M3.8 13a8.2 8.2 0 1 0 2-7.3L3.5 9" />
              </svg>
            </button>
          </div>

          <p className={styles.hint}>
            Arrastra en el lienzo para apuntar
            <span className={styles.keys}> · <kbd>espacio</kbd> dispara · <kbd>1–3</kbd> modo · <kbd>R</kbd> reinicia</span>
          </p>

          <div className={styles.toasts} aria-live="polite">
            {toasts.map((t) => (
              <div key={t.id} className={`${styles.toast} ${styles.on}`}>{t.msg}</div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
