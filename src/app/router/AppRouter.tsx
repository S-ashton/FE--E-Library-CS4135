import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import RootRedirect from './RootRedirect';
import AppLayout from '../components/layout/AppLayout';
import PublicLayout from '../components/layout/PublicLayout';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorised.tsx';
import LoginPage from "../pages/LoginPage";
import HomePage from '../pages/HomePage/HomePage.tsx';
import ManagePage from '../pages/ManagePage/ManagePage.tsx';
import CataloguePage from '../pages/CataloguePage.tsx/CataloguePage.tsx';
import AdminPage from '../pages/AdminPage/AdminPage.tsx';
import LoansPage from '../pages/LoansPage/LoansPage.tsx';
import SettingsPage from '../pages/SettingsPage/SettingsPage.tsx';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes - no navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorised" element={<Unauthorized />} />
        </Route>

        {/* Root redirect - sends each role to their landing page */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RootRedirect />} />
        </Route>

        {/* Protected routes - authenticated users only */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Dashboard - USER only */}
        <Route element={<RoleRoute allowedRoles={['USER']} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<HomePage />} />
          </Route>
        </Route>

        {/* Role-restricted routes - staff and admin only */}
        <Route element={<RoleRoute allowedRoles={['STAFF', 'ADMIN']} />}>
          <Route element={<AppLayout />}>
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/loans" element={<LoansPage />} />
          </Route>
        </Route>

        {/* Admin only */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        {/* Catch-all - 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
