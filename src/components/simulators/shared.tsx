"use client";

import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw, StepForward, StepBack } from "lucide-react";
import { Button } from "@/components/ui/button";

// =================== SLIDER ===================

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  color = "fuchsia",
  disabled,
  description,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  color?: "fuchsia" | "emerald" | "amber" | "rose";
  disabled?: boolean;
  description?: string;
}) {
  const colorMap = {
    fuchsia: { fill: "#d946ef", text: "text-fuchsia-600" },
    emerald: { fill: "#10b981", text: "text-emerald-600" },
    amber: { fill: "#f59e0b", text: "text-amber-600" },
    rose: { fill: "#f43f5e", text: "text-rose-600" },
  };
  const c = colorMap[color];
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("rounded-xl border border-border bg-white p-3", disabled && "opacity-60")}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex flex-col">
          <span className="text-muted-foreground">{label}</span>
          {description && <span className="text-[10px] text-muted-foreground/70 font-normal">{description}</span>}
        </div>
        <span className={cn("font-mono font-bold text-base", c.text)}>
          {value.toFixed(step < 1 ? 2 : 0)}
          <span className="text-xs ml-1 text-muted-foreground font-normal">{unit}</span>
        </span>
      </div>
      <div className="relative mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          aria-valuetext={`${value.toFixed(step < 1 ? 2 : 0)}${unit}`}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            "cecyt-slider relative w-full h-2 cursor-pointer appearance-none rounded-full",
            disabled && "cursor-not-allowed"
          )}
          style={{
            background: `linear-gradient(to right, ${c.fill} ${pct}%, var(--secondary) ${pct}%)`,
            ["--slider-thumb" as string]: c.fill,
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// =================== PLAY CONTROLS ===================

export function PlayControls({
  running,
  onToggle,
  onReset,
  onStepBack,
  onStepForward,
}: {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  onStepBack?: () => void;
  onStepForward?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        size="sm"
        onClick={onToggle}
        className="rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-md border-0"
      >
        {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        {running ? "Pausar" : "Iniciar"}
      </Button>
      {onStepBack && (
        <Button size="sm" variant="outline" onClick={onStepBack} className="rounded-full border-border" title="Retroceder 0.1 s" aria-label="Retroceder 0.1 s">
          <StepBack className="h-3.5 w-3.5" />
        </Button>
      )}
      {onStepForward && (
        <Button size="sm" variant="outline" onClick={onStepForward} className="rounded-full border-border" title="Avanzar 0.1 s" aria-label="Avanzar 0.1 s">
          <StepForward className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={onReset}
        className="rounded-full border-border"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reiniciar
      </Button>
    </div>
  );
}

// =================== GRAPH ===================

export type Series = {
  points: { x: number; y: number }[];
  color: string;
  label?: string;
  dashed?: boolean;
  filled?: boolean; // fill area under curve
};

export function Graph({
  series,
  xLabel,
  yLabel,
  height = 200,
  xDomain,
  yDomain,
  markers,
  shadedAreas,
  caption,
}: {
  series: Series[];
  xLabel: string;
  yLabel: string;
  height?: number;
  xDomain: [number, number];
  yDomain: [number, number];
  markers?: { x: number; color: string; label?: string; dashed?: boolean }[];
  shadedAreas?: { x0: number; x1: number; color: string; label?: string }[];
  caption?: string;
}) {
  const W = 380;
  const H = height;
  const padL = 38;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const sx = (x: number) =>
    padL + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotW;
  const sy = (y: number) =>
    padT + (1 - (y - yDomain[0]) / (yDomain[1] - yDomain[0])) * plotH;

  const xTicks = 5;
  const yTicks = 4;
  const xGrid = Array.from({ length: xTicks + 1 }, (_, i) => xDomain[0] + (i * (xDomain[1] - xDomain[0])) / xTicks);
  const yGrid = Array.from({ length: yTicks + 1 }, (_, i) => yDomain[0] + (i * (yDomain[1] - yDomain[0])) / yTicks);

  // Helper to compute y at given x for a series (linear interpolation)
  const yAt = (s: Series, xVal: number) => {
    if (s.points.length === 0) return 0;
    if (xVal <= s.points[0].x) return s.points[0].y;
    if (xVal >= s.points[s.points.length - 1].x) return s.points[s.points.length - 1].y;
    for (let i = 0; i < s.points.length - 1; i++) {
      if (s.points[i].x <= xVal && s.points[i + 1].x >= xVal) {
        const t = (xVal - s.points[i].x) / (s.points[i + 1].x - s.points[i].x);
        return s.points[i].y + t * (s.points[i + 1].y - s.points[i].y);
      }
    }
    return 0;
  };

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <svg role="img" aria-label="Gráfica cinemática" viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Shaded areas (under curves) */}
        {shadedAreas?.map((a, i) => {
          const seriesForArea = series.find((s) => s.color === a.color);
          if (!seriesForArea) return null;
          const pts: string[] = [`${sx(a.x0)},${sy(0)}`];
          const N = 30;
          for (let k = 0; k <= N; k++) {
            const xv = a.x0 + (k / N) * (a.x1 - a.x0);
            pts.push(`${sx(xv)},${sy(yAt(seriesForArea, xv))}`);
          }
          pts.push(`${sx(a.x1)},${sy(0)}`);
          return (
            <g key={`shade${i}`}>
              <polygon points={pts.join(" ")} fill={a.color} opacity="0.18" />
              {a.label && (
                <text
                  x={sx((a.x0 + a.x1) / 2)}
                  y={sy(yAt(seriesForArea, (a.x0 + a.x1) / 2) / 2)}
                  textAnchor="middle"
                  fontSize="8"
                  fill={a.color}
                  fontWeight="bold"
                >
                  {a.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Grid */}
        {xGrid.map((x, i) => (
          <line key={`xg${i}`} x1={sx(x)} y1={padT} x2={sx(x)} y2={padT + plotH} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        {yGrid.map((y, i) => (
          <line key={`yg${i}`} x1={padL} y1={sy(y)} x2={padL + plotW} y2={sy(y)} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        {/* Zero line if yDomain includes 0 */}
        {yDomain[0] < 0 && yDomain[1] > 0 && (
          <line x1={padL} y1={sy(0)} x2={padL + plotW} y2={sy(0)} stroke="#9ca3af" strokeWidth="0.8" />
        )}

        {/* Axes */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#6b7280" strokeWidth="1" />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#6b7280" strokeWidth="1" />
        {/* Tick labels */}
        {xGrid.map((x, i) => (
          <text key={`xt${i}`} x={sx(x)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#6b7280">
            {x.toFixed(x % 1 === 0 ? 0 : 1)}
          </text>
        ))}
        {yGrid.map((y, i) => (
          <text key={`yt${i}`} x={padL - 5} y={sy(y) + 3} textAnchor="end" fontSize="9" fill="#6b7280">
            {y.toFixed(y % 1 === 0 ? 0 : 1)}
          </text>
        ))}

        {/* Series */}
        {series.map((s, i) => {
          if (s.points.length < 2) return null;
          const d = s.points
            .map((p, k) => `${k === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
            .join(" ");
          return (
            <path
              key={`s${i}`}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth="2.2"
              strokeDasharray={s.dashed ? "5 3" : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Markers (current time) */}
        {markers?.map((m, i) => (
          <g key={`m${i}`}>
            <line
              x1={sx(m.x)}
              y1={padT}
              x2={sx(m.x)}
              y2={padT + plotH}
              stroke={m.color}
              strokeWidth="1.2"
              strokeDasharray={m.dashed === false ? undefined : "3 3"}
              opacity="0.75"
            />
            <circle cx={sx(m.x)} cy={padT + plotH} r="3" fill={m.color} />
            {m.label && (
              <text x={sx(m.x) + 4} y={padT + 10} fontSize="9" fill={m.color} fontWeight="bold">
                {m.label}
              </text>
            )}
          </g>
        ))}

        {/* Axis labels */}
        <text x={padL + plotW / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">
          {xLabel}
        </text>
        <text
          x={11}
          y={padT + plotH / 2}
          textAnchor="middle"
          fontSize="10"
          fill="#374151"
          fontWeight="600"
          transform={`rotate(-90 11 ${padT + plotH / 2})`}
        >
          {yLabel}
        </text>
      </svg>

      {/* Legend */}
      {series.some((s) => s.label) && (
        <div className="flex flex-wrap gap-3 justify-center mt-1">
          {series
            .filter((s) => s.label)
            .map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div
                  className="h-2.5 w-4 rounded-sm"
                  style={{
                    background: s.color,
                    opacity: s.dashed ? 0.6 : 1,
                  }}
                />
                {s.label}
              </div>
            ))}
        </div>
      )}
      {caption && (
        <div className="mt-1 text-center text-[10px] text-muted-foreground italic">{caption}</div>
      )}
    </div>
  );
}

// =================== READOUT (large, prominent) ===================

export function Readout({
  label,
  value,
  unit,
  color = "foreground",
  formula,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: "foreground" | "fuchsia" | "emerald" | "amber" | "rose" | "teal";
  formula?: string;
}) {
  const cmap = {
    foreground: "text-foreground",
    fuchsia: "text-fuchsia-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    teal: "text-teal-600",
  };
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2.5 text-center">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1 font-mono font-bold text-xl", cmap[color])}>
        {typeof value === "number" ? value.toFixed(2) : value}
        {unit && <span className="text-xs text-muted-foreground ml-1 font-normal">{unit}</span>}
      </div>
      {formula && (
        <div className="mt-0.5 text-[9px] text-muted-foreground/70 font-mono">{formula}</div>
      )}
    </div>
  );
}

// =================== SIM HEADER ===================

export function SimHeader({
  title,
  description,
  badge,
  color = "fuchsia",
}: {
  title: string;
  description: string;
  badge?: string;
  color?: "fuchsia" | "emerald" | "amber";
}) {
  const cmap = {
    fuchsia: "from-fuchsia-500 to-pink-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
  };
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border">
      <div className={cn("h-9 w-1.5 rounded-full bg-gradient-to-b flex-shrink-0 mt-1", cmap[color])} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-foreground leading-tight">{title}</h1>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-secondary text-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// =================== INSIGHT BOX ===================

export function Insight({
  children,
  color = "emerald",
  title = "Lee la gráfica",
  icon,
}: {
  children: React.ReactNode;
  color?: "emerald" | "fuchsia" | "amber" | "rose";
  title?: string;
  icon?: React.ReactNode;
}) {
  const cmap = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    fuchsia: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    rose: "bg-rose-50 border-rose-200 text-rose-900",
  };
  return (
    <div className={cn("rounded-xl border p-3.5 text-sm", cmap[color])}>
      <div className="flex items-center gap-1.5 font-bold mb-1">
        {icon}
        {title}
      </div>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
