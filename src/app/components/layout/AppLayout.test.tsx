import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AppLayout from './AppLayout'
import { renderWithProviders } from '../../../test/renderWithProviders'

describe('AppLayout', () => {
  it('renders shell with navbar, main outlet, and footer', () => {
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<div>Main area</div>} />
        </Route>
      </Routes>,
      {
        route: '/app',
        preloadedState: {
          auth: {
            user: { id: '1', email: 'user@test.com', role: 'USER' },
            token: 'fake-token',
            restoringSession: false,
            expiresAt: '',
          },
        },
      }
    )

    expect(screen.getByText('Main area')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /e-library/i })).toBeInTheDocument()
    expect(screen.getByText(/THIS IS A FOOTER/i)).toBeInTheDocument()
  })
})
