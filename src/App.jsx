import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import AdminApp from './admin/AdminApp';
import { useTheme } from './hooks/useTheme';

// Public site shell: top navbar + routed section below.
function PublicLayout() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-ink-800">
      <ScrollToTop />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
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
      </Route>
    </Routes>
  );
}
