import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ManagePage from './ManagePage'

describe('HomePage', () => {
  it('renders the manage library content', () => {
    render(<ManagePage />)

    expect(
      screen.getByText(/Manage Library Catalogue/i)
    ).toBeInTheDocument()
  })

  it('renders the book catalogue section for staff', () => {
    render(<ManagePage />)
    expect(
      screen.getByText('Library Catalogue')
    ).toBeInTheDocument()

    expect(screen.getByText(/actions/i)).toBeInTheDocument()
    expect(screen.getAllByRole(
        'button', 
        { name: /delete/i }).length).toBeGreaterThan(0)
  })

  it('renders the add book section', () => {
    render(<ManagePage />)
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
      screen.getByLabelText(/genre/i)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/year/i)
    ).toBeInTheDocument()
  })
})