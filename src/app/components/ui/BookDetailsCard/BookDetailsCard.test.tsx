import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { Book } from '../../../types/book'
import BookDetailsCard from './BookDetailsCard'

const sampleBook: Book = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  category: 'FANTASY',
  yearPublished: 2020,
  status: 'Available',
  language: 'English',
  description: 'A description.',
}

describe('BookDetailsCard', () => {
  it('shows book details and action buttons', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onBorrow = vi.fn()

    render(
      <BookDetailsCard
        book={sampleBook}
        onClose={onClose}
        onBorrow={onBorrow}
        copyAvailability="available"
      />
    )

    expect(screen.getByRole('heading', { name: 'Test Book' })).toBeInTheDocument()
    expect(screen.getByText(/Test Author/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close book details/i }))
    expect(onClose).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /borrow book/i }))
    expect(onBorrow).toHaveBeenCalledWith(sampleBook)
  })

  it('shows error text when provided', () => {
    render(
      <BookDetailsCard
        book={sampleBook}
        onClose={() => {}}
        onBorrow={() => {}}
        error="Borrow failed"
        copyAvailability="available"
      />
    )
    expect(screen.getByText('Borrow failed')).toBeInTheDocument()
  })

  it('disables borrow when search reports zero available copies', () => {
    render(
      <BookDetailsCard
        book={{ ...sampleBook, copiesAvailable: 0 }}
        onClose={() => {}}
        onBorrow={() => {}}
        copyAvailability="available"
      />
    )
    expect(
      screen.getByRole('button', { name: /no copy available/i })
    ).toBeDisabled()
  })
})
