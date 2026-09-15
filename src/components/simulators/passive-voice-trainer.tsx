"use client";

import { QuizTrainer, QItem } from "./quiz-trainer";

const ITEMS: QItem[] = [
  {
    type: "transform",
    prompt: "Transforma a voz pasiva. Activa: «The scientist writes the report.»",
    options: [
      "The report is written by the scientist.",
      "The report was written by the scientist.",
      "The report is being written by the scientist.",
      "The report has been written by the scientist.",
    ],
    correct: 0,
    explanation: "Presente simple → presente simple pasivo (is/are + participio). 'Writes' → 'is written'. El objeto 'the report' pasa a sujeto.",
    hint: "Identifica el tiempo (presente simple) y aplica: sujeto + be (mismo tiempo) + participio.",
    extra: "Fórmula general: S + be (en el tiempo del activo) + participio + by + agente.",
  },
  {
    type: "transform",
    prompt: "Transforma a voz pasiva. Activa: «The lab technician cleaned the beakers.»",
    options: [
      "The beakers are cleaned by the lab technician.",
      "The beakers were cleaned by the lab technician.",
      "The beakers have been cleaned by the lab technician.",
      "The beakers will be cleaned by the lab technician.",
    ],
    correct: 1,
    explanation: "Pasado simple → pasado simple pasivo (was/were + participio). 'Cleaned' → 'were cleaned' (sujeto plural).",
    hint: "Pasado simple → was/were + participio.",
    extra: "Cuidado con el número: beakerS (plural) → were. Un solo beaker → was.",
  },
  {
    type: "transform",
    prompt: "Transforma a voz pasiva. Activa: «The students are conducting the experiment.»",
    options: [
      "The experiment is conducted by the students.",
      "The experiment was being conducted by the students.",
      "The experiment is being conducted by the students.",
      "The experiment has been conducted by the students.",
    ],
    correct: 2,
    explanation: "Presente continuo → presente continuo pasivo (is/are being + participio).",
    hint: "Continuo → 'being + participio'. Mantén el tiempo.",
    extra: "Presente continuo pasivo: is/are + being + participio. Ojo: no se usa en todos los verbos (states).",
  },
  {
    type: "transform",
    prompt: "Transforma a voz pasiva. Activa: «The company has developed a new vaccine.»",
    options: [
      "A new vaccine was developed by the company.",
      "A new vaccine is developed by the company.",
      "A new vaccine has been developed by the company.",
      "A new vaccine had been developed by the company.",
    ],
    correct: 2,
    explanation: "Presente perfecto → presente perfecto pasivo (has/have been + participio).",
    hint: "Perfecto → 'has/have been + participio'.",
    extra: "Patrón: cualquier tiempo perfecto conserva 'been' entre el auxiliar y el participio.",
  },
  {
    type: "transform",
    prompt: "Transforma a voz pasiva. Activa: «The teacher will grade the exams tomorrow.»",
    options: [
      "The exams will be graded tomorrow.",
      "The exams are graded tomorrow.",
      "The exams were graded tomorrow.",
      "The exams will being graded tomorrow.",
    ],
    correct: 0,
    explanation: "Futuro simple → 'will be + participio'. El 'tomorrow' se conserva.",
    hint: "Futuro → 'will be + participio'.",
    extra: "Futuro simple pasivo: will be + participio. No confundir con 'will being' (incorrecto).",
  },
  {
    type: "transform",
    prompt: "Transforma a voz pasiva. Activa: «They had already finished the analysis.»",
    options: [
      "The analysis was already finished.",
      "The analysis had already been finished.",
      "The analysis has already been finished.",
      "The analysis is already finished.",
    ],
    correct: 1,
    explanation: "Pasado perfecto → 'had been + participio'. Conserva el 'already'.",
    hint: "Pasado perfecto → 'had been + participio'.",
    extra: "Pasado perfecto pasivo: had + been + participio. Útil para narrar qué había pasado antes de otro evento.",
  },
  {
    type: "transform",
    prompt: "Transforma a voz pasiva. Activa: «You must wear safety goggles in the lab.» (verbo modal)",
    options: [
      "Safety goggles must be worn in the lab.",
      "Safety goggles are worn in the lab.",
      "Safety goggles must wear in the lab.",
      "Safety goggles were worn in the lab.",
    ],
    correct: 0,
    explanation: "Modal + be + participio. 'Must wear' → 'must be worn'. Nota: 'wear' → participio 'worn' (irregular).",
    hint: "Modal → 'modal + be + participio'.",
    extra: "Modales en pasivo: can be done, must be done, should be done, might be done, etc.",
  },
  {
    type: "transform",
    prompt: "¿Cuál es la versión pasiva correcta de «People speak English all over the world»?",
    options: [
      "English is spoken all over the world.",
      "English speaks all over the world.",
      "English was spoken all over the world.",
      "English is being spoken all over the world.",
    ],
    correct: 0,
    explanation: "Con sujeto indefinido ('people', 'they', 'someone'), se OMITE el agente en la pasiva. 'Speak' → 'is spoken'.",
    hint: "'People' como sujeto → se elimina el 'by people' en la pasiva.",
    extra: "Cuando no importa quién hace la acción o es genérico (people, they, someone), se omite 'by + agente'.",
  },
  {
    type: "write",
    prompt: "Escribe en pasiva. Activa: «The team completed the report.»",
    options: ["The report was completed by the team."],
    correct: 0,
    accepted: ["The report was completed by the team", "The report was completed by the team.", "the report was completed by the team"],
    explanation: "Pasado simple → was/were + participio. Team singular → was. Toleramos punto y mayúscula.",
    hint: "completed → was completed",
    placeholder: "The report was...",
    extra: "Toleramos I'm/I am y puntuación.",
  },
];

export default function PassiveVoiceTrainer() {
  return (
    <QuizTrainer
      title="Grammar · Passive Voice"
      description="Transforma oraciones activas en pasivas y domina la estructura be + participio en todos los tiempos. El foco cambia: del quien hace al que recibe."
      badge="Inglés · 8 ejercicios"
      items={ITEMS}
      accentColor="amber"
      intro="Has completado los 8 ejercicios de voz pasiva."
    />
  );
}
