import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Reads out a project's full description. Closes on Escape, backdrop click or
// the close button; locks page scroll and restores focus while it is open.
export default function OverviewModal({ title, text, onClose }) {
  const closeRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const restoreFocusTo = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      restoreFocusTo?.focus?.();
    };
  }, [onClose]);

  // Portalled to <body> so the section's overflow-hidden and stacking
  // context can never clip or trap the dialog.
  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex animate-fade-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl animate-pop-in rounded-2xl border border-edge/10 bg-panel p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 id={titleId} className="text-lg font-bold text-fg">
            {title}
          </h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-edge/5 hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        <p className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-fg-soft">
          {text}
        </p>
      </div>
    </div>,
    document.body,
  );
}
