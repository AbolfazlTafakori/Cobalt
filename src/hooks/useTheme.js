import { useEffect, useState } from 'react';

// Class-based dark/light theme with localStorage persistence.
// The design ships dark-first, so dark is the default — and when the owner has
// not enabled the navbar switch, dark is the only theme: a stored preference
// from a time the switch was on must not leave the site light with no way back.
export function useTheme(enabled = true) {
  const [stored, setStored] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('theme') || 'dark';
  });

  const theme = enabled ? stored : 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // With the switch off, drop any stored preference too — otherwise the
    // pre-paint script in index.html keeps honoring it and the page flashes
    // light for a frame before this effect corrects it.
    if (!enabled) localStorage.removeItem('theme');
  }, [theme, enabled]);

  const toggleTheme = () =>
    setStored((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });

  return { theme, toggleTheme };
}
