import { Link, Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    fontWeight: isActive ? 700 : 400,
  });

  return (
    <div>
      <header style={{ padding: "12px 16px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h2 style={{ margin: 0 }}>E-Library</h2>
          </Link>

          <nav style={{ display: "flex", gap: 12 }}>
            <NavLink to="/" style={linkStyle}>Home</NavLink>
            <NavLink to="/books" style={linkStyle}>Books</NavLink>
            <NavLink to="/login" style={linkStyle}>Login</NavLink>
          </nav>
        </div>
      </header>

      <main style={{ padding: "16px", maxWidth: 1100, margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
}