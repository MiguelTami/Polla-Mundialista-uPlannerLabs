import { Link } from 'react-router-dom'
import { StatCard } from '../components/ui/StatCard'
import { useAuth } from '../features/auth/useAuth'
import { UpcomingMatches } from '../features/matches/UpcomingMatches'

const cardIconClass = 'size-5'

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
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Puntos"
            value="0"
            detail="Se actualizarán después de los primeros resultados."
            icon={
              <svg className={cardIconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 21h8M12 17v4M7 3h10v5a5 5 0 0 1-10 0V3ZM7 5H4v2a4 4 0 0 0 4 4M17 5h3v2a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Posición"
            value="—"
            detail="Aparecerá cuando la clasificación tenga participantes."
            icon={
              <svg className={cardIconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 21v-6H3v6h4ZM14 21V9h-4v12h4ZM21 21V3h-4v18h4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Predicciones"
            value="0"
            detail="Aquí verás cuántos partidos has pronosticado."
            icon={
              <svg className={cardIconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m8 12 2.5 2.5L16 9M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>
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
