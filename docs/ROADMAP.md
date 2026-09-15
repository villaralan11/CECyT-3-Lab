# ROADMAP — CECyT 3 Lab — Fase 1
**14/09/2026 → 20/12/2026 — 4 Sprints · 1 persona · 10-12h/semana**

> Roadmap no es wishlist. Es compromiso con fechas y DoD verificable.

### Visión Fase 1
**Química validada y defendible.** No “toda la plataforma”. Solo 3 temas de Química con evidencia de aprendizaje. Todo lo demás es Fase 2.

---

### Sprint 0 — Cimientos (14/09 — 30/09) — **EN CURSO**
**Objetivo:** Proyecto gobernable y calidad restaurada

| Tarea | WBS | DoD |
|-------|-----|-----|
| Charter firmado (borrador) | 1.1.1 | `PROJECT_CHARTER.md` v1.0 en `main` |
| WBS + Roadmap | 1.1.1 | `docs/WBS.md` + `docs/ROADMAP.md` en `main` |
| Restaurar QA | 1.4.1/1.4.2 | `vitest.config.ts` + `vitest` ≥70% + `.github/workflows/ci.yml` verde |
| Design tokens base | 1.3.1.1 | `DESIGN.md` con colores, radius, sombras, tipografía |
| Validar Sponsor + 1 profesor | 1.1.2 | Email/compromiso escrito |

**Entregable Sprint 0:** Repo con Charter+WBS+Roadmap + CI verde. **Sin esto no avanzas.**

---

### Sprint 1 — Química Core (01/10 — 31/10) — **EL SPRINT QUE IMPORTA**
**Objetivo:** 3 temas Química completos y validados por expertos

| Semana | Foco | Entregable |
|--------|------|------------|
| W1 (01-07/10) | IUPAC 04: 24 compuestos + falla + ejemplo + tests | PR #1 mergeado, 2 profesores aprueban |
| W2 (08-14/10) | Balanceo 05: 8 reacciones + conteo vivo + beam | PR #2, casos verificados RH 2024 |
| W3 (15-21/10) | Estequiometría 06: moles + limitante + flask | PR #3, cálculos con 10 casos reales |
| W4 (22-31/10) | Pulido: A11y 95, pre/post-test 24 ítems, logging | M2: Demo a validadores, firma |

**DoD Sprint 1 (M2):**
- 0 “Próximamente” en `/quimica/*`
- Lighthouse Accessibility ≥95, `vitest` ≥70%
- 2 profesores firman `docs/validacion-quimica.md` (checklist de 20 casos)
- Pre/Post-test con clave y trazabilidad DEMS

**Riesgo crítico:** R2/R3 (no validación). Mitigación: agenda fija martes 18:00 con profesores.

---

### Sprint 2 — Piloto Ready (01/11 — 15/11)
**Objetivo:** Plataforma lista para 30 alumnos reales

| Tarea | WBS | DoD |
|-------|-----|-----|
| Landing onboarding + CTA diagnóstico | 1.3.1.2 | Hero con stepper “1 Elige → 2 Falla → 3 Simula”, test con 3 usuarios móvil |
| Instrumentación piloto | 1.3.4 | Export JSON progreso + consentimiento + guía profesor 1 página |
| Perf + A11y | 1.4.4 | LCP <2.5s, teclado 100% navegable, lector de pantalla en simuladores |
| Ensayo interno | 1.5.1 | 5 alumnos beta completan 1 tema sin ayuda, feedback incorporado |

**Entregable:** `M3 Ready`: URL prod + guía + pre-test listo para imprimir/enviar.

---

### Sprint 3 — Piloto y Evidencia (16/11 — 15/12)
**Objetivo:** Datos que te permitan defender el proyecto

| Semana | Actividad |
|--------|-----------|
| 16-22/11 | Lanzamiento: pre-test + acceso, soporte WhatsApp |
| 23-30/11 | 2 semanas de uso, recordatorio, logs diarios |
| 01-07/12 | Post-test + NPS + entrevistas 3 alumnos |
| 08-15/12 | Análisis: t-test pareado, Cohen d, gráficos, informe |

**DoD Sprint 3 (M4):**
- `docs/informe-piloto.md` (5 páginas): N, mejora %, p-valor, NPS, 3 lecciones
- Excel `data/piloto-2026-2.xlsx` (anonimizado) con pre/post
- Si mejora <20% → informe explica por qué y propone ajuste (no se maquilla)

---

### Sprint 4 — Cierre y Go/No-Go (16/12 — 20/12)
**Objetivo:** Decidir Fase 2 con evidencia

| Tarea | DoD |
|-------|-----|
| Demo a Sponsor (20 min) | Slides 10 + demo vivo + informe |
| Lecciones aprendidas | `docs/lecciones.md` (qué salió bien/mal) |
| Plan Fase 2 (si Go) | Auth Supabase + Física/Inglés, estimado 8 semanas, presupuesto |
| Archivo y tag | `git tag fase1-2026-12` + backup |

**Decisión Go/No-Go Fase 2:**
- **Go** si M4 cumple criterios de éxito (O1+O5) y Sponsor aprueba presupuesto tiempo.
- **No-Go** si no hay evidencia → documentar y pivotar.

---

### Kanban Sugerido (GitHub Projects)

| Columna | WIP |
|---------|-----|
| Backlog (WBS) | — |
| Sprint Backlog | ≤6 issues |
| En curso | ≤2 |
| En revisión (profesor) | ≤2 |
| Hecho (DoD cumplido) | — |

**Regla de oro:** No empiezas Sprint 1 sin M0 firmado. No empiezas piloto sin M2 firmado por 2 profesores.

### Métricas Semanales (tablero)
- **Velocity:** issues cerrados / semana
- **Coverage:** % vitest
- **Lighthouse:** A11y + Perf
- **Riesgos:** R1-R5 semáforo (verde/amarillo/rojo)

---

**Próxima acción tuya (24h):** Enviar Charter v1.0 a Sponsor y conseguir 1ra reunión de validación 30/09. Sin eso, este Roadmap es ficción.
