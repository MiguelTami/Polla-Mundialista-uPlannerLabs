import { Link } from 'react-router-dom'
import { LoginForm } from '../features/auth/LoginForm'
import { RegisterForm } from '../features/auth/RegisterForm'

type AuthPageProps = {
  mode: 'login' | 'register'
}

const content = {
  login: {
    eyebrow: 'Bienvenido de vuelta',
    title: 'Inicia sesión',
    description: 'Ingresa para registrar tus marcadores y seguir tu posición.',
    alternative: '¿Aún no tienes una cuenta?',
    linkLabel: 'Crear cuenta',
    linkTo: '/registro',
  },
  register: {
    eyebrow: 'Únete a la competencia',
    title: 'Crea tu cuenta',
    description: 'Regístrate para comenzar a predecir el Mundial 2026.',
    alternative: '¿Ya tienes una cuenta?',
    linkLabel: 'Iniciar sesión',
    linkTo: '/login',
  },
} as const

export function AuthPage({ mode }: AuthPageProps) {
  const pageContent = content[mode]

  return (
    <main className="grid min-h-screen bg-brand-950 lg:grid-cols-[1fr_34rem]">
      <section className="hidden px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/login" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white text-sm font-black text-brand-950">
            26
          </span>
          <span className="font-bold">Polla Mundialista · uPlanner Labs</span>
        </Link>

        <div className="max-w-xl pb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-300">
            Mundial FIFA 2026
          </p>
          <h2 className="mt-5 text-5xl font-black leading-tight tracking-tight">
            Pronostica. Compite. Celebra cada punto.
          </h2>
          <p className="mt-6 text-lg leading-8 text-brand-100">
            Todos los partidos, una clasificación y el orgullo de acertar el
            marcador que nadie más vio venir.
          </p>
        </div>
      </section>

      <section className="grid place-items-center bg-[#f5f7f5] px-4 py-10 sm:px-8 lg:rounded-l-[2.5rem]">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-brand-950/10 sm:p-9">
          <span className="grid size-12 place-items-center rounded-xl bg-brand-700 text-sm font-black text-white lg:hidden">
            26
          </span>
          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-brand-700 lg:mt-0">
            {pageContent.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {pageContent.title}
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            {pageContent.description}
          </p>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}

          <p className="mt-7 text-center text-sm text-slate-600">
            {pageContent.alternative}{' '}
            <Link
              to={pageContent.linkTo}
              className="font-bold text-brand-700 hover:text-brand-900"
            >
              {pageContent.linkLabel}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
