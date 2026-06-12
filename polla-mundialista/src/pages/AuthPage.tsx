import { Link } from 'react-router-dom'

export function AuthPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-950 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
        <span className="grid size-12 place-items-center rounded-xl bg-brand-700 text-sm font-black text-white">
          26
        </span>
        <p className="mt-7 text-sm font-bold uppercase tracking-wider text-brand-700">
          Próxima fase
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Autenticación
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          El registro y el inicio de sesión con Supabase Auth se implementarán en
          la Fase 1.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  )
}
