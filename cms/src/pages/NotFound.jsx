import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '6rem', fontWeight: 900, color: '#e2e8f0', lineHeight: 1, marginBottom: '1rem' }}>404</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Halaman Tidak Dijumpai</h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem' }}>Halaman yang anda cari tidak wujud atau telah dipindahkan.</p>
        <Link to="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1.5rem', background: '#0369a1', color: '#fff',
          borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
        }}>
          <Home size={16} /> Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
