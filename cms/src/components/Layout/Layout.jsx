import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  // Tutup drawer bila tukar page (mobile)
  useEffect(() => { setNavOpen(false) }, [pathname])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar drawerOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        <TopBar onMenu={() => setNavOpen(true)} />
        <main style={{ flex: 1, padding: '2rem 1.75rem', background: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
