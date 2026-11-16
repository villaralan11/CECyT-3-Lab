# Guía Profesor — Piloto CECyT 3 Lab (Química 04-06)

**Tiempo:** 2 semanas · **Grupo:** 1 grupo Química I (35 alumnos) · **Temas:** Nomenclatura IUPAC, Balanceo, Estequiometría

### Objetivo
Validar que la secuencia **Falla → Simulador → Ejemplo** mejora comprensión vs clase tradicional. Meta: **+20%** en post-test.

### Antes del piloto (30 min)
1. Proyecta `https://cecyt3-lab.vercel.app/quimica/iupac` en cañón.
2. Explica: “Primero van a fallar a propósito (01), luego juegan con el simulador (02), luego ven el ejemplo paso a paso (03). No califico el error, califico que lo intenten.”
3. Entrega **pre-test impreso** (8 preguntas por tema, 24 total) o link `https://cecyt3-lab.vercel.app/retos` (diagnóstico).

### Durante (2 semanas, 3 sesiones de 50 min)
- **Sesión 1 (IUPAC):** 10 min falla + 20 min simulador (bidireccional fórmula↔nombre) + 15 min ejemplo FeSO₄ + 5 min dudas.
- **Sesión 2 (Balanceo):** 10 min falla CH₄+O₂ + 25 min balanceador (tabla viva) + 15 min ejemplo etano.
- **Sesión 3 (Estequiometría):** 10 min falla 10g H₂/O₂ + 25 min sliders limitante + 15 min ejemplo 8g H₂/O₂.

**Rol docente:** No expliques antes de la falla. Deja que fallen, luego guía con preguntas: “¿Qué viste en la tabla cuando cambiaste el coeficiente?”

### Instrumentación
- **Progreso:** cada alumno en `/progreso` ve su nivel. Pídeles **Exportar JSON** al final de cada sesión (guarda `cecyt3-progreso-YYYY-MM-DD.json`).
- **Asistencia y logs:** anota quién completó cada tema (sí/no). Si un alumno limpia caché, usa **Importar** para recuperar.

### Post-test y cierre
- Aplica mismo test que pre-test (mismo orden aleatorizado). Recoge JSONs.
- Envía a Alan: carpeta con 30 JSON + Excel pre/post + NPS (1-10 “¿Recomendarías el lab?”).

### Soporte
- WhatsApp Alan: responde en <2h horario escolar.
- Fallback: si Vercel cae, usa captura del simulador + pizarrón (mismo método).
