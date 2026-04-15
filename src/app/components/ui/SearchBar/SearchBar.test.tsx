import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('renders search field and calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SearchBar value="" onChange={onChange} id="test-search" />
    )

    await user.type(screen.getByRole('searchbox'), 'abc')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onSearch when the search form is submitted', () => {
    const onSearch = vi.fn()
    render(
      <SearchBar value="query" onChange={() => {}} onSearch={onSearch} id="s2" />
    )

    fireEvent.submit(screen.getByRole('search'))
    expect(onSearch).toHaveBeenCalledTimes(1)
  })
})
