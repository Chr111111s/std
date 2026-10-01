import { wedding } from '@/data/wedding'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

export function GiftRegistrySection() {
  const { status, copyToClipboard } = useCopyToClipboard()
  return (
    <section
      id="regalos"
      className="section-space gifts-section"
      aria-labelledby="gifts-title"
    >
      <Reveal className="page-width gift-layout">
        <div>
          <Icon name="gift" className="section-icon" />
          <p className="eyebrow">DETALLES QUE GUARDAMOS EN EL CORAZÓN</p>
          <h2 id="gifts-title" className="section-title">
            El mejor regalo que nos puedes dar,
            <br />
            <em>es tu presencia.</em>
          </h2>
          <p className="section-intro">
            Pero si quieres obsequiarnos algo,
            <br className="hidden sm:block" /> puedes hacerlo en:
          </p>
        </div>
        <div className="registry-card">
          <p className="registry-brand">
            Liverpool<span>ES PARTE DE MI VIDA</span>
          </p>
          <div className="registry-rule" />
          <p className="eyebrow">NUESTRA MESA DE REGALOS</p>
          <p className="registry-number">
            <span>Evento No.</span> <strong>{wedding.registry}</strong>
          </p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => void copyToClipboard(wedding.registry)}
          >
            <Icon name={status === 'copied' ? 'check' : 'copy'} />
            {status === 'copied' ? '¡Copiado!' : 'Copiar número de evento'}
          </button>
          <p className="copy-feedback" role="status">
            {status === 'error'
              ? `No se pudo copiar. Selecciona el número ${wedding.registry} y cópialo manualmente.`
              : status === 'copied'
                ? 'Número de evento copiado.'
                : 'Con este número puedes encontrar nuestra mesa.'}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
