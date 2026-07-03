import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { navGroups } from '../nav';
import { clearToken } from '../api';

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(() =>
    Object.fromEntries(navGroups.map((g) => [g.label, true])),
  );

  const toggle = (label) => setOpen((o) => ({ ...o, [label]: !o[label] }));

  const logout = () => {
    clearToken();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? 'bg-brand/15 font-medium text-brand'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-sm font-extrabold text-white shadow-brand-btn">
          AT
        </span>
        <div>
          <p className="font-bold leading-tight text-white">Admin Panel</p>
          <p className="text-xs text-slate-500">Resume CMS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            <button
              onClick={() => toggle(group.label)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-300"
            >
              <span>
                {group.emoji} {group.label}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform ${open[group.label] ? '' : '-rotate-90'}`}
              />
            </button>
            {open[group.label] && (
              <ul className="mt-1 space-y-1">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
                      <item.icon size={16} />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-2 border-t border-white/5 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          ← View Site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
