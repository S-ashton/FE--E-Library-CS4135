import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './HomePage'
import { renderWithProviders } from '../../../test/renderWithProviders'

describe('HomePage', () => {
  it('renders the welcome content', () => {
    renderWithProviders(<HomePage />)

    expect(
      screen.getByText(/welcome to e-library/i)
    ).toBeInTheDocument()
  })

  it('renders the book catalogue section', () => {
    renderWithProviders(<HomePage />)
    expect(
      screen.getByText('Book Catalogue')
    ).toBeInTheDocument()
  })

  it('renders the recommendation section', () => {
    renderWithProviders(<HomePage />)
    expect(
      screen.getByRole('heading', { name: /recommendation/i })
    ).toBeInTheDocument()
  })
})