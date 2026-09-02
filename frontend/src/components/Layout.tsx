import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span aria-hidden>✈️</span> Sistema Aéreo
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/reservas" className="text-sm text-slate-600 hover:text-slate-900">
              Reservas
            </Link>
            <span className="text-xs text-slate-400">projeto de portfólio</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
