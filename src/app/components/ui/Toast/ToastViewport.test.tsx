import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ToastViewport from './ToastViewport'

describe('ToastViewport', () => {
  it('renders toasts and calls onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <ToastViewport
        toasts={[
          { id: '1', message: 'Saved', type: 'success' },
          { id: '2', message: 'Oops', type: 'error' },
        ]}
        onClose={onClose}
      />
    )

    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Oops')).toBeInTheDocument()

    const closeButtons = screen.getAllByRole('button', { name: /close toast/i })
    await user.click(closeButtons[0])
    expect(onClose).toHaveBeenCalledWith('1')
  })
})
