// Extracción de texto en el servidor (Node runtime). Solo para rutas de API.
import JSZip from "jszip";
import mammoth from "mammoth";
import { extractSlideText, sanitizeExtractedText, sortSlideNames, type DocExt } from "./docs";

/**
 * pdf.js (dependencia de pdf-parse) referencia globales del navegador al
 * inicializarse (DOMMatrix, Path2D, ImageData) y en Node no existen; para la
 * extracción de texto bastan stubs mínimos. El import es dinámico para que
 * estas rutas no paguen el costo de carga de pdf.js en cada cold start.
 */
async function loadPdfParseClass(): Promise<typeof import("pdf-parse").PDFParse> {
  const g = globalThis as unknown as Record<string, unknown>;
  g.DOMMatrix ??= class DOMMatrixStub {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor(_init?: unknown) {}
  };
  g.Path2D ??= class Path2DStub {};
  g.ImageData ??= class ImageDataStub {};
  const mod = await import("pdf-parse");
  return mod.PDFParse;
}

/** Extrae el texto de un documento según su extensión (contenido ya saneado). */
export async function extractDocText(ext: DocExt, buffer: Buffer): Promise<string> {
  switch (ext) {
    case "pdf": {
      const PDFParse = await loadPdfParseClass();
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      try {
        const result = await parser.getText();
        return sanitizeExtractedText(result.text);
      } finally {
        await parser.destroy();
      }
    }
    case "docx": {
      const result = await mammoth.extractRawText({ buffer });
      return sanitizeExtractedText(result.value);
    }
    case "pptx": {
      const zip = await JSZip.loadAsync(buffer);
      const slideNames = sortSlideNames(
        Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      );
      if (!slideNames.length) throw new Error("PPTX sin diapositivas");
      const slides: string[] = [];
      for (const name of slideNames) {
        const xml = await zip.files[name].async("string");
        const text = extractSlideText(xml);
        if (text) slides.push(text);
      }
      return sanitizeExtractedText(slides.join("\n\n"));
    }
    case "txt":
    case "md": {
      return sanitizeExtractedText(buffer.toString("utf8"));
    }
  }
}
