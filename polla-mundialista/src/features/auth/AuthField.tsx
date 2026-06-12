import type { InputHTMLAttributes } from 'react'

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
}

export function AuthField({
  id,
  label,
  hint,
  className = '',
  ...inputProps
}: AuthFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input
        id={id}
        className={`mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-100 ${className}`}
        {...inputProps}
      />
      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          {hint}
        </span>
      ) : null}
    </label>
  )
}
