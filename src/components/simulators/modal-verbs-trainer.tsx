"use client";

import { QuizTrainer, QItem } from "./quiz-trainer";

const ITEMS: QItem[] = [
  {
    type: "blank",
    prompt: "You ____ wear a lab coat during the experiment. (es obligatorio por seguridad)",
    sentence: "You ____ wear a lab coat during the experiment.",
    options: ["can", "might", "must", "could"],
    correct: 2,
    explanation: "'Must' expresa obligación normativa. En un laboratorio, las reglas de seguridad no son opcionales.",
    hint: "Si es una regla obligatoria de seguridad, no es opcional.",
    extra: "Must = obligación fuerte (no hay opción). Have to es similar pero viene de fuera (reglamento).",
  },
  {
    type: "blank",
    prompt: "The reaction ____ produce gas if the temperature rises too fast. (es posible, no seguro)",
    sentence: "The reaction ____ produce gas if the temperature rises too fast.",
    options: ["must", "might", "should", "will"],
    correct: 1,
    explanation: "'Might' expresa posibilidad (menos del 50% de certeza). 'Could' también funcionaría; 'must' sería deducción fuerte, 'will' certeza.",
    hint: "Posibilidad incierta → might / could. No uses 'must' (deducción) ni 'will' (certeza).",
    extra: "Escala de certeza: will (100%) > should (90%) > may/might (50%) > can't/must not (deducción negativa).",
  },
  {
    type: "blank",
    prompt: "Students ____ not eat in the lab. (está prohibido)",
    sentence: "Students ____ not eat in the lab.",
    options: ["should", "might", "must", "can"],
    correct: 2,
    explanation: "'Must not / mustn't' expresa prohibición: una norma que no se puede romper. Diferente de 'don't have to' (no es necesario).",
    hint: "Prohibición fuerte → must not / mustn't.",
    extra: "Must not = prohibido. Don't have to = no es obligatorio (pero puedes si quieres). ¡Son opuestos!",
  },
  {
    type: "blank",
    prompt: "You ____ use the fume hood when working with volatile solvents. (recomendación fuerte)",
    sentence: "You ____ use the fume hood when working with volatile solvents.",
    options: ["might", "should", "could", "would"],
    correct: 1,
    explanation: "'Should' recomienda una buena práctica. No es obligación absoluta como 'must', pero es altamente recomendable.",
    hint: "Recomendación (no obligación) → should.",
    extra: "Should = conviene. Ought to es sinónimo formal. Must = obliga. Should + have + pp = arrepentimiento pasado.",
  },
  {
    type: "blank",
    prompt: "You ____ borrow my calculator during the exam. (tienes mi permiso)",
    sentence: "You ____ borrow my calculator during the exam.",
    options: ["must", "should", "can", "might"],
    correct: 2,
    explanation: "'Can' expresa permiso concedido informalmente. 'May' sería más formal (May I borrow...?).",
    hint: "Permiso concedido → can / may.",
    extra: "Permiso: can (informal), may (formal), could (más cortés). Para pedir: 'Can I...?' / 'May I...?'",
  },
  {
    type: "blank",
    prompt: "The pH indicator ____ turn pink in basic solutions. (es un hecho: siempre ocurre)",
    sentence: "The pH indicator ____ turn pink in basic solutions.",
    options: ["might", "will", "could", "would"],
    correct: 1,
    explanation: "'Will' expresa un hecho determinista: en medio básico el indicador siempre vira a rosa. 'Should' expresaría expectativa o consejo, no un hecho.",
    hint: "Hecho científico que siempre ocurre → will.",
    extra: "Will = certeza/hecho. Should = expectativa ('I expect it will') o recomendación. En ciencia, los hechos van con presente o will.",
  },
  {
    type: "blank",
    prompt: "You ____ have added too much acid; the solution turned completely clear. (deducción pasada)",
    sentence: "You ____ have added too much acid; the solution turned completely clear.",
    options: ["must", "should", "can", "will"],
    correct: 0,
    explanation: "'Must have + participio' expresa deducción fuerte sobre el pasado. El resultado evidente (solución clara) implica la causa.",
    hint: "Deducción sobre el pasado → must have + participio.",
    extra: "Deducciones pasadas: must have done (seguro que sí), can't have done (seguro que no), might have done (posible).",
  },
  {
    type: "blank",
    prompt: "She ____ not be in the lab; the lights are off. (deducción negativa: es imposible)",
    sentence: "She ____ not be in the lab; the lights are off.",
    options: ["should", "might", "can't", "must"],
    correct: 2,
    explanation: "'Can't be' expresa deducción negativa: con las luces apagadas es imposible que esté. 'Must not be' sonaría a prohibición, no a deducción.",
    hint: "Deducción negativa (imposible que sí) → can't.",
    extra: "Deducción: must = seguro que sí; can't = seguro que no. Must not = prohibición (no deducción).",
  },
  {
    type: "write",
    prompt: "Escribe con modal. You ____ (not / smoke) here. (prohibición)",
    options: ["must not smoke", "mustn't smoke"],
    correct: 0,
    accepted: ["must not smoke", "mustn't smoke", "must not smoke.", "mustn't smoke."],
    explanation: "Prohibición → must not / mustn't + base. Toleramos contracción.",
    hint: "must not / mustn't",
    placeholder: "must not smoke",
    extra: "mustn't = must not",
  },
  {
    type: "write",
    prompt: "Escribe con modal. She ____ (be) at home. I saw her at school. (deducción imposible)",
    options: ["can't be"],
    correct: 0,
    accepted: ["can't be", "cannot be", "can't be.", "cannot be."],
    explanation: "Deducción imposible → can't/cannot + be. Toleramos contracción.",
    hint: "can't / cannot",
    placeholder: "can't be",
    extra: "can't = cannot",
  },
];

export default function ModalVerbsTrainer() {
  return (
    <QuizTrainer
      topicId="09_modal"
      title="Grammar · Modal Verbs"
      description="Must, can, might, should y compañía: obligación, prohibición, posibilidad, deducción y permiso. El matiz que convierte una recomendación en una norma de seguridad del laboratorio."
      badge="Inglés · 10 ejercicios"
      items={ITEMS}
      accentColor="amber"
      intro="Has completado los 10 ejercicios de verbos modales."
    />
  );
}
