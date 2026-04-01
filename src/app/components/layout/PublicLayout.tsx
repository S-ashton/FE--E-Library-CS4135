import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Outlet />
      </div>
    </div>
  );
}