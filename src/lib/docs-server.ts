// Extracción de texto en el servidor (Node runtime). Solo para rutas de API.
import JSZip from "jszip";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { extractSlideText, sanitizeExtractedText, sortSlideNames, type DocExt } from "./docs";

/** Extrae el texto de un documento según su extensión (contenido ya saneado). */
export async function extractDocText(ext: DocExt, buffer: Buffer): Promise<string> {
  switch (ext) {
    case "pdf": {
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
