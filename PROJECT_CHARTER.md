# PROJECT CHARTER — CECyT 3 Lab
**Acta de Constitución del Proyecto**

| Campo | Detalle |
|-------|---------|
| **Proyecto** | CECyT 3 Lab — Laboratorio Virtual (Física · Química · Inglés) |
| **Institución** | CECyT No. 3 “Estanislao Ramírez Ruiz” — IPN |
| **Versión** | 1.0 — 14/09/2026 |
| **Autor / Product Owner** | Alan Villar — Estudiante / PM |
| **Sponsor** | Dirección Académica CECyT 3 (por confirmar firma) |
| **Metodología** | Híbrida Predictiva-Ágil · Sprints 2 semanas · PMBOK 7ª ed. |
| **Repositorio** | `github.com/villaralan11/CECyT-3-Lab` · Prod `cecyt3-lab.vercel.app` |

---

### 1. Propósito y Justificación

**Problema:** Reprobación y aprendizaje memorístico en materias base del tronco común (Física-Química-Inglés) en CECyT 3. Sin evidencia diagnóstica local, pero alineado a indicadores nacionales de educación media superior (abandono >9% EMS, SEP 2023). Los alumnos no tienen laboratorio virtual accesible 24/7 con retroalimentación inmediata.

**Oportunidad:** Aplicar **Falla Productiva (Kapur, 2008)** + simuladores interactivos + ejemplos resueltos con auto-explicación (Renkl) para que el alumno **falle primero, experimente y luego entienda**, en lugar de memorizar.

**Beneficio esperado:** Mejora medible en comprensión conceptual y retención, reducción de reprobación en temas críticos, y base escalable para todo el plan DEMS.

> **Si no puedes probar el problema con datos del CECyT 3, no tienes proyecto académico. Tienes un prototipo bonito.**

---

### 2. Objetivos SMART

| ID | Objetivo SMART | Métrica | Fecha límite |
|----|---------------|---------|--------------|
| **O1** | **Validar eficacia Fase 1 (Química)** con 1 grupo piloto | Pre/Post-test N≥30, **mejora promedio ≥20%** en Nomenclatura + Estequiometría | **15/12/2026** |
| **O2** | **Completitud funcional Fase 1** | 3 temas Química (04-06) con secuencia completa falla→sim→ejemplo, **0 “Próximamente”** | **31/10/2026** |
| **O3** | **Experiencia usable** | **Lighthouse Accessibility ≥95**, `p95 LCP <2.5s` móvil, test con 5 usuarios sin bloqueo | **15/11/2026** |
| **O4** | **Calidad ingenieril** | `vitest` coverage **≥70%** en `sim-banks`/`store`, CI verde en `main` | **30/10/2026** |
| **O5** | **Adopción** | **≥60%** del grupo piloto completa ≥2 temas y deja feedback (NPS ≥7) | **15/12/2026** |

**No-SMART = No gestionable.** “Mejorar el diseño” no cuenta.

---

### 3. Alcance

#### 3.1 IN — Fase 1 (lo que SÍ se entrega)
- **Temas 04, 05, 06 Química:** Nomenclatura IUPAC (24 compuestos), Balanceo (8 reacciones, steppers + conteo vivo), Estequiometría (reactivo limitante, masas molares reales).
- **Secuencia didáctica completa por tema:** Falla productiva (pregunta generativa) → Simulador Canvas interactivo → Ejemplo resuelto paso a paso con auto-explicación.
- **Plataforma web:** Next.js 16, responsive móvil, progreso `localStorage` (temporal Fase 1), modo offline básico.
- **Instrumentación:** Pre/Post-test por tema (8 preguntas), logging local de intentos, dashboard progreso `/progreso`.

#### 3.2 OUT — Fase 1 (explícitamente excluido)
- **Backend persistente, Auth, roles profesor/alumno, base de datos multi-dispositivo** → Fase 2.
- **Temas Física 01-03 e Inglés 07-10** → se mantienen funcionales pero **no se validan** en piloto Fase 1.
- **App nativa móvil, integración con SAES/SIAC, calificaciones oficiales.**

> **Cualquier “¿y si agregamos…?” fuera de IN requiere Control de Cambios firmado.**

#### 3.3 Entregables

| Entregable | Criterio de Aceptación (DoD) |
|------------|------------------------------|
| E1 — Plataforma Fase 1 deployada | `cecyt3-lab.vercel.app` 200 OK, 0 rutas `Próximamente`, Lighthouse ≥95 |
| E2 — Simuladores Química validados | Cálculos verificados contra 20 casos reales (IUPAC/Balanceo RH 2024), tests verdes |
| E3 — Paquete didáctico | `docs/pedagogia.md` + `docs/cobertura-curricular.md` con trazabilidad DEMS + 15 refs APA |
| E4 — Piloto + Informe | Excel pre/post N≥30 + informe 5 páginas con análisis estadístico (t-test) |
| E5 — Repo con calidad | CI verde, coverage ≥70%, `PROJECT_CHARTER.md` + `ROADMAP.md` + `WBS.md` actualizados |

---

### 4. Stakeholders (Registro resumido)

