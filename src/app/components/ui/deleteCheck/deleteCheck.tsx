type deleteCheckProps = {
  bookTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function deleteCheck({
  bookTitle,
  onConfirm,
  onCancel,
}: deleteCheckProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "28px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.4rem",
              lineHeight: 1.2,
              color: "#0f172a",
            }}
          >
            Are you sure?
          </h2>

          <p
            style={{
              margin: "12px 0 0",
              color: "#475569",
            }}
          >
            {bookTitle
              ? `Do you want to delete "${bookTitle}" from the library?`
              : "Do you want to delete this book from the library?"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              padding: "10px 14px",
              background: "#ffffff",
              color: "#0f172a",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "10px 14px",
              background: "#dc2626",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}