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
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
