import type { Prediction } from './predictions.types'

type LockedPredictionProps = {
  prediction?: Prediction
}

export function LockedPrediction({ prediction }: LockedPredictionProps) {
  return (
    <div className="border-t border-slate-100 pt-4 text-center">
      {prediction ? (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tu predicción
          </p>
          <p className="mt-2 text-xl font-black text-slate-900">
            {prediction.homeScore} – {prediction.awayScore}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            El partido comenzó y ya no puede modificarse.
          </p>
        </>
      ) : (
        <p className="text-xs font-semibold text-slate-500">
          Predicciones cerradas: el partido ya comenzó.
        </p>
      )}
    </div>
  )
}
