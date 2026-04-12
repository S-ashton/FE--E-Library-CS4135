import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RecDashboard from './recDashboard'

describe('RecDashboard', () => {
  it('renders title and refresh control', async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()
    render(<RecDashboard onRefresh={onRefresh} />)

    expect(
      screen.getByRole('heading', { name: /recommendations dashboard/i })
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /refresh/i }))
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })
})
