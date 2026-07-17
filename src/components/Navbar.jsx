import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-3 shadow-sm">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">SIMS Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, {user?.name ?? 'Guest'}</p>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
            {user?.role?.charAt(0) ?? 'G'}
          </span>
          <div>
            <p className="font-medium">{user?.name ?? 'Guest'}</p>
            <p className="text-xs text-slate-500">{user?.role ?? 'Visitor'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
