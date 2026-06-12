import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/navigation/Navbar'
import { Sidebar } from '../components/navigation/Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7f5]">
      <Sidebar />
      <Navbar />
      <div className="lg:pl-72">
        <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
        <footer className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          Polla Mundialista 2026 · uPlanner Labs
        </footer>
      </div>
    </div>
  )
}
