import { wedding } from '@/data/wedding'
import { photos } from '@/data/photos'
import { Botanical } from './ui/Botanical'
import { Icon } from './ui/Icon'
import { CountdownTimer } from './CountdownTimer'

export function HeroSection() {
  return (
    <section
      id="inicio"
      aria-labelledby="couple-names"
      className="hero-section"
    >
      <div className="hero-cover">
        <img
          className="hero-cover-background"
          {...photos.kiss}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="cover-content page-width">
          <div className="cover-copy">
            <p className="eyebrow">CON LA ILUSIÓN DE TODA UNA VIDA</p>
            <h1 id="couple-names" className="cover-names">
              Valeria <span className="cover-ampersand">&</span>
              <span>Eduardo</span>
            </h1>
            <p className="cover-subtitle">El inicio de nuestro para siempre.</p>
            <time className="cover-date" dateTime={wedding.date}>
              05 <span aria-hidden="true">·</span> DICIEMBRE{' '}
              <span aria-hidden="true">·</span> 2026
            </time>
            <a href="#confirmar" className="button button-primary">
              Acompáñanos <Icon name="arrow" />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-dedication page-width">
        <div className="hero-art" aria-hidden="true">
          <div className="art-caption">UNA HISTORIA · UN NUEVO CAPÍTULO</div>
          <div className="invitation-paper">
            <div className="paper-border" />
            <span className="paper-top">NOS CASAMOS</span>
            <div className="monogram">
              <span>V</span>
              <i>&</i>
              <span>E</span>
            </div>
            <div className="paper-bottom">
              <span>Valeria & Eduardo</span>
              <small>
                CINCO DE DICIEMBRE
                <br />
                DOS MIL VEINTISÉIS
              </small>
            </div>
          </div>
          <Botanical className="hero-botanical" />
          <div className="wax-seal">
            <Icon name="rings" />
          </div>
          <span className="art-side-note">CON AMOR, PARA TI</span>
        </div>
        <div className="hero-blessing">
          <p className="eyebrow">LO QUE NOS UNE</p>
          <blockquote>{wedding.opening}</blockquote>
          <span className="blessing-rule" aria-hidden="true" />
          <p className="blessing-signature">
            Con amor, <em>Valeria y Eduardo</em>
          </p>
        </div>
      </div>
      <div className="hero-bottom page-width">
        <a href="#familia" className="discover">
          <span>DESCUBRE NUESTRA INVITACIÓN</span>
          <Icon name="down" />
        </a>
        <CountdownTimer targetDate={wedding.date} />
      </div>
    </section>
  )
}
