import type { Book } from '../../../types/book'
import type { CatalogueBooksTableViewState } from '../../../utils/bookSearchFilterHelpers'
import styles from './BookTable.module.css'
import type React from 'react'

type BookTableProps = {
  title: string
  books: Book[]
  mode: 'public' | 'admin'
  state: CatalogueBooksTableViewState
  search?: React.ReactNode
  errorMessage?: string
  onSelectBook?: (book: Book) => void
}

function BookTable({
  title,
  books,
  mode,
  state,
  search,
  errorMessage,
  onSelectBook,
}: BookTableProps) {
  const countDisplay = state === 'loading' ? '…' : `${books.length} books`

  function wrapInCatalogueTableShell(body: React.ReactNode) {
    return (
      <section className={styles.tableCard}>
        <div className={styles.headerTop}>
          <h2 className={styles.heading}>{title}</h2>
          <span className={styles.countBadge}>{countDisplay}</span>
        </div>
        {search ? <div className={styles.searchRow}>{search}</div> : null}
        {body}
      </section>
    )
  }

  switch (state) {
    case 'empty':
      return wrapInCatalogueTableShell(
        <div className={styles.stateBody}>
          <p className={styles.stateMessage}>
            There are no books in the catalogue.
          </p>
        </div>
      )

    case 'noSearchResults':
      return wrapInCatalogueTableShell(
        <div className={styles.stateBody}>
          <p className={styles.stateMessage}>
            No books in the catalogue match your search.
          </p>
        </div>
      )

    case 'loading':
      return wrapInCatalogueTableShell(
        <div className={styles.stateBody}>
          <p className={styles.stateMessage}>Loading books...</p>
        </div>
      )

    case 'error':
      return wrapInCatalogueTableShell(
        <div className={styles.stateBody}>
          <p className={styles.stateMessage}>
            {errorMessage ?? 'An error occurred while loading books.'}
          </p>
        </div>
      )

    case 'populated':
      return wrapInCatalogueTableShell(
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
                  <td className={`${styles.cell} ${styles.yearCell}`}>{book.yearPublished}</td>
                  <td className={styles.cell}>
                    <span
                      className={`${styles.statusBadge} ${
                        book.status === 'Available' ? styles.available : styles.borrowed
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
}

export default BookTable
