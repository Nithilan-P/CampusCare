import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/complaints', label: 'All Complaints' },
  { to: '/admin/students', label: 'Manage Students' },
  { to: '/admin/staff', label: 'Manage Staff' },
  { to: '/admin/reports', label: 'Reports & Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-64 flex-col border-r border-border bg-surface">
        <div className="border-b border-border px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            CampusCare
          </p>
          <p className="mt-1 text-xs text-text-secondary">Admin Portal</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border px-6 py-4">
          <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
          <p className="truncate text-xs text-text-secondary">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg border border-border py-2 text-sm font-medium text-text-secondary transition hover:border-danger hover:text-danger"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;