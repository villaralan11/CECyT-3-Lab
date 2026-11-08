import { describe, it, expect } from "vitest";
import { normalizeEnglish, isCorrectEnglish, levenshtein } from "./nlp";

describe("normalizeEnglish", () => {
  it("lowercase y trim", () => expect(normalizeEnglish("  Hello  ")).toBe("hello"));
  it("expande I'm", () => expect(normalizeEnglish("I'm ready")).toBe("i am ready"));
  it("expande don't y puntuación", () => expect(normalizeEnglish("Don't worry!")).toBe("do not worry"));
  it("ignora puntuación final", () => expect(normalizeEnglish("He is here.")).toBe("he is here"));
  it("tolerante a ’", () => expect(normalizeEnglish("I’m here")).toBe("i am here"));
});

describe("isCorrectEnglish", () => {
  it("acepta contracción equivalente", () => {
    expect(isCorrectEnglish("I'm ready", "I am ready")).toBe(true);
    expect(isCorrectEnglish("I am ready", "I'm ready")).toBe(true);
  });
  it("acepta sin puntuación", () => {
    expect(isCorrectEnglish("The report is written by the scientist", "The report is written by the scientist.")).toBe(true);
  });
  it("tolerante a typo distancia 1", () => {
    expect(isCorrectEnglish("the report is writen", "the report is written")).toBe(true);
  });
  it("rechaza error grave", () => {
    expect(isCorrectEnglish("The report was written", "The report is written")).toBe(false);
  });
  it("acepta array de variaciones", () => {
    expect(isCorrectEnglish("isn't", ["is not", "isn't"])).toBe(true);
  });
});

describe("levenshtein", () => {
  it("distancia básica", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("a", "a")).toBe(0);
  });
});
