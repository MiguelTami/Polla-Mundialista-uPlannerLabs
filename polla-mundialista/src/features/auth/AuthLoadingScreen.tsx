export function AuthLoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-950 px-4">
      <div className="text-center text-white" role="status">
        <span className="mx-auto block size-9 animate-spin rounded-full border-4 border-brand-700 border-t-white" />
        <p className="mt-4 text-sm font-semibold text-brand-100">
          Cargando tu sesión...
        </p>
      </div>
    </main>
  )
}
