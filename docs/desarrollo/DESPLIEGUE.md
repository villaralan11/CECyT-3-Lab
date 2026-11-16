# Despliegue — CECyT 3 Lab v0.5.0

Arquitectura de producción: **GitHub → Vercel (Next.js 16)** con base de datos **Supabase PostgreSQL** y Prisma 6.

## Base de datos (Supabase)

- Proyecto: `villaralan11's Project` (ref `qdipyvoiyifdzubfbaji`, región `us-east-2`, Postgres 17). La BD se comparte con otra app del mismo propietario: las tablas de CECyT (`User`, `Progress`, `Post`) viven en el schema `public` junto a las de esa app, sin colisiones.
- Proveedor de acceso a datos: **Prisma** (`prisma/schema.prisma`, provider `postgresql`). Nada de consultas improvisadas.
- Conexiones:
  - `DATABASE_URL` → **pooled** (`aws-0-us-east-2.pooler.supabase.com:6543`, `pgbouncer=true&connection_limit=1`): runtime de la app en Vercel/serverless.
  - `DIRECT_URL` → **directa** (`db.<ref>.supabase.co:5432`): solo para migraciones de Prisma.

## Migraciones

Las migraciones son SQL versionado en `prisma/migrations/` (revisables en PRs).

```bash
npm run db:migrate   # crea y aplica una migración en desarrollo (usa DIRECT_URL)
npm run db:deploy    # aplica migraciones pendientes en producción (no destructivo)
npm run db:generate  # regenera el cliente Prisma
```

Nota: la migración inicial (`20261116120000_init_postgres`) se aplicó con el flujo de
*baseline* (`prisma db execute` + `prisma migrate resolve --applied`) porque la BD ya
tenía tablas de otra aplicación. Nuevas migraciones: usar `npm run db:migrate` normal.
No usar `prisma db push` contra esta BD (puede generar drift con el esquema compartido).

## Variables de entorno

Definidas en Vercel (Project → Settings → Environment Variables) y en `.env` local
(que nunca se commitea; ver `.env.example`):

| Variable | Entorno | Uso |
|----------|---------|-----|
| `DATABASE_URL` | prod/preview/dev | Conexión pooled Supabase (runtime Prisma) |
| `DIRECT_URL` | prod/preview/dev | Conexión directa Supabase (migraciones) |
| `NVIDIA_API_KEY` | prod/preview/dev | Notebook IA — **solo servidor**, marcada como sensible |
| `NVIDIA_MODEL` | prod/preview/dev | Modelo de NVIDIA (actual: `nvidia/nemotron-3.5-lightning-30b-a3b`) |
| `NEXT_PUBLIC_SITE_URL` | prod/preview | URL pública para `metadataBase` |

Reglas: ninguna clave en el cliente ni en variables `NEXT_PUBLIC_`; `.env*` está en
`.gitignore` (solo `.env.example` se versiona, con valores ficticios).

## Vercel

- Proyecto: `cecyt3-lab` (https://cecyt3-lab.vercel.app), integración GitHub conectada al repo `villaralan11/CECyT-3-Lab`, rama de producción `main`.
- Framework: Next.js (autodetectado). Root Directory: la raíz del repo.
- Install: `npm ci` (existe `package-lock.json`). Build: `npm run build` = `prisma generate && next build` (el cliente Prisma se genera **antes** de compilar; las migraciones **no** corren en el build).
- Deployments: push a `main` → producción; push a cualquier otra rama → preview. Para que la CI también corra en ramas de trabajo, usa prefijo `backup-*` (p. ej. `backup-v0.6.0`).

## Flujo para desplegar cambios futuros

```bash
git checkout -b backup-vX.Y.Z        # rama de trabajo (CI + preview en Vercel)
# ...cambios...
npm run lint && npm run typecheck && npm test && npm run build
git push -u origin backup-vX.Y.Z     # revisa el preview de Vercel
git checkout main && git merge backup-vX.Y.Z
git push origin main                 # deploy de producción
```

Si el cambio incluye el esquema de datos: genera la migración con `npm run db:migrate`,
commitea el SQL y al desplegar aplica `npm run db:deploy` (o revisa que la migración se
ejecute de forma controlada; nunca automática y destructiva en el build).

## Seguridad conocida (documentada, sin login)

El sistema sigue funcionando **anónimo**: el cliente genera un `userId` aleatorio en
`localStorage` (`anon-xxxxxxx`) y lo envía a `/api/progress`. **Esto no es autenticación**:
cualquiera puede leer/escribir el progreso de otro userId. Es un compromiso aceptado para
el aula (sin cuentas, sin datos personales); no presentar como cuenta segura. Una
integración real de identidad (p. ej. Supabase Auth) requeriría decisión de producto.
