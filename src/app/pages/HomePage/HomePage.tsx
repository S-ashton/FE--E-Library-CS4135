import BookTable from "../../components/ui/BookTable/BookTable";
import RecommendationDashboardCard from "../../components/ui/recDashboard";
import { useManageBooks } from "../../hooks/useManageBooks";

export default function HomePage() {
  const {books} = useManageBooks();
  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
      }}
    >
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            color: "#0f172a",
          }}
        >
          Welcome to E-Library
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            maxWidth: "720px",
          }}
        >
          Explore books, manage your library activity, and discover personalised
          recommendations.
        </p>
      </section>

      <RecommendationDashboardCard
        onRefresh={() => {
          console.log("Refresh recommendations placeholder");
        }}
      />
      <BookTable
        title="Book Catalogue"
        books={books}
        mode="public"
        
      />
    </div>
    
    
  );
}