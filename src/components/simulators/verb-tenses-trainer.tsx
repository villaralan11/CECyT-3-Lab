"use client";

import { QuizTrainer, QItem } from "./quiz-trainer";

const ITEMS: QItem[] = [
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "She ____ in Mexico City since 2019.",
    options: ["lives", "has lived", "is living", "lived"],
    correct: 1,
    explanation: "'Has lived' — presente perfecto. El marcador 'since' marca un punto de inicio en el pasado (2019) cuya acción se prolonga hasta ahora.",
    hint: "'Since' señala un punto de inicio. ¿Qué tiempo cubre desde el pasado hasta hoy?",
    extra: "Presente perfecto = have/has + participio. Se usa con: since, for, yet, already, ever, never.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "Look! The bus ____ right now.",
    options: ["comes", "is coming", "has come", "came"],
    correct: 1,
    explanation: "'Is coming' — presente continuo. El marcador 'Look!' te pide acción en este instante.",
    hint: "'Look!' te pide presente continuo (be + -ing).",
    extra: "Presente continuo = am/is/are + -ing. Marcadores: now, right now, at the moment, Look!, Listen!.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "Last year we ____ to Cancún for vacation.",
    options: ["go", "have gone", "went", "were going"],
    correct: 2,
    explanation: "'Went' — pasado simple. 'Last year' cierra la acción en un punto del pasado.",
    hint: "'Last year' cierra la acción en el pasado. Pasado simple.",
    extra: "Pasado simple = verbo en pasado (-ed para regulares, formas irregulares). Marcadores: yesterday, last..., ago, in 1999.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "When the phone rang, I ____ dinner.",
    options: ["cooked", "was cooking", "have cooked", "cook"],
    correct: 1,
    explanation: "'Was cooking' — pasado continuo. Una acción en progreso (cocinar) interrumpida por otra (sonó el teléfono).",
    hint: "Acción en progreso en el pasado = pasado continuo (was/were + -ing).",
    extra: "Pasado continuo = was/were + -ing. Marcadores: while, when, as, at that moment.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "By 2025, scientists ____ a vaccine for malaria.",
    options: ["discovered", "have discovered", "had discovered", "discover"],
    correct: 2,
    explanation: "'Had discovered' — pasado perfecto. 'By + fecha pasada' exige una acción ya completada antes de ese punto.",
    hint: "'By + fecha' marca una acción completada antes de otro punto: pasado perfecto.",
    extra: "Pasado perfecto = had + participio. Marcadores: by the time, before, after, already, just.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "If you heat ice, it ____.",
    options: ["melts", "is melting", "melted", "has melted"],
    correct: 0,
    explanation: "'Melts' — conditional cero. Describe un hecho científico, una ley de la naturaleza: if + presente, presente.",
    hint: "Es una ley de la naturaleza. Conditional cero: if + presente, presente.",
    extra: "Conditional 0 = if + presente simple, presente simple. Para verdades universales y hechos científicos.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "I ____ you tomorrow at 9 a.m., I promise.",
    options: ["call", "am calling", "will call", "called"],
    correct: 2,
    explanation: "'Will call' — futuro simple. Una promesa o decisión espontánea sobre el futuro.",
    hint: "Promesa → 'will' + verbo.",
    extra: "Futuro simple = will + verbo. Para promesas, predicciones, decisiones espontáneas.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "At this moment next week, we ____ on the beach.",
    options: ["will lie", "will be lying", "lie", "are lying"],
    correct: 1,
    explanation: "'Will be lying' — futuro continuo. Acción en progreso en un punto específico del futuro.",
    hint: "Acción en progreso en un punto futuro = futuro continuo (will be + -ing).",
    extra: "Futuro continuo = will be + -ing. Para acciones que estarán en progreso en un momento futuro.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "She ____ her homework yet.",
    options: ["didn't finish", "hasn't finished", "isn't finishing", "doesn't finish"],
    correct: 1,
    explanation: "'Hasn't finished' — presente perfecto negativo. 'Yet' con acción pendiente.",
    hint: "'Yet' va con presente perfecto negativo o interrogativo.",
    extra: "Yet (todavía) se usa en negativas e interrogativas con presente perfecto. Already en afirmativas.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "Water ____ at 100 °C at sea level.",
    options: ["boils", "is boiling", "has boiled", "boiled"],
    correct: 0,
    explanation: "'Boils' — presente simple. Un hecho científico, generalmente cierto.",
    hint: "Hecho científico → presente simple.",
    extra: "Presente simple = verbo base (+ s en 3ª persona). Para hechos, hábitos, horarios.",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "While the experiment ____, the teacher explained the result.",
    options: ["ran", "was running", "has run", "runs"],
    correct: 1,
    explanation: "'Was running' — pasado continuo. 'While' marca una acción durativa en el pasado.",
    hint: "'While' marca una acción durativa en el pasado.",
    extra: "Estructura típica: while + pasado continuo, pasado simple (la interrumpe).",
  },
  {
    type: "blank",
    prompt: "Elige el tiempo verbal correcto.",
    sentence: "I ____ three exams this week, and it's only Wednesday.",
    options: ["took", "have taken", "was taking", "take"],
    correct: 1,
    explanation: "'Have taken' — presente perfecto. 'This week' sigue abierto (aún no termina la semana).",
    hint: "'This week' sigue abierto: presente perfecto.",
    extra: "Presente perfecto con periodos no cerrados: today, this week, this month, this year.",
  },
  {
    type: "write",
    prompt: "Escribe la forma correcta. She ____ (live) here since 2019.",
    options: ["has lived"],
    correct: 0,
    accepted: ["has lived", "has lived.", "she has lived", "She has lived"],
    explanation: "Since 2019 → presente perfecto has lived. Toleramos punto y mayúscula.",
    hint: "since → has/have + participio",
    placeholder: "has lived",
    extra: "Toleramos I'm/I am y puntuación.",
  },
  {
    type: "write",
    prompt: "Escribe la forma correcta. Look! The child ____ (cross) the street now.",
    options: ["is crossing"],
    correct: 0,
    accepted: ["is crossing", "is crossing.", "is crossing now"],
    explanation: "Look! + now → presente continuo is crossing.",
    hint: "Look! → is/are + -ing",
    placeholder: "is crossing",
    extra: "Toleramos typo1.",
  },
];

export default function VerbTensesTrainer() {
  return (
    <QuizTrainer
      title="Grammar · Verb Tenses"
      description="Doce ejercicios que cubren presente, pasado y futuro en sus formas simple, continuo, perfecto y condicional. La clave está en los marcadores temporales ('since', 'last year', 'look!', 'by+fecha')."
      badge="Inglés · 12 ejercicios"
      items={ITEMS}
      accentColor="amber"
      intro="Has completado los 12 ejercicios de tiempos verbales."
    />
  );
}
