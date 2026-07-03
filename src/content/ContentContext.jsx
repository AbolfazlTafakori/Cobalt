import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultContent, themeVarMap } from './defaultContent';
import { getContent, putContent } from '../admin/api';

const ContentContext = createContext(null);

export const useContent = () => useContext(ContentContext);

// Deep-merge saved content over the defaults (arrays replace wholesale).
function deepMerge(base, over) {
  if (over === undefined || over === null) return base;
  if (Array.isArray(over)) return over;
  if (typeof over === 'object' && typeof base === 'object' && !Array.isArray(base)) {
    const out = { ...base };
    for (const key of Object.keys(over)) out[key] = deepMerge(base[key], over[key]);
    return out;
  }
  return over;
}

// "#2563eb" -> "37 99 235" (space-separated channels for Tailwind alpha).
function hexToRgbChannels(hex) {
  if (!hex) return null;
  const m = hex.replace('#', '');
  if (m.length !== 6) return null;
  const n = parseInt(m, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function applyTheme(theme = {}) {
  const root = document.documentElement;
  for (const [key, varName] of Object.entries(themeVarMap)) {
    const rgb = hexToRgbChannels(theme[key]);
    if (rgb) root.style.setProperty(varName, rgb);
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  // Load saved content from the backend once; fall back to defaults on failure.
  useEffect(() => {
    let alive = true;
    getContent()
      .then((saved) => {
        if (alive && saved) setContent(deepMerge(defaultContent, saved));
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Push theme colors into CSS variables whenever they change.
  useEffect(() => {
    applyTheme(content.theme);
  }, [content.theme]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      loading,
      // Immutably update one top-level section, e.g. update('profile', p => ({...p, role}))
      updateSection: (key, updater) =>
        setContent((prev) => ({
          ...prev,
          [key]: typeof updater === 'function' ? updater(prev[key]) : updater,
        })),
      // Persist the current (or given) content to the backend (admin only).
      save: (next) => putContent(next ?? content),
    }),
    [content, loading],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}
