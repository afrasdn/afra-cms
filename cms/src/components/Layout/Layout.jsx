import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '16rem', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar />
        <main style={{ flex: 1, padding: '2rem 1.75rem', background: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
