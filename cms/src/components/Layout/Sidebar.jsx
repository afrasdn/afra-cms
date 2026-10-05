import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Home, Award,
  MessageSquare, ScrollText, Users, Shield, LogOut, ChevronRight,
  ChevronDown, Globe, Briefcase, MapPin, Settings, Crown, Target,
  BarChart3, BadgeCheck, FileText, ListChecks, Building2, Phone,
  AlignLeft
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

// ── Single links (tiada anak) ──
const dashboardLink = { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
const footerLink = { to: '/footer-settings', icon: AlignLeft, label: 'Footer' }

// ── Groups ikut NAMA PUBLIC PAGE ──
// (sesetengah route dikongsi 2 page, cth: Perkhidmatan keluar di Home & Services)
const groups = [
  {
    label: 'Home',
    icon: Home,
    children: [
      { to: '/home-content', icon: FileText, label: 'Hero' },
      { to: '/metrics', icon: BarChart3, label: 'Metrik' },
      { to: '/branches', icon: MapPin, label: 'Cawangan' },
      { to: '/accreditations', icon: BadgeCheck, label: 'Akreditasi' },
    ],
  },
  {
    label: 'About Us',
    icon: Building2,
    children: [
      { to: '/about-settings', icon: FileText, label: 'Info' },
      { to: '/leadership', icon: Crown, label: 'Kepimpinan' },
      { to: '/objectives', icon: Target, label: 'Objektif' },
    ],
  },
  {
    label: 'Services',
    icon: Briefcase,
    children: [
      { to: '/admin/services', icon: ListChecks, label: 'Perkhidmatan' },
      { to: '/products', icon: Package, label: 'Produk' },
      { to: '/categories', icon: Tag, label: 'Kategori' },
    ],
  },
  {
    label: 'Certificates',
    icon: Award,
    children: [
      { to: '/admin/certificates', icon: Award, label: 'Sijil' },
      { to: '/branches', icon: MapPin, label: 'Cawangan' },
    ],
  },
  {
    label: 'Contact Us',
    icon: Phone,
    children: [
      { to: '/contact-settings', icon: Phone, label: 'Hubungi' },
      { to: '/contact-messages', icon: MessageSquare, label: 'Mesej', badge: true },
    ],
  },
  {
    label: 'Sistem',
    icon: Settings,
    children: [
      { to: '/audit-log', icon: ScrollText, label: 'Audit' },
      { to: '/users', icon: Users, label: 'Pengguna' },
    ],
  },
]

function groupForPath(pathname) {
  // Match child route — handle nested paths like /products/new, /admin/certificates/xxx/edit
  for (const g of groups) {
    if (g.children.some(c => pathname === c.to || pathname.startsWith(c.to + '/'))) {
      return g.label
    }
  }
  return null
}

const linkStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.65rem 0.85rem',
  borderRadius: '0.375rem',
  fontSize: '0.84rem',
  fontWeight: isActive ? 700 : 500,
  color: isActive ? '#ffffff' : '#64748b',
  background: isActive ? '#0369a1' : 'transparent',
  transition: 'all 0.15s',
  textDecoration: 'none',
})

function hoverIn(e) {
  if (!e.currentTarget.style.background.includes('0369a1')) {
    e.currentTarget.style.background = '#f0f9ff'
    e.currentTarget.style.color = '#0369a1'
  }
}

function hoverOut(e) {
  if (!e.currentTarget.style.background.includes('0369a1')) {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color = '#64748b'
  }
}

export default function Sidebar({ drawerOpen = false, onClose = () => {} }) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(() => {
    const active = groupForPath(location.pathname)
    return active ? { [active]: true } : {}
  })
  const [unread, setUnread] = useState(0)

  // Auto-expand group yang mengandungi route semasa
  useEffect(() => {
    const active = groupForPath(location.pathname)
    if (active) setOpen(prev => (prev[active] ? prev : { ...prev, [active]: true }))
  }, [location.pathname])

  // Badge mesej belum dibaca
  useEffect(() => {
    async function loadUnread() {
      try {
        const { count } = await supabase
          .from('contact_messages')
          .select('id', { count: 'exact', head: true })
          .eq('is_read', false)
        setUnread(count ?? 0)
      } catch { /* abaikan — sidebar tetap berfungsi */ }
    }
    loadUnread()
  }, [])

  function toggleGroup(label) {
    setOpen(prev => ({ ...prev, [label]: !prev[label] }))
  }

  async function handleSignOut() {
    try {
      await signOut()
      toast.success('Berjaya log keluar.')
    } catch {
      toast.error('Ralat semasa log keluar.')
    }
  }

  function renderGroup(group) {
    const isOpen = !!open[group.label]
    const hasActiveChild = group.children.some(
      c => location.pathname === c.to || location.pathname.startsWith(c.to + '/')
    )
    const GroupIcon = group.icon
    return (
      <div key={group.label}>
        <button
          onClick={() => toggleGroup(group.label)}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
          style={{
            ...linkStyle(hasActiveChild),
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textAlign: 'left',
          }}
        >
          <GroupIcon size={16} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{group.label}</span>
          <ChevronDown
            size={13}
            style={{
              opacity: 0.6,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
        {isOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            marginTop: '0.2rem',
            marginBottom: '0.35rem',
            marginLeft: '0.85rem',
            paddingLeft: '0.65rem',
            borderLeft: '1px solid #e2e8f0',
          }}>
            {group.children.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={`${group.label}-${to}`}
                to={to}
                style={({ isActive }) => ({
                  ...linkStyle(isActive),
                  fontSize: '0.8rem',
                  padding: '0.55rem 0.75rem',
                })}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && unread > 0 && (
                  <span style={{
                    background: '#dc2626', color: '#fff', fontSize: '0.68rem',
                    fontWeight: 800, borderRadius: '9999px', padding: '0.1rem 0.5rem',
                    minWidth: '1.4rem', textAlign: 'center',
                  }}>
                    {unread}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div
        className={`admin-sidebar-overlay${drawerOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`admin-sidebar${drawerOpen ? ' open' : ''}`} style={{
      width: '16rem',
      minHeight: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
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
        borderBottom: '1px solid #e2e8f0',
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
          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em' }}>AFRA</div>
          <div style={{ fontSize: '0.68rem', color: '#0369a1', fontWeight: 700, letterSpacing: '0.1em', marginTop: '0.1rem' }}>PORTAL PENTADBIR</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        <NavLink
          to={dashboardLink.to}
          style={({ isActive }) => linkStyle(isActive)}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          <dashboardLink.icon size={16} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{dashboardLink.label}</span>
          <ChevronRight size={12} style={{ opacity: 0.4 }} />
        </NavLink>

        {groups.map(renderGroup)}

        <NavLink
          to={footerLink.to}
          style={({ isActive }) => linkStyle(isActive)}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          <footerLink.icon size={16} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{footerLink.label}</span>
          <ChevronRight size={12} style={{ opacity: 0.4 }} />
        </NavLink>

        {/* View Public Website Link */}
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
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
              color: '#0369a1',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
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
        borderTop: '1px solid #e2e8f0',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 600 }}>
          LOG MASUK SEBAGAI
        </div>
        <div style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 600, marginBottom: '0.85rem', wordBreak: 'break-all' }}>
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
    </>
  )
}
