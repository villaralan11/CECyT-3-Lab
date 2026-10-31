# CECyT 3 Lab

Laboratorio virtual (Next.js 16 + Tailwind 4): Física (11 simuladores), Química (IUPAC, balanceo, estequiometría) e Inglés (4 trainers).

## Correr
    npm install        # también corre `prisma generate`
    npm run dev        # http://localhost:3000

(con bun: `bun install && bun run dev`)

## Comandos
    npm run lint · npm run typecheck · npm test · npm run build && npm start

## Notas
- El progreso se guarda en localStorage; si Prisma/BD no está disponible la API responde 501 y el sitio sigue funcionando.
- La BD SQLite vive en `db/custom.db` (`DATABASE_URL` en `.env`, ruta relativa).
- Los simuladores de Física son páginas HTML autónomas en `public/simuladores/` (se incrustan por iframe con `?embed=1`).
