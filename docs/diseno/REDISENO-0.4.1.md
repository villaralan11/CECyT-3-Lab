# CECyT 3 Lab — Rediseño v0.4.1

## Alcance

Esta entrega extiende el sistema visual de la portada v0.4.0 a los catálogos de Física, Química e Inglés, las tarjetas de simulador y las páginas de práctica. También sincroniza la paleta del conjunto de simuladores HTML de Física.

## Principios

- Base editorial clara (Paper / Ink), composición de inspiración Stockholm y componentes técnicos.
- Colores saturados para dar energía juvenil, aplicados como acentos funcionales.
- Estructura coherente entre materias, conservando una identidad cromática reconocible por sección.
- Animación contenida y respeto a `prefers-reduced-motion`.

## Cambios implementados

- Hooks de estilo compartidos en los tres catálogos y las tarjetas expandibles.
- Estilo común para las páginas individuales de Química e Inglés.
- Recoloración de variables del simulador Canvas de Física, sin cambiar su lógica de simulación.
- No se eliminaron rutas ni se modificaron los conjuntos de ejercicios.

## Validación

- Sintaxis de los 43 archivos TypeScript/TSX revisada mediante el transpiler de TypeScript.
- `public/simuladores/base.js` validado con `node --check`.
- Balance de llaves de `globals.css` revisado.
- La instalación de dependencias no pudo completarse en este entorno por timeout del registro npm; falta ejecutar `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` en un entorno con acceso al registro.
