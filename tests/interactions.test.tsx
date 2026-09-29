import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RsvpSection } from '../src/components/RsvpSection'
import { GiftRegistrySection } from '../src/components/GiftRegistrySection'
import { CountdownTimer } from '../src/components/CountdownTimer'
import { AudioPlayer } from '../src/components/AudioPlayer'
import App from '../src/App'

afterEach(() => {
  window.history.replaceState({}, '', '/')
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('RSVP', () => {
  it('personaliza el formulario y confirma la cantidad de la ruta', async () => {
    window.history.replaceState(
      {},
      '',
      '/4?invitado=Familia+P%C3%A9rez&pases=1',
    )
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('Familia Pérez,')).toBeTruthy()
    expect(screen.getByText('4 invitados')).toBeTruthy()
    expect(screen.queryByLabelText('Personas que asistirán')).toBeNull()
    expect(screen.queryByRole('spinbutton')).toBeNull()
    await user.selectOptions(
      screen.getByLabelText('Enviar confirmación a'),
      '525585730063',
    )
    await user.click(
      screen.getByRole('button', { name: /Continuar en WhatsApp/ }),
    )
    expect(open).toHaveBeenCalledOnce()
    const url = new URL(open.mock.calls[0][0] as string)
    expect(url.pathname).toBe('/525585730063')
    expect(url.searchParams.get('text')).toContain('Asistiremos 4 invitados')
    expect(
      screen.getByText(/Mensaje preparado. Envíalo desde WhatsApp/),
    ).toBeTruthy()
  })
  it('permite declinar sin pedir un número de asistentes', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    render(<RsvpSection invitation={{ guest: '', passes: 2 }} />)
    await user.type(
      screen.getByLabelText('Tu nombre o el de tu familia'),
      'Ana',
    )
    await user.click(screen.getByLabelText('No podré asistir'))
    expect(screen.queryByLabelText('Personas que asistirán')).toBeNull()
    await user.click(
      screen.getByRole('button', { name: /Continuar en WhatsApp/ }),
    )
    expect(
      new URL(open.mock.calls[0][0] as string).searchParams.get('text'),
    ).toContain('no podremos acompañarlos')
  })
  it('no afirma una reserva sin un parámetro válido', () => {
    window.history.replaceState({}, '', '/?pases=-2')
    render(<App />)
    expect(screen.queryByText(/hemos reservado/)).toBeNull()
    expect(
      screen.queryByRole('button', { name: /Continuar en WhatsApp/ }),
    ).toBeNull()
    expect(screen.getByText(/Abre el enlace personal/)).toBeTruthy()
  })
  it('actualiza la invitación cuando cambia el historial', () => {
    window.history.replaceState({}, '', '/1?invitado=Luis')
    render(<App />)
    act(() => {
      window.history.pushState({}, '', '/2?invitado=Ana')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByText('Ana,')).toBeTruthy()
    expect(screen.getByText('2 invitados')).toBeTruthy()
    expect(
      (
        screen.getByLabelText(
          'Tu nombre o el de tu familia',
        ) as HTMLInputElement
      ).value,
    ).toBe('Ana')
  })
  it.each([1, 2, 3, 4, 5, 6])(
    'adapta la ruta /%i sin selectores de cantidad',
    (passes) => {
      window.history.replaceState({}, '', `/${passes}`)
      const { container } = render(<App />)
      expect(
        screen.getByText(
          `${passes} ${passes === 1 ? 'invitado' : 'invitados'}`,
        ),
      ).toBeTruthy()
      expect(container.querySelector('[name="guests"]')).toBeNull()
    },
  )
})

describe('rutas desconocidas', () => {
  it.each(['/7', '/0', '/01', '/2/otra', '/no-existe'])(
    'muestra 404 en %s',
    (path) => {
      window.history.replaceState({}, '', path)
      render(<App />)
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
        'Este enlace no está disponible.',
      )
      expect(
        screen
          .getByRole('link', { name: 'Volver al inicio' })
          .getAttribute('href'),
      ).toBe('/')
      expect(
        screen.queryByRole('button', { name: /Continuar en WhatsApp/ }),
      ).toBeNull()
      expect(screen.queryByLabelText('Nuestra canción')).toBeNull()
    },
  )
  it('recupera una invitación válida al volver en el historial', () => {
    window.history.replaceState({}, '', '/no-existe')
    render(<App />)
    act(() => {
      window.history.replaceState({}, '', '/6')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByText('6 invitados')).toBeTruthy()
    expect(document.title).not.toContain('Página no encontrada')
  })
})

describe('copiar evento', () => {
  it('copia el número y anuncia el resultado', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    render(<GiftRegistrySection />)
    fireEvent.click(screen.getByRole('button', { name: /Copiar número/ }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '¡Copiado!' })).toBeTruthy(),
    )
    expect(writeText).toHaveBeenCalledWith('60014617')
    vi.unstubAllGlobals()
  })
  it('ofrece copia manual cuando se rechaza el permiso', async () => {
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) },
    })
    render(<GiftRegistrySection />)
    fireEvent.click(screen.getByRole('button', { name: /Copiar número/ }))
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toContain(
        'cópialo manualmente',
      ),
    )
    vi.unstubAllGlobals()
  })
})

