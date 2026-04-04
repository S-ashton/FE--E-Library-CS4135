import type { MouseEvent } from 'react'
import type { Book } from '../../../types/book'

type BookTableProps = {
  title: string
  books: Book[]
  mode: 'public' | 'admin'
  onSelectBook?: (book: Book) => void
  onDeleteBook?: (book: Book) => void
}

function BookTable({
  title,
  books,
  mode,
  onSelectBook,
  onDeleteBook,
}: BookTableProps) {
  const showActions = mode === 'admin'

  return (
    <section
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.4rem',
            color: '#0f172a',
          }}
        >
          {title}
        </h2>

        <span
          style={{
            padding: '6px 10px',
            borderRadius: '999px',
            background: '#f3f4f6',
            fontSize: '0.9rem',
            color: '#334155',
            fontWeight: 600,
          }}
        >
          {books.length} books
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '900px',
          }}
        >
          <thead>
            <tr
              style={{
                textAlign: 'left',
                color: '#64748b',
                fontSize: '0.9rem',
              }}
            >
              <th style={{ padding: '16px 24px' }}>Title</th>
              <th style={{ padding: '16px 24px' }}>Author</th>
              <th style={{ padding: '16px 24px' }}>Category</th>
              <th style={{ padding: '16px 24px' }}>Year</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              {showActions && <th style={{ padding: '16px 24px' }}>Actions</th>}
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
                style={{
                  borderTop: '1px solid #f1f5f9',
                  cursor: mode === 'public' ? 'pointer' : 'default',
                }}
              >

                <td
                  style={{
                    padding: '16px 24px',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  {book.title}
                </td>

                <td style={{ padding: '16px 24px', color: '#475569' }}>
                  {book.author}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span
                    style={{
                      background: '#f1f5f9',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                    }}
                  >
                    {book.category}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', color: '#334155' }}>
                  {book.year}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span
                    style={{
                      background:
                        book.status === 'Available' ? '#dcfce7' : '#fee2e2',
                      color:
                        book.status === 'Available' ? '#166534' : '#b91c1c',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {book.status}
                  </span>
                </td>

                {showActions && (
                  <td style={{ padding: '16px 24px' }}>
                    <button
                      type="button"
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onDeleteBook?.(book)
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#dc2626',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
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
}

export default BookTable