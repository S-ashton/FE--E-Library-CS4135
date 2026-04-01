import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../app/store/authSlice'
import type { RootState } from '../app/store/store'

type Options = {
  preloadedState?: Partial<RootState>
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, route = '/' }: Options = {}
) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: preloadedState as RootState,
  })

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </Provider>
    ),
  }
}