import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function AppLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>
        <p>E-Library</p>
      </footer>
    </div>
  );
}

export default AppLayout;
