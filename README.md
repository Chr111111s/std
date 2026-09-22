# Valeria & Eduardo — Nuestra boda

Invitación de boda para el **05 de diciembre de 2026**, construida con React 19, TypeScript/TSX, Vite y Tailwind CSS 4.

## Desarrollo

```powershell
npm.cmd install
npm.cmd run dev
```

Abre la URL que indica Vite. Si ya están instaladas las dependencias, basta con el segundo comando. Node.js 24 está indicado en `.nvmrc`. En otra terminal puedes utilizar `npm` en lugar de `npm.cmd`.

## Arquitectura

```text
src/
  App.tsx                         Composición y navegación por anclas
  index.css                       Tokens Tailwind, composición y responsive
  styles/photos.css               Composición de retratos y galería responsive
  styles/hero.css                 Portada fotográfica de ancho completo y dedicatoria
  data/
    wedding.ts                    Contenido, horarios, mapas, contactos y música
    photos.ts                     Fotografías y textos alternativos
    photos.generated.json         Rutas, dimensiones y variantes optimizadas
  components/
    AudioPlayer.tsx                Control flotante; audio opcional
    HeroSection.tsx                Portada editorial y monograma botánico
    CountdownTimer.tsx             Cuenta regresiva con limpieza de temporizador
    ParentsGodparentsSection.tsx   Padres y padrinos
    PhotoStorySection.tsx          Retratos y galería de la pareja
    EventDetailsSection.tsx        Ceremonia, recepción y enlaces a Maps
    TimelineSection.tsx            Itinerario vertical
    DressCodeSection.tsx           Vestimenta y colores reservados
    GiftRegistrySection.tsx        Liverpool y copia del evento
    RsvpSection.tsx                Pases, formulario y confirmación por WhatsApp
    FooterSection.tsx             Frase de cierre
    ui/
      Botanical.tsx               Ilustración SVG original
      Icon.tsx                    Iconos SVG sin dependencias
      Reveal.tsx                  Aparición al hacer scroll
  hooks/
    useInvitation.ts              Parámetros de URL y cambios de historial
    useCopyToClipboard.ts         Copia, feedback y manejo de errores
  lib/
    invitation.ts                 Parser, mensaje de WhatsApp y cálculo de tiempo
tests/
  invitation.test.ts              Casos límite de parámetros, fechas y mensajes
  interactions.test.tsx           Formulario, copia, audio y composición
```

Los componentes visuales están separados de los datos y de las funciones puras para poder cambiar el contenido o probar interacciones sin acoplarlas al diseño.

## Dirección de diseño

- Marfil `#FDFBF7`, champagne `#D4AF37`, eucalipto `#5A7065` y grafito `#2C2C2C`. El verde profundo `#40594E` se usa en botones y en la sección de vestimenta; el oro oscuro `#8B753D` mejora la legibilidad de los acentos sobre marfil.
- Cormorant Garamond para nombres y títulos; Montserrat para información y controles. Las fuentes se cargan mediante Google Fonts, con alternativas locales si no hay conexión.
- Elemento distintivo: tarjeta inclinada de papelería, monograma V/E, ramas de eucalipto dibujadas en SVG y sello con anillos. No usa fotografías genéricas, emojis ni paquetes de iconos.
- Secciones con ritmos diferentes: portada asimétrica, familias simétricas, tarjetas de ubicaciones, itinerario vertical, vestimenta sobre verde y RSVP en papel.
- Adaptación hasta 320 px, campos móviles de 16 px para evitar zoom al enfocarlos, controles táctiles y enlaces por anclas.
- Foco visible, enlace para saltar al contenido, etiquetas de formulario, mensajes de estado, SVG decorativos ocultos a lectores de pantalla y respeto a `prefers-reduced-motion`.
- Las animaciones usan CSS e IntersectionObserver. No se requiere Framer Motion.

## Fotografías

La portada usa una fotografía de fondo de ancho completo, con un velo para facilitar la lectura. La tarjeta botánica ocupa una sección marfil independiente junto a la bendición, antes del contador; no se superpone a la foto.

Las fotografías originales se conservan en `resources/`. La sección “Nuestra historia, en imágenes” presenta las siete fotos de la pareja después de las familias; en móvil, las cinco imágenes de la galería inferior se recorren horizontalmente. La composición botánica original situada arriba del contador se conserva.

