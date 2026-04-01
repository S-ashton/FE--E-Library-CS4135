import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/authSlice';

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <nav
      style={{
        background: '#c6f3fb',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/dashboard"
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#111827',
            textDecoration: 'none',
          }}
        >
          E-Library
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/dashboard"
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Home
          </Link>

          {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
            <Link
              to="/manage"
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Manage
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Admin
            </Link>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {user && (
            <span
              style={{
                color: '#6b7280',
                fontSize: '0.95rem',
              }}
            >
              {user.email}
            </span>
          )}

          <button
            onClick={handleLogout}
            style={{
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
