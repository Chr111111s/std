import { photos } from '@/data/photos'
import { Reveal } from './ui/Reveal'
import { Icon } from './ui/Icon'

const gallery = [
  photos.dance,
  photos.kiss,
  photos.walk,
  photos.bench,
  photos.joy,
]

export function PhotoStorySection() {
  return (
    <section
      id="nosotros"
      className="section-space story-section"
      aria-labelledby="story-title"
    >
      <div className="page-width">
        <div className="story-layout">
          <Reveal className="story-lead">
            <figure>
              <img
                {...photos.embrace}
                sizes="(max-width: 760px) calc(100vw - 60px), (max-width: 1280px) 44vw, 530px"
                loading="lazy"
                decoding="async"
              />
              <figcaption>CONTIGO, TODO TIENE SENTIDO.</figcaption>
            </figure>
          </Reveal>
          <Reveal className="story-note">
            <p className="eyebrow">NUESTRA HISTORIA, EN IMÁGENES</p>
            <h2 id="story-title" className="section-title">
              Y entre tantos caminos,
              <br />
              <em>nos encontramos.</em>
            </h2>
            <p className="section-intro">
              Hoy, nuestra historia se convierte en una nueva promesa. Qué
              alegría compartirla contigo.
            </p>
            <figure className="story-announcement">
              <img
                {...photos.announcement}
                sizes="(max-width: 760px) 60vw, 290px"
                loading="lazy"
                decoding="async"
              />
              <figcaption>EL SIGUIENTE CAPÍTULO: NUESTRO SÍ.</figcaption>
            </figure>
          </Reveal>
        </div>
        <Reveal>
          <div className="story-gallery-heading">
            <p className="eyebrow">INSTANTES MUY NUESTROS</p>
            <span>
              Desliza para ver más <Icon name="arrow" />
            </span>
          </div>
          <div
            className="story-gallery"
            role="region"
            aria-label="Fotografías de Valeria y Eduardo. Desplázate horizontalmente para verlas todas."
            tabIndex={0}
          >
            {gallery.map((photo) => (
              <figure key={photo.src}>
                <img
                  {...photo}
                  sizes="(max-width: 760px) 70vw, (max-width: 1280px) 18vw, 223px"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
