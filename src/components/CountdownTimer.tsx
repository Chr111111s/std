import { useEffect, useState } from 'react'
import { getTimeRemaining } from '@/lib/invitation'

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState(() => getTimeRemaining(targetDate))
  useEffect(() => {
    const update = () => setTime(getTimeRemaining(targetDate))
    const interval = window.setInterval(update, 1000)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', update)
    }
  }, [targetDate])
  const units = [
    { label: 'Días', value: time.days },
    { label: 'Horas', value: time.hours },
    { label: 'Minutos', value: time.minutes },
    { label: 'Segundos', value: time.seconds },
  ]
  return (
    <div className="countdown-wrap">
      <p className="eyebrow">
        {time.expired
          ? 'Nuestro gran día ha llegado'
          : 'Cada vez más cerca del sí'}
      </p>
      <dl className="countdown" aria-label="Cuenta regresiva para nuestra boda">
        {units.map(({ label, value }) => (
          <div key={label}>
            <dd>{String(value).padStart(2, '0')}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
