import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ToastContext, type ToastItem, type ToastType } from "./ToastContext";
import ToastViewport from "../components/ui/Toast/ToastViewport";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = crypto.randomUUID();

      setToasts((current) => [...current, { id, message, type }]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  const showSuccess = useCallback((message: string) => {
    addToast(message, "success");
  }, [addToast]);

  const showError = useCallback((message: string) => {
    addToast(message, "error");
  }, [addToast]);

  const value = useMemo(
    () => ({ showSuccess, showError }),
    [showSuccess, showError]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}