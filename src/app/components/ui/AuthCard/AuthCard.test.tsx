import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AuthCard from './AuthCard'

describe('AuthCard', () => {
  it('renders title, subtitle, and children', () => {
    render(
      <AuthCard title="Welcome back" subtitle="Sign in to continue.">
        <button>Submit</button>
      </AuthCard>
    )

    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/sign in to continue/i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /submit/i })
    ).toBeInTheDocument()
  })
})