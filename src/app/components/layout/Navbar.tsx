import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    <nav>
      <span>E-Library</span>

      <div>
        <a href="/dashboard">Home</a>

        {user?.role === 'STAFF' || user?.role === 'ADMIN' ? (
          <a href="/manage">Manage</a>
        ) : null}

        {user?.role === 'ADMIN' ? (
          <a href="/admin">Admin</a>
        ) : null}
      </div>

      <div>
        {user && <span>{user.email}</span>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
