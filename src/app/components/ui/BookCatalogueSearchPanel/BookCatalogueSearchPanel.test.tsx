import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import BookCatalogueSearchPanel from './BookCatalogueSearchPanel'

describe('BookCatalogueSearchPanel', () => {
  it('renders search and filters', async () => {
    const user = userEvent.setup()
    const onSearchQueryChange = vi.fn()
    const onSubmitSearch = vi.fn()

    render(
      <BookCatalogueSearchPanel
        idPrefix="test"
        searchQuery=""
        onSearchQueryChange={onSearchQueryChange}
        filterGenre=""
        onFilterGenreChange={() => {}}
        filterYear=""
        onFilterYearChange={() => {}}
        filterLanguage=""
        onFilterLanguageChange={() => {}}
        onSubmitSearch={onSubmitSearch}
        isSearching={false}
      />
    )

    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByLabelText(/^genre$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^year$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^language$/i)).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox'), 'x')
    expect(onSearchQueryChange).toHaveBeenCalled()

    fireEvent.submit(screen.getByRole('search'))
    expect(onSubmitSearch).toHaveBeenCalled()
  })
})
