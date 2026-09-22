import { wedding } from '@/data/wedding'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

export function FooterSection() {
  return (
    <footer className="footer-section">
      <Reveal className="page-width">
        <Icon name="rings" className="section-icon mx-auto" />
        <p className="footer-quote">{wedding.closing}</p>
        <p className="footer-names">
          Valeria <span>&</span> Eduardo
        </p>
        <p className="eyebrow">05 · DICIEMBRE · 2026</p>
        <div className="footer-bottom">
          <span>HECHO PARA COMPARTIR CONTIGO</span>
          <a href="#inicio">
            Volver al inicio <Icon name="arrow" />
          </a>
        </div>
      </Reveal>
    </footer>
  )
}
