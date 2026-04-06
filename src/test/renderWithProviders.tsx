import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../app/store/authSlice'
import loanReducer from '../app/store/loanSlice'
import type { RootState } from '../app/store/store'
import { ToastProvider } from '../app/context/ToastProvider'

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
      loans: loanReducer,
    },
    preloadedState: preloadedState as RootState,
  })

  return {
    store,
    ...render(
      <Provider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={[route]}>
            {ui}
          </MemoryRouter>
        </ToastProvider>
      </Provider>
    ),
  }
}