import { useState } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Shield, User, Menu, X, LayoutDashboard,
  MapPin, Phone, Mail
} from 'lucide-react'
import '../../styles/public.css'

export default function PublicLayout() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'ABOUT US' },
    { to: '/catalog', label: 'SERVICES' },
    { to: '/certificates', label: 'CERTIFICATES' },
    { to: '/contact', label: 'CONTACT US' },
  ]

  return (
    <div className="public-site-wrapper">
      {/* ── HEADER / NAVIGATION ── */}
      <header className="public-header">
        <div className="mx-auto flex max-w-7xl header-inner px-6 sm:px-8">
          
          {/* Brand Logo & Title */}
          <Link className="brand-container" to="/">
            <div className="brand-logo-box">
              <img
                src="/assets/afra-logo.png"
                alt="AFRA Services Logo"
                onError={e => { e.currentTarget.src = '/assets/afra-logo-hd.png' }}
              />
            </div>
            <div className="brand-text-col">
              <span className="brand-title">AFRA</span>
              <span className="brand-subtitle">SERVICES SDN. BHD.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
            <a
              className="nav-item"
              href="https://webmail.afraservices.com.my"
              target="_blank"
              rel="noopener noreferrer"
            >
              STAFF EMAIL
            </a>
          </nav>

          {/* Right Action: Login / Dashboard Button & Mobile Menu Toggle */}
          <div className="header-right-actions">
            {user ? (
              <Link className="nav-btn-login" to="/dashboard" style={{ background: '#0284c7' }}>
                <LayoutDashboard size={14} />
                <span>KONSOL CMS</span>
              </Link>
            ) : (
              <Link className="nav-btn-login" to="/login">
                <User size={14} />
                <span>LOGIN</span>
              </Link>
            )}

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="https://webmail.afraservices.com.my"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              STAFF EMAIL
            </a>
            {user ? (
              <Link
                to="/dashboard"
                style={{ color: '#0369a1', fontWeight: 800 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                KONSOL PENTADBIR CMS →
              </Link>
            ) : (
              <Link
                to="/login"
                style={{ color: '#0369a1', fontWeight: 800 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                LOG MASUK PENTADBIR →
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT OUTLET ── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="public-footer">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20 footer-grid">
          
          <div className="footer-col-main">
            <Link className="footer-brand-wrap" to="/">
              <div className="footer-logo-box">
                <img
                  src="/assets/afra-logo.png"
                  alt="AFRA Services Logo"
                  onError={e => { e.currentTarget.src = '/assets/afra-logo-hd.png' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="footer-brand-title">AFRA</span>
                <span className="footer-brand-sub">SERVICES SDN. BHD.</span>
              </div>
            </Link>

            <p className="footer-about-text">
              AFRA Services Sdn. Bhd. (No. Pendaftaran: 881616-V) merupakan syarikat kawalan keselamatan berlesen rasmi di Malaysia yang diperbadankan sejak 7 Disember 2009 dengan modal dibenarkan dan berbayar sebanyak RM 5,000,000.00.
            </p>

            <div className="footer-contacts-list">
              <div className="footer-contact-item">
                <MapPin size={18} />
                <span>LOT PT 1914, Tingkat 1A, Bukit Besar,<br />21100 Kuala Terengganu, Terengganu Darul Iman.</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} />
                <span>09-6226678 / 09-6264788 (Faks)</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} />
                <a href="mailto:afraservices@gmail.com">afraservices@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="footer-col-nav">
            <h3 className="footer-nav-title">Pautan Pantas</h3>
            <ul className="footer-nav-links">
              <li><Link to="/">Laman Utama</Link></li>
              <li><Link to="/about">Tentang Kami</Link></li>
              <li><Link to="/catalog">Senarai Perkhidmatan</Link></li>
              <li><Link to="/certificates">Sijil &amp; Pelesenan</Link></li>
              <li><Link to="/contact">Hubungi Kami</Link></li>
              <li><a href="https://webmail.afraservices.com.my" target="_blank" rel="noopener noreferrer">Staff Webmail</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom-bar">
          <div className="mx-auto max-w-7xl px-6 footer-bottom-inner">
            <p>Hak Cipta Terpelihara 2009 - 2026 © <strong>AFRA Services Sdn. Bhd.</strong> (881616-V).</p>
            <p style={{ fontSize: '11px', color: '#38bdf8' }}>Agensi Kawalan Keselamatan Berlesen KDN &amp; PDRM</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
