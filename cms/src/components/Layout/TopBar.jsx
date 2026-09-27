import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Bell } from 'lucide-react'

const routeTitles = {
  '/dashboard':        'Dashboard',
  '/products':         'Pengurusan Produk',
  '/products/new':     'Tambah Produk Baru',
  '/categories':       'Pengurusan Kategori',
  '/home-content':     'Kandungan Laman Utama',
  '/certificates':       'Sijil & Pelesenan',
  '/admin/certificates':     'Sijil & Pelesenan',
  '/admin/certificates/new': 'Tambah Sijil',
  '/contact-messages': 'Mesej Kenalan',
  '/audit-log':        'Log Audit',
  '/users':            'Pengurusan Pengguna',
}

export default function TopBar() {
  const { pathname } = useLocation()
  const { profile } = useAuth()

  // Match exact or edit routes like /products/:id/edit
  const title = routeTitles[pathname]
    ?? (pathname.endsWith('/edit') ? 'Edit Rekod' : 'CMS AFRA Services')

  const now = new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
      padding: '0 1.75rem',
      height: '4rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '1rem',
    }}>
      <div>
        <h1 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</h1>
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.1rem', fontWeight: 500 }}>{now}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button style={{
          width: '2.25rem', height: '2.25rem',
          background: '#f1f5f9', border: '1px solid #e2e8f0',
          borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#64748b',
        }}>
          <Bell size={16} />
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.65rem',
          padding: '0.4rem 0.85rem', background: '#f8fafc',
          border: '1px solid #e2e8f0', borderRadius: '0.5rem',
        }}>
          <div style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '50%',
            background: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
          }}>
            {profile?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Pentadbir</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{profile?.email ?? '...'}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
