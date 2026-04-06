import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store/store'
import { injectStore } from './app/services/apiClient'
import './index.css'
import App from './app/App.tsx'
import { ToastProvider } from './app/context/ToastProvider.tsx'


// Give apiClient a reference to the store so its interceptors can read
// auth state and dispatch actions without importing store.ts directly.
injectStore(store);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </StrictMode>,
)
