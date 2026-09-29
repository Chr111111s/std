import { useMemo, useSyncExternalStore } from 'react'
import { parseInvitation } from '@/lib/invitation'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

function getLocation() {
  return window.location.pathname + window.location.search
}

export function useInvitation() {
  const location = useSyncExternalStore(subscribe, getLocation)
  return useMemo(() => {
    const url = new URL(location, window.location.origin)
    return parseInvitation(url.pathname, url.search)
  }, [location])
}
