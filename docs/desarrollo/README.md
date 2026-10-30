# Desarrollo — CECyT 3 Lab

Notas técnicas para quien mantiene el repositorio.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** + componentes estilo shadcn/ui
- **Prisma 6** (PostgreSQL / Supabase; opcional en local)
- **Vitest** para pruebas unitarias
- **npm** como gestor de paquetes oficial (`package-lock.json` es la fuente de verdad)

> No agregues `bun.lock`, `yarn.lock` ni `pnpm-lock.yaml`: el CI usa `npm ci`.

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` / `npm start` | Build y arranque de producción |
| `npm run lint` | ESLint |
| `npm test` | Vitest (38 pruebas) |
| `npm run test:coverage` | Vitest con cobertura |
| `npm run db:push` | Sincroniza `prisma/schema.prisma` con la base de datos |

## Estructura

- `src/app/` — rutas y API (`/api/progress`).
- `src/components/` — UI, simuladores, componentes didácticos y visor 3D.
- `src/lib/` — lógica pura y pruebas (`*.test.ts`).
- `public/simuladores/` — simuladores HTML/JS servidos como estáticos.
- `scripts/` — análisis del piloto y scripts de despliegue.
- `tests/` — pruebas de los scripts de despliegue (bash).

## Scripts de despliegue

`scripts/deploy/` contiene los scripts bash que usa el sandbox de despliegue
(rutas como `/home/z/my-project`, `uv`, Caddy y `BUILD_ID`). **No son necesarios
para desarrollo local**; solo aplican al entorno Linux del sandbox.

Se exponen mediante alias en `package.json` (`npm run deploy:*`) para no depender de
rutas ocultas como `.zscripts/`:

```bash
npm run deploy:build          # build completo del sandbox
npm run deploy:start          # arranque del servicio
npm run deploy:database       # prepara la base de datos del despliegue
npm run deploy:python-runtime # empaqueta un runtime de Python (si hay .py)
npm run deploy:mini-services:* # instalar / compilar / arrancar mini-servicios
```

## Asistentes de IA

`AGENTS.md` es la **única fuente de reglas** para asistentes. El bloque
`BEGIN:nextjs-agent-rules` lo regenera `next dev`, así que no lo borres.
`CLAUDE.md` solo contiene `@AGENTS.md` (un import), no dupliques reglas ahí.

## Capturas de pantalla

Las capturas viven en [`../screenshots/`](../screenshots/). Reglas:

- Una imagen por vista y versión; no subas duplicados sueltos en la raíz.
- Regenera con Playwright:
  `npx playwright screenshot http://localhost:3000 docs/screenshots/v3-actual/hero.png --full-page`
- Mantén el total por debajo de ~3 MB. Si crece, mueve las capturas históricas a
  almacenamiento externo (GitHub Releases, Drive) y deja solo las actuales.
