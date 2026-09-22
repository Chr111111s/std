import { wedding } from '@/data/wedding'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

export function EventDetailsSection() {
  return (
    <section
      id="celebracion"
      className="section-space events-section"
      aria-labelledby="events-title"
    >
      <div className="page-width">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">EL LUGAR DONDE DIREMOS SÍ</p>
            <h2 id="events-title" className="section-title">
              Un día, <em>dos encuentros.</em>
            </h2>
          </div>
          <p className="section-intro">
            Sábado, 05 de diciembre de 2026.
            <br />
            Nos encantará encontrarnos contigo.
          </p>
        </Reveal>
        <div className="event-grid">
          {wedding.venues.map((venue) => (
            <Reveal key={venue.title}>
              <article className="event-card">
                {venue.photo ? (
                  <div className="venue-photo">
                    <img
                      {...venue.photo}
                      sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1280px) 45vw, 575px"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div
                    className={`venue-illustration ${venue.kind}`}
                    aria-hidden="true"
                  >
                    <Icon name={venue.kind} />
                    <span className="venue-arch" />
                    <span className="venue-ground" />
                  </div>
                )}
                <div className="event-card-content">
                  <div className="event-label">
                    <p className="eyebrow">{venue.title}</p>
                    <time dateTime={venue.dateTime}>{venue.time}</time>
                  </div>
                  <h3>{venue.name}</h3>
                  <a
                    className="text-link"
                    href={venue.map}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="pin" /> Ver ubicación <Icon name="arrow" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
