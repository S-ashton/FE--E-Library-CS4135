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
})