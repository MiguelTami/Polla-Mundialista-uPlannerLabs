const predictionErrors: Record<string, string> = {
  PREDICTION_LOCKED:
    'El partido ya comenzó y la predicción quedó bloqueada.',
  INVALID_SCORE: 'Ingresa marcadores entre 0 y 99.',
  MATCH_NOT_FOUND: 'El partido seleccionado ya no está disponible.',
  AUTH_REQUIRED: 'Tu sesión expiró. Inicia sesión nuevamente.',
}

export function getPredictionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const knownError = Object.entries(predictionErrors).find(([code]) =>
      error.message.includes(code),
    )

    return (
      knownError?.[1] ??
      'No pudimos guardar la predicción. Inténtalo nuevamente.'
    )
  }

  return 'No pudimos guardar la predicción. Inténtalo nuevamente.'
}
