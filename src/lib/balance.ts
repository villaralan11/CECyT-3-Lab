// Solver dinámico de balanceo — matriz estequiométrica + RREF con fracciones
// Para 8 reacciones pre-cargadas y cualquier reacción nueva ingresada por el alumno

export function parseFormula(formula: string): Record<string, number> {
  // Expande paréntesis (OH)2 -> O2H2 etc.
  let expanded = formula.replace(/\(([^)]+)\)(\d*)/g, (_, inside: string, mult: string) => {
    const m = mult ? parseInt(mult, 10) : 1;
    return inside.replace(/([A-Z][a-z]?)(\d*)/g, (_: string, el: string, n: string) => el + (n ? parseInt(n, 10) * m : m));
  });
  const res: Record<string, number> = {};
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expanded)) !== null) {
    const el = m[1];
    const n = m[2] ? parseInt(m[2], 10) : 1;
    res[el] = (res[el] || 0) + n;
  }
  return res;
}

// Fracción exacta para evitar errores de punto flotante
class Frac {
  n: number; // numerador
  d: number; // denominador >0
  constructor(n: number, d: number = 1) {
    if (d === 0) throw new Error("den 0");
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(Math.abs(n), Math.abs(d));
    this.n = n / g;
    this.d = d / g;
  }
  static from(n: number) { return new Frac(n, 1); }
  add(o: Frac) { return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o: Frac) { return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o: Frac) { return new Frac(this.n * o.n, this.d * o.d); }
  div(o: Frac) { return new Frac(this.n * o.d, this.d * o.n); }
  neg() { return new Frac(-this.n, this.d); }
  isZero() { return this.n === 0; }
  toNum() { return this.n / this.d; }
}

function gcd(a: number, b: number): number {
  while (b) { const t = b; b = a % b; a = t; }
  return a || 1;
}
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Balancea reacción: reactants -> products (arrays de fórmulas sin coef)
 * Retorna coeficientes enteros mínimos positivos [r1..rn, p1..pm] o null si no se puede
 */
export function balanceReaction(reactants: string[], products: string[]): number[] | null {
  const species = [...reactants, ...products];
  const n = species.length;
  const counts = species.map(parseFormula);
  const elements = Array.from(new Set(counts.flatMap((c) => Object.keys(c)))).sort();
  const m = elements.length;
  if (m === 0 || n === 0) return null;

  // Matriz A m x n: + para reactivos, - para productos
  const A: Frac[][] = elements.map((el) => {
    return species.map((_, j) => {
      const cnt = counts[j][el] || 0;
      const sign = j < reactants.length ? 1 : -1;
      return new Frac(cnt * sign, 1);
    });
  });

  // RREF para hallar espacio nulo: buscamos x tal que A x =0
  // Hacemos Gauss-Jordan sobre A (m x n) para encontrar pivotes
  const mat: Frac[][] = A.map((row) => row.map((c) => new Frac(c.n, c.d)));
  const where = new Array(n).fill(-1);
  let row = 0;
  for (let col = 0; col < n && row < m; col++) {
    // busca pivote
    let sel = -1;
    for (let i = row; i < m; i++) if (!mat[i][col].isZero()) { sel = i; break; }
    if (sel === -1) continue;
    [mat[sel], mat[row]] = [mat[row], mat[sel]];
    where[col] = row;
    // normaliza fila
    const div = mat[row][col];
    for (let j = col; j < n; j++) mat[row][j] = mat[row][j].div(div);
    // elimina columna en otras filas
    for (let i = 0; i < m; i++) if (i !== row && !mat[i][col].isZero()) {
      const factor = mat[i][col];
      for (let j = col; j < n; j++) mat[i][j] = mat[i][j].sub(factor.mul(mat[row][j]));
    }
    row++;
  }

  // Columnas libres = variables libres
  const freeCols: number[] = [];
  for (let i = 0; i < n; i++) if (where[i] === -1) freeCols.push(i);
  if (freeCols.length === 0) return null; // solo solución trivial

  // Tomamos 1 var libre =1, resto 0, y resolvemos pivotes: x[pivot] = - sum_{free} mat[row][free]*x[free]
  // Si hay >1 libre, ponemos la última en 1 y las demás 0 para obtener una solución base
  const x: Frac[] = Array(n).fill(null).map(() => new Frac(0, 1));
  const chosenFree = freeCols[freeCols.length - 1];
  x[chosenFree] = new Frac(1, 1);
  // Para cada col pivote, calcula valor
  for (let i = 0; i < n; i++) if (where[i] !== -1) {
    const r = where[i];
    let sum = new Frac(0, 1);
    for (const f of freeCols) sum = sum.add(mat[r][f].mul(x[f]));
    x[i] = sum.neg();
  }

  // Ahora x tiene una solución en fracciones (puede tener negativos, tomamos valor absoluto)
  // Hacemos todos positivos: si algún x es negativo, multiplica todo por -1
  if (x.some((v) => v.n < 0)) {
    for (let i = 0; i < n; i++) x[i] = x[i].neg();
  }
  // Si algún x es 0 o negativo, no es válida (deberían ser >0)
  if (x.some((v) => v.n <= 0)) {
    // intenta otra combinación de libres (pon todas libres en 1)
    // fallback: pon todas libres en 1
    for (const f of freeCols) x[f] = new Frac(1, 1);
    for (let i = 0; i < n; i++) if (where[i] !== -1) {
      const r = where[i];
      let sum = new Frac(0, 1);
      for (const f of freeCols) sum = sum.add(mat[r][f].mul(x[f]));
      x[i] = sum.neg();
    }
    if (x.some((v) => v.n < 0)) for (let i = 0; i < n; i++) x[i] = x[i].neg();
    if (x.some((v) => v.n <= 0)) return null;
  }

  // Escala a enteros: LCM de denominadores
  let L = 1;
  for (const v of x) L = lcm(L, v.d);
  let ints = x.map((v) => (v.n * L) / v.d);
  // Reduce por GCD
  let g = ints.reduce((a, b) => gcd(a, b));
  ints = ints.map((v) => v / g);
  // Verifica que balancea
  for (const el of elements) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      const cnt = counts[j][el] || 0;
      const sign = j < reactants.length ? 1 : -1;
      sum += cnt * ints[j] * sign;
    }
    if (sum !== 0) return null;
  }
  // Limita coeficientes razonables (≤100)
  if (ints.some((v) => v > 100 || v < 1)) return null;
  return ints;
}

// Helper para UI: intenta balancear y devuelve string
export function tryBalance(reactants: string[], products: string[]): { coef: number[]; equation: string } | null {
  const coef = balanceReaction(reactants, products);
  if (!coef) return null;
  const nR = reactants.length;
  const left = reactants.map((f, i) => `${coef[i] === 1 ? "" : coef[i]}${f}`).join(" + ");
  const right = products.map((f, i) => `${coef[nR + i] === 1 ? "" : coef[nR + i]}${f}`).join(" + ");
  return { coef, equation: `${left} → ${right}` };
}
