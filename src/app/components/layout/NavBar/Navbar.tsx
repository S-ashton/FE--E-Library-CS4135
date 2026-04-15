import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, NavLink } from 'react-router-dom';
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
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Home</NavLink>
          )}
          <NavLink to="/catalogue" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Catalogue</NavLink>

          {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
            <NavLink to="/manage" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Manage</NavLink>
          )}

          {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
            <NavLink to="/loans" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Loans</NavLink>
          )}

          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Admin</NavLink>
          )}

          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Account</NavLink>
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