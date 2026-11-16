"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Atom,
  Check,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Languages,
  Microscope,
  MoveUpRight,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";

const SUBJECTS = [
  {
    id: "fisica",
    name: "Física",
    kicker: "Movimiento · energía · universo",
    description:
      "Explora fenómenos, modifica variables y descubre qué pasa cuando la teoría se encuentra con la realidad.",
    count: "11 simuladores",
    topics: ["Cinemática", "Fuerzas", "Electricidad"],
    href: "/fisica",
    icon: Atom,
    theme: "physics",
    number: "01",
  },
  {
    id: "quimica",
    name: "Química",
    kicker: "Materia · reacciones · moléculas",
    description:
      "Trabaja con estructuras, ecuaciones y cálculos para entender cómo se transforma la materia.",
    count: "3 simuladores",
    topics: ["IUPAC", "Balanceo", "Estequiometría"],
    href: "/quimica",
    icon: FlaskConical,
    theme: "chemistry",
    number: "02",
  },
  {
    id: "ingles",
    name: "Inglés",
    kicker: "Grammar · práctica · comunicación",
    description:
      "Domina estructuras del idioma con ejercicios interactivos, retroalimentación y ejemplos claros.",
    count: "4 entrenadores",
    topics: ["Verb tenses", "Passive voice", "Modals"],
    href: "/ingles",
    icon: Languages,
    theme: "english",
    number: "03",
  },
];

const TOPICS = [
  { n: "01", subject: "Física", name: "Cinemática", description: "MRU, MRUV y tiro parabólico", href: "/fisica#fisica-i", tone: "blue" },
  { n: "02", subject: "Física", name: "Fuerzas y energía", description: "Dinámica, trabajo y colisiones", href: "/fisica#fisica-ii", tone: "blue" },
  { n: "03", subject: "Física", name: "Electricidad y ondas", description: "Cargas, circuitos y movimiento ondulatorio", href: "/fisica#fisica-iii", tone: "blue" },
  { n: "04", subject: "Química", name: "Nomenclatura IUPAC", description: "Identifica y nombra compuestos", href: "/quimica/iupac", tone: "coral" },
  { n: "05", subject: "Química", name: "Balanceo de ecuaciones", description: "Equilibra reacciones paso a paso", href: "/quimica/balanceo", tone: "coral" },
  { n: "06", subject: "Química", name: "Estequiometría", description: "Reactivo limitante y rendimiento", href: "/quimica/estequiometria", tone: "coral" },
  { n: "07", subject: "Inglés", name: "Verb tenses", description: "Tiempos verbales y marcadores temporales", href: "/ingles/verb-tenses", tone: "lime" },
  { n: "08", subject: "Inglés", name: "Passive voice", description: "Transformaciones de activa a pasiva", href: "/ingles/passive-voice", tone: "lime" },
  { n: "09", subject: "Inglés", name: "Modal verbs", description: "Obligación, posibilidad y deducción", href: "/ingles/modal-verbs", tone: "lime" },
  { n: "10", subject: "Inglés", name: "Reported speech", description: "Estilo indirecto y cambios de tiempo", href: "/ingles/reported-speech", tone: "lime" },
];

const QUESTIONS = [
  {
    subject: "Física",
    tone: "physics",
    prompt: "En el punto más alto de un tiro parabólico, la velocidad vertical (vᵧ) es…",
    options: ["Máxima", "Cero", "Igual a vₓ", "Igual a g"],
    correct: 1,
    explanation:
      "En el punto más alto, la componente vertical de la velocidad se anula. La componente horizontal permanece constante si despreciamos la resistencia del aire.",
  },
  {
    subject: "Química",
    tone: "chemistry",
    prompt: "¿Cuál es el nombre IUPAC de Ca(OH)₂?",
    options: ["Óxido de calcio", "Ácido cálcico", "Hidróxido de calcio", "Cloruro de calcio"],
    correct: 2,
    explanation:
      "El compuesto contiene el catión calcio (Ca²⁺) y dos grupos hidróxido (OH⁻), por eso se nombra hidróxido de calcio.",
  },
  {
    subject: "Inglés",
    tone: "english",
    prompt: "She ____ in Mexico City since 2019.",
    options: ["lives", "has lived", "is living", "lived"],
    correct: 1,
    explanation:
      "Since señala un punto de inicio que continúa hasta el presente. Usamos present perfect: has + past participle.",
  },
];

