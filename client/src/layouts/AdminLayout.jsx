import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', end: true },
  { to: '/admin/complaints', label: 'All Complaints', end: true },
  { to: '/admin/students', label: 'Manage Students' },
  { to: '/admin/staff', label: 'Manage Staff' },
  { to: '/admin/reports', label: 'Reports & Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background sm:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:hidden">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">CampusCare</p>
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg border border-border p-2 text-text-secondary"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar (mobile: collapsible, desktop: always visible) */}
      <aside
        className={`${
          mobileMenuOpen ? 'flex' : 'hidden'
        } w-full flex-col border-b border-border bg-surface sm:flex sm:w-64 sm:border-b-0 sm:border-r`}
      >
        <div className="hidden border-b border-border px-6 py-5 sm:block">
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
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
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

      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;