import { PageHeader } from '../components/ui/PageHeader'

type PlaceholderPageProps = {
  eyebrow: string
  title: string
  description: string
}

export function PlaceholderPage(props: PlaceholderPageProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 sm:px-10">
      <PageHeader {...props} />
    </div>
  )
}