La tarjeta de la ceremonia utiliza `iglesia.jpg`. La del salón conserva su ilustración mientras llega su fotografía; para incorporarla después, añade su recurso en `photos.ts` y asígnalo a `photo` en la recepción dentro de `wedding.ts`.

`public/photos/` contiene variantes JPEG de hasta 640 y 1440 píxeles de ancho, con `srcSet`, `sizes`, dimensiones explícitas y carga diferida. Los originales no se sirven ni se incluyen en la compilación. `scripts/prepare-photos.ps1` permite regenerar las variantes en Windows mediante System.Drawing, respetando la orientación y sin modificar los originales.

## Invitaciones personalizadas

```text
http://localhost:5173/?invitado=Familia+P%C3%A9rez&pases=4
```

`useInvitation()` utiliza `parseInvitation()` para devolver:

```ts
{ guest: 'Familia Pérez', passes: 4 }
```

El RSVP muestra “Familia Pérez, hemos reservado 4 lugares para ustedes” y permite elegir entre 1 y 4 asistentes. Sin parámetros se muestra una invitación genérica; la disponibilidad se consulta con los novios, sin inventar una reserva.

Los pases deben ser enteros entre 1 y 100. Ceros, negativos, decimales, valores no numéricos o excesivos se tratan como ausencia de pases. Los nombres se recortan a 120 caracteres y React los presenta como texto.

Los parámetros personalizan la presentación; son editables por el visitante. Si se necesita validar invitaciones reales, habrá que añadir un servidor con identificadores de invitación.

## WhatsApp

El formulario permite asistir o declinar, elegir uno de los dos contactos, indicar asistentes y añadir un mensaje. `buildWhatsAppUrl()` valida los datos y genera un enlace `https://wa.me/...` con el texto codificado mediante `encodeURIComponent`.

Los teléfonos están en formato internacional de México (`52` + 10 dígitos). La interfaz **prepara el mensaje**: el invitado debe enviarlo desde WhatsApp. No almacena respuestas ni afirma que se hayan recibido. No hay backend.

## Fecha y zona horaria

La cuenta regresiva utiliza `2026-12-05T14:00:00-06:00`, tomando Ciudad de México como zona del evento. El desplazamiento explícito mantiene el mismo instante para invitados en otros países. Si la sede utiliza otra zona, cambia `wedding.date`.

Se actualiza cada segundo, se sincroniza al volver a la pestaña y se detiene visualmente en cero después de la fecha. La finalización a la 01:00 AM está indicada como domingo 6 de diciembre.

## Música opcional

Sin archivo de audio, el control discreto abre la información de “Dandelions — Ruth B” y un enlace para escucharla en Spotify. No intenta reproducir un archivo inexistente.

Para incorporar audio más adelante, copia `.env.example` a `.env.local` y configura:

```dotenv
VITE_WEDDING_AUDIO_URL=/audio/dandelions.mp3
```

Coloca tu archivo autorizado en `public/audio/dandelions.mp3` o indica una URL de audio. Reinicia Vite al cambiar el entorno. La reproducción comienza solo al pulsar el control; incluye pausa, onda animada y manejo de errores.

## Mesa de regalos

El número `60014617` se copia mediante Clipboard API. Se anuncia el éxito y, si falla, se mantiene el número seleccionable con una instrucción para copiar manualmente. En producción, usa HTTPS para disponer de la [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText).

## Validación y producción

| Comando                    | Uso                                           |
| -------------------------- | --------------------------------------------- |
| `npm.cmd run dev`          | Servidor de desarrollo                        |
| `npm.cmd run build`        | TypeScript y compilación de producción        |
| `npm.cmd run preview`      | Revisar la compilación                        |
| `npm.cmd run lint`         | ESLint                                        |
| `npm.cmd run test`         | Pruebas automatizadas de lógica e interacción |
| `npm.cmd run test:watch`   | Pruebas durante desarrollo                    |
| `npm.cmd run format`       | Aplicar Prettier                              |
| `npm.cmd run format:check` | Comprobar el formato                          |

La compilación se genera en `dist/` y puede servirse como sitio estático. No se ha desplegado a un servicio externo.

Las referencias originales no pudieron abrirse con las herramientas disponibles durante la implementación. El diseño sigue el contenido y la arquitectura especificados en el encargo.
