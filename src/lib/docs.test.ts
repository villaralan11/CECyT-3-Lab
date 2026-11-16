import { describe, expect, it } from "vitest";
import { budgetSources, docExtOf, extractSlideText, sanitizeExtractedText, sortSlideNames } from "./docs";

describe("docs · docExtOf", () => {
  it("reconoce extensiones aceptadas", () => {
    expect(docExtOf("apuntes.PDF")).toBe("pdf");
    expect(docExtOf("clase-1.docx")).toBe("docx");
    expect(docExtOf("diapos.pptx")).toBe("pptx");
    expect(docExtOf("notas.md")).toBe("md");
    expect(docExtOf("notas.txt")).toBe("txt");
  });
  it("rechaza extensiones no soportadas", () => {
    expect(docExtOf("foto.jpg")).toBeNull();
    expect(docExtOf("doc.doc")).toBeNull(); // word viejo, no soportado
    expect(docExtOf("sinextension")).toBeNull();
  });
});

describe("docs · extractSlideText", () => {
  it("extrae y une los runs de texto de una diapositiva", () => {
    const xml = `<p:sld><p:txBody><a:p><a:r><a:t>Ley de Ohm</a:t></a:r><a:r><a:t>V = I × R</a:t></a:r></a:p></p:txBody></p:sld>`;
    expect(extractSlideText(xml)).toBe("Ley de Ohm V = I × R");
  });
  it("devuelve vacío si no hay texto", () => {
    expect(extractSlideText("<p:sld></p:sld>")).toBe("");
  });
});

describe("docs · sortSlideNames", () => {
  it("ordena slides numéricamente (no lexicográficamente)", () => {
    expect(sortSlideNames(["slide10.xml", "slide2.xml", "slide1.xml"])).toEqual(["slide1.xml", "slide2.xml", "slide10.xml"]);
  });
});

describe("docs · sanitizeExtractedText", () => {
  it("normaliza saltos y espacios", () => {
    expect(sanitizeExtractedText("Hola\r\n\r\n\r\nmundo  \nmundo")).toBe("Hola\n\nmundo\nmundo");
  });
  it("trunca textos que exceden el límite", () => {
    const out = sanitizeExtractedText("x".repeat(130_000));
    expect(out.length).toBeLessThan(131_000);
    expect(out).toContain("[texto truncado por límite]");
  });
});

describe("docs · budgetSources", () => {
  it("reparte el presupuesto entre varias fuentes", () => {
    const out = budgetSources(
      [
        { title: "A", content: "a".repeat(40_000) },
        { title: "B", content: "b".repeat(40_000) },
      ],
      10_000
    );
    expect(out[0].content.length).toBeLessThanOrEqual(5_100);
    expect(out[1].content.length).toBeLessThanOrEqual(5_100);
    expect(out[0].content).toContain("[...texto truncado");
  });
  it("no altera fuentes dentro del presupuesto", () => {
    const src = [{ title: "A", content: "corto" }];
    expect(budgetSources(src, 48_000)[0].content).toBe("corto");
  });
});
