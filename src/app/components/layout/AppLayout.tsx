import { Outlet } from 'react-router-dom'
import Navbar from './NavBar/Navbar'
import Footer from './Footer'

function AppLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f3f4f6',
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: '24px',
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default AppLayout