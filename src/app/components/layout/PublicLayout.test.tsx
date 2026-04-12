import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import PublicLayout from './PublicLayout'
import { renderWithProviders } from '../../../test/renderWithProviders'

describe('PublicLayout', () => {
  it('renders nested route content in the outlet', () => {
    renderWithProviders(
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<div>Outlet child</div>} />
        </Route>
      </Routes>,
      { route: '/' }
    )

    expect(screen.getByText('Outlet child')).toBeInTheDocument()
  })
})
