import { useEffect, useRef, useState } from 'react'

export function useCopyToClipboard() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timeout.current), [])

  async function copyToClipboard(value: string) {
    clearTimeout(timeout.current)
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
      timeout.current = setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }
  return { status, copyToClipboard }
}
