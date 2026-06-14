import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth/useAuth'
import { getMyPredictions } from './predictions.service'
import type { Prediction } from './predictions.types'

export function usePredictions() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getMyPredictions()
      .then((data) => {
        if (isMounted) setPredictions(data)
      })
      .catch((error: unknown) => {
        if (!isMounted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar tus predicciones.',
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
    if (!user) return

    const channel = supabase
      .channel(`predictions-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          getMyPredictions()
            .then(setPredictions)
            .catch(() => undefined)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [user])

  const predictionsByMatchId = useMemo(
    () =>
      new Map(
        predictions.map((prediction) => [
          String(prediction.matchId),
          prediction,
        ]),
      ),
    [predictions],
  )

  const updatePrediction = useCallback((prediction: Prediction) => {
    setPredictions((current) => {
      const existingIndex = current.findIndex(
        (item) => item.matchId === prediction.matchId,
      )

      if (existingIndex === -1) return [...current, prediction]

      return current.map((item) =>
        item.matchId === prediction.matchId ? prediction : item,
      )
    })
  }, [])

  return {
    predictions,
    predictionsByMatchId,
    isLoading,
    errorMessage,
    updatePrediction,
  }
}
