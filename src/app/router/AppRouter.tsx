import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import AppLayout from '../components/layout/AppLayout';
import PublicLayout from '../components/layout/PublicLayout';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorised.tsx';
// import LoginPage from '../features/auth/LoginPage';
import LoginPage from "../features/auth/LoginPage.tsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes - no navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorised" element={<Unauthorized />} />
        </Route>

        {/* Protected routes - authenticated users only */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Route>

        {/* Role-restricted routes - staff and admin only */}
        <Route element={<RoleRoute allowedRoles={['STAFF', 'ADMIN']} />}>
          <Route element={<AppLayout />}>
            <Route path="/manage" element={<div>Management Page</div>} />
          </Route>
        </Route>

        {/* Admin only */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Route>

        {/* Catch-all - 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
