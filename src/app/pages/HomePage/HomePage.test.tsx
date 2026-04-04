import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('renders the welcome content', () => {
    render(<HomePage />)

    expect(
      screen.getByText(/welcome to e-library/i)
    ).toBeInTheDocument()
  })

  it('renders the book catalogue section', () => {
    render(<HomePage />)
    expect(
      screen.getByText('Book Catalogue')
    ).toBeInTheDocument()
  })

  it('renders the recommendation section', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { name: /recommendation/i })
    ).toBeInTheDocument()
  })
})