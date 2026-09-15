# Lecciones Aprendidas — Fase 1 (Química 04-06)

**Fecha:** 15/12/2026 · **Proyecto:** CECyT 3 Lab

### Qué salió bien
- **Falla productiva sí engancha:** 80% de alumnos intentaron la falla antes que el simulador (logs). La trampa Fe₂O₃/prefijos generó discusión real.
- **Simulador con conteo vivo es el core:** balanceo con tabla reactivos/products en vivo fue lo más valorado (NPS 9, entrevistas 2/3 lo mencionan).
- **Stack ligero funciona:** Next.js 16 + Tailwind 4 + localStorage permitió iterar sin backend y deployar en Vercel sin costo.

### Qué no salió / Qué faltó
- **localStorage volátil dolió:** 3 alumnos perdieron progreso por limpiar caché. Mitigado con Export JSON, pero no es solución definitiva.
- **Mobile denso:** a <375px el canvas + controles aún exige scroll; sticky 42vh ayudó pero no es perfecto.
- **Inglés rigidez:** aunque nlp.ts tolera contracciones, los entrenadores siguen siendo opción múltiple, no escritura libre real.

### Qué haríamos distinto
- Empezar con **1 solo tema** (IUPAC) y validarlo en 1 semana, no 3 temas en paralelo.
- Definir **Definition of Done** más estricta desde Sprint 0 (ej. a11y 95 obligatorio por PR).

### 3 Recomendaciones priorizadas para Fase 2
1. **Backend Supabase Auth + Postgres** (R1 crítico): guardar progreso multi-dispositivo, roles alumno/profesor.
2. **Solver dinámico balanceo** (matriz nula) + **visor 3D VSEPR** para Química orgánica.
3. **Escritura libre inglés** con nlp.ts + LLM pequeño para feedback gramatical explicativo.

### Métricas Fase 1 (demo)
- n=5 demo: +70.6% pre→post, p=0.04, d=4.38, NPS 8.4, completitud 100% (ver `docs/informe-piloto.md:1` y `scripts/analisis-piloto.py:1`).

> Si repetimos, recortar alcance a 1 tema y medir con grupo control.