| Stakeholder | Rol | Interés / Poder | Estrategia |
|-------------|-----|----------------|------------|
| **Dirección Académica CECyT 3** | Sponsor | Alto/Alto | **Mantener satisfecho:** Informe mensual + firma de hitos |
| **Profesores Química (2)** | Validador experto | Alto/Medio | **Gestionar de cerca:** Co-diseño de bancos, validación de simuladores |
| **Alumnos 2do semestre (N=35)** | Usuario final | Alto/Bajo | **Mantener informados:** Piloto, encuestas, NPS |
| **Academia de Física/Inglés** | Consultivo | Medio/Bajo | Informar Fase 1, involucrar Fase 2 |
| **Alan Villar** | PO / Dev / PM | — | Ejecuta y rinde cuentas |
| **Vercel/GitHub** | Proveedor | Bajo/Bajo | Monitorear costos/límites |

> **Sin firma del Sponsor y sin 2 profesores validadores, no hay piloto.**

---

### 5. Hitos (Milestones)

| Hito | Fecha | Criterio |
|------|-------|----------|
| M0 — Charter firmado | 20/09/2026 | Sponsor firma este documento |
| M1 — WBS + Roadmap + CI verde | 30/09/2026 | `docs/WBS.md`, `docs/ROADMAP.md`, `vitest` ≥70% |
| M2 — Química Fase 1 completa | 31/10/2026 | E1+E2+E3 aceptados por profesores |
| M3 — Piloto lanzado | 15/11/2026 | 30 alumnos con pre-test + acceso |
| M4 — Informe piloto | 15/12/2026 | E4 con mejora ≥20% y NPS ≥7 |
| M5 — Retrospectiva y Go/No-Go Fase 2 | 20/12/2026 | Decisión Backend + Auth |

---

### 6. Supuestos y Restricciones

**Supuestos:**
1. Se obtiene acceso a 1 grupo de Química (35 alumnos) en semestre 2026-2.
2. 2 profesores validan contenido en ≤5 días hábiles por entrega.
3. Vercel Hobby + GitHub público cubren hosting Fase 1 sin costo.

**Restricciones:**
- **Tiempo:** 1 persona, 10-12h/semana. No hay equipo.
- **Presupuesto:** $0 MXN Fase 1 (solo tiempo y hosting gratuito).
- **Técnica:** Sin backend Fase 1 → progreso solo `localStorage` (pérdida si borra caché, **riesgo aceptado y comunicado**).
- **Académica:** Entrega debe cumplir lineamientos IPN/DEMS y citar en APA 7.

---

### 7. Riesgos Iniciales (Top 5) — Matriz Prob x Impacto

| # | Riesgo | P | I | Exposición | Respuesta |
|---|--------|---|---|------------|-----------|
| **R1** | **Pérdida de progreso por `localStorage`** | A | A | **Crítico** | Mitigar: aviso explícito + export JSON + Fase 2 Supabase Auth planificado |
| **R2** | No se consigue grupo piloto | M | A | Alto | Mitigar: carta formal a Sponsor en M0 + plan B: piloto con ex-alumnos |
| **R3** | Profesores no validan a tiempo | A | M | Alto | Mitigar: agenda quincenal + bancos con trazabilidad DEMS para revisión rápida |
| **R4** | Scope creep (“agreguemos Física también”) | A | M | Alto | Evitar: Control de Cambios + Fase 1 congelada en Química |
| **R5** | Deploy falla / Vercel límites | B | M | Medio | Mitigar: CI + `next.config.ts` condicional + backup `backup-azul-412e729` |

---

### 8. Criterios de Éxito del Proyecto (para cerrar Fase 1)

El proyecto se declara **exitoso** si y solo si:
1. O1 ≥20% mejora pre/post con p<0.05 (t-test) **y** O5 ≥60% completitud.
2. 0 bugs críticos en piloto, Lighthouse ≥95, CI verde.
3. Informe aceptado por 2 profesores + Sponsor firma M4.

Si no se cumple 1, el proyecto es **no exitoso pero aprendido** → se documenta en lecciones aprendidas y se decide Fase 2.

---

### 9. Organización y Gobierno

- **Product Owner / PM / Dev:** Alan Villar — decide backlog, ejecuta, reporta.
- **Sponsor:** Dirección Académica — aprueba Charter, M2 y M4, provee acceso a grupo.
- **Comité validador:** 2 profesores Química — aprueban contenido didáctico.
- **Reuniones:** Quincenal 30min con validadores + Mensual con Sponsor (acta en `docs/actas/`).

### 10. Aprobación

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Sponsor | _________________________ | __________ | ____/____/2026 |
| PO/PM | Alan Villar | __________ | 14/09/2026 |
| Validador 1 | _________________________ | __________ | ____/____/2026 |

> **Sin estas firmas, el proyecto no tiene autoridad para consumir tiempo institucional ni para probar con alumnos.**

---

**Próximo paso inmediato:** Validar este Charter con tu Sponsor en 5 días y pasar a `docs/WBS.md` + `docs/ROADMAP.md`. Sin eso, todo lo demás es decoración.
