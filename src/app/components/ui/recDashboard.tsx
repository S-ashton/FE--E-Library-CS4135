import styles from "./ActiveLoansCard/ActiveLoansCard.module.css";

export type RecommendationRow = {
  bookId: number;
  score: number;
  /** Empty while real titles are loading from the book service. */
  title: string;
  author?: string;
  coverImageUrl?: string;
  metaLoading?: boolean;
};

function formatScore(score: number) {
  if (score >= 0 && score <= 1) {
    return `${(score * 100).toFixed(0)}%`;
  }
  return score.toFixed(2);
}

type RecDashboardProps = {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  error?: string | null;
  recommendations?: RecommendationRow[];
  lastUpdatedLabel?: string;
  /** When false, shows a sign-in hint instead of calling refresh meaningful. */
  isAuthenticated?: boolean;
  /** Loan history is still loading (avoid flash of borrow-first empty). */
  isHistoryLoading?: boolean;
  /**
   * Signed in, history loaded, user has never had a loan — show borrow-first copy
   * instead of calling the recommendations API.
   */
  showBorrowFirstEmpty?: boolean;
};

export default function RecDashboard({
  title = "Recommendations Dashboard",
  description = "Personalised picks based on your borrowing activity (recommendation service).",
  onRefresh,
  isLoading = false,
  error = null,
  recommendations = [],
  lastUpdatedLabel = "Not yet loaded",
  isAuthenticated = true,
  isHistoryLoading = false,
  showBorrowFirstEmpty = false,
}: RecDashboardProps) {
  const count = recommendations.length;
  const showRecList =
    isAuthenticated &&
    !isHistoryLoading &&
    !showBorrowFirstEmpty;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.message} style={{ marginTop: "8px", maxWidth: "700px" }}>
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || !showRecList}
          className={`${styles.returnButton} ${
            isLoading || !showRecList ? styles.returnButtonDisabled : ""
          }`}
        >
          {isLoading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && isAuthenticated && showRecList ? (
        <p className={styles.message} style={{ color: "#b91c1c" }} role="alert">
          {error}
        </p>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Recommendation count</p>
          <p className={styles.summaryValue}>
            {!showRecList ? "—" : isLoading ? "…" : count}
          </p>
        </div>

        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Last updated</p>
          <p className={styles.summaryValue}>
            {!showRecList ? "—" : lastUpdatedLabel}
          </p>
        </div>
      </div>

      <div className={styles.loansGridWrapper}>
        {!isAuthenticated ? (
          <p className={styles.message} style={{ gridColumn: "1 / -1" }}>
            Sign in to see personalised recommendations.
          </p>
        ) : isHistoryLoading ? (
          <p className={styles.message} style={{ gridColumn: "1 / -1" }}>
            Loading your library activity…
          </p>
        ) : showBorrowFirstEmpty ? (
          <p className={styles.message} style={{ gridColumn: "1 / -1" }}>
            Once you start borrowing books, recommended titles will appear here.
          </p>
        ) : isLoading && recommendations.length === 0 ? (
          <p className={styles.message} style={{ gridColumn: "1 / -1" }}>
            Loading recommendations…
          </p>
        ) : recommendations.length === 0 ? (
          <p className={styles.message} style={{ gridColumn: "1 / -1" }}>
            No recommendations yet. Check back after the service has enough data.
          </p>
        ) : (
          recommendations.map((r) => (
            <div key={r.bookId} className={styles.loanCard}>
              <div className={styles.loanCardTop}>
                <div className={styles.coverThumb}>
                  {r.metaLoading ? (
                    <span className={styles.noCover}>…</span>
                  ) : r.coverImageUrl ? (
                    <img
                      src={r.coverImageUrl}
                      alt={
                        r.title
                          ? `${r.title} cover`
                          : "Recommended book cover"
                      }
                      className={styles.coverImage}
                    />
                  ) : (
                    <span className={styles.noCover}>No Cover</span>
                  )}
                </div>
                <div className={styles.loanCardBody}>
                  <h3 className={styles.loanTitle}>
                    {r.metaLoading ? (
                      <span
                        className={styles.loanMeta}
                        style={{ fontSize: "1rem" }}
                      >
                        Loading book details…
                      </span>
                    ) : (
                      r.title
                    )}
                  </h3>
                  {!r.metaLoading ? (
                    <p className={styles.loanMeta}>
                      {r.author?.trim() ? r.author : "—"}
                    </p>
                  ) : null}
                  <p className={styles.loanMeta}>
                    Relevance: {formatScore(r.score)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
