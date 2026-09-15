"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Zap, CheckCircle2, BookOpen, RotateCcw, ArrowRight, GraduationCap, Trophy } from "lucide-react";
import { PageHeader, Breadcrumb } from "@/components/site/ui";
import { useProgress } from "@/hooks/use-progress";

const LEVELS = [
  { name: "Novato", min: 0, color: "from-amber-400 to-orange-500" },
  { name: "Explorador", min: 4, color: "from-emerald-400 to-teal-500" },
  { name: "Practicante", min: 10, color: "from-cyan-400 to-blue-500" },
  { name: "Laboratorista", min: 20, color: "from-fuchsia-400 to-pink-500" },
  { name: "Experto", min: 40, color: "from-violet-400 to-purple-500" },
];

const TOPICS = [
  { n: "01", name: "MRU", subject: "Física", href: "/fisica/mru", color: "emerald" },
  { n: "02", name: "MRUV", subject: "Física", href: "/fisica/mruv", color: "emerald" },
  { n: "03", name: "Los 3 tiros", subject: "Física", href: "/fisica/tiros", color: "emerald" },
  { n: "04", name: "Nomenclatura IUPAC", subject: "Química", href: "/quimica/iupac", color: "fuchsia" },
  { n: "05", name: "Balanceo de ecuaciones", subject: "Química", href: "/quimica/balanceo", color: "fuchsia" },
  { n: "06", name: "Estequiometría", subject: "Química", href: "/quimica/estequiometria", color: "fuchsia" },
  { n: "07", name: "Verb Tenses", subject: "Inglés", href: "/ingles/verb-tenses", color: "amber" },
  { n: "08", name: "Passive Voice", subject: "Inglés", href: "/ingles/passive-voice", color: "amber" },
  { n: "09", name: "Modal Verbs", subject: "Inglés", href: "/ingles/modal-verbs", color: "amber" },
  { n: "10", name: "Reported Speech", subject: "Inglés", href: "/ingles/reported-speech", color: "amber" },
];

