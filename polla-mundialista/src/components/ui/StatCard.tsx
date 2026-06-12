import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: string
  detail: string
  icon: ReactNode
}

export function StatCard({ label, value, detail, icon }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}
