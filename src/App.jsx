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

export default function App() {
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
