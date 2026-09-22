import { describe, expect, it } from 'vitest'
import {
  buildWhatsAppUrl,
  getTimeRemaining,
  parseInvitation,
} from '../src/lib/invitation'

describe('pases personalizados', () => {
  it('decodifica los nombres y los espacios de la URL', () => {
    expect(parseInvitation('?invitado=Familia+P%C3%A9rez&pases=4')).toEqual({
      guest: 'Familia Pérez',
      passes: 4,
    })
  })
  it('ofrece una invitación genérica sin parámetros', () => {
    expect(parseInvitation('')).toEqual({ guest: '', passes: null })
  })
  it.each([
    '0',
    '-4',
    '1.5',
    'abc',
    '1e2',
    '101',
    'Infinity',
    '9007199254740992',
    '',
  ])('no convierte %s en una reserva', (value) => {
    expect(parseInvitation(`?pases=${value}`).passes).toBeNull()
  })
  it('limita nombres excesivos y conserva texto como texto', () => {
    expect(parseInvitation(`?invitado=${'a'.repeat(300)}`).guest).toHaveLength(
      120,
    )
    expect(parseInvitation('?invitado=%3Cscript%3E').guest).toBe('<script>')
  })
})

describe('mensaje de WhatsApp', () => {
  const confirmation = {
    phone: '525545623019',
    name: 'Familia Pérez',
    attendance: 'yes' as const,
    guests: 3,
    reserved: 4,
  }
  it('codifica el mensaje y utiliza el número internacional', () => {
    const url = new URL(
      buildWhatsAppUrl({ ...confirmation, note: 'Gracias & nos vemos' }),
    )
    expect(url.origin + url.pathname).toBe('https://wa.me/525545623019')
    expect(url.searchParams.get('text')).toContain(
      'Asistiremos 3 personas. Tenemos 4 lugares reservados.',
    )
    expect(url.searchParams.get('text')).toContain('Familia Pérez')
    expect(url.searchParams.get('text')).toContain('Gracias & nos vemos')
  })
  it('no permite confirmar más personas que pases', () => {
    expect(() => buildWhatsAppUrl({ ...confirmation, guests: 5 })).toThrow()
    expect(() => buildWhatsAppUrl({ ...confirmation, guests: 0 })).toThrow()
    expect(() => buildWhatsAppUrl({ ...confirmation, name: '  ' })).toThrow()
  })
  it('genera una declinación sin afirmar asistencia', () => {
    const message = new URL(
      buildWhatsAppUrl({ ...confirmation, attendance: 'no', guests: 0 }),
    ).searchParams.get('text')
    expect(message).toContain('no podremos acompañarlos')
    expect(message).not.toContain('Asistiremos')
  })
  it('no promete una reserva a una visita sin pases', () => {
    const message = new URL(
      buildWhatsAppUrl({ ...confirmation, reserved: null }),
    ).searchParams.get('text')
    expect(message).toContain('confírmenos la disponibilidad')
  })
})

describe('cuenta regresiva', () => {
  const target = '2026-12-05T14:00:00-06:00'
  it('utiliza el instante de Ciudad de México desde cualquier zona', () => {
    expect(
      getTimeRemaining(target, Date.parse('2026-12-04T18:58:59Z')),
    ).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1, expired: false })
  })
  it('se queda en cero después del evento', () => {
    expect(
      getTimeRemaining(target, Date.parse('2026-12-06T20:00:00Z')),
    ).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
  })
  it('evita NaN con fechas inválidas', () => {
    expect(getTimeRemaining('invalid').seconds).toBe(0)
  })
})
