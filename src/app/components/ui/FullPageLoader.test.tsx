import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FullPageLoader from './FullPageLoader'

describe('FullPageLoader', () => {
  it('shows the default loading message', () => {
    render(<FullPageLoader />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows a custom message when provided', () => {
    render(<FullPageLoader message="Please wait" />)
    expect(screen.getByText('Please wait')).toBeInTheDocument()
  })
})