export default function ProgresoPage() {
  const { progress, userId, exportJSON, isSyncing } = useProgress();
  // puntos = suma de scores + 2 por tema completado (simple)
  const topicIds = ["04_iupac", "05_balanceo", "06_estequiometria", "01_mru", "02_mruv", "03_tiros", "07_verb", "08_passive", "09_modal", "10_reported"];
  const points = Object.values(progress).reduce((acc, p) => acc + p.score + (p.completed ? 2 : 0), 0);
  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const totalAttempts = Object.values(progress).reduce((acc, p) => acc + p.attempts, 0);
  const currentLevel = LEVELS.find((l) => points >= l.min) ?? LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.min > points);
  const pointsToNext = nextLevel ? nextLevel.min - points : 0;
  const progressPct = nextLevel
    ? ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  const colorMap = {
    emerald: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
    fuchsia: { text: "text-fuchsia-700", bg: "bg-fuchsia-50", border: "border-fuchsia-200", dot: "bg-fuchsia-500" },
    amber: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Progreso" }]} />

      <PageHeader
        eyebrow="Tu bitácora"
        accent="fuchsia"
        title={
          <>
            Todo lo que aprendes{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              deja una huella
            </span>
            .
          </>
        }
        subtitle="Tu avance se guarda solo en este navegador (localStorage). Si limpias caché, usas incógnito o cambias de dispositivo, pierdes tu progreso. Exporta tu copia abajo. Sin cuentas, sin nube."
      />

      <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: stats */}
        <div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <Zap className="h-5 w-5 mx-auto text-fuchsia-600" />
              <div className="mt-2 text-2xl font-bold text-foreground font-mono">{totalAttempts}</div>
              <div className="text-xs text-muted-foreground">Actividades</div>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-600" />
              <div className="mt-2 text-2xl font-bold text-foreground font-mono">{points}</div>
              <div className="text-xs text-muted-foreground">Puntos</div>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <BookOpen className="h-5 w-5 mx-auto text-amber-600" />
              <div className="mt-2 text-2xl font-bold text-foreground font-mono">{completedCount}/10</div>
              <div className="text-xs text-muted-foreground">Temas</div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground font-mono">ID: {userId} {isSyncing && "· sincronizando..."}</div>

          {completedCount === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-center">
              <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/60" />
              <h3 className="mt-3 text-base font-bold text-foreground">Aún no hay actividad registrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">¡Resuelve tu primer reto o abre un simulador para empezar!</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Link href="/retos" className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-shadow">
                  <Trophy className="h-3.5 w-3.5" /> Probar un reto
                </Link>
                <Link href="/fisica/mru" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold hover:bg-secondary/40 transition-colors">
                  Abrir un simulador <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <div className="font-bold text-emerald-800">¡Sigues avanzando! {completedCount} temas con progreso.</div>
              <div className="text-emerald-700">Tu progreso se guarda en este navegador y, si hay DB, también en la nube (ID {userId}).</div>
            </div>
          )}
        </div>

        {/* Right: level card */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center shadow-md`}>
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Nivel actual
                </div>
                <div className="text-xl font-bold text-foreground">{currentLevel.name}</div>
              </div>
            </div>
            <button onClick={() => { localStorage.removeItem("cecyt3-progress-v2"); localStorage.removeItem("cecyt3-lab-v3"); location.reload(); }} className="text-xs font-semibold text-muted-foreground hover:text-rose-600 transition-colors inline-flex items-center gap-1">
              <RotateCcw className="h-3 w-3" />
              Reiniciar
            </button>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">
                {nextLevel ? (
                  <>Te faltan <strong className="text-foreground">{pointsToNext} puntos</strong> para «{nextLevel.name}».</>
                ) : (
                  <>¡Nivel máximo alcanzado!</>
                )}
              </span>
              <span className="font-semibold text-foreground">{points} / {nextLevel?.min ?? points} puntos</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color}`}
              />
            </div>
          </div>

          {/* Export / Import + Aviso */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="text-xs font-bold text-amber-800">⚠️ Avance {process.env.NEXT_PUBLIC_SUPABASE_URL ? "en nube + local" : "volátil"}</div>
            <div className="mt-1 text-xs text-amber-700 leading-relaxed">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Guardado en Supabase y en este navegador." : "Solo aquí. Si borras caché o cambias de cel, se pierde. Guarda copia."}
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button onClick={exportJSON} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-amber-300 px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 transition-colors">
                Exportar JSON
              </button>
              <label className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-600 cursor-pointer transition-colors">
                Importar
                <input type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const txt = r.result as string; const j = JSON.parse(txt); if (j.progress) localStorage.setItem("cecyt3-progress-v2", JSON.stringify(j.progress)); else localStorage.setItem("cecyt3-progress-v2", txt); location.reload(); } catch { alert("Archivo inválido"); } }; r.readAsText(f); }} />
              </label>
              <button onClick={() => { localStorage.removeItem("cecyt3-progress-v2"); location.reload(); }} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-secondary/40 transition-colors">
                Reiniciar
              </button>
            </div>
          </div>

          {/* Levels list */}
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
              Escala de niveles
            </div>
            <div className="space-y-2">
              {LEVELS.map((lvl, i) => {
                const isCurrent = lvl.name === currentLevel.name;
                const isUnlocked = points >= lvl.min;
                return (
                  <div
                    key={lvl.name}
                    className={`flex items-center gap-2 rounded-lg p-2 ${
                      isCurrent ? "bg-secondary/60 border border-border" : ""
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${lvl.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${!isUnlocked ? "opacity-40" : ""}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold ${isUnlocked ? "text-foreground" : "text-muted-foreground/60"}`}>
                        {lvl.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{lvl.min} puntos mínimos</div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-fuchsia-600">
                        Actual
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Topics progress */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Avance por tema</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOPICS.map((t, i) => {
            const c = colorMap[t.color as keyof typeof colorMap];
            const map: Record<string, string> = { "01": "01_mru", "02": "02_mruv", "03": "03_tiros", "04": "04_iupac", "05": "05_balanceo", "06": "06_estequiometria", "07": "07_verb", "08": "08_passive", "09": "09_modal", "10": "10_reported" };
            const pid = map[t.n];
            const p = progress[pid];
            const pct = p ? Math.round((p.score / Math.max(1, p.total)) * 100) : 0;
            const label = !p ? "Sin empezar" : p.completed ? "Completado" : `${p.score}/${p.total}`;
            return (
              <motion.div key={t.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={t.href} className={`group flex items-center gap-3 rounded-2xl border ${c.border} ${c.bg} p-4 hover:shadow-md transition-all`}>
                  <div className="text-xs font-mono font-bold text-muted-foreground w-8">{t.n}</div>
                  <div className={`h-2 w-2 rounded-full ${p?.completed ? "bg-emerald-500" : c.dot}`} />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    <div className={`text-xs ${c.text} font-semibold`}>{t.subject}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-sm font-bold text-foreground">{pct}%</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
