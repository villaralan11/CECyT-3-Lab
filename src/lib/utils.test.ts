import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("mergea clases tailwind", () => {
    expect(cn("px-2 py-1", "px-3")).toBe("py-1 px-3");
  });
  it("ignora falsy", () => {
    expect(cn("text-red-500", false && "bg-blue-500", undefined, null)).toBe("text-red-500");
  });
  it("resuelve conflictos tailwind-merge", () => {
    expect(cn("text-sm text-lg")).toBe("text-lg");
  });
});
