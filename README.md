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
  App.tsx                         Resolución de rutas y composición de la invitación
  index.css                       Tokens Tailwind, composición y responsive
  styles/photos.css               Composición de retratos y galería responsive
  styles/hero.css                 Portada fotográfica de ancho completo y dedicatoria
  data/
    wedding.ts                    Contenido, horarios, mapas, contactos y música
    photos.ts                     Fotografías y textos alternativos
    photos.generated.json         Rutas, dimensiones y variantes optimizadas
  components/
    AudioPlayer.tsx                Autoplay, recuperación por interacción y pausa
    NotFoundPage.tsx               Página 404 con regreso al inicio
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
    useInvitation.ts              Ruta dinámica, nombre y cambios de historial
    useCopyToClipboard.ts         Copia, feedback y manejo de errores
  lib/
    invitation.ts                 Parser, mensaje de WhatsApp y cálculo de tiempo
tests/
  invitation.test.ts              Casos límite de parámetros, fechas y mensajes
  interactions.test.tsx           Formulario, copia, audio y composición
```

Los componentes visuales están separados de los datos y de las funciones puras para poder cambiar el contenido o probar interacciones sin acoplarlas al diseño.

## Dirección de diseño

- Marfil `#FDFBF7`, champán `#F0E6D4`, oro suave `#BDA777`, acentos de títulos `#9A8255`, tinta dorada `#756341` y grafito `#2C2C2C`. Los botones usan champán `#E5D5B6` con texto `#433D32`; vestimenta tiene un fondo claro `#EFE5D1`. La paleta evita grandes superficies marrón oscuro y dorados amarillos brillantes. Fondos, ilustraciones, sellos, estados de formulario y favicon siguen la misma dirección.
- Cormorant Garamond para nombres y títulos; Montserrat para información y controles. Las fuentes se cargan mediante Google Fonts, con alternativas locales si no hay conexión.
- Elemento distintivo: tarjeta inclinada de papelería, monograma V/E, ramas de eucalipto dibujadas en SVG y sello con anillos. No usa fotografías genéricas, emojis ni paquetes de iconos.
- Secciones con ritmos diferentes: portada asimétrica, familias simétricas, tarjetas de ubicaciones, itinerario vertical, vestimenta sobre champán y RSVP en papel claro.
- Base de 16 px, textos auxiliares de al menos 14 px y campos de 16 px también en escritorio. Rejillas, botones y navegación ajustados para esos tamaños, con reglas responsive hasta 320 px.
- Foco visible, enlace para saltar al contenido, etiquetas de formulario, mensajes de estado, SVG decorativos ocultos a lectores de pantalla y respeto a `prefers-reduced-motion`.
- Las animaciones usan CSS e IntersectionObserver. No se requiere Framer Motion.

## Fotografías

La portada usa una fotografía de fondo de ancho completo, con un velo para facilitar la lectura. La tarjeta botánica ocupa una sección marfil independiente junto a la bendición, antes del contador; no se superpone a la foto.

Las fotografías originales se conservan en `resources/`. La sección “Nuestra historia, en imágenes” presenta las siete fotos de la pareja después de las familias; en móvil, las cinco imágenes de la galería inferior se recorren horizontalmente. La composición botánica original situada arriba del contador se conserva.

La tarjeta de la ceremonia utiliza `iglesia.jpg`. La del salón conserva su ilustración mientras llega su fotografía; para incorporarla después, añade su recurso en `photos.ts` y asígnalo a `photo` en la recepción dentro de `wedding.ts`.

`public/photos/` contiene variantes JPEG de hasta 640 y 1440 píxeles de ancho, con `srcSet`, `sizes`, dimensiones explícitas y carga diferida. Los originales no se sirven ni se incluyen en la compilación. `scripts/prepare-photos.ps1` permite regenerar las variantes en Windows mediante System.Drawing, respetando la orientación y sin modificar los originales.

## Invitaciones personalizadas

```text
http://localhost:5173/4?invitado=Familia+P%C3%A9rez#confirmar
```

`useInvitation()` utiliza `parseInvitation()` para devolver:

```ts
{ guest: 'Familia Pérez', passes: 4 }
```

Las rutas `/1`, `/2`, `/3`, `/4`, `/5` y `/6` comparten el mismo componente. `/1` muestra “1 invitado”; las demás, “X invitados”. Se acepta una barra final opcional. El formulario confirma todos los lugares de la ruta y no ofrece ningún selector ni campo de cantidad.

`/` conserva la invitación general y los contactos, sin asignar pases ni mostrar un formulario de confirmación. Las demás rutas, incluidos `/0`, `/7`, `/01` o `/2/otra`, muestran `NotFoundPage`. El parámetro antiguo `?pases=` se ignora: actualiza los enlaces que hayas compartido. `?invitado=` sigue siendo opcional; los nombres se recortan a 120 caracteres y React los presenta como texto.

