// Biblioteca de simulaciones de física embebidas oficialmente desde PhET.
// Etiquetas y descripciones: redacción propia de CECyT-3-Lab.
// Las simulaciones se ejecutan en los servidores oficiales de PhET a través del
// patrón iframe publicado por PhET Interactive Simulations, University of
// Colorado Boulder — https://phet.colorado.edu
// Cada slug fue verificado contra la URL oficial que consume el iframe.

export const PHET_LOCALE = "es_PE";
export const PHET_SITE = "https://phet.colorado.edu";

export type PhetArea =
  | "Mecánica"
  | "Oscilaciones"
  | "Energía"
  | "Fluidos y termodinámica"
  | "Ondas y sonido"
  | "Óptica"
  | "Electricidad y magnetismo"
  | "Física moderna";

export type PhetSim = {
  /** Nombre del paquete oficial en phet.colorado.edu (URL verificada). */
  slug: string;
  /** Título curricular con redacción propia. */
  label: string;
  /** Descripción didáctica con redacción propia. */
  desc: string;
  /** Área del temario de física. */
  area: PhetArea;
};

/** URL oficial del paquete HTML5 embebible con localización en español. */
export const phetEmbedUrl = (slug: string) =>
  `${PHET_SITE}/sims/html/${slug}/latest/${slug}_all.html?locale=${PHET_LOCALE}`;

/** Página oficial de la simulación en el sitio de PhET. */
export const phetSimPageUrl = (slug: string) =>
  `${PHET_SITE}/${PHET_LOCALE}/simulations/${slug}`;

