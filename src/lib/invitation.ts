export type Invitation = { guest: string; passes: number | null }
export type Attendance = 'yes' | 'no'

export function parseInvitation(
  pathname: string,
  search = '',
): Invitation | null {
  // Only the six invitation routes (with an optional trailing slash) are valid.
  const match = /^\/([1-6])\/?$/.exec(pathname)
  if (pathname !== '/' && !match) return null
  const params = new URLSearchParams(search)
  const guest = (params.get('invitado') ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 120)
  const passes = match ? Number(match[1]) : null
  return { guest, passes }
}

export function buildWhatsAppUrl({
  phone,
  name,
  attendance,
  reserved,
  note = '',
}: {
  phone: string
  name: string
  attendance: Attendance
  reserved: number
  note?: string
}) {
  if (!/^\d{10,15}$/.test(phone))
    throw new Error('Número de contacto inválido.')
  if (!name.trim()) throw new Error('Escribe tu nombre o el de tu familia.')
  if (!Number.isInteger(reserved) || reserved < 1 || reserved > 6) {
    throw new Error('Abre el enlace personal de tu invitación para confirmar.')
  }
  const response =
    attendance === 'yes'
      ? reserved === 1
        ? 'Confirmo mi asistencia a su boda el 5 de diciembre de 2026. Asistiré como 1 invitado. Tengo 1 lugar reservado.'
        : `Confirmamos nuestra asistencia a su boda el 5 de diciembre de 2026. Asistiremos ${reserved} invitados. Tenemos ${reserved} lugares reservados.`
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
