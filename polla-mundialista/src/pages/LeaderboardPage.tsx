import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/useAuth'
import { LeaderboardTable } from '../features/leaderboard/LeaderboardTable'
import { useLeaderboard } from '../features/leaderboard/useLeaderboard'

export function LeaderboardPage() {
  const { user } = useAuth()
  const { entries, isLoading, errorMessage } = useLeaderboard()

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Ranking general"
        title="Clasificación"
        description="Compara tus puntos y aciertos con los demás participantes."
      />

      <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <h2 className="font-black text-brand-950">Reglas de puntuación</h2>
        <p className="mt-2 text-sm leading-6 text-brand-800">
          Marcador exacto: 5 puntos · Ganador y diferencia exacta: 4 ·
          Ganador o empate correcto: 3 · Sin acierto: 0.
        </p>
      </section>

      {isLoading ? (
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="font-bold text-rose-900">
            No pudimos cargar la clasificación
          </h2>
          <p className="mt-2 text-sm text-rose-700">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && entries.length === 0 ? (
        <EmptyState
          title="La clasificación está vacía"
          description="Los participantes aparecerán aquí cuando sus perfiles estén activos."
        />
      ) : null}

      {!isLoading && !errorMessage && entries.length > 0 ? (
        <LeaderboardTable entries={entries} currentUserId={user?.id} />
      ) : null}
    </div>
  )
}
