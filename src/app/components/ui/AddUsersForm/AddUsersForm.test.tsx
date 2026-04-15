import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import AddUserForm from './AddUsersForm'

describe('AddUserForm', () => {
  it('renders fields and submit', () => {
    render(
      <AddUserForm
        userEmail=""
        userPassword=""
        userRole=""
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onRoleChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
      />
    )

    expect(screen.getByRole('heading', { name: /add new user/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/user email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
  })

  it('calls change handlers when typing', async () => {
    const user = userEvent.setup()
    const onEmailChange = vi.fn()
    render(
      <AddUserForm
        userEmail=""
        userPassword=""
        userRole=""
        onEmailChange={onEmailChange}
        onPasswordChange={() => {}}
        onRoleChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
      />
    )

    await user.type(screen.getByLabelText(/user email/i), 'a@b.com')
    expect(onEmailChange).toHaveBeenCalled()
  })
})
