import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import LoginPage from './LoginPage'
import { renderWithProviders } from '../../test/renderWithProviders'

describe('LoginPage', () => {
  it('renders the login card and sign-in action', () => {
    renderWithProviders(<LoginPage />, { route: '/login' })

    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument()
  })

  it('switches to register when Create an account is chosen', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: '/login' })

    await user.click(
      screen.getByRole('button', { name: /^create an account$/i })
    )

    expect(
      screen.getByRole('heading', { name: /create an account/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()
  })

  it('returns to login from register via Sign in', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: '/login' })

    await user.click(
      screen.getByRole('button', { name: /^create an account$/i })
    )
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument()
  })
})
