import { useEffect } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import AdminApp from './admin/AdminApp';
import { useContent } from './content/ContentContext';
import { useTheme } from './hooks/useTheme';
import { uploadUrl } from './admin/api';

// Public site shell: top navbar + routed section below.
function PublicLayout() {
  const { content } = useContent();
  const themeToggle = !!content.nav.themeToggle;
  const { theme, toggleTheme } = useTheme(themeToggle);
  return (
    <div className="min-h-screen bg-page">
      <ScrollToTop />
      {/* First tab stop on every page: jumps past the fixed navbar. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Outlet />
      </main>
    </div>
  );
}

function buildLogoFavicon(logoText, brand) {
  const text = (logoText || 'A').trim() || 'A';
  const first = text.charAt(0);
  const rest = text.slice(1);
  const brandColor = brand || '#2563eb';
  // Mirrors the navbar tile: dark rounded square, first char white, rest in brand.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f1729"/>
        <stop offset="1" stop-color="#080b16"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
          font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
          font-weight="800" font-size="34" letter-spacing="-1">
      <tspan fill="#ffffff">${first}</tspan><tspan fill="${brandColor}">${rest}</tspan>
    </text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function useDocumentHead() {
  const { content } = useContent();
  const p = content.profile || {};
  const logo = content.nav?.logo || '';
  const brand = content.theme?.brand || '';
  useEffect(() => {
    const fallback = `${p.firstName || ''} ${p.lastName || ''}${p.role ? ' — ' + p.role : ''}`.trim();
    const title = (p.pageTitle && p.pageTitle.trim()) || fallback;
    if (title) document.title = title;
  }, [p.pageTitle, p.firstName, p.lastName, p.role]);
  useEffect(() => {
    const href = p.favicon ? uploadUrl(p.favicon) : buildLogoFavicon(logo, brand);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.setAttribute('type', p.favicon ? '' : 'image/svg+xml');
    link.setAttribute('href', href);
  }, [p.favicon, logo, brand]);
}

export default function App() {
  useDocumentHead();
  return (
    <Routes>
      {/* Admin panel — no public navbar */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />

        {/* nginx serves index.html for every path, so unmatched URLs land
            here — send them home instead of rendering an empty shell. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
