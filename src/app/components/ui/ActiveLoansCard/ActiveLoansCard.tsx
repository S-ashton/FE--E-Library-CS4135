type ActiveLoansCardProps = {
  borrowedBooks: Array<{
    loanId: string
    bookId: string
    title: string
    author: string
    dueDate: string
    status: string
    fineAmount: number | null
  }>
  state: 'empty' | 'loading' | 'populated' | 'error'
  isReturning?: boolean
  onReturnBook?: (loanId: string) => void
}

export default function ActiveLoansCard({
  borrowedBooks,
  state,
  isReturning = false,
  onReturnBook,
}: ActiveLoansCardProps) {
  switch (state) {
    case 'empty':
      return (
        <section style={cardStyle}>
          <h2 style={titleStyle}>Active Loans</h2>
          <p style={{ margin: 0, color: '#475569' }}>You have no active loans.</p>
        </section>
      )

    case 'loading':
      return (
        <section style={cardStyle}>
          <h2 style={titleStyle}>Active Loans</h2>
          <p style={{ margin: 0, color: '#475569' }}>Loading active loans...</p>
        </section>
      )

    case 'error':
      return (
        <section style={cardStyle}>
          <h2 style={titleStyle}>Active Loans</h2>
          <p style={{ margin: 0, color: '#475569' }}>
            An error occurred while loading active loans.
          </p>
        </section>
      )

    case 'populated':
      return (
        <section style={cardStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 style={titleStyle}>Active Loans</h2>
            </div>
          </div>

          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              background: '#f8fafc',
            }}
          >
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
              Borrowed Books Count
            </p>
            <p style={{ margin: '8px 0 0', fontWeight: 700 }}>{borrowedBooks.length}</p>
          </div>

          <div
            style={{
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '20px',
              background: '#f8fafc',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {borrowedBooks.map((book) => (
              <div
                key={book.loanId}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '16px',
                  background: '#ffffff',
                  display: 'grid',
                  gap: '8px',
                }}
              >
                <h3 style={{ margin: 0, color: '#0f172a' }}>{book.title}</h3>
                <p style={{ margin: 0, color: '#6b7280' }}>{book.author}</p>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Due Date: {new Date(book.dueDate).toLocaleDateString()}
                </p>
                <p style={{ margin: 0, color: '#6b7280' }}>Status: {book.status}</p>

                {book.fineAmount !== null && book.fineAmount > 0 && (
                  <p style={{ margin: 0, color: '#dc2626' }}>
                    Fine Amount: €{book.fineAmount.toFixed(2)}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onReturnBook?.(book.loanId)}
                  disabled={isReturning}
                  style={{
                    marginTop: '8px',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    background: isReturning ? '#93c5fd' : '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: isReturning ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isReturning ? 'Returning...' : 'Return Book'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )

    default:
      return null
  }
}

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  padding: '24px',
  display: 'grid',
  gap: '20px',
} as const

const titleStyle = {
  margin: 0,
  fontSize: '1.4rem',
  color: '#0f172a',
} as const