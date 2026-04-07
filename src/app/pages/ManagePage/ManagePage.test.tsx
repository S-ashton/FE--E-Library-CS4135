import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ManagePage from './ManagePage'
import { renderWithProviders } from '../../../test/renderWithProviders'

describe('ManagePage', () => {
  it('renders the manage library content', () => {
    renderWithProviders(<ManagePage />)

    expect(
      screen.getByText(/Manage Library Catalogue/i)
    ).toBeInTheDocument()
  })

  it('renders the book catalogue section for staff', () => {
    renderWithProviders(<ManagePage />)
    expect(
      screen.getByText('Library Catalogue')
    ).toBeInTheDocument()

    expect(screen.getByText(/actions/i)).toBeInTheDocument()
    expect(screen.getAllByRole(
        'button', 
        { name: /delete/i }).length).toBeGreaterThan(0)
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
      screen.getByLabelText(/genre/i)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/year/i)
    ).toBeInTheDocument()
  })
})