import { useRef, useState } from 'react'
import { wedding } from '@/data/wedding'
import { Icon } from './ui/Icon'

export function AudioPlayer({ src = wedding.audio.src }: { src?: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  async function toggle() {
    if (!src || error) {
      setExpanded((value) => !value)
      return
    }
    if (!audio.current) return
    if (playing) {
      audio.current.pause()
      return
    }
    setLoading(true)
    try {
      await audio.current.play()
    } catch {
      setError(true)
      setExpanded(true)
    } finally {
      setLoading(false)
    }
  }
  return (
    <aside className="audio-widget" aria-label="Nuestra canción">
      {src ? (
        <audio
          ref={audio}
          src={src}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setError(true)
            setPlaying(false)
            setLoading(false)
          }}
        />
      ) : null}
      {expanded ? (
        <div className="audio-panel" id="song-panel">
          <button
            type="button"
            className="audio-close"
            onClick={() => setExpanded(false)}
            aria-label="Cerrar canción"
          >
            <Icon name="close" />
          </button>
          <span className="eyebrow">NUESTRA CANCIÓN</span>
          <p>Dandelions</p>
          <small>Ruth B</small>
          {error ? (
            <small role="status">No se pudo reproducir la canción.</small>
          ) : null}
          <a
            href="https://open.spotify.com/search/Dandelions%20Ruth%20B"
            target="_blank"
            rel="noreferrer"
          >
            Escuchar en Spotify <Icon name="arrow" />
          </a>
        </div>
      ) : null}
      <button
        type="button"
        className={`audio-toggle ${playing ? 'is-playing' : ''}`}
        onClick={() => void toggle()}
        disabled={loading}
        aria-label={
          !src || error
            ? 'Ver nuestra canción'
            : playing
              ? 'Pausar Dandelions'
              : 'Reproducir Dandelions'
        }
        aria-pressed={src && !error ? playing : undefined}
        aria-expanded={!src || error ? expanded : undefined}
        aria-controls={expanded ? 'song-panel' : undefined}
      >
        <Icon name={playing ? 'pause' : src && !error ? 'play' : 'music'} />
        <span className="audio-label">
          {playing ? 'Nuestra canción' : 'Dandelions'}
        </span>
        {playing ? (
          <span className="sound-wave" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : null}
      </button>
    </aside>
  )
}
