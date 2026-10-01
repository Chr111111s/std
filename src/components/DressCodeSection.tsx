import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

export function DressCodeSection() {
  return (
    <section
      id="vestimenta"
      className="section-space dress-section"
      aria-labelledby="dress-title"
    >
      <Reveal className="page-width dress-layout">
        <div>
          <p className="eyebrow">UN TOQUE DE ELEGANCIA</p>
          <h2 id="dress-title" className="section-title">
            Código de vestimenta
            <br />
            <em>Formal.</em>
          </h2>
          <p className="section-intro">
            Nos vestimos de fiesta para <br />
            una ocasión irrepetible.
          </p>
        </div>
        <div className="dress-details">
          <div className="dress-options">
            <div>
              <Icon name="suit" />
              <h3>Caballeros</h3>
              <p>Traje</p>
            </div>
            <div>
              <Icon name="dress" />
              <h3>Damas</h3>
              <p>Vestido largo formal</p>
            </div>
          </div>
          <div className="dress-note">
            <div className="dress-swatches" aria-hidden="true">
              <span />
              <span />
            </div>
            <p>
              Para permitir que la novia destaque en su día especial, les
              pedimos amablemente <strong>evitar tonos blanco y rosa.</strong>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
