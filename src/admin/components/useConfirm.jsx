import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal, { ModalActions } from './Modal';
import { Button } from './ui';

const ConfirmContext = createContext(() => {});

export const useConfirm = () => useContext(ConfirmContext);

// Promise-based confirm dialog: `await confirm({ title, message })`.
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => {
    setState({
      title: opts.title || 'Delete item?',
      message: opts.message || 'This action cannot be undone.',
      confirmLabel: opts.confirmLabel || 'Delete',
    });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result) => {
    setState(null);
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!state}
        title={state?.title || ''}
        onClose={() => close(false)}
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-red-500/15 text-red-400">
            <Trash2 size={26} />
          </span>
          <p className="mt-4 text-sm text-slate-400">{state?.message}</p>
        </div>
        <ModalActions>
          <Button variant="outline" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => close(true)}>
            {state?.confirmLabel}
          </Button>
        </ModalActions>
      </Modal>
    </ConfirmContext.Provider>
  );
}
