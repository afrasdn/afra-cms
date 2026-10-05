import { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { fetchSettings } from '../../lib/content'
import { useLang, S, LangToggle } from '../../lib/i18n'
import {
  Shield, User, Menu, X, LayoutDashboard,
  MapPin, Phone, Mail
} from 'lucide-react'
import '../../styles/public.css'

export default function PublicLayout() {
  const { user } = useAuth()
  const { lang, t } = useLang()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState({})

  useEffect(() => {
    async function loadFooter() {
      const s = await fetchSettings(supabase)
      setSettings(s)
    }
    loadFooter()
  }, [])

  const navLinks = [
    { to: '/', label: t.navHome },
    { to: '/about', label: t.navAbout },
    { to: '/catalog', label: t.navServices },
    { to: '/certificates', label: t.navCertificates },
    { to: '/contact', label: t.navContact },
  ]
  const footLinks = [
    { to: '/', label: t.footHome },
    { to: '/about', label: t.footAbout },
    { to: '/catalog', label: t.footServices },
    { to: '/certificates', label: t.footCerts },
    { to: '/contact', label: t.footContact },
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
              {t.navStaffEmail}
            </a>
          </nav>

          {/* Right Action: Language toggle + Login / Dashboard Button & Mobile Menu Toggle */}
          <div className="header-right-actions">
            <LangToggle />
            {user ? (
              <Link className="nav-btn-login" to="/dashboard" style={{ background: '#0284c7' }}>
                <LayoutDashboard size={14} />
                <span>{t.navKonsol}</span>
              </Link>
            ) : (
              <Link className="nav-btn-login" to="/login">
                <User size={14} />
                <span>{t.navLogin}</span>
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
              {t.navStaffEmail}
            </a>
            <div style={{ padding: '0.5rem 0' }}>
              <LangToggle />
            </div>
            {user ? (
              <Link
                to="/dashboard"
                style={{ color: '#0369a1', fontWeight: 800 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.navAdminDash}
              </Link>
            ) : (
              <Link
                to="/login"
                style={{ color: '#0369a1', fontWeight: 800 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.navAdminLogin}
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
              {S(settings, 'footer_about', lang) || (lang === 'en' ? 'AFRA Services Sdn. Bhd. (Reg. No.: 881616-V) is an officially licensed security guarding company in Malaysia, incorporated since 7 December 2009 with authorised and paid-up capital of RM 5,000,000.00.' : 'AFRA Services Sdn. Bhd. (No. Pendaftaran: 881616-V) merupakan syarikat kawalan keselamatan berlesen rasmi di Malaysia yang diperbadankan sejak 7 Disember 2009 dengan modal dibenarkan dan berbayar sebanyak RM 5,000,000.00.')}
            </p>

            {(settings.social_facebook || settings.social_instagram || settings.social_tiktok) && (
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {[
                  { url: settings.social_facebook, short: 'FB', label: 'Facebook' },
                  { url: settings.social_instagram, short: 'IG', label: 'Instagram' },
                  { url: settings.social_tiktok, short: 'TT', label: 'TikTok' },
                ].filter(s => s.url).map(s => (
                  <a key={s.short} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '2.25rem', height: '2.25rem', padding: '0 0.6rem', borderRadius: '9999px', background: '#ffffff', border: '1px solid var(--blue-border)', color: 'var(--blue-primary)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textDecoration: 'none' }}>
                    {s.short}
                  </a>
                ))}
              </div>
            )}

            <div className="footer-contacts-list">
              <div className="footer-contact-item">
                <MapPin size={18} />
                <span>{settings.hq_address || 'LOT PT 1914, Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu Darul Iman.'}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} />
                <span>{settings.hq_phone || '09-6226678'}{settings.hq_fax ? ` / ${settings.hq_fax} (${lang === 'en' ? 'Fax' : 'Faks'})` : (lang === 'en' ? ' / 09-6264788 (Fax)' : ' / 09-6264788 (Faks)')}</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} />
                <a href={`mailto:${settings.admin_email || 'afraservices@gmail.com'}`}>{settings.admin_email || 'afraservices@gmail.com'}</a>
              </div>
            </div>
          </div>

          <div className="footer-col-nav">
            <h3 className="footer-nav-title">{S(settings, 'footer_nav_title', lang) || t.footerLinksTitle}</h3>
            <ul className="footer-nav-links">
              {footLinks.map(l => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
              <li><a href="https://webmail.afraservices.com.my" target="_blank" rel="noopener noreferrer">{t.footWebmail}</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom-bar">
          <div className="mx-auto max-w-7xl px-6 footer-bottom-inner">
            <p>{S(settings, 'footer_copyright', lang) || (lang === 'en' ? 'Copyright 2009 - 2026 © AFRA Services Sdn. Bhd. (881616-V). All Rights Reserved.' : 'Hak Cipta Terpelihara 2009 - 2026 © AFRA Services Sdn. Bhd. (881616-V).')}</p>
            <p style={{ fontSize: '11px', color: 'var(--blue-primary)' }}>{S(settings, 'footer_tagline', lang) || (lang === 'en' ? 'KDN & PDRM Licensed Security Agency' : 'Agensi Kawalan Keselamatan Berlesen KDN & PDRM')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
