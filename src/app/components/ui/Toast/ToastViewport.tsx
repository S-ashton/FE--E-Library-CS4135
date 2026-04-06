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
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        display: "grid",
        gap: "12px",
        zIndex: 2000,
        width: "min(360px, calc(100vw - 32px))",
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";

        return (
          <div
            key={toast.id}
            style={{
              border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}`,
              background: isSuccess ? "#f0fdf4" : "#fef2f2",
              color: isSuccess ? "#166534" : "#991b1b",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div style={{ fontWeight: 600 }}>{toast.message}</div>

            <button
              type="button"
              onClick={() => onClose(toast.id)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "1rem",
                color: "inherit",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}