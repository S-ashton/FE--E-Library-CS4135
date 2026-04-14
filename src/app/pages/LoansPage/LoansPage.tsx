import { useEffect, useMemo } from "react";
import { useAllLoans } from "../../hooks/useAllLoans";
import type { LoanDTO } from "../../types/loan";
import styles from "./LoansPage.module.css";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isOverdue(loan: LoanDTO): boolean {
  if (loan.status === "OVERDUE") return true;
  if (loan.status === "RETURNED") return false;
  return new Date(loan.dueDate) < new Date();
}

export default function LoansPage() {
  const { allLoans, isLoadingAllLoans, error, refreshAllLoans } = useAllLoans();

  useEffect(() => {
    void refreshAllLoans().catch(() => {});
  }, [refreshAllLoans]);

  const activeLoans = useMemo<LoanDTO[]>(() => {
    return allLoans
      .filter((l) => l.status !== "RETURNED")
      .sort((a, b) => {
        const aOver = isOverdue(a) ? 0 : 1;
        const bOver = isOverdue(b) ? 0 : 1;
        if (aOver !== bOver) return aOver - bOver;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [allLoans]);

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#0f172a" }}>
          Active Loans
        </h1>
        <p style={{ margin: "12px 0 0", color: "#475569", maxWidth: "720px" }}>
          All currently active and overdue loans across the library.
        </p>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "24px",
        }}
      >
        {isLoadingAllLoans ? (
          <p className={styles.loadingMsg}>Loading loans…</p>
        ) : error ? (
          <p className={styles.errorMsg}>{error}</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Book Title</th>
                  <th>Book ID</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Fine (€)</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyMsg}>
                      No active loans found.
                    </td>
                  </tr>
                ) : (
                  activeLoans.map((loan) => {
                    const overdue = isOverdue(loan);
                    return (
                      <tr key={loan.id}>
                        <td>{loan.userEmail ?? '—'}</td>
                        <td>{loan.bookTitle ?? '—'}</td>
                        <td>{loan.bookId}</td>
                        <td>{formatDate(loan.dueDate)}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              overdue ? styles.statusOverdue : styles.statusActive
                            }`}
                          >
                            {overdue ? "Overdue" : "Active"}
                          </span>
                        </td>
                        <td>
                          {loan.fineAmount > 0 ? (
                            <span className={styles.fineAmount}>
                              €{loan.fineAmount.toFixed(2)}
                            </span>
                          ) : (
                            <span className={styles.fineNone}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
