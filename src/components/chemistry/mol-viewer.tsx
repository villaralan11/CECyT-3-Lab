"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  sdf: string;
  formula: string;
  name: string;
  height?: number;
  geometry?: string;
};

// SDFs mínimos (V2000) con geometría aproximada real para el visor VSEPR
export const SDFS: Record<string, string> = {
  CH4: `
methane
  -CECyT3Lab-

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
  -CECyT3Lab-

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
  C3H8: `
propane
  -CECyT3Lab-

 11 10  0  0  0  0  0  0  0  0999 V2000
   -1.2660    0.0000    0.7700 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0  0
    1.2660    0.0000    0.7700 C   0  0  0  0  0  0  0  0  0  0  0  0  0
   -1.7200    0.7600    1.1500 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7200   -0.7600    1.1500 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.6300    0.0000   -0.2500 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    1.0200    0.3700 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -1.0200    0.3700 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.7200    0.7600    1.1500 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.7200   -0.7600    1.1500 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.6300    0.0000   -0.2500 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  2  7  1  0  0  0  0
  2  8  1  0  0  0  0
  3  9  1  0  0  0  0
  3 10  1  0  0  0  0
  3 11  1  0  0  0  0
M  END
`,
  C2H4: `
ethene
  -CECyT3Lab-

  6  5  0  0  0  0  0  0  0  0999 V2000
   -0.6700    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6700    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0  0
   -1.2500    0.9400    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.2500   -0.9400    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.2500    0.9400    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.2500   -0.9400    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  2  5  1  0  0  0  0
  2  6  1  0  0  0  0
M  END
`,
  CH3OH: `
methanol
  -CECyT3Lab-

  6  5  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4300    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6300    0.6300   -0.6300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6300   -0.6300    0.6300 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6300    0.6300    0.6300 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.7300    0.5900    0.5900 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  2  6  1  0  0  0  0
M  END
`,
  C2H5OH: `
ethanol
  -CECyT3Lab-

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
  ACETONE: `
acetone
  -CECyT3Lab-

 10  9  0  0  0  0  0  0  0  0999 V2000
   -1.5100   -0.3700    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.4000    1.1500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.5100   -0.3700    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8500   -0.4500    1.0300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8500   -0.4500   -1.0300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -2.0900    0.5200    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.8500   -0.4500    1.0300 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.8500   -0.4500   -1.0300 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.0900    0.5200    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  2  0  0  0  0
  2  4  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  1  7  1  0  0  0  0
  4  8  1  0  0  0  0
  4  9  1  0  0  0  0
  4 10  1  0  0  0  0
M  END
`,
  ACETIC: `
acetic-acid
  -CECyT3Lab-

  8  7  0  0  0  0  0  0  0  0999 V2000
   -1.5100   -0.3000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.4000    1.1500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.0200   -0.9000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8700   -0.3700    1.0300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8700   -0.3700   -1.0300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -2.0700    0.6400    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.6000   -0.6800    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  2  0  0  0  0
  2  4  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  1  7  1  0  0  0  0
  4  8  1  0  0  0  0
M  END
`,
};

export function MolViewer({ sdf, formula, name, height = 220, geometry }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let viewer: any = null;
    let cancelled = false;
    let spinTimer: ReturnType<typeof setTimeout> | null = null;
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
        spinTimer = setTimeout(() => { try { viewer.spin(false); } catch {} }, 8000);
      } catch (e: any) {
        setErr(e?.message ?? "No se pudo cargar 3D");
      }
    })();
    return () => {
      cancelled = true;
      if (spinTimer) clearTimeout(spinTimer);
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
        {geometry ?? "Usa el visor para observar la geometría real de la molécula."}
      </div>
    </div>
  );
}