function MiniReto() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<(boolean | null)[]>(QUESTIONS.map(() => null));

  const question = QUESTIONS[index];
  const answered = selected !== null;
  const finished = history.every((answer) => answer !== null);
  const correct = selected === question.correct;

  const choose = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === question.correct;
    if (isCorrect) setScore((value) => value + 1);
    setHistory((current) => current.map((value, i) => (i === index ? isCorrect : value)));
  };

  const next = () => {
    if (index < QUESTIONS.length - 1) {
      setIndex((value) => value + 1);
      setSelected(null);
      return;
    }
    setIndex(0);
    setSelected(null);
    setScore(0);
    setHistory(QUESTIONS.map(() => null));
  };

  return (
    <div className="lab-quiz">
      <div className="lab-quiz-aside">
        <div className="lab-quiz-index"><Zap size={15} /> QUICK CHALLENGE / 003</div>
        <div className="lab-quiz-symbol" aria-hidden="true">?</div>
        <p className="lab-kicker lab-kicker-light">Pon a prueba lo que sabes</p>
        <h3>Aprender también es jugar con las ideas.</h3>
        <p className="lab-quiz-copy">Tres preguntas. Tres materias. Retroalimentación inmediata para entender el porqué.</p>
        <Link href="/retos" className="lab-quiz-link">Ver todos los retos <ArrowRight size={16} /></Link>
      </div>
      <div className="lab-quiz-main">
        <div className="lab-quiz-topline">
          <span className={`lab-subject-tag ${question.tone}`}>{question.subject}</span>
          <span className="lab-score"><Trophy size={15} /> {score} / {QUESTIONS.length}</span>
        </div>
        <div className="lab-quiz-progress" aria-label={`Pregunta ${index + 1} de ${QUESTIONS.length}`}>
          {QUESTIONS.map((item, i) => (
            <span key={item.subject} className={`${i === index ? "current" : ""} ${history[i] === true ? "passed" : ""} ${history[i] === false ? "missed" : ""}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="lab-quiz-question">{question.prompt}</h4>
            <div className="lab-quiz-options">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correct;
                const isSelected = selected === i;
                const stateClass = !answered ? "" : isCorrect ? "correct" : isSelected ? "incorrect" : "muted";
                return (
                  <button key={option} type="button" onClick={() => choose(i)} disabled={answered} className={`lab-quiz-option ${stateClass}`}>
                    <span className="lab-option-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{option}</span>
                    {answered && isCorrect && <CheckCircle2 size={17} />}
                    {answered && isSelected && !isCorrect && <X size={17} />}
                  </button>
                );
              })}
            </div>
            {answered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`lab-quiz-feedback ${correct ? "is-correct" : "is-incorrect"}`}>
                <strong>{correct ? "¡Bien hecho!" : "Vamos a entenderlo."}</strong>
                <p>{question.explanation}</p>
              </motion.div>
            )}
            <div className="lab-quiz-actions">
              <span>{answered ? (finished ? "Reto completado" : "Respuesta registrada") : `Pregunta ${index + 1} de ${QUESTIONS.length}`}</span>
              <button type="button" onClick={next} disabled={!answered} className="lab-button lab-button-dark">
                {index === QUESTIONS.length - 1 ? "Volver a intentar" : "Siguiente"} <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="lab-home">
      <section className="lab-hero">
        <div
          className="lab-hero-image"
          role="img"
          aria-label="Mesa de laboratorio iluminada con un prisma de cristal, un matraz con líquido azul y material de estudio"
        />
        <div className="lab-container lab-hero-layout">
          <motion.div
            className="lab-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lab-eyebrow">CECYT NO. 3 · IPN</div>
            <h1>Aprender <span>se ve así.</span></h1>
            <p className="lab-hero-description">
              Un laboratorio virtual para entender Física, Química e Inglés a través de experimentos, simuladores y retos.
            </p>
            <div className="lab-hero-actions">
              <Link href="#materias" className="lab-button lab-button-primary">
                Explorar materias <ArrowRight size={16} />
              </Link>
              <Link href="/laboratorios" className="lab-button lab-button-text">
                Ver cómo funciona <ChevronRight size={16} />
              </Link>
            </div>
            <div className="lab-hero-proof" aria-label="Características de la plataforma">
              <span><Atom size={13} /> Simuladores reales</span>
              <span><FlaskConical size={13} /> Aprende haciendo</span>
              <span><Sparkles size={13} /> Feedback inmediato</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="materias" className="lab-section lab-subjects-section">
        <div className="lab-container">
          <div className="lab-section-heading">
            <div>
              <p className="lab-kicker">01 / ELIGE TU CAMPO</p>
              <h2>Tres áreas. <span>Un mundo por descubrir.</span></h2>
            </div>
            <p className="lab-section-intro">Cada materia tiene herramientas para que pases de memorizar conceptos a entenderlos de verdad.</p>
          </div>
          <div className="lab-subject-grid">
            {SUBJECTS.map((subject, i) => {
              const Icon = subject.icon;
              return (
                <motion.div key={subject.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link href={subject.href} className={`lab-subject-card ${subject.theme}`}>
                    <div className="lab-subject-card-top"><span>{subject.number} / DISCIPLINA</span><MoveUpRight size={18} /></div>
                    <div className="lab-subject-icon"><Icon size={25} strokeWidth={1.8} /></div>
                    <p className="lab-subject-kicker">{subject.kicker}</p>
                    <h3>{subject.name}</h3>
                    <p className="lab-subject-description">{subject.description}</p>
                    <div className="lab-subject-topics">{subject.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                    <div className="lab-subject-card-bottom"><strong>{subject.count}</strong><span>Explorar <ArrowRight size={15} /></span></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="lab-stat-strip">
            <div><strong>03</strong><span>Materias</span></div>
            <div><strong>18</strong><span>Simuladores y entrenadores</span></div>
            <div><strong>10</strong><span>Temas interactivos</span></div>
            <div><strong>86+</strong><span>Ejercicios y actividades</span></div>
          </div>
        </div>
      </section>

      <section className="lab-method-section">
        <div className="lab-container lab-method-layout">
          <div className="lab-method-copy">
            <p className="lab-kicker lab-kicker-light">02 / NUESTRA FORMA DE APRENDER</p>
            <h2>No vienes a mirar.<br /><span>Vienes a descubrir.</span></h2>
            <p>La plataforma está diseñada alrededor de una idea sencilla: aprender también significa intentar, equivocarse y volver a probar con más información.</p>
            <Link href="/laboratorios" className="lab-method-link">Conoce los laboratorios <ArrowRight size={16} /></Link>
          </div>
          <div className="lab-method-steps">
            <div className="lab-method-step"><span className="step-no">01</span><div><strong>Falla a propósito</strong><p>Responde antes de ver la solución. Detecta lo que todavía no tienes claro.</p></div><span className="step-shape shape-coral">?</span></div>
            <div className="lab-method-step"><span className="step-no">02</span><div><strong>Experimenta</strong><p>Mueve variables, prueba escenarios y observa qué cambia.</p></div><span className="step-shape shape-blue"><Atom size={24} /></span></div>
            <div className="lab-method-step"><span className="step-no">03</span><div><strong>Comprende</strong><p>Conecta los resultados con una explicación y un ejemplo resuelto.</p></div><span className="step-shape shape-lime"><Check size={24} /></span></div>
          </div>
        </div>
      </section>

      <section id="temas" className="lab-section lab-topics-section">
        <div className="lab-container">
          <div className="lab-section-heading">
            <div><p className="lab-kicker">03 / RUTA DE APRENDIZAJE</p><h2>Explora los <span>10 temas.</span></h2></div>
            <Link href="/fisica" className="lab-text-link">Ver todas las materias <ArrowRight size={16} /></Link>
          </div>
          <div className="lab-topic-list">
            {TOPICS.map((topic) => (
              <Link key={topic.n} href={topic.href} className={`lab-topic-row tone-${topic.tone}`}>
                <span className="lab-topic-no">{topic.n}</span>
                <span className="lab-topic-subject">{topic.subject}</span>
                <span className="lab-topic-main"><strong>{topic.name}</strong><small>{topic.description}</small></span>
                <span className="lab-topic-arrow"><ChevronRight size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-quiz-section">
        <div className="lab-container"><MiniReto /></div>
      </section>

      <section className="lab-section lab-explore-section">
        <div className="lab-container">
          <div className="lab-explore-heading"><div><p className="lab-kicker">04 / SIGUE EXPLORANDO</p><h2>Tu siguiente experimento <span>empieza aquí.</span></h2></div><p>Prueba una actividad, registra lo que descubras y vuelve por un nuevo desafío.</p></div>
          <div className="lab-explore-grid">
            <Link href="/laboratorios" className="lab-explore-card explore-lab"><span className="explore-icon"><Microscope size={22} /></span><span className="explore-no">01 / BITÁCORA</span><h3>Laboratorios</h3><p>Hipótesis, experimentación, registro y conclusiones.</p><span className="explore-go">Entrar <ArrowRight size={16} /></span></Link>
            <Link href="/retos" className="lab-explore-card explore-challenges"><span className="explore-icon"><Target size={22} /></span><span className="explore-no">02 / DESAFÍOS</span><h3>Retos rápidos</h3><p>Preguntas cortas con retroalimentación para mejorar.</p><span className="explore-go">Intentar un reto <ArrowRight size={16} /></span></Link>
            <Link href="/progreso" className="lab-explore-card explore-progress"><span className="explore-icon"><GraduationCap size={22} /></span><span className="explore-no">03 / TU RECORRIDO</span><h3>Mi progreso</h3><p>Consulta tus actividades, resultados y avance.</p><span className="explore-go">Ver mi avance <ArrowRight size={16} /></span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
