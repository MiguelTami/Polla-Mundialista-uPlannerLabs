import { StatCard } from '../../components/ui/StatCard'
import type { PredictionStatus } from './prediction-status'

type PredictionsSummaryProps = {
  total: number
  points: number
  statusCounts: Record<PredictionStatus, number>
}

const iconClassName = 'size-5'

export function PredictionsSummary({
  total,
  points,
  statusCounts,
}: PredictionsSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Registradas"
        value={String(total)}
        detail={`${statusCounts.pending} todavía se pueden modificar.`}
        icon={
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m8 12 2.5 2.5L16 9M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
      <StatCard
        label="Evaluadas"
        value={String(statusCounts.evaluated)}
        detail={`${statusCounts.locked} están bloqueadas a la espera de resultado.`}
        icon={
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5V11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
      <StatCard
        label="Puntos"
        value={String(points)}
        detail="Total obtenido en predicciones ya evaluadas."
        icon={
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 21h8M12 17v4M7 3h10v5a5 5 0 0 1-10 0V3ZM7 5H4v2a4 4 0 0 0 4 4M17 5h3v2a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
    </div>
  )
}
