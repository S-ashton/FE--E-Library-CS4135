import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../store/store';
import { logout } from '../../../store/authSlice';
import './NavBar.css';

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-link nav-brand">
          E-Library
        </Link>

        <div className="nav-links-group">
          {user?.role === 'USER' && (
            <Link to="/dashboard" className="nav-link">Home</Link>
          )}
          <Link to="/catalogue" className="nav-link">Catalogue</Link>

          {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
            <Link to="/manage" className="nav-link">Manage</Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
        </div>

        <div className="nav-user-group">
          {user && <span className="nav-user-email">{user.email}</span>}

          <button
            type="button"
            onClick={handleLogout}
            className="nav-logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;