import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders footer branding', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 E-Library/i)).toBeInTheDocument()
    expect(screen.getByText(/Discover your next read/i)).toBeInTheDocument()
  })
})
