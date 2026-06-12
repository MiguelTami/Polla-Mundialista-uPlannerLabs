import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/useAuth'

export function ProfilePage() {
  const { user } = useAuth()
  const displayName =
    typeof user?.user_metadata.display_name === 'string'
      ? user.user_metadata.display_name
      : 'Participante'

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Tu cuenta"
        title="Perfil"
        description="Consulta la información vinculada a tu participación."
      />
      <section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="divide-y divide-slate-100">
          <div className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm font-semibold text-slate-500">Nombre visible</dt>
            <dd className="font-bold text-slate-900">{displayName}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm font-semibold text-slate-500">Correo</dt>
            <dd className="break-all text-slate-900">{user?.email}</dd>
          </div>
          <div className="grid gap-1 py-4 last:pb-0 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm font-semibold text-slate-500">Rol</dt>
            <dd>
              <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-800">
                Participante
              </span>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
