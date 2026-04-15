import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RegisterForm from './RegisterForm'

describe('RegisterForm', () => {
  it('renders email, password, and submit', () => {
    render(
      <RegisterForm
        email=""
        password=""
        isSubmitting={false}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
      />
    )

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()
  })

  it('lists password validation messages when provided', () => {
    render(
      <RegisterForm
        email="a@b.com"
        password="weak"
        passwordFieldErrors={[
          'Password must be at least 8 characters.',
          'Password must contain at least one uppercase letter.',
        ]}
        isSubmitting={false}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
      />
    )

    expect(
      screen.getByText(/at least 8 characters/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/uppercase letter/i)
    ).toBeInTheDocument()
  })

  it('calls onBackToSignIn when Sign in is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    render(
      <RegisterForm
        email=""
        password=""
        isSubmitting={false}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
        onBackToSignIn={onBack}
      />
    )

    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
