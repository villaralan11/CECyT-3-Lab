# Plan Fase 2 — CECyT 3 Lab (Go/No-Go)

**Decisión:** **Go** si O1 (+20% y p<0.05) + completitud ≥60% + NPS ≥7. Ver `docs/informe-piloto.md:1`.

### Alcance Fase 2 (8 semanas, 1 persona, 10-12h/semana)

**Sprint 5 (2 semanas) — Backend**
- Supabase Auth (email + OAuth), tabla `progress` (user_id, topic, score, attempts), migración `localStorage → Postgres`
- Roles: `alumno` (ve su progreso), `profesor` (ve grupo anonimizado), `admin`
- Costo: Supabase Free (500MB, 50k MAU) $0

**Sprint 6 (2 semanas) — Solvers**
- Balanceo dinámico: parser fórmula → matriz estequiométrica → Gauss-Jordan nullspace → coeficientes enteros mínimos
- Estequiometría: solver genérico para cualquier reacción balanceada
- Tests: 20 reacciones nuevas

**Sprint 7 (2 semanas) — 3D + Escritura libre**
- Visor VSEPR con `3Dmol.js` o `Three.js` (moléculas orgánicas)
- Inglés escritura libre: `nlp.ts` + prompt LLM local (opcional) para feedback explicativo

**Sprint 8 (2 semanas) — Física + Inglés + Piloto 2**
- Física 01-03 con `FIXED_DT` + toggle aire ya hecho, añadir validación con profesor Física
- Inglés 07-10 con escritura libre + tolerancia
- Piloto 2 con 30 alumnos (Física o Inglés) y mismo análisis `scripts/analisis-piloto.py:1`

### Estimación
- **Tiempo:** 8 semanas × 10h = 80h
- **Costo:** $0 (Vercel Hobby + Supabase Free + GitHub)
- **Riesgos:** R1 mitigado por backend, R2 (no grupo) mitigado por adelantar carta sponsor en Sprint 5

### Criterios Fase 2
- Coverage ≥75%, A11y 95, LCP <2.5s en 3G
- Piloto 2 con +15% mínimo (más exigente al ser 2ª iteración)

### No-Go (si O1 no se cumple)
- Documentar en `docs/lecciones.md:1`, archivar tag `fase1-2026-12` y pivotar a 1 tema profundo con grupo control.