export const PHET_SIMS: PhetSim[] = [
  // ================= Mecánica =================
  {
    slug: "projectile-motion",
    label: "Tiro parabólico",
    area: "Mecánica",
    desc: "Ajusta ángulo, velocidad inicial y altura para calcular alcance y altura máxima; compara vuelos con y sin resistencia del aire.",
  },
  {
    slug: "projectile-data-lab",
    label: "Tiro parabólico · datos",
    area: "Mecánica",
    desc: "Colecta y tabula mediciones de alcance, altura y tiempo entre vuelos para analizar la física del proyectil como en un laboratorio real.",
  },
  {
    slug: "gravity-and-orbits",
    label: "Gravedad y órbitas",
    area: "Mecánica",
    desc: "Lanza satélites y planetas: descubre qué combinación de masa y velocidad produce una órbita estable, y qué hace que se caigan.",
  },
  {
    slug: "forces-and-motion-basics",
    label: "Fuerzas y movimiento",
    area: "Mecánica",
    desc: "Empuja carritos y cajones con fuerzas distintas: compara aceleraciones y confirma la segunda ley de Newton.",
  },
  {
    slug: "friction",
    label: "Fricción",
    area: "Mecánica",
    desc: "Frota dos superficies a escala microscópica y mira cómo la energía mecánica se transforma en calor.",
  },
  {
    slug: "gravity-force-lab",
    label: "Fuerza gravitacional",
    area: "Mecánica",
    desc: "Dos esferas y una balanza: mide cómo cambia la atracción entre masas al mover la distancia entre ellas.",
  },
  {
    slug: "gravity-force-lab-basics",
    label: "Gravitación · intro",
    area: "Mecánica",
    desc: "Versión guiada para descubrir la ley de gravitación universal desde cero, con ejemplos cotidianos.",
  },

  // ================= Oscilaciones =================
  {
    slug: "masses-and-springs",
    label: "Masa y resorte",
    area: "Oscilaciones",
    desc: "Cuelga masas, estira resortes y cronometra oscilaciones para hallar el periodo y la constante del resorte.",
  },
  {
    slug: "masses-and-springs-basics",
    label: "Masa y resorte · intro",
    area: "Oscilaciones",
    desc: "La versión rápida: estira, suelta y observa cómo cambia el vaivén con la rigidez y la amplitud.",
  },
  {
    slug: "pendulum-lab",
    label: "Péndulo de laboratorio",
    area: "Oscilaciones",
    desc: "Varía longitud, masa, ángulo y gravedad; cronometra el periodo y descubre de qué depende de verdad.",
  },
  {
    slug: "hookes-law",
    label: "Ley de Hooke",
    area: "Oscilaciones",
    desc: "Estira resortes solos, en serie y en paralelo, y verifica la relación fuerza–extensión con tus propias mediciones.",
  },

  // ================= Energía =================
  {
    slug: "energy-skate-park",
    label: "Energía en la pista",
    area: "Energía",
    desc: "Suelta al patinador en la rampa y observa cómo la energía se reparte entre cinética, potencial y calor.",
  },
  {
    slug: "energy-skate-park-basics",
    label: "Energía en la pista · intro",
    area: "Energía",
    desc: "Construye tu propia pista y comprueba qué pasa con la energía cuando permites fricción.",
  },
  {
    slug: "energy-forms-and-changes",
    label: "Formas de energía",
    area: "Energía",
    desc: "Calienta, enfría y conecta bloques para ver cómo la energía cambia de forma ante tus ojos.",
  },

  // ================= Fluidos y termodinámica =================
  {
    slug: "density",
    label: "Densidad",
    area: "Fluidos y termodinámica",
    desc: "Suelta cubos misteriosos en el tanque y predice cuáles flotan comparando sus densidades con la del agua.",
  },
  {
    slug: "under-pressure",
    label: "Presión en fluidos",
    area: "Fluidos y termodinámica",
    desc: "Desciende un manómetro dentro del agua y comprueba cómo crece la presión con la profundidad.",
  },
  {
    slug: "gas-properties",
    label: "Gases",
    area: "Fluidos y termodinámica",
    desc: "Bombea moléculas, comprime el pistón y relaciona presión, volumen y temperatura a escala molecular.",
  },
  {
    slug: "states-of-matter",
    label: "Estados de la materia",
    area: "Fluidos y termodinámica",
    desc: "Observa átomos y moléculas mientras cambian entre sólido, líquido y gas al variar la temperatura.",
  },
  {
    slug: "states-of-matter-basics",
    label: "Estados de la materia · intro",
    area: "Fluidos y termodinámica",
    desc: "Elige una molécula y contrólale la temperatura para moverla entre sus estados.",
  },

  // ================= Ondas y sonido =================
  {
    slug: "wave-on-a-string",
    label: "Onda en una cuerda",
    area: "Ondas y sonido",
    desc: "Agita la cuerda a mano o con oscilador: explora amplitud, frecuencia y nodos al variar la tensión.",
  },
  {
    slug: "wave-interference",
    label: "Interferencia de ondas",
    area: "Ondas y sonido",
    desc: "Cruza ondas en agua, luz y sonido para ver los patrones de interferencia constructiva y destructiva.",
  },
  {
    slug: "waves-intro",
    label: "Introducción a las ondas",
    area: "Ondas y sonido",
    desc: "Empieza con agua, sonido y luz para dominar cresta, valle y longitud de onda desde cero.",
  },
  {
    slug: "fourier-making-waves",
    label: "Ondas y Fourier",
    area: "Ondas y sonido",
    desc: "Suma armónicas una a una y descubre cómo se construye cualquier onda periódica con senos.",
  },
  {
    slug: "sound-waves",
    label: "Ondas de sonido",
    area: "Ondas y sonido",
    desc: "Vibra una fuente y mira cómo viaja el sonido por el aire hasta llegar al oído.",
  },

  // ================= Óptica =================
  {
    slug: "geometric-optics",
    label: "Óptica geométrica",
    area: "Óptica",
    desc: "Combina lentes y espejos con rayos de luz: construye imágenes y prueba el comportamiento de cada superficie.",
  },
  {
    slug: "bending-light",
    label: "Refracción de la luz",
    area: "Óptica",
    desc: "Dispara el rayo láser entre medios y verifica la ley de Snell midiendo los ángulos sobre un transportador en vivo.",
  },
  {
    slug: "blackbody-spectrum",
    label: "Espectro del cuerpo negro",
    area: "Óptica",
    desc: "Calienta el cuerpo y compara la curva de emisión: temperatura, color y potencia radiada.",
  },

  // ================= Electricidad y magnetismo =================
  {
    slug: "ohms-law",
    label: "Ley de Ohm",
    area: "Electricidad y magnetismo",
    desc: "Varía voltaje y resistencia y mira cómo responde la corriente, con la fórmula siempre a la vista.",
  },
  {
    slug: "circuit-construction-kit-dc",
    label: "Arma circuitos (CD)",
    area: "Electricidad y magnetismo",
    desc: "Baterías, resistencias, bombillas e interruptores, medidos con amperímetro y voltímetro de verdad.",
  },
  {
    slug: "circuit-construction-kit-dc-virtual-lab",
    label: "Arma circuitos · lab",
    area: "Electricidad y magnetismo",
    desc: "La versión de laboratorio con más componentes para experimentar y medir sin restricciones.",
  },
  {
    slug: "resistance-in-a-wire",
    label: "Resistividad de un cable",
    area: "Electricidad y magnetismo",
    desc: "Cambia material, área y longitud del cable para descubrir de qué depende su resistencia.",
  },
  {
    slug: "faradays-law",
    label: "Ley de Faraday",
    area: "Electricidad y magnetismo",
    desc: "Mueve un imán a través de la bobina y genera corriente inducida capaz de encender la bombilla.",
  },
  {
    slug: "magnet-and-compass",
    label: "Imán y brújula",
    area: "Electricidad y magnetismo",
    desc: "Mueve la brújula cerca del imán y traza la dirección del campo magnético en cada punto.",
  },
  {
    slug: "magnets-and-electromagnets",
    label: "Electroimanes",
    area: "Electricidad y magnetismo",
    desc: "Compara el campo de un imán permanente contra el de una bobina alimentada con corriente.",
  },

  // ================= Física moderna =================
  {
    slug: "rutherford-scattering",
    label: "Dispersión de Rutherford",
    area: "Física moderna",
    desc: "Dispara partículas alfa contra distintos modelos del átomo y descubre por qué existe un núcleo.",
  },
];

/** Orden curricular de las áreas de la biblioteca. */
export const PHET_AREAS: PhetArea[] = [
  "Mecánica",
  "Oscilaciones",
  "Energía",
  "Fluidos y termodinámica",
  "Ondas y sonido",
  "Óptica",
  "Electricidad y magnetismo",
  "Física moderna",
];
