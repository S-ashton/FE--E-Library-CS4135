import styles from "./RecDashboard.module.css";

export type RecDashboardItem = {
  bookId: number;
  title: string;
  author?: string;
  coverImageUrl?: string;
  metaLoading: boolean;
};

type RecDashboardProps = {
  title?: string;
  description?: string;
  onRefresh?: () => void | Promise<void>;
  onSelectRecommendation?: (bookId: number) => void | Promise<void>;
  isLoading?: boolean;
  /** When false, stats and list are gated. Defaults to true for standalone usage/tests. */
  isAuthenticated?: boolean;
  error?: string | null;
  recommendations?: RecDashboardItem[];
  lastUpdatedLabel?: string;
};

export default function RecDashboard({
  title = "Recommendations Dashboard",
  description = "Books we think you'll like!",
  onRefresh,
  onSelectRecommendation,
  isLoading = false,
  isAuthenticated = true,
  error = null,
  recommendations = [],
}: RecDashboardProps) {
  const showRecList = isAuthenticated;
  const refreshDisabled = isLoading || !showRecList || !onRefresh;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <button
          type="button"
          disabled={refreshDisabled}
          aria-busy={isLoading}
          className={styles.refreshButton}
          onClick={() => {
            void onRefresh?.();
          }}
        >
          Refresh
        </button>
      </div>

      <div className={styles.placeholderPanel}>
        {!showRecList && (
          <p className={styles.placeholderText}>
            Sign in to see personalised recommendations.
          </p>
        )}

        {showRecList && error ? (
          <p className={styles.errorText} role="alert">
            {error}
          </p>
        ) : null}

        {showRecList &&
        isLoading &&
        recommendations.length === 0 &&
        !error ? (
          <p className={styles.placeholderText}>Loading recommendations…</p>
        ) : null}

        {showRecList &&
        !isLoading &&
        recommendations.length === 0 &&
        !error ? (
          <p className={styles.placeholderText}>
            Recommended books will appear here in cards API is integrated. For
            now this is a placeholder.
          </p>
        ) : null}

        {showRecList && recommendations.length > 0 ? (
          <ul className={styles.recommendationsGrid}>
            {recommendations.map((item) => (
              <li key={item.bookId} className={styles.recommendationCard}>
                <div className={styles.recommendationCardTop}>
                  <div className={styles.coverThumb}>
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={
                          item.metaLoading
                            ? ""
                            : `${item.title || "Book"} cover`
                        }
                        className={styles.coverImage}
                      />
                    ) : (
                      <span className={styles.noCover}>No Cover</span>
                    )}
                  </div>

                  <div className={styles.recommendationCardBody}>
                    {item.metaLoading ? (
                      <p className={styles.loadingTitle}>Loading title…</p>
                    ) : (
                      <>
                        <p className={styles.bookTitle}>
                          {item.title || "Untitled"}
                        </p>
                        {item.author ? (
                          <p className={styles.bookAuthor}>{item.author}</p>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void onSelectRecommendation?.(item.bookId);
                  }}
                  className={styles.viewButton}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
