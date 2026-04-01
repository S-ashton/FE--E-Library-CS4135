import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '24px',
        }}>
        <Outlet />
      </main>
      <footer>
        <p>E-Library</p>
      </footer>
    </div>
  );
}

export default AppLayout;
