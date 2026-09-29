import { useEffect, useRef, useState } from 'react'
import { wedding } from '@/data/wedding'
import { Icon } from './ui/Icon'

const activationEvents = [
  'pointerdown',
  'pointerup',
  'click',
  'keydown',
  'touchend',
] as const

function isPlaybackInterrupted(cause: unknown) {
  return (
    typeof cause === 'object' &&
    cause !== null &&
    'name' in cause &&
    (cause.name === 'NotAllowedError' || cause.name === 'AbortError')
  )
}

export function AudioPlayer({ src = wedding.audio.src }: { src?: string }) {
  return <AudioTrack key={src} src={src} />
}

function AudioTrack({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const stopAutomaticStart = useRef<() => void>(() => {})
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const media = audio.current
    if (!media) return
    let active = true
    let automatic = true

    function stop() {
      automatic = false
      for (const event of activationEvents) {
        document.removeEventListener(event, interact, true)
      }
    }

    async function start() {
      try {
        await media!.play()
        if (active) stop()
      } catch (cause) {
        if (!active || !automatic) return
        // A policy block is recoverable on the next user gesture.
        if (isPlaybackInterrupted(cause)) return
        stop()
        setError(true)
        setExpanded(true)
      }
    }

    function interact(event: Event) {
      // The player's own controls handle their gesture without a second play().
      if (
        event.target instanceof Element &&
        event.target.closest('.audio-widget')
      )
        return
      if (
        event instanceof KeyboardEvent &&
        (event.repeat || event.ctrlKey || event.metaKey || event.altKey)
      )
        return
      // Mouse activation starts on press; touch and pen activate on release.
      if (
        'pointerType' in event &&
        ((event.type === 'pointerdown' && event.pointerType !== 'mouse') ||
          (event.type === 'pointerup' && event.pointerType === 'mouse'))
      )
        return
      if (automatic) void start()
    }

    stopAutomaticStart.current = stop
    // Capture the gesture before links or child controls can stop propagation.
    for (const event of activationEvents) {
      document.addEventListener(event, interact, {
        capture: true,
        passive: true,
      })
    }
    void start()
    return () => {
      active = false
      stop()
      media.pause()
    }
  }, [])

  async function toggle() {
    stopAutomaticStart.current()
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
    } catch (cause) {
      if (!isPlaybackInterrupted(cause)) {
        setError(true)
        setExpanded(true)
      }
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
          autoPlay
          preload="auto"
          onPlaying={() => {
            stopAutomaticStart.current()
            setPlaying(true)
          }}
          onPause={() => setPlaying(false)}
          onError={() => {
            stopAutomaticStart.current()
            setError(true)
            setExpanded(true)
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
