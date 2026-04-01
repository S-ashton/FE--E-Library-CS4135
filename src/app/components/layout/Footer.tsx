export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "16px 24px",
          color: "#6b7280",
          fontSize: "0.95rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span>© 2026 E-Library</span>
        <span>THIS IS A FOOTER</span>
        <span>Discover your next read</span>
      </div>
    </footer>
  );
}