import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Home, Award,
  MessageSquare, ScrollText, Users, Shield, LogOut, ChevronRight,
  Globe
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products',           icon: Package,         label: 'Produk' },
  { to: '/categories',         icon: Tag,             label: 'Kategori' },
  { to: '/home-content',       icon: Home,            label: 'Kandungan Laman' },
  { to: '/admin/certificates', icon: Award,           label: 'Sijil & Lesen' },
  { to: '/contact-messages',   icon: MessageSquare,   label: 'Mesej Kenalan' },
  { to: '/audit-log',          icon: ScrollText,      label: 'Log Audit' },
  { to: '/users',              icon: Users,           label: 'Pengguna' },
]

export default function Sidebar() {
  const { profile, signOut } = useAuth()

  async function handleSignOut() {
    try {
      await signOut()
      toast.success('Berjaya log keluar.')
    } catch {
      toast.error('Ralat semasa log keluar.')
    }
  }

  return (
    <aside style={{
      width: '16rem',
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 40,
    }}>
      {/* Brand */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
      }}>
        <div style={{
          width: '2.25rem', height: '2.25rem',
          background: '#0369a1', borderRadius: '0.375rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Shield size={16} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em' }}>AFRA</div>
          <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.1em', marginTop: '0.1rem' }}>PORTAL PENTADBIR</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '0.375rem',
              fontSize: '0.84rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#ffffff' : '#94a3b8',
              background: isActive ? '#0369a1' : 'transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('0369a1')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.color = '#e2e8f0'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.background.includes('0369a1')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#94a3b8'
              }
            }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{label}</span>
            <ChevronRight size={12} style={{ opacity: 0.4 }} />
          </NavLink>
        ))}

        {/* View Public Website Link */}
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '0.375rem',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#38bdf8',
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.2)',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
          >
            <Globe size={16} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>Lihat Laman Utama</span>
            <ChevronRight size={12} style={{ opacity: 0.7 }} />
          </Link>
        </div>
      </nav>

      {/* User + Sign out */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>
          LOG MASUK SEBAGAI
        </div>
        <div style={{ fontSize: '0.84rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.85rem', wordBreak: 'break-all' }}>
          {profile?.email ?? '—'}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            width: '100%', padding: '0.6rem 0.85rem',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '0.375rem', color: '#f87171',
            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <LogOut size={14} />
          <span>Log Keluar</span>
        </button>
      </div>
    </aside>
  )
}
