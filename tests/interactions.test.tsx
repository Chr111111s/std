import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
  it('personaliza el formulario, limita asistentes y abre el mensaje correcto', async () => {
    window.history.replaceState({}, '', '/?invitado=Familia+P%C3%A9rez&pases=4')
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const user = userEvent.setup()
    render(<RsvpSection />)
    expect(screen.getByText('Familia Pérez,')).toBeTruthy()
    expect(screen.getByText('4 lugares para ustedes.')).toBeTruthy()
    const guests = screen.getByLabelText(
      'Personas que asistirán',
    ) as HTMLSelectElement
    expect(guests.options).toHaveLength(4)
    await user.selectOptions(guests, '3')
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
    expect(url.searchParams.get('text')).toContain('Asistiremos 3 personas')
    expect(screen.getByRole('status').textContent).toContain(
      'Envíalo desde WhatsApp',
    )
  })
  it('permite declinar sin pedir un número de asistentes', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    render(<RsvpSection />)
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
    render(<RsvpSection />)
    expect(screen.queryByText(/hemos reservado/)).toBeNull()
    expect(
      screen.getByLabelText('Personas que asistirán').getAttribute('min'),
    ).toBe('1')
  })
  it('actualiza la invitación cuando cambia el historial', () => {
    render(<RsvpSection />)
    act(() => {
      window.history.pushState({}, '', '/?invitado=Ana&pases=2')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByText('Ana,')).toBeTruthy()
    expect(
      (
        screen.getByLabelText(
          'Tu nombre o el de tu familia',
        ) as HTMLInputElement
      ).value,
    ).toBe('Ana')
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
      new Error('NotAllowedError'),
    )
    render(<AudioPlayer src="/audio/sample.mp3" />)
    fireEvent.click(
      screen.getByRole('button', { name: 'Reproducir Dandelions' }),
    )
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
