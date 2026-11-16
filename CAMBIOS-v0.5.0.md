# CECyT 3 Lab — Registro de cambios v0.5.0

Fecha: 2026-11-16 · Base: `CECyT-3-Lab-v0.4.2-notebook-ia-optimizado.zip` (fuente de verdad,
integridad verificada con `unzip -t`, 219 archivos, sin errores de CRC).

## 1. Errores corregidos

| # | Problema | Causa raíz | Corrección |
|---|---|---|---|
| 1 | `globals.css` truncado: 11 líneas, solo estilos del Notebook. La portada, navbar y pie carecían de CSS (sin import de Tailwind, sin tokens, sin clases `lab-*`) | El empaquetado v0.4.2 capturó una versión incompleta del archivo | Reconstrucción completa del sistema de diseño (tokens Paper/Ink/Guinda, tipografía Geist, utilidades `shine`/`blob-float`/`grid-pattern`/`dots-pattern`/`animated-gradient`/`scrollbar-thin`, navbar, pie, portada, héroes compartidos, notebook, modo embed) respetando el JSX existente y `docs/diseno/SISTEMA-VISUAL-0.4.md` |
| 2 | Sin modo claro/oscuro en el sitio (solo los simuladores HTML lo tenían) | El CSS del tema se perdió con el truncado | Tokens duplicados bajo `.dark`, script anti-destello en `<head>`, persistencia en `localStorage`, componente `ThemeToggle` en la barra |
| 3 | Superficies fijadas a blanco (`bg-white`, `via-white`, `to-white`) impedían el modo oscuro | Estilos duros de la etapa anterior | Sustitución por tokens (`bg-card`, `via-card`, `to-card`): 136 apariciones en 17 archivos (108 `bg-white` + 28 extremos de degradado); `text-white` sobre degradados saturados se conservó |
| 4 | Bordes `black/[0.05–0.08]` invisibles en grafito | Ídem | Override bajo `.dark` en `globals.css` |
| 5 | El acento de la navegación era magenta genérico | Deriva de la v0.4.2 | Unificado al guinda institucional `#6C1D45` (CTA, indicador activo, enlaces) |
| 6 | ESLint: error `react-hooks/set-state-in-effect` en el nuevo `theme-toggle.tsx` | `setState` síncrono en efecto | Lectura del tema solo tras montar con justificación (mismo patrón que `use-progress.ts` y `fisica/page.tsx`) |
| 7 | Riesgo de destello de tema al cargar | Clase `.dark` aplicada tarde | Script pre-pintado en `layout.tsx` junto al script embed existente |
| 8 | En modo embed los héroes interiores quedaban 66 px recortados (compensan la navbar oculta) | Margen negativo `-mt-[4.125rem]` fijo | Regla `html.embed` que neutraliza el margen |
| 9 | `@keyframes transferred-float` referenciaba un nombre inexistente en el CSS del notebook (la animación del orbe no corría) | Herencia del CSS truncado | Renombrada a `notebook-float` y aplicada |
| 10 | En la portada la imagen quedaba arriba y el texto abajo, como bloques separados (observación del usuario) | El hero replicaba literalmente la composición apilada heredada de la v0.4.2 | Hero unificado: la fotografía es el fondo de todo el bloque y el texto se apoya sobre ella; velos de legibilidad con `color-mix` sobre los tokens (lateral izquierdo + fundido inferior), funcionando en claro y oscuro; en móvil se refuerza el velo y se reencuadra la foto |

## 2. Archivos modificados / añadidos

- `src/app/globals.css` — reconstruido (≈900 líneas).
- `src/app/layout.tsx` — script de tema pre-pintado.
- `src/components/site/navbar.tsx` — integración del conmutador de tema.
- `src/components/site/theme-toggle.tsx` — **nuevo**.
- `package.json` — versión 0.4.2 → 0.5.0.
- `docs/diseno/REDISENO-0.5.0.md` — **nuevo** (sistema de diseño).
- `CAMBIOS-v0.5.0.md` — **nuevo** (este documento).
- `README.md` — notas de versión.
- Sustitución de utilidades en 17 archivos `.tsx` (bg/via/to white → card): portada, `sim-card`,
  `ui`, páginas de materia, laboratorios, retos, progreso, lecciones, toast.

Sin cambios de lógica: simuladores, retos, progreso (localStorage + API 501-fallback),
Notebook IA, rutas y redirecciones de `next.config.ts` quedaron intactos.

## 3. Optimización aplicada

- Las imágenes optimizadas del ZIP **no se recomprimieron** (instrucción del proyecto).
- CSS único basado en tokens: se eliminó la duplicación potencial entre temas al reutilizar la
  paleta de Tailwind vía variables en lugar de hojas alternativas.
