import type { MouseEvent } from 'react'
import type { Book } from '../../../types/book'
import styles from './BookTable.module.css'

type BookTableProps = {
  title: string
  books: Book[]
  mode: 'public' | 'admin'
  state: 'loading' | 'empty' | 'error' | 'populated'
  errorMessage?: string
  onSelectBook?: (book: Book) => void
  onDeleteBook?: (book: Book) => void
}

function BookTable({
  title,
  books,
  mode,
  state,
  errorMessage,
  onSelectBook,
  onDeleteBook,
}: BookTableProps) {
  const showActions = mode === 'admin'

  switch (state) {
    case 'empty':
      return (
        <section className={styles.stateCard}>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.stateMessage}>There are no books in the catalogue.</p>
        </section>
      )

    case 'loading':
      return (
        <section className={styles.stateCard}>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.stateMessage}>Loading books...</p>
        </section>
      )

    case 'error':
      return (
        <section className={styles.stateCard}>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.stateMessage}>
            {errorMessage ?? 'An error occurred while loading books.'}
          </p>
        </section>
      )

    case 'populated':
      return (
        <section className={styles.tableCard}>
          <div className={styles.header}>
            <h2 className={styles.heading}>{title}</h2>
            <span className={styles.countBadge}>{books.length} books</span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.coverHeadCell}>Cover</th>
                  <th className={styles.headCell}>Title</th>
                  <th className={styles.headCell}>Author</th>
                  <th className={styles.headCell}>Category</th>
                  <th className={styles.headCell}>Year</th>
                  <th className={styles.headCell}>Status</th>
                  {showActions && <th className={styles.headCell}>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    onClick={() => {
                      if (mode === 'public' && onSelectBook) {
                        onSelectBook(book)
                      }
                    }}
                    className={`${styles.row} ${mode === 'public' ? styles.clickableRow : ''}`}
                  >
                    <td className={styles.coverCell}>
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
                    </td>

                    <td className={styles.titleCell}>{book.title}</td>
                    <td className={`${styles.cell} ${styles.authorCell}`}>{book.author}</td>
                    <td className={styles.cell}>
                      <span className={styles.categoryBadge}>{book.category}</span>
                    </td>
                    <td className={`${styles.cell} ${styles.yearCell}`}>{book.year}</td>
                    <td className={styles.cell}>
                      <span
                        className={`${styles.statusBadge} ${
                          book.status === 'Available' ? styles.available : styles.borrowed
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>

                    {showActions && (
                      <td className={styles.cell}>
                        <button
                          type="button"
                          onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onDeleteBook?.(book)
                          }}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )

    default:
      return null
  }
}

export default BookTable