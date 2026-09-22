import { wedding } from '@/data/wedding'
import { Icon } from './ui/Icon'
import { Botanical } from './ui/Botanical'
import { Reveal } from './ui/Reveal'

export function TimelineSection() {
  return (
    <section
      id="itinerario"
      className="section-space timeline-section"
      aria-labelledby="timeline-title"
    >
      <div className="page-width timeline-layout">
        <Reveal className="timeline-intro">
          <p className="eyebrow">ASÍ LO HEMOS SOÑADO</p>
          <h2 id="timeline-title" className="section-title">
            Momentos para
            <br />
            <em>recordar siempre.</em>
          </h2>
          <p className="section-intro">
            De la emoción del primer sí
            <br />a la última canción de la noche.
          </p>
          <Botanical className="timeline-botanical" />
        </Reveal>
        <Reveal>
          <ol className="timeline">
            {wedding.timeline.map((item) => (
              <li key={item.time}>
                <time>{item.time}</time>
                <span className="timeline-mark">
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
