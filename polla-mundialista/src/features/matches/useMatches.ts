import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getMatches } from './matches.service'
import type { Match } from './matches.types'

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      setMatches(await getMatches())
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar los partidos.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    getMatches()
      .then((data) => {
        if (isMounted) setMatches(data)
      })
      .catch((error: unknown) => {
        if (!isMounted) return

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar los partidos.',
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('matches-live-results')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
        },
        () => {
          getMatches()
            .then(setMatches)
            .catch(() => undefined)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  return {
    matches,
    isLoading,
    errorMessage,
    reload,
  }
}
