import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/navigation/Navbar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7f5]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Outlet />
      </main>
    </div>
  )
}
