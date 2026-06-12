import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { SystemStatusCard } from '../features/system-status/SystemStatusCard'

const roadmap = [
  {
    number: '01',
    title: 'Crea tu cuenta',
    description: 'Regístrate e inicia sesión de forma segura con Supabase Auth.',
  },
  {
    number: '02',
    title: 'Predice los partidos',
    description: 'Guarda tus marcadores antes del inicio de cada encuentro.',
  },
  {
    number: '03',
    title: 'Compite por el primer lugar',
    description: 'Suma puntos y sigue tu posición en la clasificación general.',
  },
] as const

export function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-brand-950 px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-300">
            Mundial FIFA 2026
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Cada marcador cuenta.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-brand-100 sm:text-lg">
            Pronostica los resultados, acumula puntos y demuestra quién sabe más
            de fútbol en uPlanner Labs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/partidos"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-950 transition hover:bg-brand-100"
            >
              Ver partidos
            </Link>
            <Link
              to="/clasificacion"
              className="rounded-xl border border-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-900"
            >
              Ver clasificación
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section>
          <PageHeader
            eyebrow="Cómo funciona"
            title="Tu camino hacia la cima"
            description="La base técnica está lista para construir el flujo principal del MVP."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {roadmap.map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="text-sm font-black text-brand-600">
                  {item.number}
                </span>
                <h2 className="mt-3 font-bold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <SystemStatusCard />
          <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Estado del proyecto
            </p>
            <p className="mt-2 font-bold text-brand-950">Fase 0 · Base técnica</p>
            <p className="mt-2 text-sm leading-6 text-brand-800">
              Arquitectura, navegación, estilos y conexión de datos configurados.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
