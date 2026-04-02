import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    render(
      <LoginForm
        email=""
        password=""
        error={null}
        isSubmitting={false}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
      />
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('calls change handlers when typing', async () => {
    const user = userEvent.setup()
    const onEmailChange = vi.fn()
    const onPasswordChange = vi.fn()

    render(
      <LoginForm
        email=""
        password=""
        error={null}
        isSubmitting={false}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onSubmit={(e) => e.preventDefault()}
      />
    )

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'Password123')

    expect(onEmailChange).toHaveBeenCalled()
    expect(onPasswordChange).toHaveBeenCalled()
  })
})