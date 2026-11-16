# CECyT 3 Lab

**Versión 0.5.0 · Sistema de diseño recuperado y modo claro/oscuro.** Se reconstruyó `globals.css` (llegó truncado en el paquete v0.4.2: solo 11 líneas con los estilos del Notebook), se unificó la identidad institucional en guinda `#6C1D45` y se añadió tema claro/oscuro con tokens y conmutador en la barra. Todos los simuladores, retos, progreso y el Notebook IA conservan su lógica. Consulta `docs/diseno/REDISENO-0.5.0.md` y `CAMBIOS-v0.5.0.md` (errores corregidos, pendientes y resultados de pruebas).

Laboratorio virtual (Next.js 16 + Tailwind 4): Física (11 simuladores), Química (IUPAC, balanceo, estequiometría) e Inglés (4 trainers).

## Correr
    cp .env.example .env   # DATABASE_URL (Supabase PostgreSQL); NVIDIA_API_KEY solo para el Notebook IA
    npm install        # también corre `prisma generate`
    npm run dev        # http://localhost:3000

(con bun: `bun install && bun run dev`)

## Comandos
    npm run lint · npm run typecheck · npm test · npm run build && npm start

## Notas
- La base de datos es **Supabase PostgreSQL** (Prisma 6, migraciones versionadas en `prisma/migrations/`). En local, `DATABASE_URL` usa la conexión pooled (PgBouncer) y `DIRECT_URL` la directa (puerto 5432) para migrar. Ver `docs/desarrollo/DESPLIEGUE.md`.
- El progreso se persiste vía `/api/progress` (upsert en Postgres); si la BD no está disponible la API responde 501 y el cliente sigue con localStorage (fallback conservado).
- El Notebook IA (`/api/notebook`) llama a NVIDIA integrate API **solo desde el servidor**; la clave vive en `NVIDIA_API_KEY` (Vercel/servidor, nunca en el cliente). Desde v0.5.1 también acepta **documentos subidos** (PDF/DOCX/PPTX/TXT/MD) guardados en la BD: ver `CAMBIOS-v0.5.1.md`.
- Los simuladores de Física son páginas HTML autónomas en `public/simuladores/` (se incrustan por iframe con `?embed=1`).
