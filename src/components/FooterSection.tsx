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
      <div className="developer-credit page-width">
        <span>Design by chris aviles</span>
        <a
          href="https://wa.me/527775201281"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar a Chris Aviles por WhatsApp"
        >
          <Icon name="whatsapp" />
        </a>
        <a
          href="mailto:avilessotelo@gmail.com"
          aria-label="Enviar correo a Chris Aviles"
        >
          <Icon name="mail" />
        </a>
      </div>
    </footer>
  )
}
