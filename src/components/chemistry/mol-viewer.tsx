"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  sdf: string;
  formula: string;
  name: string;
  height?: number;
};

// SDFs mínimos para demo (VSEPR tetraédrico, etc.)
export const SDFS: Record<string, string> = {
  CH4: `
methane
  -OEChem-01302312302D

  5  4  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6290    0.6290    0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290   -0.6290    0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290    0.6290   -0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6290   -0.6290   -0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
M  END
`,
  C2H6: `
ethane
  -OEChem-01302312302D

  8  7  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    1.5400 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6290    0.6290   -0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290   -0.6290   -0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290    0.6290    0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6290    0.6290    2.1690 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290   -0.6290    2.1690 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290    0.6290    0.9110 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  2  6  1  0  0  0  0
  2  7  1  0  0  0  0
  2  8  1  0  0  0  0
M  END
`,
  C2H5OH: `
ethanol
  -OEChem-01302312302D

  9  8  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    1.5400 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4300    0.0000    2.1500 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.8000    1.7000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6290    0.6290   -0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290   -0.6290   -0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290    0.6290    0.6290 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6290    0.6290    1.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6290   -0.6290    1.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  1  7  1  0  0  0  0
  2  3  1  0  0  0  0
  2  8  1  0  0  0  0
  2  9  1  0  0  0  0
  3  4  1  0  0  0  0
M  END
`,
};

export function MolViewer({ sdf, formula, name, height = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let viewer: any = null;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("3dmol");
        // 3dmol exports as $3Dmol or default
        const $3Dmol: any = (mod as any).default ?? mod;
        if (!ref.current || cancelled) return;
        // @ts-ignore
        viewer = $3Dmol.createViewer(ref.current, { backgroundColor: "white" });
        viewer.addModel(sdf, "sdf");
        viewer.setStyle({}, { stick: {}, sphere: { scale: 0.3 } });
        viewer.zoomTo();
        viewer.render();
        viewer.spin(true);
        // stop spin after 8s to save battery
        setTimeout(() => { try { viewer.spin(false); } catch {} }, 8000);
      } catch (e: any) {
        setErr(e?.message ?? "No se pudo cargar 3D");
      }
    })();
    return () => {
      cancelled = true;
      try { viewer?.clear(); } catch {}
    };
  }, [sdf]);

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-border bg-secondary/40 flex items-center justify-between">
        <div className="text-xs font-bold text-foreground">{formula} · {name}</div>
        <div className="text-[10px] text-muted-foreground">3D VSEPR · arrastra para rotar</div>
      </div>
      <div ref={ref} style={{ width: "100%", height }} className="relative" role="img" aria-label={`Modelo 3D de ${formula} ${name}`} />
      {err && <div className="px-3 py-2 text-xs text-rose-600 border-t border-border bg-rose-50">{err}</div>}
      <div className="px-3 py-2 text-[11px] text-muted-foreground border-t border-border bg-secondary/20">
        Geometría tetraédrica (109.5°) para alcanos/alcoholes. Usa el visor para ver ángulos reais.
      </div>
    </div>
  );
}
