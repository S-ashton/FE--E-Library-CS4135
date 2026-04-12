import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ActiveLoansCard from './ActiveLoansCard'

describe('ActiveLoansCard', () => {
  it('shows empty state copy', () => {
    render(
      <ActiveLoansCard borrowedBooks={[]} state="empty" />
    )
    expect(screen.getByRole('heading', { name: /active loans/i })).toBeInTheDocument()
    expect(screen.getByText(/no active loans/i)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <ActiveLoansCard borrowedBooks={[]} state="loading" />
    )
    expect(screen.getByText(/loading active loans/i)).toBeInTheDocument()
  })

  it('lists borrowed books and calls onReturnBook', async () => {
    const user = userEvent.setup()
    const onReturnBook = vi.fn()
    const borrowedBooks = [
      {
        loanId: 'l1',
        bookId: 'b1',
        title: 'Sample Title',
        author: 'Sample Author',
        dueDate: '2026-06-01T12:00:00.000Z',
        status: 'ACTIVE',
        fineAmount: null,
      },
    ]

    render(
      <ActiveLoansCard
        borrowedBooks={borrowedBooks}
        state="populated"
        onReturnBook={onReturnBook}
      />
    )

    expect(screen.getByText('Sample Title')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /return book/i }))
    expect(onReturnBook).toHaveBeenCalledWith('l1')
  })
})
