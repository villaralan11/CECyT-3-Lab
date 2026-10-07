# Decisiones del portafolio

## Arquitectura

- El sitio es estático y utiliza HTML semántico (`header`, `nav`, `main`, `section`, `article`, `aside` y `footer`) para que su estructura sea clara, accesible y fácil de indexar.
- El contenido, la presentación y las interacciones están separados en `index.html`, `css/style.css` y `js/app.js`. No se agregan frameworks ni dependencias externas, lo que reduce el peso inicial y evita solicitudes de terceros.
- El diseño parte de pantallas móviles y amplía sus rejillas con Flexbox, CSS Grid y cuatro breakpoints. Los controles de navegación y tema incluyen estados accesibles; la navegación respeta la preferencia de movimiento reducido.
- El formulario valida nombre, correo y mensaje en el navegador. No simula un envío: para recibir mensajes hay que conectarlo a un backend o servicio de formularios.

## Paleta de colores

- El tema claro predeterminado usa un fondo gris casi blanco (`#f5f5f7`) y superficies blancas para dar espacio al contenido y una apariencia sobria inspirada en páginas de producto de Apple.
- El azul (`#06c`) destaca enlaces y acciones; el texto gris carbón y las superficies neutras mantienen una jerarquía visual simple.
- El tema oscuro alternativo conserva esa jerarquía con fondo carbón y superficies oscuras. Todos los tonos se gestionan con Custom Properties y el tema elegido se guarda en el navegador.

## Tipografía

- Se usa una pila de sistema nativa (`-apple-system`, BlinkMacSystemFont, system-ui y equivalentes) para una lectura limpia y sin solicitudes a fuentes externas.
- La tipografía monoespaciada se limita a etiquetas pequeñas de sección; el resto del sitio prioriza una presentación simple y editorial.

## Antes de desplegar

- Sustituye los enlaces generales de GitHub y LinkedIn en `index.html` por las URL de los perfiles personales.
- Configura un endpoint o servicio de formularios si necesitas recibir mensajes; el formulario actual solo valida los datos localmente.
