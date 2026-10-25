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

---

## v1.1 — Capa «módulos» (25/10/2026)

> Inspiración: patrones de módulos de apple.com **medidos** con un espejo REA local (estudio privado). Implementación, código y geometría propios; contenido y marca 100% CECyT 3 Lab. No se copian textos ni assets de terceros.

### Tokens nuevos (globals.css)
| Clase | Valor | Uso |
|-------|-------|-----|
| `.module-col` | max-width 1044px (980 útiles), márgenes auto, gutters 22/32px | Contenedor de módulos |
| `.type-hero` | clamp(44→80px), w600, tracking -0.02em, lh 1.05 | H1 |
| `.type-h2` | clamp(32→44px), w600, -0.015em | Encabezado de sección |
| `.type-h3` | clamp(24→28px), w600 | Título de tile |
| `.type-sub` | clamp(18→21px), lh 1.4 | Subhead |
| `.type-body` | 17px, lh 1.47 | Cuerpo |
| `.eyebrow` | 13px w600, uppercase, +0.08em, muted | Antetítulo |
| `.module-tile` | radius 28px + overflow hidden | Tile de módulo |
| `.module-blur` | saturate(1.8) + blur(20px) | Nav translúcida |

### Componentes (`src/components/site/modules.tsx`)
- `FadeIn` — reveal fade + rise, respeta `useReducedMotion` y rescate `scripting: none`.
- `ModuleGrid` — 2 columnas, gap 12/16px.
- `ModuleTile` — full (span 2) | half · plain | dark; anatomía: eyebrow → título → sub → contenido → chevron-link.
- `ModuleHeader`, `CtaPrimary`, `CtaGhost`, `ChevronLink`.

### Reglas v1.1
- Tile de módulo: fondo NEUTRO (`bg-card`); el gradiente se queda SOLO en el CTA primario y en el H1 (v1.0 intacta).
- Jerarquía por tamaño y peso: títulos w600 con tracking apretado, subheads en `text-muted-foreground` — nunca colores de subject en texto largo.
- Enlaces secundarios tipo chevron (`›`), no botones rellenos.
- Ritmo de sección: `py-24 sm:py-28` en módulos de introducción.

---

## v1.2 — Capa «app» (referencia HIG oficial) (25/10/2026)

> Fuente: Human Interface Guidelines — Typography (sección Specifications, tabla Dynamic Type default) y los kits oficiales publicados en la comunidad de Figma **bajo la cuenta de Apple** (verificar insignia azul; enlazados desde developer.apple.com/design/resources/). Todo se usa como referencia de medición: assets, glifos y código de terceros no entran al proyecto.

### Cuándo se usa
- **Landing / páginas de marketing** → v1.0 + v1.1 (módulos).
- **Páginas tipo app** (`/fisica/*` simuladores, `/quimica/*`, `/ingles/*`, `/progreso`) → esta capa: escala de texto de sistema, jerarquía compacta, superficies translúcidas con blur.

### Mapeo de estilos de texto (HIG Dynamic Type default → web)
| Estilo iOS | pt / leading | Clase web | Nota |
|---|---|---|---|
| Large Title | 34 / 41 | `.app-large` | Título de página en la app; peso 600; tracking apretado |
| Title 1 | 28 / 34 | `.app-title1` | Secciones grandes |
| Title 2 | 22 / 28 | `.app-title2` | Encabezados de módulo |
| Title 3 | 20 / 25 | `.app-title3` | Subsecciones |
| Headline | 17 / 22 | `.app-headline` | Peso 600 (semibold) — énfasis |
| Body | 17 / 22 | `.app-body` | Texto base de la vista |
| Callout | 16 / 21 | `.app-callout` | Enlaces destacados / ayuda |
| Subhead | 15 / 20 | `.app-subhead` | Texto secundario |
| Footnote | 13 / 18 | `.app-footnote` | Notas legales / TOU |
| Caption 1/2 | 12·11 / 16·13 | `.app-caption` | Etiquetas pequeñas |

Mínimo legible iOS: 11 pt (Caption 2, default) — en web nunca < 12px en UI activa.

### Materiales (semántica, no copia)
- Superficies `glass`: fondo translúcido + `backdrop-filter: saturate(1.8) blur(20px)` (ya tokenizado como `.module-blur`) + hairline `border-border/60`. Conserva únicamente la paleta propia (fuchsia/emerald/amber); nada de identidad visual de marcas ajenas.

### Reglas v1.2
- Los kits oficiales de Apple son para diseñar **sus** plataformas: aquí funcionan como **referencia de medición** (escala, jerarquía, materiales) — no se copian archivos .fig, glifos SF Symbols, bezels ni textos.
- La identidad visual SIEMPRE es CECyT 3 Lab (v1.0: fuchsia/emerald/amber + Geist).
- La migración a la capa app se aplicará gradualmente, empezando por los simuladores.
- **Estado (25/10):** escala de texto `.app-*` + material `.app-glass` implementados en `globals.css`; aplicados a los componentes compartidos de simuladores (`SimHeader`, `Readout`, `Slider`, `Graph`, `Insight`, `PlayControls`) y al simulador MRU (targets 44pt incluidos). Siguientes: mruv, los 3 tiros, química (IUPAC, balanceo, estequiometría) e inglés.