describe('contador y audio', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(
      function () {
        this.dispatchEvent(new Event('pause'))
      },
    )
  })
  it('termina en cero y limpia el temporizador al desmontarse', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-05T19:59:59Z'))
    const { unmount } = render(
      <CountdownTimer targetDate="2026-12-05T14:00:00-06:00" />,
    )
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('Nuestro gran día ha llegado')).toBeTruthy()
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('sin archivo ofrece un enlace a la canción sin aparentar reproducción', async () => {
    render(<AudioPlayer src="" />)
    fireEvent.click(screen.getByRole('button', { name: 'Ver nuestra canción' }))
    expect(
      screen
        .getByRole('link', { name: /Escuchar en Spotify/ })
        .getAttribute('href'),
    ).toContain('Dandelions')
    expect(
      screen.queryByRole('button', { name: 'Pausar Dandelions' }),
    ).toBeNull()
  })
  it('maneja un fallo de reproducción sin dejar el control bloqueado', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(
      new DOMException('Formato no soportado', 'NotSupportedError'),
    )
    render(<AudioPlayer src="/audio/sample.mp3" />)
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toContain(
        'No se pudo reproducir',
      ),
    )
    expect(
      (
        screen.getByRole('button', {
          name: 'Ver nuestra canción',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false)
  })
  it('intenta reproducir al montar y refleja la reproducción real', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(function () {
        this.dispatchEvent(new Event('playing'))
        return Promise.resolve()
      })
    render(<AudioPlayer src="/audio/sample.mp3" />)
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Pausar Dandelions' }),
      ).toBeTruthy(),
    )
    expect(play).toHaveBeenCalledOnce()
    fireEvent.click(document.body)
    expect(play).toHaveBeenCalledOnce()
  })
  it.each(['click', 'keydown', 'touchend', 'pointerdown', 'pointerup'])(
    'reintenta tras %s si el navegador bloquea el autoplay',
    async (event) => {
      const play = vi
        .spyOn(HTMLMediaElement.prototype, 'play')
        .mockRejectedValueOnce(
          new DOMException('Interacción necesaria', 'NotAllowedError'),
        )
        .mockImplementation(function () {
          this.dispatchEvent(new Event('playing'))
          return Promise.resolve()
        })
      render(<AudioPlayer src="/audio/sample.mp3" />)
      await act(async () => {})
      expect(screen.queryByText('No se pudo reproducir la canción.')).toBeNull()
      fireEvent(
        document.body,
        event === 'keydown'
          ? new KeyboardEvent(event, { key: 'Enter', bubbles: true })
          : Object.assign(new Event(event, { bubbles: true }), {
              pointerType: event === 'pointerdown' ? 'mouse' : 'touch',
            }),
      )
      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: 'Pausar Dandelions' }),
        ).toBeTruthy(),
      )
      expect(play).toHaveBeenCalledTimes(2)
      fireEvent.click(screen.getByRole('button', { name: 'Pausar Dandelions' }))
      fireEvent.click(document.body)
      expect(play).toHaveBeenCalledTimes(2)
      expect(
        screen.getByRole('button', { name: 'Reproducir Dandelions' }),
      ).toBeTruthy()
    },
  )
  it('mantiene el inicio por interacción si play se interrumpe antes de sonar', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementationOnce(function () {
        this.dispatchEvent(new Event('play'))
        return Promise.reject(
          new DOMException('Inicio interrumpido', 'AbortError'),
        )
      })
      .mockImplementation(function () {
        this.dispatchEvent(new Event('playing'))
        return Promise.resolve()
      })
    render(<AudioPlayer src="/audio/sample.mp3" />)
    await act(async () => {})
    expect(
      screen.queryByRole('button', { name: 'Pausar Dandelions' }),
    ).toBeNull()
    fireEvent.click(document.body)
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Pausar Dandelions' }),
      ).toBeTruthy(),
    )
    expect(play).toHaveBeenCalledTimes(2)
  })
  it('inicia desde un toque en otro control aunque este detenga la propagación', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new DOMException('Bloqueado', 'NotAllowedError'))
      .mockImplementation(function () {
        this.dispatchEvent(new Event('playing'))
        return Promise.resolve()
      })
    render(
      <>
        <button onClick={(event) => event.stopPropagation()}>
          Ver invitación
        </button>
        <AudioPlayer src="/audio/sample.mp3" />
      </>,
    )
    await act(async () => {})
    fireEvent.click(screen.getByRole('button', { name: 'Ver invitación' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Pausar Dandelions' }),
      ).toBeTruthy(),
    )
    expect(play).toHaveBeenCalledTimes(2)
  })
  it('el control manual reproduce una sola vez y permite pausar', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new DOMException('Bloqueado', 'NotAllowedError'))
      .mockImplementation(function () {
        this.dispatchEvent(new Event('playing'))
        return Promise.resolve()
      })
    render(<AudioPlayer src="/audio/sample.mp3" />)
    await act(async () => {})
    fireEvent.click(
      screen.getByRole('button', { name: 'Reproducir Dandelions' }),
    )
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(
        (
          screen.getByRole('button', {
            name: 'Pausar Dandelions',
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(false),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Pausar Dandelions' }))
    fireEvent.click(document.body)
    expect(play).toHaveBeenCalledTimes(2)
  })
  it('limpia los eventos incluso con StrictMode y promesas pendientes al desmontar', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValue(new DOMException('Bloqueado', 'NotAllowedError'))
    const { unmount } = render(
      <StrictMode>
        <AudioPlayer src="/audio/sample.mp3" />
      </StrictMode>,
    )
    unmount()
    await act(async () => {})
    const attempts = play.mock.calls.length
    fireEvent.click(document.body)
    fireEvent.keyDown(document.body, { key: 'Enter' })
    fireEvent.touchEnd(document.body)
    fireEvent.pointerDown(document.body, { pointerType: 'mouse' })
    fireEvent.pointerUp(document.body, { pointerType: 'touch' })
    expect(play).toHaveBeenCalledTimes(attempts)
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })
})

it('incluye todas las secciones y las ubicaciones reales sin duplicar identificadores', () => {
  const { container } = render(<App />)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
    'Valeria',
  )
  expect(
    screen
      .getAllByRole('link', { name: /Ver ubicación/ })
      .map((link) => link.getAttribute('href')),
  ).toEqual([
    'https://maps.app.goo.gl/VWMJwPo7Tg545M2G9?g_st=ipc',
    'https://maps.app.goo.gl/fBiu84zzEUcg7nMB9?g_st=ic',
  ])
  expect(screen.getByText('evitar tonos blanco y rosa.')).toBeTruthy()
  const ids = [...container.querySelectorAll('[id]')].map(
    (element) => element.id,
  )
  expect(new Set(ids).size).toBe(ids.length)
  expect(container.querySelectorAll('section').length).toBe(8)
})
