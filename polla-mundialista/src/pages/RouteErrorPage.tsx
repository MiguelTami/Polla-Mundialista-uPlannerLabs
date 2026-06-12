import { Link, useRouteError } from 'react-router-dom'

export function RouteErrorPage() {
  const error = useRouteError()

  console.error(error)

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-rose-600">
          Error inesperado
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">
          No pudimos cargar esta pantalla
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Intenta regresar al inicio. Si el problema continúa, revisa la consola
          del navegador.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white"
        >
          Ir al inicio
        </Link>
      </section>
    </main>
  )
}
