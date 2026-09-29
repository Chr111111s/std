import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('audio configurado en el despliegue', () => {
  it.each([undefined, '', '   '])(
    'usa la canción incluida cuando la variable es %j',
    async (configuredUrl) => {
      vi.resetModules()
      vi.stubEnv('VITE_WEDDING_AUDIO_URL', configuredUrl)
      const { wedding } = await import('../src/data/wedding')
      expect(wedding.audio.src).toBe('/audio/musica.mp3')
    },
  )

  it('respeta una URL personalizada y elimina espacios accidentales', async () => {
    vi.resetModules()
    vi.stubEnv('VITE_WEDDING_AUDIO_URL', ' /audio/otra-cancion.mp3 ')
    const { wedding } = await import('../src/data/wedding')
    expect(wedding.audio.src).toBe('/audio/otra-cancion.mp3')
  })
})
