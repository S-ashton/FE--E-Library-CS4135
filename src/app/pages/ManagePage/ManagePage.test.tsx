import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ManagePage from './ManagePage'
import { renderWithProviders } from '../../../test/renderWithProviders'

vi.mock('../../hooks/useManageBooks', () => ({
  useManageBooks: () => ({
    books: [],
    addBook: vi.fn().mockResolvedValue(undefined),
    refreshBooks: vi.fn().mockResolvedValue([]),
    isLoadingBooks: false,
    isAddingBook: false,
    booksError: null,
  }),
}))

vi.mock('../../hooks/useLoanHistory', () => ({
  useLoanHistory: () => ({
    history: [],
    isLoadingHistory: false,
    error: null,
    refreshHistory: vi.fn().mockResolvedValue(undefined),
  }),
}))

describe('ManagePage', () => {
  it('renders the manage library content', () => {
    renderWithProviders(<ManagePage />)

    expect(
      screen.getByText(/Manage Library Catalogue/i)
    ).toBeInTheDocument()
  })

  it('renders the add book section', () => {
    renderWithProviders(<ManagePage />)
    expect(
      screen.getByText(/Add New Book/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add book/i })
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/title/i)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/author/i)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/description/i)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/genre/i, { selector: 'select#bookGenre' })
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/year/i, { selector: 'input#bookYear' })
    ).toBeInTheDocument()
  })
})