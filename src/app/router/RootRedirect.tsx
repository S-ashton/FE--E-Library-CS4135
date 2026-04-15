import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// Redirects the root path (/) to the appropriate page based on user role.
// USER goes to /dashboard, STAFF goes to /catalogue, ADMIN goes to /admin.
function RootRedirect() {
    const user = useSelector((state: RootState) => state.auth.user);

    if (user?.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'STAFF') {
        return <Navigate to="/manage" replace />;
    }
    return <Navigate to="/dashboard" replace />;
}

export default RootRedirect;
