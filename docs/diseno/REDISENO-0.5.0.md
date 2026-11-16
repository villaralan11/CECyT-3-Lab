# CECyT 3 Lab — Rediseño y estabilización v0.5.0

## Resumen

La v0.5.0 parte del ZIP `CECyT-3-Lab-v0.4.2-notebook-ia-optimizado.zip` (fuente de verdad) y
completa la estabilización del proyecto: recuperación del sistema de diseño global (que llegó
truncado en el paquete), tema claro/oscuro con tokens, homogeneización de superficies y
verificación integral (typecheck, ESLint, 55 pruebas unitarias, build de producción y todas las
rutas con servidor de producción).

## Hallazgo principal de la auditoría

`src/app/globals.css` llegó con **solo 11 líneas** (únicamente los estilos del Notebook IA).
Faltaban la importación de Tailwind 4, los tokens de tema, todas las clases `lab-*` de la
portada, la navegación y el pie. La documentación (`docs/diseno/REDISENO-0.4.2.md`) confirma
que existía una versión completa, por lo que el CSS se **reconstruyó** respetando el sistema
visual documentado en `docs/diseno/SISTEMA-VISUAL-0.4.md` y el JSX existente (no se tocó la
estructura de la portada).

## Sistema de diseño (tokens)

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--background` | Paper `#F4F2EC` | `#161814` | Fondo del sitio |
| `--foreground` | Ink `#20251F` | `#ECEBE2` | Texto |
| `--card` | `#FFFFFF` | `#1F231E` | Superficies elevadas |
| `--border` | Stone `#DEDCD3` | `#303429` | Bordes y divisores |
| `--guinda` | `#6C1D45` | `#C983AB` | Identidad institucional IPN |
| Acentos por materia | Emerald/Teal (Física), Fucsia (Química), Ámbar (Inglés), Violeta (Laboratorios) | versión tintada | Categorías y estados |

- Tipografía: **Geist Sans** (interfaz) y **Geist Mono** (índices y metadatos), ya presentes en el proyecto.
- Reglas: una acción primaria por bloque, radios moderados, degradados reservados a titulares
  de materia, `prefers-reduced-motion` respetado.
- Utilidades propias: `shine` (barrido de brillo), `blob-float`, `grid-pattern`, `dots-pattern`,
  `animated-gradient`, `scrollbar-thin`.

## Modo claro / oscuro

- El tema vive como clase `.dark` en `<html>`, fijada por un script en `<head>` antes del primer
  pintado (sin destello) y persistida en `localStorage` (`cecyt3-theme`); por defecto sigue al
  sistema.
- Nuevo componente `src/components/site/theme-toggle.tsx` integrado a la barra de navegación.
- Implementación por tokens: los pastel `*-50/100/700/800/900` de Tailwind se remapean bajo
  `.dark`, y las superficies usan `bg-card`/`via-card`/`to-card` en lugar de blanco fijo, de modo
  que el modo oscuro funciona en todo el sitio sin tocar la lógica de las páginas.

## Portada

- **Hero único:** la fotografía (`public/hero-lab.jpg`) es el fondo de todo el bloque hero y el
  texto se apoya sobre ella — imagen y texto conviven en el mismo bloque, no apilados. Velos de
  color papel (lateral izquierdo y fundido inferior, calculados con `color-mix` sobre los tokens)
  garantizan la legibilidad del titular editorial de gran escala «Aprender se ve así.» tanto en
  modo claro como en oscuro; en oscuro el velo adopta el grafito del tema.
- En pantallas pequeñas el velo lateral se refuerza y el enfoque de la foto pasa al instrumento
  de laboratorio (posición 66 %), manteniendo el texto sobre la imagen.
- Tarjetas de materia con barra de acento por disciplina, franja de cifras editorial (sin tarjetas),
  sección de método en grafito con resplandor guinda, ruta de 10 temas como lista con divisores,
  reto exprés funcional y bloque «Sigue explorando».
- El CTA de navegación y el indicador activo ahora usan el **guinda institucional** (`#6C1D45`).

## Navegación y pie

- Barra fija translúcida de altura exacta 4.125 rem (los héroes interiores compensan esa altura).
- Menú móvil con índices mono y estado activo en guinda.
- Pie institucional en grafito con columnas marca / exploración / institución.

## Notebook IA

Se conservaron íntegros sus estilos originales (paleta lila propia) y su API
(`/api/notebook` con NVIDIA); se añadió una capa de adaptación al modo oscuro sin cambiar su
estructura ni dependencias.

## Verificación visual

Capturas en 1440, 1024, 768 y 390 px de inicio, Física, Química, Laboratorios, Retos, Progreso,
Notebook IA, lección IUPAC y pie; apertura de simulador MRU/MRUV embebido; menú móvil; y modo
oscuro en portada, Física y lección. Sin desbordamientos ni textos cortados.
