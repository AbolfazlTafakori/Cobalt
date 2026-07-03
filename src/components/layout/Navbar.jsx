import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Download, Moon, Sun, Menu, X } from 'lucide-react';
import { useContent } from '../../content/ContentContext';

export default function Navbar({ theme, onToggleTheme }) {
  const { content } = useContent();
  const { nav, profile } = content;
  const navLinks = nav.links;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative py-2 text-[15px] font-medium transition-colors ${
      isActive ? 'text-brand' : 'text-slate-300 hover:text-white'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-ink-900/80 backdrop-blur-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="flex h-[74px] w-full items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo — dark tile with a glossy top edge and two-tone initials */}
        <Link
          to="/"
          aria-label="Home"
          className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-ink-700 to-ink-900 text-[17px] font-extrabold tracking-tight shadow-lg ring-1 ring-inset ring-white/5"
        >
          {/* subtle top-left sheen */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
          <span className="relative">
            <span className="text-white">{nav.logo.charAt(0)}</span>
            <span className="text-brand">{nav.logo.slice(1)}</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === '/'} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-0 h-0.5 w-full rounded-full bg-brand" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-slate-200 transition-colors hover:border-white/25 hover:text-white"
          >
            {theme === 'dark' ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          <a
            href={profile.resumeUrl}
            download
            className="hidden items-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-semibold text-white shadow-brand-btn transition-transform hover:-translate-y-0.5 hover:bg-brand-dark sm:flex"
          >
            <Download size={18} />
            {nav.downloadLabel}
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-slate-200 lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-ink-900/95 backdrop-blur-lg lg:hidden">
          <ul className="container-page flex flex-col py-4">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-2 py-3 text-[15px] font-medium ${
                      isActive ? 'text-brand' : 'text-slate-300'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <a
              href={profile.resumeUrl}
              download
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-semibold text-white sm:hidden"
            >
              <Download size={18} />
              {nav.downloadLabel}
            </a>
          </ul>
        </div>
      )}
    </header>
  );
}
