// Utilidades de extracción de texto para el Notebook IA (v0.5.1).
// El texto se guarda en la tabla `Document` y se envía a la IA como fuentes.

/** Límites del sistema de documentos */
export const DOC_MAX_BYTES = 4_000_000; // 4 MB por archivo (límite de body en Vercel: 4.5 MB)
export const DOC_MAX_TEXT = 120_000; // caracteres extraídos guardados por documento
export const DOC_MAX_PER_USER = 12; // documentos por usuario (BD compartida en plan free)
export const NOTEBOOK_CONTEXT_BUDGET = 48_000; // presupuesto total de contexto para la IA

/** Extensiones aceptadas, con su MIME y etiqueta amigable */
export const DOC_ACCEPTED = [
  { ext: "pdf", mime: "application/pdf", label: "PDF" },
  { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "Word" },
  { ext: "pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", label: "PowerPoint" },
  { ext: "txt", mime: "text/plain", label: "Texto" },
  { ext: "md", mime: "text/markdown", label: "Markdown" },
] as const;

export type DocExt = (typeof DOC_ACCEPTED)[number]["ext"];

export function docExtOf(name: string): DocExt | null {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return DOC_ACCEPTED.some((d) => d.ext === ext) ? (ext as DocExt) : null;
}

export function docMimeOf(ext: DocExt): string {
  return DOC_ACCEPTED.find((d) => d.ext === ext)?.mime ?? "application/octet-stream";
}

/** Normaliza el texto extraído: saltos, espacios y longitud */
export function sanitizeExtractedText(raw: string): string {
  const clean = raw
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return clean.length > DOC_MAX_TEXT ? clean.slice(0, DOC_MAX_TEXT) + "\n\n[texto truncado por límite]" : clean;
}

/** Extrae el texto de los runs `<a:t>` de una diapositiva PPTX (XML) */
export function extractSlideText(slideXml: string): string {
  const runs = slideXml.match(/<a:t>([^<]*)<\/a:t>/g) ?? [];
  return runs
    .map((run) => run.replace(/<\/?a:t>/g, "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();
}

/** Ordena nombres de slides XML `slide1.xml, slide2.xml, ... slide10.xml` numéricamente */
export function sortSlideNames(names: string[]): string[] {
  return [...names].sort((a, b) => {
    const na = Number(a.match(/slide(\d+)\.xml/)?.[1] ?? 0);
    const nb = Number(b.match(/slide(\d+)\.xml/)?.[1] ?? 0);
    return na - nb;
  });
}

export type ContextSource = { title: string; content: string };

/**
 * Reparte el presupuesto total de contexto entre las fuentes sin sesgar el orden:
 * cada fuente aporta como máximo budget/n caracteres (mínimo 300).
 */
export function budgetSources(sources: ContextSource[], total: number = NOTEBOOK_CONTEXT_BUDGET): ContextSource[] {
  if (!sources.length) return sources;
  const per = Math.max(300, Math.floor(total / sources.length));
  return sources.map((source) => {
    if (source.content.length <= per) return source;
    return { ...source, content: source.content.slice(0, per) + "\n[...texto truncado por límite de contexto]" };
  });
}
