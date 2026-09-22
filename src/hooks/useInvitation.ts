import { useEffect, useMemo, useState } from 'react'
import { parseInvitation } from '@/lib/invitation'

export function useInvitation() {
  const [search, setSearch] = useState(() => window.location.search)
  useEffect(() => {
    const sync = () => setSearch(window.location.search)
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  return useMemo(() => parseInvitation(search), [search])
}
