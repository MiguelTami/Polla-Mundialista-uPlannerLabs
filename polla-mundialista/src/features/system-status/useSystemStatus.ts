import { useEffect, useState } from 'react'
import { checkSupabaseConnection } from './systemStatus.service'

export type SystemStatus = 'checking' | 'online' | 'offline'

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus>('checking')

  useEffect(() => {
    let isMounted = true

    checkSupabaseConnection()
      .then(() => {
        if (isMounted) setStatus('online')
      })
      .catch(() => {
        if (isMounted) setStatus('offline')
      })

    return () => {
      isMounted = false
    }
  }, [])

  return status
}
