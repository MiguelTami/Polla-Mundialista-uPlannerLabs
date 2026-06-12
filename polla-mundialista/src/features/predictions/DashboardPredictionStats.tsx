import { StatCard } from '../../components/ui/StatCard'
import { usePredictions } from './usePredictions'

const iconClassName = 'size-5'

export function DashboardPredictionStats() {
  const { predictions, isLoading } = usePredictions()
  const totalPoints = predictions.reduce(
    (total, prediction) => total + prediction.pointsAwarded,
    0,
  )
  const loadingValue = isLoading ? '…' : undefined

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Puntos"
        value={loadingValue ?? String(totalPoints)}
        detail="Total obtenido en predicciones evaluadas."
        icon={
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 21h8M12 17v4M7 3h10v5a5 5 0 0 1-10 0V3ZM7 5H4v2a4 4 0 0 0 4 4M17 5h3v2a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
      <StatCard
        label="Posición"
        value="—"
        detail="Se calculará en la fase de clasificación."
        icon={
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 21v-6H3v6h4ZM14 21V9h-4v12h4ZM21 21V3h-4v18h4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        }
      />
      <StatCard
        label="Predicciones"
        value={loadingValue ?? String(predictions.length)}
        detail="Partidos para los que ya registraste un marcador."
        icon={
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m8 12 2.5 2.5L16 9M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
    </div>
  )
}
