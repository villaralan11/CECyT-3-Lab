# WBS — Work Breakdown Structure — CECyT 3 Lab
**EDT v1.0 — 14/09/2026 — Fase 1 enfocada en Química**

> WBS 100% rule: Todo lo que está aquí es todo el trabajo. Si no está aquí, no se hace en Fase 1.

```
1. CECyT 3 Lab — Fase 1 (Química validada)
├── 1.1 Dirección del Proyecto (PM)
│   ├── 1.1.1 Charter, WBS, Roadmap
│   ├── 1.1.2 Gestión de stakeholders (Sponsor + 2 profesores)
│   ├── 1.1.3 Control de cambios y riesgos (R1-R5)
│   └── 1.1.4 Retrospectivas y actas
├── 1.2 Fundamento Pedagógico y Curricular
│   ├── 1.2.1 Marco teórico Productive Failure + Worked Examples (15 refs APA)
│   ├── 1.2.2 Mapeo DEMS Química (04-06) → docs/cobertura-curricular.md
│   └── 1.2.3 Validación experta (2 profesores firman bancos)
├── 1.3 Plataforma Web (Next.js 16)
│   ├── 1.3.1 Arquitectura y Design System
│   │   ├── 1.3.1.1 Tokens (color, radius 16px, shadow) → DESIGN.md
│   │   ├── 1.3.1.2 Layout, Nav, Progreso (localStorage)
│   │   └── 1.3.1.3 Responsive + A11y (WCAG AA, 44px touch)
│   ├── 1.3.2 Simuladores Química
│   │   ├── 1.3.2.1 IUPAC (24 compuestos, benceno overlay)
│   │   ├── 1.3.2.2 Balanceo (8 reacciones, conteo vivo, beam overlay)
│   │   └── 1.3.2.3 Estequiometría (moles, reactivo limitante, flask overlay)
│   ├── 1.3.3 Secuencia Didáctica por Tema
│   │   ├── 1.3.3.1 Falla productiva (pregunta generativa)
│   │   ├── 1.3.3.2 Simulador interactivo
│   │   └── 1.3.3.3 Ejemplo resuelto con auto-explicación (Renkl)
│   └── 1.3.4 Instrumentación
│       ├── 1.3.4.1 Pre/Post-test (8 preguntas x 3 temas = 24 ítems)
│       ├── 1.3.4.2 Logging local + export JSON
│       └── 1.3.4.3 Dashboard /progreso + /retos
├── 1.4 Calidad y DevOps
│   ├── 1.4.1 Vitest + coverage ≥70% (sim-banks, store, gramática)
│   ├── 1.4.2 CI GitHub Actions (lint + tsc + test + build)
│   ├── 1.4.3 Deploy Vercel (prod + preview, standalone condicional)
│   └── 1.4.4 Lighthouse CI ≥95 (A11y + Perf)
├── 1.5 Piloto y Validación
│   ├── 1.5.1 Preparación (carta consentimiento, pre-test impreso/digital)
│   ├── 1.5.2 Ejecución (2 semanas, 30 alumnos, soporte)
│   ├── 1.5.3 Recolección (Excel pre/post + NPS + logs)
│   └── 1.5.4 Análisis (t-test, d de Cohen, reporte 5 páginas)
└── 1.6 Cierre Fase 1
    ├── 1.6.1 Informe piloto + Lecciones aprendidas
    ├── 1.6.2 Demo a Sponsor (Go/No-Go Fase 2)
    └── 1.6.3 Plan Fase 2 (Supabase Auth + Física/Inglés)
```

---

### Diccionario WBS (extracto crítico — lo que NO puedes saltarte)

| Paquete | Descripción | Entregable | DoD |
|---------|-------------|------------|-----|
| **1.2.1** | Marco teórico | `docs/pedagogia.md` | 15 refs APA, tabla comparativa, justificación Productive Failure |
| **1.3.2.1-3** | Simuladores | `src/components/simulators/*` | 20 casos verificados vs fuente (IUPAC 2024, balanceo RH), sin “Próximamente” |
| **1.3.3** | Secuencia | Por tema | Cada tema 04-06 tiene falla + sim + ejemplo con auto-explicación interactiva |
| **1.4.1** | Tests | `*.test.ts` | Coverage ≥70%, 0 tests skipped |
| **1.5.4** | Análisis | `docs/informe-piloto.md` | p-valor, mejora %, NPS, 3 recomendaciones priorizadas |

---

### Reglas de Control

1. **Sin WBS no hay sprint.** Todo ticket en GitHub Projects debe tener etiqueta `WBS: x.y.z`.
2. **Cambio de alcance:** Si pides agregar Física 01 a Fase 1, abres Issue `Control de Cambios` y Sponsor aprueba.
3. **Trazabilidad:** Cada tema 04-06 en `src/data/cecyt-data.ts` debe tener `trace: {programa, fuente}` que apunte a `docs/cobertura-curricular.md`.

### Exclusiones explícitas (NO es trabajo Fase 1)
- Auth, DB, roles, calificaciones oficiales, SAES, app nativa.

> **Si no puedes descomponer tu trabajo en paquetes ≤16h, no puedes estimar ni entregar.**
