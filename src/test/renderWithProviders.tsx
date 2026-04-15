import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../app/store/authSlice'
import loanReducer from '../app/store/loanSlice'
import usersReducer from '../app/store/usersSlice'
import bookReducer from '../app/store/bookSlice'
import recommendationReducer from '../app/store/recommendationSlice'
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
      users: usersReducer,
      books: bookReducer,
      recommendations: recommendationReducer,
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