import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, isError = false) => {
    setToast({ message, isError });
    window.clearTimeout(show._t);
    show._t = window.setTimeout(() => setToast(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl border px-5 py-3.5 text-sm font-medium shadow-lg backdrop-blur ${
            toast.isError
              ? 'border-red-500/40 bg-red-500/15 text-red-300'
              : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
          }`}
        >
          {toast.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
