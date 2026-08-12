/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // All theme colors are driven by CSS variables (see index.css) so the
        // admin panel can recolor the whole site at runtime. The `rgb(var / a)`
        // form keeps Tailwind's opacity utilities (e.g. bg-brand/10) working.
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          light: 'rgb(var(--c-brand-light) / <alpha-value>)',
          dark: 'rgb(var(--c-brand-dark) / <alpha-value>)',
        },
        ink: {
          900: 'rgb(var(--c-ink-900) / <alpha-value>)',
          800: 'rgb(var(--c-ink-800) / <alpha-value>)',
          700: 'rgb(var(--c-ink-700) / <alpha-value>)',
          600: 'rgb(var(--c-ink-600) / <alpha-value>)',
        },
        dot: 'rgb(var(--c-dot) / <alpha-value>)',

        // Semantic surfaces and text for the public site. These flip between
        // the dark and light themes; see the token block in index.css.
        // Brand blue tuned for text on the current theme. No alpha channel:
        // it is a resolved color, not a triplet (see --c-accent in index.css).
        accent: 'var(--c-accent)',
        page: 'rgb(var(--c-page) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        sunken: 'rgb(var(--c-sunken) / <alpha-value>)',
        edge: 'rgb(var(--c-edge) / <alpha-value>)',
        fg: {
          DEFAULT: 'rgb(var(--c-fg) / <alpha-value>)',
          soft: 'rgb(var(--c-fg-soft) / <alpha-value>)',
          muted: 'rgb(var(--c-fg-muted) / <alpha-value>)',
          subtle: 'rgb(var(--c-fg-subtle) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1840px',
      },
      boxShadow: {
        glow: '0 0 80px 20px rgb(var(--c-brand) / 0.45)',
        'brand-btn': '0 12px 30px -8px rgb(var(--c-brand) / 0.55)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out both',
        'pop-in': 'pop-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
