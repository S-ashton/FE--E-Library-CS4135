import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UsersTable from './UsersTable'

describe('UsersTable', () => {
  it('shows loading state', () => {
    render(<UsersTable users={[]} isLoading error={null} />)
    expect(screen.getByText(/loading users/i)).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<UsersTable users={[]} isLoading={false} error={null} />)
    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })

  it('renders user rows', () => {
    render(
      <UsersTable
        users={[
          {
            id: 1,
            email: 'reader@example.com',
            role: 'USER',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ]}
        isLoading={false}
        error={null}
      />
    )
    expect(screen.getByText('reader@example.com')).toBeInTheDocument()
    expect(screen.getByText('USER')).toBeInTheDocument()
  })
})
