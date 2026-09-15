/**
 * NLP tolerante para evaluación de respuestas en inglés
 * Trata contracciones, puntuación, mayúsculas y errores menores
 */

const CONTRACTIONS: Record<string, string> = {
  "i'm": "i am",
  "you're": "you are",
  "he's": "he is",
  "she's": "she is",
  "it's": "it is",
  "we're": "we are",
  "they're": "they are",
  "i've": "i have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",
  "i'd": "i would",
  "you'd": "you would",
  "he'd": "he would",
  "she'd": "she would",
  "we'd": "we would",
  "they'd": "they would",
  "i'll": "i will",
  "you'll": "you will",
  "he'll": "he will",
  "she'll": "she will",
  "we'll": "we will",
  "they'll": "they will",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "hasn't": "has not",
  "haven't": "have not",
  "hadn't": "had not",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "won't": "will not",
  "wouldn't": "would not",
  "can't": "cannot",
  "couldn't": "could not",
  "shouldn't": "should not",
  "mustn't": "must not",
  "let's": "let us",
};

export function normalizeEnglish(input: string): string {
  let s = input.toLowerCase().trim();
  // Unificar apóstrofes
  s = s.replace(/[’‘]/g, "'");
  // Expandir contracciones
  // Ordenar por longitud descendente para evitar reemplazos parciales
  const keys = Object.keys(CONTRACTIONS).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const re = new RegExp(`\\b${k.replace("'", "'")} \\b`, "g"); // placeholder, usaremos simple replace
    // Usamos split/join para evitar regex escapa
    s = s.split(k).join(CONTRACTIONS[k]);
  }
  // Segunda pasada con regex word boundary sin dependencia de espacio
  for (const k of keys) {
    const pattern = new RegExp(`\\b${k.replace("'", "\\'")}\\b`, "g");
    s = s.replace(pattern, CONTRACTIONS[k]);
  }
  // Quitar puntuación final pero conservar apóstrofe interno ya expandido
  s = s.replace(/[.,!?;:]+$/g, "");
  s = s.replace(/[.,!?;:"()]+/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/**
 * Evalúa si la respuesta del usuario es correcta de forma tolerante
 * @param input respuesta del alumno
 * @param expected respuesta esperada (o array de aceptadas)
 * @param opts tolerancias
 */
export function isCorrectEnglish(
  input: string,
  expected: string | string[],
  opts: { maxDistance?: number; ignorePunct?: boolean } = {}
): boolean {
  const { maxDistance = 1 } = opts;
  const normInput = normalizeEnglish(input);
  const candidates = Array.isArray(expected) ? expected : [expected];
  for (const c of candidates) {
    const normExpected = normalizeEnglish(c);
    if (normInput === normExpected) return true;
    // Tolerancia a un typo (distancia 1) si la cadena es >4 chars
    if (normInput.length > 4 && levenshtein(normInput, normExpected) <= maxDistance) return true;
    // Tolerancia a espacios/puntuación extra ya manejada por normalize, pero doble check sin espacios
    if (normInput.replace(/\s/g, "") === normExpected.replace(/\s/g, "")) return true;
  }
  return false;
}

// Para multiple-choice con free-text futuro: expone lista de variaciones aceptadas
export const ENGLISH_VARIATIONS: Record<string, string[]> = {
  "i am": ["i'm", "i am"],
  "you are": ["you're", "you are"],
  "is not": ["isn't", "is not"],
  "are not": ["aren't", "are not"],
  "cannot": ["can't", "cannot", "can not"],
};
