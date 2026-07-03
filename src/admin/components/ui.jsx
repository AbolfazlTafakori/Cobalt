// Shared admin UI primitives: page header, cards, fields, buttons, item rows.
import { Plus } from 'lucide-react';

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function Card({ title, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 ${className}`}
    >
      {title && <h2 className="mb-5 text-lg font-semibold text-white">{title}</h2>}
      {children}
    </section>
  );
}

export function Field({ label, hint, className = '', as = 'input', ...props }) {
  const Tag = as;
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-slate-300">
          {label}
        </span>
      )}
      <Tag
        {...props}
        className={`w-full rounded-xl border border-white/10 bg-ink-900/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${
          as === 'textarea' ? 'min-h-[110px] resize-y' : ''
        }`}
      />
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function Row({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

// Color picker synced with a hex text field. `value` may be a hex or 'none'.
export function ColorField({ label, value, onChange, hint }) {
  const swatch = value === 'none' || !value ? '#000000' : value;
  return (
    <div>
      {label && (
        <span className="mb-2 block text-sm font-medium text-slate-300">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={swatch}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#2563eb"
          className="w-36 rounded-xl border border-white/10 bg-ink-900/40 px-3 py-2.5 text-sm text-white focus:border-brand focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange('none')}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
        >
          No Border
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark shadow-brand-btn',
    outline:
      'border border-white/15 text-white hover:border-white/35 hover:bg-white/5',
    danger: 'border border-red-500/50 text-red-400 hover:bg-red-500/10',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${variants[variant]} ${className}`}
    />
  );
}

export function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-brand/40 bg-brand/5 px-5 py-3 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/10"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}

// A row in an editable list, with edit/delete actions.
export function ItemRow({ icon, title, subtitle, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
      {icon && (
        <img
          src={icon}
          alt=""
          className="h-10 w-10 shrink-0 rounded-lg bg-ink-700 object-contain p-1.5"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-white">{title}</p>
        {subtitle && (
          <p className="truncate text-sm text-slate-400">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <IconButton onClick={onEdit} label="Edit" />
        <IconButton onClick={onDelete} label="Delete" danger />
      </div>
    </div>
  );
}

function IconButton({ onClick, label, danger }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-white/10 transition-colors ${
        danger
          ? 'text-red-400 hover:border-red-500/50 hover:bg-red-500/10'
          : 'text-slate-300 hover:border-brand/40 hover:bg-brand/10 hover:text-brand'
      }`}
    >
      {danger ? <TrashIcon /> : <EditIcon />}
    </button>
  );
}

const EditIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export function EmptyState({ children }) {
  return (
    <p className="rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-slate-500">
      {children}
    </p>
  );
}
