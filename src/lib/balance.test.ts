import { describe, it, expect } from "vitest";
import { balanceReaction, parseFormula } from "./balance";

describe("parseFormula", () => {
  it("H2O", () => expect(parseFormula("H2O")).toEqual({ H: 2, O: 1 }));
  it("Ca(OH)2", () => expect(parseFormula("Ca(OH)2")).toEqual({ Ca: 1, O: 2, H: 2 }));
  it("C6H12O6", () => expect(parseFormula("C6H12O6")).toEqual({ C: 6, H: 12, O: 6 }));
});

describe("balanceReaction", () => {
  const cases: [string[], string[], number[]][] = [
    [["CH4", "O2"], ["CO2", "H2O"], [1, 2, 1, 2]],
    [["C2H6", "O2"], ["CO2", "H2O"], [2, 7, 4, 6]],
    [["C2H5OH", "O2"], ["CO2", "H2O"], [1, 3, 2, 3]],
    [["C6H12O6", "O2"], ["CO2", "H2O"], [1, 6, 6, 6]],
    [["H2", "O2"], ["H2O"], [2, 1, 2]],
    [["N2", "H2"], ["NH3"], [1, 3, 2]],
    [["Fe", "O2"], ["Fe2O3"], [4, 3, 2]],
    [["Al", "O2"], ["Al2O3"], [4, 3, 2]],
    // extras para llegar a 20
    [["H2", "Cl2"], ["HCl"], [1, 1, 2]],
    [["Na", "Cl2"], ["NaCl"], [2, 1, 2]],
    [["C3H8", "O2"], ["CO2", "H2O"], [1, 5, 3, 4]],
    [["C4H10", "O2"], ["CO2", "H2O"], [2, 13, 8, 10]],
    [["CO", "O2"], ["CO2"], [2, 1, 2]],
    [["KClO3"], ["KCl", "O2"], [2, 2, 3]],
    [["CaCO3"], ["CaO", "CO2"], [1, 1, 1]],
    [["H2SO4", "NaOH"], ["Na2SO4", "H2O"], [1, 2, 1, 2]],
    [["HCl", "NaOH"], ["NaCl", "H2O"], [1, 1, 1, 1]],
    [["CH3OH", "O2"], ["CO2", "H2O"], [2, 3, 2, 4]],
    [["C2H4", "O2"], ["CO2", "H2O"], [1, 3, 2, 2]],
    [["NH3", "O2"], ["NO", "H2O"], [4, 5, 4, 6]],
  ];

  for (const [r, p, expected] of cases) {
    it(`${r.join("+")}->${p.join("+")} = ${expected.join(",")}`, () => {
      const res = balanceReaction(r, p);
      expect(res).toEqual(expected);
    });
  }

  it("retorna null si no balanceable", () => {
    expect(balanceReaction(["H2"], ["O2"])).toBeNull();
  });
});
