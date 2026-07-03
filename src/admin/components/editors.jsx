import { Plus, Trash2 } from 'lucide-react';
import { Field } from './ui';

// Reusable editor for an array of strings (paragraphs, tags, bullet lists…).
export function StringListEditor({ label, items = [], onChange, placeholder, textarea }) {
  const update = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);

  return (
    <div>
      {label && (
        <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      )}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <Field
              as={textarea ? 'textarea' : 'input'}
              className="flex-1"
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
            />
            <button
              onClick={() => remove(i)}
              aria-label="Remove"
              className="mt-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-brand/40 bg-brand/5 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/10"
      >
        <Plus size={15} />
        Add
      </button>
    </div>
  );
}

// A removable framed block wrapping the fields of one object in a list.
export function ListItemBlock({ index, onRemove, children }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <button
        onClick={onRemove}
        aria-label="Remove item"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-red-400 hover:bg-red-500/10"
      >
        <Trash2 size={15} />
      </button>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        #{index + 1}
      </p>
      {children}
    </div>
  );
}

export function AddItemButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-brand/40 bg-brand/5 px-5 py-3 text-sm font-semibold text-brand hover:bg-brand/10"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}