- Los simuladores pesados cargan solo al expandir su tarjeta (iframe diferido, ya existente).
- `public/` conserva los 28 archivos originales; los no referenciados
  (`cecyt3-logo-full-optimized.*`, `cecyt3-logo-small.png`, `cecyt3-logo.jpg`, `social-preview.svg`)
  se listan como pendiente de limpieza para no arriesgar referencias futuras (p. ej. OG/GitHub).

## 4. Pendientes (etapa posterior, fuera de alcance por instrucción)

1. Conexión a Supabase y migración de `prisma/schema.prisma` (SQLite → PostgreSQL).
2. Configuración de Vercel y variables (`DATABASE_URL`, `NVIDIA_API_KEY`, `NEXT_PUBLIC_SITE_URL`).
3. Sustituir el fallback 501 de `/api/progress` por persistencia real.
4. Limpieza de assets no referenciados y de la dependencia `tailwindcss-animate` (no usada por
   Tailwind 4; `tw-animate-css` es la activa).
5. Convertir el hero de portada de `background-image` CSS a `next/image` si se desea prioridad
   de carga en LCP (requiere reestructurar el bloque hero).
6. Pruebas E2E automatizadas (Playwright) sobre los flujos retos/progreso.

## 5. Resultado de las pruebas (ejecutadas realmente)

| Prueba | Comando | Resultado |
|---|---|---|
| Integridad del ZIP | `unzip -t` | OK, 219 archivos, sin errores |
| Instalación | `npm install` | OK (incluye `prisma generate`) |
| TypeScript | `npx tsc --noEmit` | 0 errores |
| ESLint | `npm run lint` | 0 problemas |
| Pruebas unitarias | `npm test` (vitest) | 55/55 en 3 suites (balance, nlp, utils) |
| Build de producción | `npm run build` | OK — 19 rutas (17 estáticas + 2 API) |
| Servidor de producción | `npm start` | Listo en 127 ms |
| Rutas de página (12) | curl | Todas 200 |
| Lecciones de Química (3) e Inglés (4) | curl | Todas 200 |
| Simuladores HTML (11 + índice) | curl | Todos 200 |
| Assets críticos | curl | `hero-lab.jpg`, `cecyt3-logo.png` → 200 |
| API progreso sin BD | curl `/api/progress?userId=test` | 501 con `fallback: true` (comportamiento diseñado: el cliente usa localStorage) |
| Simulador embebido | navegador (iframe MRU/MRUV `?embed=1`) | Carga y controles operativos |
| Notebook IA sin API key | `POST /api/notebook` | 503 con mensaje claro (requiere `NVIDIA_API_KEY`; no se solicitaron credenciales por instrucción) |
| Responsive | capturas 1440 / 1024 / 768 / 390 px | Sin desbordamientos; menú móvil operativo |
| Modo oscuro | navegador (toggle + recarga) | Portada, Física y lecciones consistentes; preferencia persistente |

## 6. Infraestructura de producción (2026-11-16, posterior al empaquetado)

Migración del proyecto a infraestructura de producción manteniendo intacto el
diseño y las funcionalidades descritas arriba:

| Área | Cambio |
|---|---|
| Base de datos | SQLite (`db/custom.db`) → **PostgreSQL en Supabase** (Prisma 6, `provider = "postgresql"`). `DATABASE_URL` pooled (PgBouncer 6543) para runtime y `DIRECT_URL` directa (5432) para migraciones |
| Migraciones | Primera migración versionada `20261116120000_init_postgres` (modelos `User`, `Progress`, `Post` con sus restricciones), aplicada con flujo de *baseline* porque la BD se comparte con otra app del propietario |
| `/api/progress` | Persistencia real (upsert Postgres) con validación de tipos y límites; corrección del bug que respondía `ok: true` ante fallo de BD; el fallback 501 → localStorage se conserva |
| Notebook IA | El modelo `nvidia/llama-3.1-nemotron-51b-instruct` alcanzó su fin de vida el 2026-11-15 (NVIDIA responde 410); reemplazado por `nvidia/nemotron-3.5-lightning-30b-a3b` con `thinking: false` (evita respuestas vacías por agotamiento de tokens en razonamiento). La clave sigue siendo server-only |
| CI | GitHub Actions migrado de Bun a `npm ci` + lint + typecheck + test + build (Node 24) |
| Repositorio | `.env` y `db/custom.db` retirados del tracking; `.gitignore` protege `.env*` (excepto `.env.example`), BDs locales y artefactos |
| Documentación | `README.md`, `docs/desarrollo/README.md` y `docs/desarrollo/DESPLIEGUE.md` (nuevo) actualizados a la arquitectura real |
| Despliegue | Vercel proyecto `cecyt3-lab` (Next.js, `npm ci` + `npm run build`), variables en los 3 entornos, verificado en preview antes de producción |

Detalle operativo y flujo para desplegar cambios futuros: `docs/desarrollo/DESPLIEGUE.md`.
