import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { getLeaderboard } from './leaderboard.service'
import type { LeaderboardEntry } from './leaderboard.types'

export function useLeaderboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getLeaderboard()
      .then((data) => {
        if (isMounted) setEntries(data)
      })
      .catch((error: unknown) => {
        if (!isMounted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar la clasificación.',
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const currentUserEntry = useMemo(
    () => entries.find((entry) => entry.userId === user?.id),
    [entries, user?.id],
  )

  return {
    entries,
    currentUserEntry,
    isLoading,
    errorMessage,
  }
}
