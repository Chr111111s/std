import { useEffect } from 'react'

export function NotFoundPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Página no encontrada | Valeria & Eduardo'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="not-found page-width" id="contenido">
      <a className="brand" href="/" aria-label="Valeria y Eduardo, inicio">
        V<span>&</span>E
      </a>
      <p className="not-found-code" aria-label="Error 404">
        404
      </p>
      <h1 className="section-title">Este enlace no está disponible.</h1>
      <p className="section-intro">
        Revisa el enlace de tu invitación o vuelve al inicio para ver los
        detalles de nuestra boda.
      </p>
      <a className="button button-primary" href="/">
        Volver al inicio
      </a>
    </main>
  )
}
