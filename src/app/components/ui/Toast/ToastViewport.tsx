import styles from "./ToastViewport.module.css";

type ToastType = "success" | "error";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastViewportProps = {
  toasts: ToastItem[];
  onClose: (id: string) => void;
};

export default function ToastViewport({
  toasts,
  onClose,
}: ToastViewportProps) {
  return (
    <div className={styles.viewport}>
      {toasts.map((toast) => {
        const toastClass =
          toast.type === "success" ? styles.successToast : styles.errorToast;

        return (
          <div
            key={toast.id}
            className={`${styles.toast} ${toastClass}`}
          >
            <div className={styles.message}>{toast.message}</div>

            <button
              type="button"
              onClick={() => onClose(toast.id)}
              className={styles.closeButton}
              aria-label="Close toast"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}