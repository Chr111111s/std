import { useMemo, useState, type FormEvent } from 'react'
import { wedding } from '@/data/wedding'
import { useInvitation } from '@/hooks/useInvitation'
import {
  buildWhatsAppUrl,
  type Attendance,
  type Invitation,
} from '@/lib/invitation'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

function RsvpForm({ invitation }: { invitation: Invitation }) {
  const [name, setName] = useState(invitation.guest)
  const [attendance, setAttendance] = useState<Attendance>('yes')
  const [guests, setGuests] = useState('1')
  const [phone, setPhone] = useState<string>(wedding.contacts[0].phone)
  const [note, setNote] = useState('')
  const [prepared, setPrepared] = useState(false)
  const [error, setError] = useState('')
  const options = useMemo(
    () =>
      Array.from({ length: invitation.passes ?? 0 }, (_, index) => index + 1),
    [invitation.passes],
  )
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    try {
      const url = buildWhatsAppUrl({
        phone,
        name,
        attendance,
        guests: Number(guests),
        reserved: invitation.passes,
        note,
      })
      window.open(url, '_blank', 'noopener,noreferrer')
      setPrepared(true)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Revisa los datos para continuar.',
      )
    }
  }
  return (
    <form
      className="rsvp-form"
      onSubmit={submit}
      onChange={() => setPrepared(false)}
    >
      <div className="rsvp-personal">
        <Icon name="rings" />
        <p>
          {invitation.guest ? (
            <>
              <span>{invitation.guest},</span>{' '}
            </>
          ) : null}
          {invitation.passes ? (
            <>
              hemos reservado{' '}
              <strong>
                {invitation.passes}{' '}
                {invitation.passes === 1
                  ? 'lugar para ti'
                  : 'lugares para ustedes'}
                .
              </strong>
            </>
          ) : (
            'nos hará muy felices compartir este día contigo.'
          )}
        </p>
        <small>
          {invitation.passes
            ? 'Esta invitación está pensada especialmente para ustedes.'
            : 'Cuéntanos quién nos acompaña. Confirmaremos contigo la disponibilidad de lugares.'}
        </small>
      </div>
      <label className="field">
        Tu nombre o el de tu familia
        <input
          name="name"
          autoComplete="name"
          placeholder="Escribe aquí tu nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={120}
          pattern=".*\S.*"
        />
      </label>
      <fieldset className="attendance-field">
        <legend>¿Nos acompañas?</legend>
        <div className="attendance-options">
          <label>
            <input
              type="radio"
              name="attendance"
              value="yes"
              checked={attendance === 'yes'}
              onChange={() => setAttendance('yes')}
            />
            <span>
              <Icon name="check" /> Sí, con mucho gusto
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="attendance"
              value="no"
              checked={attendance === 'no'}
              onChange={() => setAttendance('no')}
            />
            <span>No podré asistir</span>
          </label>
        </div>
      </fieldset>
      <div className="form-row">
        {attendance === 'yes' ? (
          <label className="field">
            Personas que asistirán
            {invitation.passes ? (
              <select
                name="guests"
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
              >
                {options.map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? 'persona' : 'personas'}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="guests"
                type="number"
                min="1"
                max="100"
                step="1"
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                required
              />
            )}
          </label>
        ) : null}
        <label className="field">
          Enviar confirmación a
          <select
            name="contact"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          >
            {wedding.contacts.map((contact) => (
              <option key={contact.phone} value={contact.phone}>
                {contact.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        Un mensaje para los novios <span className="optional">(opcional)</span>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          placeholder="Nos encantará leerte…"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>
      <button type="submit" className="button button-primary w-full">
        <Icon name="message" /> Continuar en WhatsApp <Icon name="arrow" />
      </button>
      <p className="form-status" role="status">
        {error ||
          (prepared
            ? 'Mensaje preparado. Envíalo desde WhatsApp para completar tu confirmación.'
            : 'Se abrirá WhatsApp con tu respuesta lista para enviar.')}
      </p>
    </form>
  )
}

export function RsvpSection() {
  const invitation = useInvitation()
  return (
    <section
      id="confirmar"
      className="section-space rsvp-section"
      aria-labelledby="rsvp-title"
    >
      <div className="page-width rsvp-layout">
        <Reveal className="rsvp-intro">
          <p className="eyebrow">HAY UN LUGAR ESPECIAL PARA TI</p>
          <h2 id="rsvp-title" className="section-title">
            La celebración
            <br />
            no sería la misma
            <br />
            <em>sin ti.</em>
          </h2>
          <p className="section-intro">
            Ayúdanos a preparar cada detalle.
            <br />
            Confirma tu asistencia antes del
          </p>
          <p className="rsvp-deadline">
            15 de noviembre <span>de 2026</span>
          </p>
          <div className="rsvp-contacts">
            <p>Si tienes alguna duda, escríbenos.</p>
            {wedding.contacts.map((contact) => (
              <a
                key={contact.phone}
                href={`https://wa.me/${contact.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="message" />
                {contact.label}
                <Icon name="arrow" />
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <RsvpForm
            key={`${invitation.guest}:${invitation.passes}`}
            invitation={invitation}
          />
        </Reveal>
      </div>
    </section>
  )
}
