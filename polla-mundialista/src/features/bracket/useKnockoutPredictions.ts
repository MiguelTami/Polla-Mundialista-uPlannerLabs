import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMyKnockoutPredictions } from './bracket.service'
import type { KnockoutPrediction } from './bracket.types'

export function useKnockoutPredictions() {
  const [predictions, setPredictions] = useState<KnockoutPrediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getMyKnockoutPredictions()
      .then((data) => {
        if (isMounted) setPredictions(data)
      })
      .catch((error: unknown) => {
        if (!isMounted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar tu cuadro.',
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const predictionsByMatchNumber = useMemo(
    () =>
      new Map(
        predictions.map((prediction) => [
          prediction.matchNumber,
          prediction,
        ]),
      ),
    [predictions],
  )

  const updatePrediction = useCallback((prediction: KnockoutPrediction) => {
    setPredictions((current) => [
      ...current.filter(
        (item) => item.matchNumber !== prediction.matchNumber,
      ),
      prediction,
    ])
  }, [])

  return {
    predictionsByMatchNumber,
    isLoading,
    errorMessage,
    updatePrediction,
  }
}
