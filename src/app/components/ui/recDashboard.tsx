//import { useToast } from "../../hooks/useToast";

type RecDashboardProps = {
  title?: string;
  description?: string;
  onRefresh?: () => void;
};

export default function RecDashboard({
  title = "Recommendations Dashboard",
  description = "This area will show personalised book recommendations once the recommendations API is connected.",
  onRefresh,
}: RecDashboardProps) {

  //const { showSuccess } = useToast();

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        padding: "24px",
        display: "grid",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.4rem",
              color: "#0f172a",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              color: "#475569",
              maxWidth: "700px",
            }}
          >
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "10px 14px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#f8fafc",
          }}
        >
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Nice Box Title
          </p>
          <p style={{ margin: "8px 0 0", fontWeight: 700 }}>This is a nice box to be used for something</p>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#f8fafc",
          }}
        >
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Recommendation Count
          </p>
          <p style={{ margin: "8px 0 0", fontWeight: 700 }}>0</p>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#f8fafc",
          }}
        >
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Last Updated
          </p>
          <p style={{ margin: "8px 0 0", fontWeight: 700 }}>Not yet loaded</p>
        </div>
      </div>

      <div
        style={{
          border: "1px dashed #cbd5e1",
          borderRadius: "12px",
          padding: "20px",
          background: "#f8fafc",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#475569",
          }}
        >
          Recommended books will appear here in cards API is integrated. For now this is a placeholder.
        </p>
      </div>
    </section>
  );
}