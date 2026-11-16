# CECyT 3 Lab — Sistema visual 0.4

## Dirección creativa

**Scandinavian Academic / Technical Editorial**, con una capa juvenil y experimental. La plataforma debe sentirse como un producto digital educativo contemporáneo: claro, expresivo, útil y con personalidad institucional.

La composición toma como base Stockholm, minimalismo editorial y orden visual. Los acentos Gorpcore aparecen en códigos, índices, nomenclaturas y pequeños indicadores técnicos; la parte Old Money se limita a sobriedad tipográfica y materiales visuales cálidos, sin convertir el sitio en una marca de moda.

## Paleta

| Token | Hex | Función |
|---|---|---|
| Paper | `#F4F2EC` | Fondo principal |
| Ink | `#20251F` | Texto y superficies oscuras |
| IPN Guinda | `#6C1D45` | Identidad institucional |
| Electric Blue | `#315CE8` | Acción principal / Física |
| Coral | `#EF705A` | Energía / Química / avisos |
| Acid Lime | `#DFF17A` | Acento juvenil / Inglés |
| Mint | `#5BC9AD` | Estados positivos |
| Stone | `#DEDCD3` | Bordes y divisores |

Los colores vibrantes se reservan para acciones, categorías, estados y puntos de énfasis. No se usan degradados saturados como fondo general.

## Tipografía

Geist Sans para titulares y texto de interfaz. Geist Mono para índices, metadatos, nomenclatura técnica y pequeñas etiquetas de laboratorio.

## Reglas de composición

- Fondos marfil y grafito, superficies limpias y separadores finos.
- Tarjetas con radios moderados; evitar cápsulas y esquinas excesivamente redondas en todos los componentes.
- Una sola acción primaria por bloque.
- Cada materia tiene un acento propio, manteniendo estructura y jerarquía compartidas.
- Movimiento breve y funcional; respetar `prefers-reduced-motion`.
- La navegación debe seguir siendo clara en pantallas pequeñas.

## Alcance de la primera pasada

- Portada renovada y adaptable.
- Navegación superior y menú móvil.
- Pie institucional.
- Tokens globales y utilidades de diseño.
- Reto exprés conservado como interacción funcional.

Las páginas internas de materias, laboratorios, retos, progreso y simuladores se migrarán por etapas para conservar sus comportamientos y comprobar cada flujo.


## Aplicación del sistema — v0.4.1

Se extendió la dirección visual a las páginas interiores y experiencias interactivas:

- Catálogos de Física, Química e Inglés con una estructura compartida y un acento cromático propio por materia.
- Tarjetas expandibles de simulador con controles más compactos, bordes discretos y estados de apertura claros.
- Páginas de actividad de Química e Inglés con una superficie de trabajo común, navegación de contexto y jerarquía de lectura uniforme.
- Simuladores de Física en HTML con la paleta Paper / Ink y acentos Electric Blue, Mint, Coral, Violet y Acid Lime; se conserva el modo claro/oscuro.
- Se mantienen la lógica, los enlaces, los estados, la persistencia de progreso y la carga embebida de los simuladores.

### Acentos por materia

| Materia | Acento | Uso |
|---|---|---|
| Física | Electric Blue `#315CE8` | Catálogo, iconos, controles y enfoque
| Química | Coral `#EF705A` | Catálogo, nomenclatura y cálculos
| Inglés | Violet `#8066DC` | Entrenadores y navegación de ejercicios

Los estados de acierto, error y advertencia mantienen sus colores semánticos (Mint/verde, Coral/rojo y ámbar) para no confundirlos con el color de marca de la materia.


## Evolución de portada — v0.4.2

La portada usa una imagen fotográfica a todo el ancho con una composición editorial de alto contraste. El magenta se reserva para el CTA de navegación y el indicador activo; los colores específicos de Física, Química e Inglés siguen identificando sus secciones sin invadir el hero.
