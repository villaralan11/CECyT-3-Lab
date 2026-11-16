# CECyT 3 Lab — Rediseño v0.4.2

## Dirección visual

La portada toma como referencia la composición editorial compartida por el usuario: fotografía de laboratorio de borde a borde, espacio negativo amplio a la izquierda y tipografía de gran escala. La implementación adapta esa dirección a la identidad de CECyT No. 3 / IPN sin reproducir literalmente el sitio de referencia.

## Cambios

- Se sustituyó la ilustración abstracta enmarcada del hero por `public/hero-lab.jpg`, una fotografía panorámica con instrumental científico.
- Se simplificó el titular a «Aprender se ve así.» en dos líneas, con contraste tipográfico negro/gris.
- Se compactó la navegación superior y se ajustó el CTA «Explorar» con acento magenta.
- Se redujeron los controles del hero a una acción principal, una acción secundaria y tres indicadores tipo chip.
- Se ajustaron alturas, tamaños y posiciones para escritorio, tablet y móvil; en móvil la imagen se ubica en la parte inferior para proteger la legibilidad.
- Se cambió el icono del botón de navegación a un matraz para reforzar el contexto de laboratorio.

## Se conserva

Se mantiene el rediseño v0.4.1 de los catálogos de Física, Química e Inglés, las páginas de práctica, los simuladores, sus rutas y su lógica interactiva.

## Validación

- Sintaxis TSX revisada con el transpiler de TypeScript global.
- Balance de llaves de `globals.css` comprobado.
- La compilación completa de Next.js no se ejecutó en este entorno porque el proyecto no tiene `node_modules` instalados. Verificar localmente con `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` y `npm run build`.
