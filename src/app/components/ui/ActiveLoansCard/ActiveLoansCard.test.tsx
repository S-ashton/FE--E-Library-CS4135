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
    expect(
      screen.getByText(/no books on loan \(nothing active or overdue\)/i)
    ).toBeInTheDocument()
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

  it('shows overdue badge, fine, and staff note for overdue loan with fine', () => {
    const borrowedBooks = [
      {
        loanId: 'l-overdue',
        bookId: 'b1',
        title: 'Late Book',
        author: 'Some Author',
        dueDate: '2020-01-01T12:00:00.000Z',
        status: 'OVERDUE',
        fineAmount: 3.5,
      },
    ]

    render(
      <ActiveLoansCard borrowedBooks={borrowedBooks} state="populated" />
    )

    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText(/Fine: €3\.50/)).toBeInTheDocument()
    expect(
      screen.getByText(/Please contact a staff member to sort out your fine/i)
    ).toBeInTheDocument()
  })

  it('shows staff note for overdue loan without fine yet', () => {
    const borrowedBooks = [
      {
        loanId: 'l-overdue',
        bookId: 'b1',
        title: 'Late Book',
        author: 'Some Author',
        dueDate: '2020-01-01T12:00:00.000Z',
        status: 'OVERDUE',
        fineAmount: null,
      },
    ]

    render(
      <ActiveLoansCard borrowedBooks={borrowedBooks} state="populated" />
    )

    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(
      screen.getByText(/Please contact a staff member to sort out your fine/i)
    ).toBeInTheDocument()
  })
})
