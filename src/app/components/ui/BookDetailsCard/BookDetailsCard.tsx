import type { Book } from "../../../types/book";
import type { CopyAvailability } from "../../../types/copyAvailability";
import styles from "./BookDetailsCard.module.css";

type BookDetailsCardProps = {
  book: Book;
  onClose: () => void;
  onBorrow: (book: Book) => void;
  error?: string | null;
  isSubmitting?: boolean;
  copyAvailability?: CopyAvailability;
  isAlreadyBorrowed?: boolean;
};

export default function BookDetailsCard({
  book,
  onClose,
  onBorrow,
  error,
  isSubmitting = false,
  copyAvailability,
  isAlreadyBorrowed = false,
}: BookDetailsCardProps) {
  const checking =
    copyAvailability === undefined || copyAvailability === "loading";
  const canBorrow =
    !isAlreadyBorrowed &&
    !checking &&
    copyAvailability === "available";
  const borrowDisabled = isSubmitting || checking || !canBorrow;
  const borrowLabel = isSubmitting
    ? "Borrowing..."
    : isAlreadyBorrowed
      ? "Already borrowed"
      : checking
        ? "Checking…"
        : canBorrow
          ? "Borrow Book"
          : "No copy available";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{book.title}</h2>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close book details"
          >
            &times;
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.cover}>
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={`${book.title} cover`}
                className={styles.coverImage}
              />
            ) : (
              <div className={styles.noCover}>No Cover</div>
            )}
          </div>

          <div className={styles.details}>
            <p className={styles.metaText}>
              <strong>Author:</strong> {book.author}
            </p>

            <p className={styles.metaText}>
              <strong>Genre:</strong> {book.category}
            </p>

            <p className={styles.metaText}>
              <strong>Year:</strong> {book.yearPublished}
            </p>

            <p className={styles.description}>
              {book.description ?? "No description available."}
            </p>

            {error && <p className={styles.errorText}>{error}</p>}

            <button
              type="button"
              onClick={() => onBorrow(book)}
              disabled={borrowDisabled}
              className={`${styles.borrowButton} ${
                borrowDisabled ? styles.borrowButtonDisabled : ""
              }`}
            >
              {borrowLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}