import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Spinner from './Spinner'

describe('Spinner', () => {
  it('renders a loading indicator', () => {
    const { container } = render(<Spinner />)
    const el = container.querySelector('[aria-hidden="true"]')
    expect(el).toBeTruthy()
  })
})
