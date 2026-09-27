import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Lock, LogIn, ArrowLeft, Sparkles } from 'lucide-react'

export default function PreviewGate({ children, pageName = 'Halaman Ini' }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
      }}>
        <div style={{
          width: '2.5rem', height: '2.5rem', border: '3px solid #bae6fd',
          borderTopColor: '#0369a1', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Memeriksa status kebenaran...</p>
      </div>
    )
  }

  // If user is logged in, unlock full page content!
  if (user) {
    return children
  }

  // If not logged in, display the "Under Development / Proceed with Login" screen
  return (
    <div style={{
      padding: '5rem 1.5rem 6.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-alt, #f8fafc)',
      minHeight: 'calc(100vh - 18rem)',
    }}>
      <div style={{
        maxWidth: '34rem',
        width: '100%',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '3rem 2.25rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
      }}>
        {/* Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          color: '#0369a1',
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          <Sparkles size={14} />
          <span>Page Under Development</span>
        </div>

        {/* Lock / Security Icon */}
        <div style={{
          width: '4.5rem',
          height: '4.5rem',
          borderRadius: '50%',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: '#0f172a',
        }}>
          <Lock size={30} color="#0369a1" />
        </div>

        {/* Main Headings */}
        <h1 style={{
          fontSize: '1.65rem',
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
        }}>
          {pageName} Sedang Dibangunkan
        </h1>

        <p style={{
          fontSize: '0.92rem',
          color: '#64748b',
          lineHeight: 1.7,
          marginBottom: '2.25rem',
        }}>
          Bahagian ini dikhaskan untuk sesi semakan dalaman. Untuk melihat kandungan penuh dan konsol pengurusan, sila <strong>log masuk pentadbir</strong> atau kembali ke <strong>laman utama</strong>.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
        }}>
          <Link
            to="/login"
            className="btn-solid-blue"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.85rem 1.5rem',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
            }}
          >
            <LogIn size={16} />
            <span>PROCEED WITH LOGIN (PENTADBIR)</span>
          </Link>

          <Link
            to="/"
            className="btn-outline-navy"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.85rem 1.5rem',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>KEMBALI KE HOMEPAGE</span>
          </Link>
        </div>

        {/* Security Notice Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          fontSize: '0.74rem',
          color: '#94a3b8',
        }}>
          <Shield size={13} color="#0369a1" />
          <span>AFRA Services Sdn. Bhd. Sistem Keselamatan & Kawalan CMS</span>
        </div>
      </div>
    </div>
  )
}
