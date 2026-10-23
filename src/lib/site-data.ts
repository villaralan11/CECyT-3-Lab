/**
 * Fuente única de verdad para navegación e índice del sitio.
 * TODO el contenido refleja rutas y simuladores que EXISTEN.
 */

export type SubjectId = "fisica" | "quimica" | "ingles";

export const SUBJECTS: {
  id: SubjectId;
  name: string;
  index: string;
  desc: string;
  topics: number;
  simulators: string;
  href: string;
}[] = [
  {
    id: "fisica",
    name: "Física",
    index: "01",
    desc: "Cinemática con integración Euler-Cromer contrastada contra la solución analítica: MRU, MRUV y los tres tiros.",
    topics: 3,
    simulators: "3 simuladores",
    href: "/fisica",
  },
  {
    id: "quimica",
    name: "Química",
    index: "02",
    desc: "Nomenclatura IUPAC con 24 compuestos reales, balanceo con conteo de átomos en vivo y estequiometría con masas molares verdaderas.",
    topics: 3,
    simulators: "3 simuladores",
    href: "/quimica",
  },
  {
    id: "ingles",
    name: "Inglés",
    index: "03",
    desc: "Grammar trainer con estrategia y explicación inmediata: tiempos verbales, voz pasiva, modales y reported speech.",
    topics: 4,
    simulators: "4 trainers",
    href: "/ingles",
  },
];

export type TopicEntry = {
  n: string;
  subject: SubjectId;
  subjectName: string;
  name: string;
  desc: string;
  href: string;
};

export const TOPICS: TopicEntry[] = [
  { n: "01", subject: "fisica", subjectName: "Física", name: "Cinemática · MRU", desc: "Movimiento Rectilíneo Uniforme", href: "/fisica/mru" },
  { n: "02", subject: "fisica", subjectName: "Física", name: "Cinemática · MRUV", desc: "Aceleración constante", href: "/fisica/mruv" },
  { n: "03", subject: "fisica", subjectName: "Física", name: "Los 3 tiros", desc: "Vertical, horizontal y parabólico", href: "/fisica/tiros" },
  { n: "04", subject: "quimica", subjectName: "Química", name: "Nomenclatura IUPAC", desc: "Orgánica e inorgánica · 24 compuestos", href: "/quimica/iupac" },
  { n: "05", subject: "quimica", subjectName: "Química", name: "Balanceo de ecuaciones", desc: "Steppers + tabla de átomos en vivo", href: "/quimica/balanceo" },
  { n: "06", subject: "quimica", subjectName: "Química", name: "Estequiometría", desc: "Reactivo limitante y rendimiento", href: "/quimica/estequiometria" },
  { n: "07", subject: "ingles", subjectName: "Inglés", name: "Verb Tenses", desc: "12 ejercicios con marcadores temporales", href: "/ingles/verb-tenses" },
  { n: "08", subject: "ingles", subjectName: "Inglés", name: "Passive Voice", desc: "Transformaciones activa → pasiva", href: "/ingles/passive-voice" },
  { n: "09", subject: "ingles", subjectName: "Inglés", name: "Modal Verbs", desc: "Obligación, prohibición, deducción", href: "/ingles/modal-verbs" },
  { n: "10", subject: "ingles", subjectName: "Inglés", name: "Reported Speech", desc: "Backshift + marcadores + imperativos", href: "/ingles/reported-speech" },
];

export const SECTIONS = [
  { name: "Laboratorios", desc: "Guías con método científico", href: "/laboratorios" },
  { name: "Retos", desc: "Quizzes de 5 minutos", href: "/retos" },
  { name: "Progreso", desc: "Tu bitácora personal", href: "/progreso" },
] as const;

/** Color de acento por materia (Tailwind classes — comparte escala con las páginas internas). */
export const SUBJECT_STYLE: Record<SubjectId, { text: string; bgTint: string; dot: string; border: string }> = {
  fisica: { text: "text-teal-700", bgTint: "bg-teal-50", dot: "bg-teal-500", border: "border-teal-200/80" },
  quimica: { text: "text-fuchsia-700", bgTint: "bg-fuchsia-50", dot: "bg-fuchsia-500", border: "border-fuchsia-200/80" },
  ingles: { text: "text-amber-700", bgTint: "bg-amber-50", dot: "bg-amber-500", border: "border-amber-200/80" },
};
