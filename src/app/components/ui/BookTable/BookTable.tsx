import type { Book } from '../../../types/book'
import type { CatalogueBooksTableViewState } from '../../../utils/bookSearchFilterHelpers'
import { genreLabel } from '../../../utils/bookEnumLabels'
import styles from './BookTable.module.css'
import type React from 'react'

function statusBadgeClass(status: Book['status']): string {
  switch (status) {
    case 'Available':
      return styles.available
    case 'Borrowed':
      return styles.borrowed
    case 'All copies borrowed':
      return styles.allBorrowed
    case 'Checking…':
      return styles.checking
    case 'Unavailable':
      return styles.unavailable
    default:
      return styles.unavailable
  }
}

type BookTableProps = {
  title: string
  books: Book[]
  mode: 'public' | 'admin'
  state: CatalogueBooksTableViewState
  search?: React.ReactNode
  errorMessage?: string
  onSelectBook?: (book: Book) => void
  onAddCopy?: (book: Book) => void | Promise<void>
  addingCopyBookId?: number | null
  onDeleteBook?: (book: Book) => void
}

function BookTable({
  title,
  books,
  mode,
  state,
  search,
  errorMessage,
  onSelectBook,
  onAddCopy,
  addingCopyBookId = null,
  onDeleteBook,
}: BookTableProps) {
  const showAddCopy = Boolean(onAddCopy)
  const showDeleteBook = Boolean(onDeleteBook)
  const showCopyCounts = mode === 'admin'
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
                {showCopyCounts ? (
                  <th className={`${styles.headCell} ${styles.copiesHeadCell}`}>
                    Available copies
                  </th>
                ) : null}
                <th className={styles.headCell}>Status</th>
                {showAddCopy ? (
                  <th className={`${styles.headCell} ${styles.addCopyHeadCell}`}>
                    Add copy
                  </th>
                ) : null}
                {showDeleteBook ? (
                  <th className={`${styles.headCell} ${styles.addCopyHeadCell}`}>
                    Delete
                  </th>
                ) : null}
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  onClick={() => {
                    if (onSelectBook) {
                      onSelectBook(book)
                    }
                  }}
                  className={`${styles.row} ${onSelectBook ? styles.clickableRow : ''}`}
                  style={!onSelectBook ? { cursor: 'default' } : undefined}
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
                    <span className={styles.categoryBadge}>{genreLabel(book.category)}</span>
                  </td>
                  <td className={`${styles.cell} ${styles.yearCell}`}>{book.yearPublished}</td>
                  {showCopyCounts ? (
                    <td className={`${styles.cell} ${styles.copiesCell}`}>
                      {book.copiesAvailable != null ? book.copiesAvailable : '—'}
                    </td>
                  ) : null}
                  <td className={styles.cell}>
                    <span
                      className={`${styles.statusBadge} ${statusBadgeClass(book.status)}`}
                    >
                      {book.statusLabel ?? book.status}
                    </span>
                  </td>
                  {showAddCopy ? (
                    <td
                      className={`${styles.cell} ${styles.addCopyCell}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={styles.addCopyBtn}
                        aria-label={`Add copy of ${book.title}`}
                        disabled={addingCopyBookId === book.id}
                        onClick={() => void onAddCopy?.(book)}
                      >
                        +
                      </button>
                    </td>
                  ) : null}
                  {showDeleteBook ? (
                    <td
                      className={`${styles.cell} ${styles.addCopyCell}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        aria-label={`Delete ${book.title}`}
                        onClick={() => onDeleteBook?.(book)}
                      >
                        Delete
                      </button>
                    </td>
                  ) : null}
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
