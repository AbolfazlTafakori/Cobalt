import { useEffect } from 'react';
import { X } from 'lucide-react';

// Centered overlay dialog. Closes on backdrop click or Escape.
export default function Modal({ open, title, onClose, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl border border-white/10 bg-ink-700 p-6 shadow-2xl sm:p-7`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalActions({ children }) {
  return <div className="mt-6 flex justify-end gap-3">{children}</div>;
}
