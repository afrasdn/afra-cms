import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useLang } from '../lib/i18n'

export default function NotFound() {
  const { t } = useLang()
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '6rem', fontWeight: 900, color: '#e2e8f0', lineHeight: 1, marginBottom: '1rem' }}>404</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{t.notFoundTitle}</h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem' }}>{t.notFoundDesc}</p>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1.5rem', background: '#0369a1', color: '#fff',
          borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
        }}>
          <Home size={16} /> {t.notFoundBack}
        </Link>
      </div>
    </div>
  )
}
