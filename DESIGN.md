# DESIGN SYSTEM — CECyT 3 Lab
**v1.0 — 14/09/2026 — Fuente única de verdad visual**

> Si no está aquí, no lo uses. Un token por concepto.

### 1. Principios
- **Institucional pero joven:** IPN serio + gradientes vivos (no corporate aburrido, no IA genérica).
- **1 gradiente primario:** `from-fuchsia-500 to-pink-500` SOLO para CTAs primarios. Todo lo demás es neutro o `bgSoft`.
- **Legible primero:** Contraste WCAG AA, touch 44px, `focus-visible` siempre.

### 2. Tokens

| Token | Valor | Uso |
|-------|-------|-----|
| **bg** | `hsl(var(--background))` | Fondo app |
| **foreground** | `hsl(var(--foreground))` | Texto primario |
| **border** | `hsl(var(--border))` | Bordes sutiles |
| **primary gradient** | `from-fuchsia-500 to-pink-500` | Solo CTA primario |
| **Física** | `emerald: bg-emerald-50 / text-emerald-700 / border-emerald-200 / gradient from-emerald-400 to-teal-500` | Chips, cards Física |
| **Química** | `fuchsia: bg-fuchsia-50 / text-fuchsia-700 / border-fuchsia-200 / gradient from-fuchsia-500 to-rose-500` | Chips, cards Química |
| **Inglés** | `amber: bg-amber-50 / text-amber-700 / border-amber-200 / gradient from-amber-400 to-orange-500` | Chips, cards Inglés |
| **radius** | `16px (rounded-2xl)` cards, `9999px (rounded-full)` CTAs/pills | Consistencia |
| **shadow** | `shadow-lg shadow-fuchsia-500/25` solo CTAs primarios | No sombras decorativas |
| **tipografía** | `Geist Sans` (body), `Geist Mono` (código/fórmulas) | 1 familia por rol |

### 3. Componentes base
- **CTA primario:** `rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg px-6 py-3 text-sm font-semibold hover:scale-105`
- **CTA secundario:** `rounded-full bg-white border border-border text-foreground hover:bg-fuchsia-50/40`
- **Card:** `rounded-3xl border p-6 bg-white` + `hover:-translate-y-1 hover:shadow-xl`
- **Chip:** `rounded-full border px-2.5 py-0.5 text-xs font-medium` con `bgSoft + text + border` del subject
- **Touch target mínimo:** `h-11 w-11` (44px)

### 4. No-hacer (prohibido)
- No usar `SOLID` ni `accentDark` sin definir en `Subject`.
- No más de 2 gradientes por viewport.
- No texto `fuchsia-600` sobre `fuchsia-50` sin verificar contraste ≥4.5:1.
- No `hover:scale` en móvil (usar `active:scale`).

### 5. A11y Checklist por PR
- [ ] Contraste AA (Lighthouse ≥95)
- [ ] Navegación teclado (Tab, Enter, Esc)
- [ ] `alt` en imágenes, `aria-label` en icon buttons
- [ ] Canvas con descripción textual alternativa
