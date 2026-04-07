import type { Book } from "../../../types/book";
import styles from "./BookDetailsCard.module.css";

type BookDetailsCardProps = {
  book: Book;
  onClose: () => void;
  onBorrow: (book: Book) => void;
  error?: string | null;
  isSubmitting?: boolean;
};

export default function BookDetailsCard({
  book,
  onClose,
  onBorrow,
  error,
  isSubmitting = false,
}: BookDetailsCardProps) {
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
              <strong>Year:</strong> {book.year}
            </p>

            <p className={styles.description}>
              {book.description ?? "No description available."}
            </p>

            {error && <p className={styles.errorText}>{error}</p>}

            <button
              type="button"
              onClick={() => onBorrow(book)}
              disabled={isSubmitting}
              className={`${styles.borrowButton} ${
                isSubmitting ? styles.borrowButtonDisabled : ""
              }`}
            >
              {isSubmitting ? "Borrowing..." : "Borrow Book"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}