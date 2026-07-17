import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const menuByRole = {
  Admin: [
    { to: '/', label: 'Dashboard' },
    { to: '/students', label: 'Students' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/payments', label: 'Payments' },
    { to: '/users', label: 'Users' },
    { to: '/profile', label: 'Profile' },
  ],
  Teacher: [
    { to: '/', label: 'Dashboard' },
    { to: '/students', label: 'Students' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/profile', label: 'Profile' },
  ],
  Cashier: [
    { to: '/', label: 'Dashboard' },
    { to: '/students', label: 'Students' },
    { to: '/payments', label: 'Payments' },
    { to: '/profile', label: 'Profile' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = menuByRole[user?.role] ?? menuByRole.Admin;

  return (
    <aside className="sticky top-0 h-[calc(100vh-64px)] w-full max-w-[220px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-3 py-6">
      <div className="mb-6 px-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Navigation</div>
      <nav className="space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-500 text-white' : 'text-slate-700 hover:bg-slate-100'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
