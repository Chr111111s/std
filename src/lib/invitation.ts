export type Invitation = { guest: string; passes: number | null }
export type Attendance = 'yes' | 'no'

export function parseInvitation(search: string): Invitation {
  const params = new URLSearchParams(search)
  const guest = (params.get('invitado') ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 120)
  const rawPasses = params.get('pases') ?? ''
  const number = Number(rawPasses)
  // Invalid values never become a reservation. The limit guards URL abuse.
  const passes =
    /^\d+$/.test(rawPasses) &&
    Number.isSafeInteger(number) &&
    number >= 1 &&
    number <= 100
      ? number
      : null
  return { guest, passes }
}

export function buildWhatsAppUrl({
  phone,
  name,
  attendance,
  guests,
  reserved,
  note = '',
}: {
  phone: string
  name: string
  attendance: Attendance
  guests: number
  reserved: number | null
  note?: string
}) {
  if (!/^\d{10,15}$/.test(phone))
    throw new Error('Número de contacto inválido.')
  if (!name.trim()) throw new Error('Escribe tu nombre o el de tu familia.')
  if (
    attendance === 'yes' &&
    (!Number.isInteger(guests) || guests < 1 || guests > (reserved ?? 100))
  ) {
    throw new Error('Selecciona un número de asistentes válido.')
  }
  const response =
    attendance === 'yes'
      ? `Confirmamos nuestra asistencia a su boda el 5 de diciembre de 2026. Asistiremos ${guests} ${guests === 1 ? 'persona' : 'personas'}.${reserved ? ` Tenemos ${reserved} ${reserved === 1 ? 'lugar reservado' : 'lugares reservados'}.` : ' Por favor, confírmenos la disponibilidad de lugares.'}`
      : 'Gracias por invitarnos a su boda el 5 de diciembre de 2026. Lamentablemente no podremos acompañarlos.'
  const message = `Hola, Valeria y Eduardo. Soy ${name.trim()}.\n${response}${note.trim() ? `\nNota: ${note.trim()}` : ''}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function getTimeRemaining(targetDate: string, now = Date.now()) {
  const difference = new Date(targetDate).getTime() - now
  const seconds = Number.isFinite(difference)
    ? Math.max(0, Math.floor(difference / 1000))
    : 0
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
    expired: seconds === 0,
  }
}
