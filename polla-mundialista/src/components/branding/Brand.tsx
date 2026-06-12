import { Link } from 'react-router-dom'

type BrandProps = {
  compact?: boolean
  inverse?: boolean
}

export function Brand({ compact = false, inverse = false }: BrandProps) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <span
        className={[
          'grid size-10 shrink-0 place-items-center rounded-xl text-sm font-black',
          inverse
            ? 'bg-white text-brand-950'
            : 'bg-brand-700 text-white',
        ].join(' ')}
      >
        26
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span
            className={[
              'block truncate text-sm font-bold leading-tight',
              inverse ? 'text-white' : 'text-slate-950',
            ].join(' ')}
          >
            Polla Mundialista
          </span>
          <span
            className={[
              'block truncate text-xs',
              inverse ? 'text-brand-200' : 'text-slate-500',
            ].join(' ')}
          >
            uPlanner Labs
          </span>
        </span>
      ) : null}
    </Link>
  )
}
