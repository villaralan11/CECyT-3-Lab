# Screenshots — 3 versiones CECyT 3 Lab

Historial visual limpio de las 3 iteraciones. Cada carpeta corresponde a un tag.

| Versión | Tag | Commit | Descripción | Foto |
|---------|-----|--------|-------------|------|
| **v1 — Azul original** | `v1-azul` | `412e729` | Landing azul con kickers 01-05, hero `Falla. Experimenta. Entiende.` | `v1-azul/hero.png` (875K) |
| **v2 — Linear-dark** | `v2-linear` | `bb6b9a9` | Hero editorial oscuro, explore bento, tokens neutros | `v2-linear/hero.png` (167K) |
| **v3 — Actual Fase 2** | `v3-actual` | `5a3c791` | Hero limpio (sin mancha central), stepper 01-03, Química 04-06 con falla→sim→ejemplo, 3D VSEPR, backend | `v3-actual/hero.png` + `iupac.png` + `balanceo.png` + `tiros.png` |

**Cómo ver cada versión:**
```bash
git checkout v1-azul  # v1
git checkout v2-linear # v2
git checkout v3-actual # v3 (igual que main 5a3c791)
git checkout main      # vuelve a actual
```

**Tamaño:** 6 PNGs, ~2.8M total. Todas las capturas anteriores temporales (audit-*, mpa-*, orig-*, v2-*, v3-*, v4-*) fueron movidas a `/tmp/backup-cecyt3-pngs` y ya no están en el repo (ver `.gitignore:58`).

**Generación:** `npx playwright screenshot http://localhost:3000 docs/screenshots/v3-actual/hero.png --full-page` con Playwright 1.63 + Chrome 153.
