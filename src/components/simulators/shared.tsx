"use client";

import { cn } from "@/lib/utils";

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
    fuchsia: { text: "text-fuchsia-600" },
    emerald: { text: "text-emerald-600" },
    amber: { text: "text-amber-600" },
    rose: { text: "text-rose-600" },
  };
  const c = colorMap[color];
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

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
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={`${label}${unit ? ` (${unit})` : ""}`}
          className={cn(
            "relative w-full h-2 cursor-pointer appearance-none rounded-full bg-secondary disabled:cursor-not-allowed",
            c.text,
            disabled && "opacity-60"
          )}
          style={{
            background: `linear-gradient(to right, currentColor ${pct}%, var(--secondary) ${pct}%)`,
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
          <h2 className="text-xl font-bold text-foreground leading-tight">{title}</h2>
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
