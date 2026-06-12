export function MatchCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex justify-between border-b border-slate-100 pb-4">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="h-3 w-28 rounded bg-slate-100" />
        </div>
        <div className="h-6 w-20 rounded-full bg-slate-100" />
      </div>
      <div className="grid grid-cols-3 gap-4 py-7">
        <div className="h-9 rounded bg-slate-100" />
        <div className="mx-auto h-7 w-10 rounded bg-slate-100" />
        <div className="h-9 rounded bg-slate-100" />
      </div>
    </div>
  )
}
