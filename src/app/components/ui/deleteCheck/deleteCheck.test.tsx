import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import DeleteCheck from './deleteCheck'

describe('DeleteCheck', () => {
  it('shows generic copy when no title is given', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <DeleteCheck onConfirm={onConfirm} onCancel={onCancel} />
    )

    expect(
      screen.getByText(/delete this item/i)
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    await user.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('mentions the book title when provided', () => {
    render(
      <DeleteCheck
        bookTitle="Moby Dick"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.getByText(/"Moby Dick"/)).toBeInTheDocument()
  })
})