La ubicación se observa una sola vez con `useSyncExternalStore`; el parser se vuelve a ejecutar únicamente al cambiar ruta o consulta. Los campos mantienen su estado dentro de `RsvpForm`, sin renderizar las demás secciones al escribir. La cuenta regresiva y el audio también mantienen su estado local. No se añade una dependencia de enrutamiento para estas seis rutas.

Las rutas personalizan la presentación; son editables por el visitante. Si se necesita validar invitaciones reales, habrá que añadir un servidor con identificadores de invitación.

## WhatsApp

El formulario permite asistir o declinar, elegir uno de los dos contactos y añadir un mensaje. `buildWhatsAppUrl()` recibe una única cantidad reservada, valida que esté entre 1 y 6 y genera un enlace `https://wa.me/...` con el texto codificado mediante `encodeURIComponent`. No recibe una cantidad de asistentes separada que pueda discrepar de la ruta.

Los teléfonos están en formato internacional de México (`52` + 10 dígitos). La interfaz **prepara el mensaje**: el invitado debe enviarlo desde WhatsApp. No almacena respuestas ni afirma que se hayan recibido. No hay backend.

## Fecha y zona horaria

La cuenta regresiva utiliza `2026-12-05T14:00:00-06:00`, tomando Ciudad de México como zona del evento. El desplazamiento explícito mantiene el mismo instante para invitados en otros países. Si la sede utiliza otra zona, cambia `wedding.date`.

Se actualiza cada segundo, se sincroniza al volver a la pestaña y se detiene visualmente en cero después de la fecha. La finalización a la 01:00 AM está indicada como domingo 6 de diciembre.

## Música de fondo

`public/audio/musica.mp3` contiene una copia del audio MPEG/MP3 proporcionado en `resources/musica.mpeg`; el original se conserva. Se sirve como archivo estático, separado del JavaScript, y se utiliza por defecto sin configurar variables de entorno.

Para sustituir el audio, copia `.env.example` a `.env.local` y configura:

```dotenv
VITE_WEDDING_AUDIO_URL=/audio/musica.mp3
```

Puedes indicar otro archivo de `public/audio/` o una URL de audio. Reinicia Vite al cambiar el entorno. Configura `VITE_WEDDING_AUDIO_URL=` vacío para desactivar el audio: el control ofrecerá la información de “Dandelions — Ruth B” y un enlace a Spotify.

Con audio configurado se intenta `play()` al montar, con `autoPlay`, `loop` y `preload="auto"`. Si el navegador responde `NotAllowedError`, se reintenta desde la primera pulsación del ratón, toque o tecla en cualquier parte de la página, sin exigir el botón de música. Los eventos se capturan antes de que otros controles puedan detener su propagación. Un bloqueo de autoplay no se presenta como un fallo del archivo. La interfaz espera a `playing` para indicar que suena y retirar los escuchadores; el evento `play` por sí solo no confirma que haya comenzado el sonido. También se limpian al utilizar el control manual o al desmontar. Una pausa manual no se revierte por futuras interacciones. El audio sin interacción depende de las [políticas de autoplay del navegador](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay); el sitio no puede garantizarlo en la primera visita.

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

La compilación se genera en `dist/`. Vite sirve las rutas directamente en desarrollo y preview.

### Vercel

El archivo `vercel.json`, ubicado junto a `package.json`, configura Vite, `npm run build`, la salida `dist` y una reescritura de `/(.*)` a `/index.html`, según la [documentación oficial de Vercel para Vite SPA](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas). Los archivos estáticos existentes (JavaScript, CSS, fotos y audio) tienen prioridad sobre la reescritura.

La URL del navegador se conserva: al abrir o recargar `/1`–`/6`, React obtiene la cantidad desde esa ruta. Al abrir `/7` o `/no-existe`, la aplicación muestra `NotFoundPage`, en lugar del error de Vercel. Los parámetros como `?invitado=Ana` también se conservan.

Incluye `vercel.json` en el repositorio y crea un nuevo despliegue que contenga ese cambio. En Vercel, `Root Directory` debe apuntar a la carpeta que contiene `package.json` y `vercel.json`, no a `dist`. Tras desplegar, verifica acceso directo y recarga en `/1`, `/6` y `/no-existe`, además de `/audio/musica.mp3`. La configuración local no modifica un despliegue ya publicado.

### Otros alojamientos

Configura el alojamiento para servir `index.html` en las rutas de la aplicación; de lo contrario, abrir o recargar `/4` podría devolver el 404 del servidor antes de cargar React. Conserva la resolución normal de archivos estáticos y audio. Por ejemplo, en el bloque `server` de Nginx que sirve `dist/`:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

En alojamientos con archivo `_redirects` (como Netlify), la regla equivalente es `/* /index.html 200`; en otros proveedores, usa su configuración de reescrituras para SPA. `NotFoundPage` muestra el error dentro de la aplicación; la reescritura sirve el HTML con código HTTP 200 y no equivale a un 404 HTTP del servidor.

Las referencias originales no pudieron abrirse con las herramientas disponibles durante la implementación. El diseño sigue el contenido y la arquitectura especificados en el encargo.
