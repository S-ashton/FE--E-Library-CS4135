import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store/store';
import { restoreSession } from './store/authSlice';
import AppRouter from './router/AppRouter';
import FullPageLoader from './components/ui/FullPageLoader';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { restoringSession } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // restoreSession always runs on startup — it calls /auth/refresh to get a fresh
    // access token from the HttpOnly cookie. If the cookie is valid the user is
    // restored silently. If not, token stays null and ProtectedRoute redirects to /login.
    dispatch(restoreSession());
  }, [dispatch]);

  if (restoringSession) {
    return <FullPageLoader message="Loading..." />;
  }

  return <AppRouter />;
}

export default App;
