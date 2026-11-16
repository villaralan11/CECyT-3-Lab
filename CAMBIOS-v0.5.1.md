# CECyT 3 Lab — Registro de cambios v0.5.1

Fecha: 2026-11-16 · Base: v0.5.0 (`c889953`, etiqueta `archive/cecyt3-lab-v0.5.0-production`).

## 1. Nueva función: biblioteca de documentos en el Notebook IA

El Notebook ahora acepta **documentos reales** además de texto pegado:

- **Formatos**: PDF, Word (.docx), PowerPoint (.pptx), TXT y Markdown.
- **Panel de biblioteca** junto al chat: subir, abrir (los PDF se ven en el navegador,
  el resto se descarga), eliminar y marcar/desmarcar qué documentos usa la IA.
- **Guardado en Supabase**: nueva tabla `Document` (archivo original en `data BYTEA`,
  texto extraído en `text`, metadatos). Límites: 4 MB por archivo, 12 documentos por
  usuario, 120,000 caracteres extraídos por documento.
- **La IA lee los documentos**: `/api/notebook` acepta `documentIds` + `userId`;
  el presupuesto de contexto (48,000 caracteres) se reparte equitativamente entre
  documentos y fuentes de texto para no sesgar por orden.
- El modo anterior (pegar texto, 8 fuentes) se conserva completo.

## 2. Archivos modificados / añadidos

- `prisma/schema.prisma` — nuevo modelo `Document`; migración versionada
  `20261116153000_documentos_notebook` (aplicada con flujo de baseline, BD compartida).
- `src/lib/docs.ts` — **nuevo**: límites, tipos aceptados, sanitización y presupuesto de contexto.
- `src/lib/docs.test.ts` — **nuevo**: 9 pruebas unitarias (64 en total).
- `src/lib/docs-server.ts` — **nuevo**: extracción (pdf-parse v2, mammoth, jszip para PPTX).
- `src/app/api/documents/route.ts` y `src/app/api/documents/[id]/route.ts` — **nuevos**:
  subir/listar/servir/eliminar (validación de tipo, tamaño y cuota por usuario).
- `src/app/api/notebook/route.ts` — acepta `documentIds` y reparte el presupuesto de contexto.
- `src/app/notebook/page.tsx` — panel de biblioteca junto al chat (mismo sistema visual).
  Además: botón discreto `{ }` junto a «Limpiar» que abre un inspector con las
  peticiones JSON de las APIs en tiempo real (estado HTTP, cuerpo, latencia).
- `src/app/globals.css` — estilos mínimos `.notebook-doc-*` y `.notebook-net-*` con
  tokens existentes (claro/oscuro). También: el tramo final del titular de portada
  («se ve así») sube de 55% a 88% de opacidad para conservar legibilidad sobre la foto.
- `next.config.ts` — `serverExternalPackages` (pdf.js/mammoth/jszip) y
  `outputFileTracingIncludes` con `pdf.worker.mjs` + `standard_fonts` para el runtime
  serverless (ver sección 6).
- `src/lib/docs-server.ts` — stubs de `DOMMatrix`/`Path2D`/`ImageData` e import
  dinámico de pdf.js (requerido en el runtime serverless de Vercel; ver sección 6).
- `package.json` — 0.5.0 → 0.5.1; dependencias `pdf-parse`, `mammoth`, `jszip`.

## 3. Resultado de las pruebas (ejecutadas realmente)

| Prueba | Resultado |
|---|---|
| Lint / Typecheck | 0 errores |
| Tests unitarios | 64/64 (4 suites) |
| Build de producción | OK |
| Subida TXT / DOCX / PPTX / PDF | 201 en los cuatro formatos (extracción verificada) |
| Rechazo .jpg y archivo >4 MB | 400 con mensaje claro |
| IA respondiendo con 4 documentos | Cita «Fuente 2 (ley-de-ohm.docx)» y contenido correcto de DOCX/PPTX/PDF/TXT |
| Abrir documento | HTTP 200 con `Content-Type` correcto (PDF renderiza en el navegador) |
| Eliminar documento | 200 y lista actualizada |
| Cuota de 12 documentos / usuario | Implementada (400 al exceder) |

## 4. Seguridad (documentada, sin login)

Los documentos se asocian al `userId` anónimo de `localStorage` (mismo modelo que el
progreso): **no es autenticación**. Los IDs de documento son `cuid` no adivinables y el
acceso exige el `userId` coincidente; es un compromiso aceptado para el aula sin cuentas.
Los archivos se sirven bajo demanda desde la BD; no hay almacenamiento externo.

## 5. Nota de infraestructura

La tabla `Document` convive en el schema `public` con el resto de tablas (BD compartida).
No se ejecutan migraciones en el build de Vercel; la migración quedó aplicada y registrada
(`prisma migrate status` → up to date).

## 6. pdf.js en el runtime serverless de Vercel (dos problemas resueltos)

1. **`DOMMatrix is not defined`**: pdf.js referencia globales del navegador al
   inicializarse. Solución: stubs mínimos en `src/lib/docs-server.ts` antes del import,
   que además pasó a ser dinámico (mejora el cold start de las rutas que no usan PDF).
2. **`Cannot find module .../pdf.worker.mjs`**: pdf.js carga su worker con
   `import(workerSrc)` — string no estático que el trazado de archivos (NFT) no puede
   seguir, así que el lambda no incluía el archivo. Solución: `outputFileTracingIncludes`
   en `next.config.ts` copia `pdf.worker.mjs` y `standard_fonts/` a la función de
   `/api/documents`.
