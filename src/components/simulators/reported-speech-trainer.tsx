"use client";

import { QuizTrainer, QItem } from "./quiz-trainer";

const ITEMS: QItem[] = [
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'I am running the simulation now,' she said.»",
    options: [
      "She said she was running the simulation then.",
      "She said she is running the simulation now.",
      "She said she ran the simulation then.",
      "She said she had been running the simulation now.",
    ],
    correct: 0,
    explanation: "Backshift: am → was (presente → pasado). Marcador: now → then. Pronombre: I → she.",
    hint: "Backshift de tiempos + ajuste de pronombres y marcadores temporales.",
    extra: "Reglas de backshift: present → past, past → past perfect, will → would, can → could, now → then, today → that day, tomorrow → the next day.",
  },
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'We finished the lab report yesterday,' they said.»",
    options: [
      "They said they had finished the lab report the day before.",
      "They said they finished the lab report yesterday.",
      "They said they have finished the lab report the day before.",
      "They said they were finishing the lab report yesterday.",
    ],
    correct: 0,
    explanation: "Pasado simple → pasado perfecto (had finished). yesterday → the day before. we → they.",
    hint: "Pasado simple → pasado perfecto. 'Yesterday' → 'the day before'.",
    extra: "Marcadores temporales: yesterday → the day before, tomorrow → the next day, next week → the following week, ago → before.",
  },
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'Can you pass the beaker?' he asked.»",
    options: [
      "He asked if I could pass the beaker.",
      "He asked can you pass the beaker.",
      "He asked if I can pass the beaker.",
      "He asked to pass the beaker.",
    ],
    correct: 0,
    explanation: "Pregunta sí/no → 'asked if/whether' + orden afirmativa + backshift: can → could. No se usa orden interrogativo.",
    hint: "Pregunta sí/no → 'asked if/whether' + sujeto + verbo. Backshift can → could.",
    extra: "En reported questions NO se usa auxiliar 'do/does/did' ni signo de interrogación: 'He asked where I lived' (no 'where did I live').",
  },
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'Don't touch the hot plate!' the teacher said.»",
    options: [
      "The teacher told us not to touch the hot plate.",
      "The teacher said don't touch the hot plate.",
      "The teacher told us to not touch the hot plate.",
      "The teacher asked us if we touch the hot plate.",
    ],
    correct: 0,
    explanation: "Imperativo negativo → 'told + obj + not to + infinitivo'. 'Don't touch' → 'not to touch'. (La opción C es incorrecta: el orden es 'not to', no 'to not').",
    hint: "Imperativo → 'told + objeto + (not) to + infinitivo'.",
    extra: "Imperativo afirmativo: told + obj + to + inf ('She told me to sit'). Negativo: told + obj + not to + inf.",
  },
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'Where is the microscope?' Maria asked.»",
    options: [
      "Maria asked where the microscope was.",
      "Maria asked where is the microscope.",
      "Maria asked where was the microscope.",
      "Maria asked where the microscope is.",
    ],
    correct: 0,
    explanation: "Wh-question → 'asked + wh + sujeto + verbo (backshift)'. 'Where is' → 'where was'. Importante: orden afirmativo (no 'where was the microscope').",
    hint: "Wh-question: conservas el 'where', cambias el orden a afirmativo y backshift.",
    extra: "Reported wh-questions: wh + sujeto + verbo. NUNCA orden interrogativo ni auxiliar do/does/did.",
  },
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'I will submit the data tomorrow,' he said.»",
    options: [
      "He said he would submit the data the next day.",
      "He said he will submit the data tomorrow.",
      "He said he submits the data the next day.",
      "He said he had submitted the data tomorrow.",
    ],
    correct: 0,
    explanation: "will → would. tomorrow → the next day / the following day. I → he.",
    hint: "Backshift will → would. 'Tomorrow' → 'the next day'.",
    extra: "Futuro en reported: will → would, shall → should, may → might, can → could.",
  },
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'I have already calibrated the scale,' the technician said.»",
    options: [
      "The technician said he had already calibrated the scale.",
      "The technician said he has already calibrated the scale.",
      "The technician said he already calibrated the scale.",
      "The technician said I had already calibrated the scale.",
    ],
    correct: 0,
    explanation: "Presente perfecto → pasado perfecto (had calibrated). Conserva 'already'. I → he.",
    hint: "Presente perfecto → pasado perfecto.",
    extra: "Backshift de perfectos: present perfect → past perfect, past perfect → (sigue) past perfect.",
  },
  {
    type: "transform",
    prompt: "Convierte a reported speech. Directo: «'Let's start the titration,' the professor suggested.»",
    options: [
      "The professor suggested starting the titration.",
      "The professor suggested that we start the titration.",
      "Both A and B are correct.",
      "The professor said to start the titration.",
    ],
    correct: 2,
    explanation: "'Let's...' con 'suggest' admite DOS estructuras válidas: 'suggested + -ing' o 'suggested (that) we + verbo'.",
    hint: "'Let's' con 'suggest' admite dos estructuras válidas.",
    extra: "Suggest es especial: NO admite 'suggested me to' (incorrecto). Solo: 'suggested -ing' o 'suggested (that) + sujeto + verbo'.",
  },
  {
    type: "write",
    prompt: "Escribe en reported speech. Directo: «'I am working now,' she said.»",
    options: ["She said she was working then."],
    correct: 0,
    accepted: ["She said she was working then", "She said she was working then.", "she said she was working then", "She said that she was working then"],
    explanation: "Backshift: am → was, now → then. Aceptamos con/sin 'that', con/sin punto, I'm = I am.",
    hint: "am → was, now → then",
    placeholder: "She said she was...",
    extra: "Toleramos puntuación, mayúsculas y contracciones.",
  },
  {
    type: "write",
    prompt: "Escribe en reported speech. Directo: «'Don't open the door,' he told me.»",
    options: ["He told me not to open the door."],
    correct: 0,
    accepted: ["He told me not to open the door", "He told me not to open the door.", "he told me not to open the door"],
    explanation: "Imperativo negativo → told + not to + infinitivo. Orden: not to, no to not.",
    hint: "Don't open → not to open",
    placeholder: "He told me not to...",
    extra: "Toleramos punto final opcional.",
  },
];

export default function ReportedSpeechTrainer() {
  return (
    <QuizTrainer
      title="Grammar · Reported Speech"
      description="Cuenta lo que alguien dijo sin citarlo: backshift de tiempos, ajuste de pronombres y marcadores (now→then, yesterday→the day before), preguntas sin auxiliar e imperativos con to + infinitivo."
      badge="Inglés · 8 ejercicios"
      items={ITEMS}
      accentColor="amber"
      intro="Has completado los 8 ejercicios de reported speech."
    />
  );
}
