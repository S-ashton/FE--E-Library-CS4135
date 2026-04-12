import styles from "./ActiveLoansCard.module.css";

type ActiveLoansCardProps = {
  borrowedBooks: Array<{
    loanId: string;
    bookId: string;
    title: string;
    author: string;
    dueDate: string;
    status: string;
    fineAmount: number | null;
    coverImageUrl?: string;
  }>;
  state: "empty" | "loading" | "populated" | "error";
  isReturning?: boolean;
  onReturnBook?: (loanId: string) => void | Promise<void>;
};

export default function ActiveLoansCard({
  borrowedBooks,
  state,
  isReturning = false,
  onReturnBook,
}: ActiveLoansCardProps) {
  switch (state) {
    case "empty":
      return (
        <section className={styles.card}>
          <h2 className={styles.heading}>Active Loans</h2>
          <p className={styles.message}>You have no active loans.</p>
        </section>
      );

    case "loading":
      return (
        <section className={styles.card}>
          <h2 className={styles.heading}>Active Loans</h2>
          <p className={styles.message}>Loading active loans...</p>
        </section>
      );

    case "error":
      return (
        <section className={styles.card}>
          <h2 className={styles.heading}>Active Loans</h2>
          <p className={styles.message}>
            An error occurred while loading active loans.
          </p>
        </section>
      );

    case "populated":
      return (
        <section className={styles.card}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.heading}>Active Loans</h2>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Borrowed Books Count</p>
            <p className={styles.summaryValue}>{borrowedBooks.length}</p>
          </div>

          <div className={styles.loansGridWrapper}>
            {borrowedBooks.map((book) => (
              <div key={book.loanId} className={styles.loanCard}>
                <div className={styles.loanCardTop}>
                  <div className={styles.coverThumb}>
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={`${book.title} cover`}
                        className={styles.coverImage}
                      />
                    ) : (
                      <span className={styles.noCover}>No Cover</span>
                    )}
                  </div>
                  <div className={styles.loanCardBody}>
                    <h3 className={styles.loanTitle}>{book.title}</h3>
                    <p className={styles.loanMeta}>{book.author}</p>
                    <p className={styles.loanMeta}>
                      Due Date: {new Date(book.dueDate).toLocaleDateString()}
                    </p>
                    <p className={styles.loanMeta}>Status: {book.status}</p>

                    {book.fineAmount !== null && book.fineAmount > 0 && (
                      <p className={styles.fineText}>
                        Fine Amount: €{book.fineAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onReturnBook?.(book.loanId)}
                  disabled={isReturning}
                  className={`${styles.returnButton} ${
                    isReturning ? styles.returnButtonDisabled : ""
                  }`}
                >
                  {isReturning ? "Returning..." : "Return Book"}
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    default:
      return null;
  }
}