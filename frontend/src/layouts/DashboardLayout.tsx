import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, LibraryBig, BarChart3, Settings, LogOut, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/brand', label: 'Brand Setup', icon: Palette },
  { to: '/app/content', label: 'Create Content', icon: Sparkles },
  { to: '/app/library', label: 'Content Library', icon: LibraryBig },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-800 bg-slate-950/90 p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gold to-brand-blue font-black text-slate-950">B</div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand-gold">BrandForge</div>
              <div className="text-lg font-semibold">AI Studio</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 transition ${isActive ? 'bg-slate-800 text-white shadow-glow' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</div>
            <div className="mt-3 text-lg font-semibold">{user?.name ?? 'Creator'}</div>
            <div className="text-sm text-slate-400">{user?.email ?? 'demo@brandforge.ai'}</div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:border-brand-gold hover:text-brand-gold"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
