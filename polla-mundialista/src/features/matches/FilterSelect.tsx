import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export type FilterSelectOption = {
  value: string
  label: string
}

type FilterSelectProps<TOption extends FilterSelectOption> = {
  label: string
  value: string
  options: TOption[]
  emptyLabel: string
  onChange: (value: string) => void
  renderTrailing?: (option: TOption) => ReactNode
}

export function FilterSelect<TOption extends FilterSelectOption>({
  label,
  value,
  options,
  emptyLabel,
  onChange,
  renderTrailing,
}: FilterSelectProps<TOption>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const selectOption = (nextValue: string) => {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
        className="mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left text-sm font-semibold text-slate-800 outline-none transition hover:border-brand-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label ?? emptyLabel}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {selectedOption && renderTrailing
            ? renderTrailing(selectedOption)
            : null}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={`h-4 w-4 text-slate-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <path
              d="m5 7.5 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
        >
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => selectOption('')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
              !value
                ? 'bg-brand-50 text-brand-800'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {emptyLabel}
            {!value ? <CheckIcon /> : null}
          </button>

          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option.value)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                  isSelected
                    ? 'bg-brand-50 text-brand-800'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{option.label}</span>
                <span className="flex shrink-0 items-center gap-3">
                  {renderTrailing ? renderTrailing(option) : null}
                  {isSelected ? <CheckIcon /> : null}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-brand-700"
    >
      <path
        d="m4.5 10.25 3.25 3.25 7.75-7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
