import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar'
import { renderWithProviders } from '../../../../test/renderWithProviders'

describe('Navbar', () => {
  it('shows base links for a normal user', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'user@test.com', role: 'USER' },
          token: 'fake-token',
          restoringSession: false,
          expiresAt: '' 
        },
      },
      route: '/dashboard',
    })

    expect(screen.getByText(/e-library/i)).toBeInTheDocument()
    expect(screen.getByText(/user@test.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Manage' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
  })

  it('shows manage and admin links but not home for admin user', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: {
          user: { id: '2', email: 'admin@test.com', role: 'ADMIN' },
          token: 'fake-token',
          restoringSession: false,
          expiresAt: ''
        },
      },
      route: '/admin',
    })

    expect(screen.getByRole('link', { name: 'Manage' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument()
  })
})