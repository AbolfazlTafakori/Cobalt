import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

// Shell for all authenticated admin pages: fixed sidebar + scrollable content.
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-ink-800 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-ink-800/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-bold">Admin Panel</span>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-ink-800">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="lg:pl-72">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
