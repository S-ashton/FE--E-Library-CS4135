import { Link } from "react-router-dom";

export default function HomePage() {
  const mockRecommended = [
    { id: 1, title: "The Name of the Wind", author: "Patrick Rothfuss" },
    { id: 2, title: "Dune", author: "Frank Herbert" },
    { id: 3, title: "1984", author: "George Orwell" },
  ];

  const mockCategories = ["Fantasy", "Sci-Fi", "Mystery", "History", "Programming"];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Hero */}
      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h1 style={{ marginTop: 0 }}>Welcome to the E-Library</h1>
        <p style={{ marginBottom: 16 }}>
          Browse books, borrow titles, and get recommendations based on your activity.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/books">Browse catalogue →</Link>
          <Link to="/login">Login →</Link>
        </div>
      </section>

      {/* Search (placeholder) */}
      <section>
        <h2>Search</h2>
        <div style={{ display: "flex", gap: 8, maxWidth: 600 }}>
          <input
            placeholder="Search by title, author, keyword..."
            style={{ flex: 1, padding: 10 }}
            disabled
          />
          <button disabled style={{ padding: "10px 14px" }}>
            Search
          </button>
        </div>
        <small style={{ color: "#666" }}>
          (Placeholder — will connect to backend search API.)
        </small>
      </section>

      {/* Recommendations (placeholder) */}
      <section>
        <h2>Recommended for you</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {mockRecommended.map((b) => (
            <div key={b.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <strong>{b.title}</strong>
              <div style={{ color: "#666", marginTop: 6 }}>{b.author}</div>
              <div style={{ marginTop: 10 }}>
                <button disabled>View details</button>{" "}
                <button disabled>Borrow</button>
              </div>
            </div>
          ))}
        </div>
        <small style={{ color: "#666" }}>
          (Placeholder — later this will come from the recommender service.)
        </small>
      </section>

      {/* Categories (placeholder) */}
      <section>
        <h2>Browse by category</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {mockCategories.map((c) => (
            <button key={c} disabled style={{ padding: "8px 12px" }}>
              {c}
            </button>
          ))}
        </div>
        <small style={{ color: "#666" }}>
          (Placeholder — categories/filters will be connected later.)
        </small>
      </section>
    </div>
  );
}