import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { Book } from '../../../types/book'
import BookTable from './BookTable'

const sampleBook: Book = {
  id: 1,
  title: 'Catalogue Book',
  author: 'Writer',
  category: 'ROMANCE',
  yearPublished: 2019,
  status: 'Available',
  language: 'English',
}

describe('BookTable', () => {
  it('shows empty catalogue message', () => {
    render(
      <BookTable
        title="Library"
        books={[]}
        mode="public"
        state="empty"
      />
    )
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
    expect(screen.getByText(/no books in the catalogue/i)).toBeInTheDocument()
  })

  it('renders rows in populated state', async () => {
    const user = userEvent.setup()
    const onSelectBook = vi.fn()
    render(
      <BookTable
        title="Browse"
        books={[sampleBook]}
        mode="public"
        state="populated"
        onSelectBook={onSelectBook}
      />
    )

    expect(screen.getByText('Catalogue Book')).toBeInTheDocument()
    await user.click(screen.getByText('Catalogue Book'))
    expect(onSelectBook).toHaveBeenCalledWith(sampleBook)
  })
})
