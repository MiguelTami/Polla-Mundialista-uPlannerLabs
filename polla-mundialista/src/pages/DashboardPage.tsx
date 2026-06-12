import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { UpcomingMatches } from '../features/matches/UpcomingMatches'
import { DashboardPredictionStats } from '../features/predictions/DashboardPredictionStats'

export function DashboardPage() {
  const { user } = useAuth()
  const displayName =
    typeof user?.user_metadata.display_name === 'string'
      ? user.user_metadata.display_name.split(' ')[0]
      : 'participante'

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl bg-brand-950 px-6 py-9 text-white sm:px-9 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">
          Mundial FIFA 2026
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Hola, {displayName}
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-brand-100">
          Tu cuenta está lista. Cuando publiquemos los partidos podrás comenzar
          a registrar tus predicciones.
        </p>
        <Link
          to="/partidos"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-950 transition hover:bg-brand-100"
        >
          Explorar partidos
        </Link>
      </section>

      <section aria-labelledby="summary-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-700">
              Tu resumen
            </p>
            <h2 id="summary-title" className="mt-1 text-2xl font-black text-slate-950">
              Estado de la polla
            </h2>
          </div>
        </div>
        <DashboardPredictionStats />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-700">
            Próximos partidos
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">
            Prepara tus marcadores
          </h2>
        </div>
        <div className="mt-5">
          <UpcomingMatches />
        </div>
      </section>
    </div>
  )
}
