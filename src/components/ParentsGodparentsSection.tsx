import { wedding } from '@/data/wedding'
import { Reveal } from './ui/Reveal'
import { Icon } from './ui/Icon'

export function ParentsGodparentsSection() {
  return (
    <section
      id="familia"
      className="section-space family-section"
      aria-labelledby="family-title"
    >
      <Reveal className="page-width text-center">
        <Icon name="rings" className="section-icon mx-auto" />
        <p className="eyebrow">EL AMOR QUE NOS ACOMPAÑA</p>
        <h2 id="family-title" className="section-title">
          Junto a quienes nos <em>vieron crecer.</em>
        </h2>
        <p className="section-intro">
          Con la bendición de Dios, de nuestros padres y padrinos,
          <br className="hidden sm:block" /> queremos compartir contigo la
          alegría de nuestra unión.
        </p>
        <div className="family-grid">
          {wedding.families.map((family) => (
            <div className="family-group" key={family.title}>
              <h3 className="eyebrow">{family.title}</h3>
              <p>
                {family.names[0]}
                <span className="family-and">&</span>
                {family.names[1]}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
