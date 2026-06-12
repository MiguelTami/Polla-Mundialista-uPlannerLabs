import { useSystemStatus, type SystemStatus } from './useSystemStatus'

const statusContent: Record<
  SystemStatus,
  { label: string; detail: string; dotClass: string }
> = {
  checking: {
    label: 'Comprobando conexión',
    detail: 'Validando la comunicación con Supabase.',
    dotClass: 'bg-amber-400 animate-pulse',
  },
  online: {
    label: 'Supabase conectado',
    detail: 'La base de datos está respondiendo correctamente.',
    dotClass: 'bg-emerald-500',
  },
  offline: {
    label: 'Conexión no disponible',
    detail: 'Revisa las variables de entorno, la tabla teams y sus políticas RLS.',
    dotClass: 'bg-rose-500',
  },
}

export function SystemStatusCard() {
  const status = useSystemStatus()
  const content = statusContent[status]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-1.5 size-2.5 shrink-0 rounded-full ${content.dotClass}`}
        />
        <div>
          <h2 className="font-bold text-slate-950">{content.label}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{content.detail}</p>
        </div>
      </div>
    </section>
  )
}
