import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Shield, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

export default function Login() {
  const { user, signIn, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!authLoading && user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Selamat kembali, Pentadbir!')
    } catch (err) {
      setError('E-mel atau kata laluan tidak sah. Sila cuba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Left dark trust pane */}
      <div style={{
        width: '40%', minWidth: '320px', background: '#0f172a',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '3rem 2.5rem',
      }} className="login-left">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 0.85rem', background: 'rgba(56,189,248,0.12)',
          border: '1px solid rgba(56,189,248,0.3)', borderRadius: '0.375rem',
          color: '#38bdf8', fontSize: '0.76rem', fontWeight: 700,
          width: 'fit-content', marginBottom: '2rem',
        }}>
          <Shield size={13} />
          <span>PORTAL PENTADBIR KESELAMATAN</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Sistem Kawalan &<br />Pentadbiran HQ
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          AFRA Services Sdn. Bhd. — gerbang kawalan operasi keselamatan berpusat. Akses khusus pentadbir sahaja.
        </p>

        {[
          { icon: '🛡️', title: 'Kawalan Operasi & CMS 24 Jam', desc: 'Urus produk, sijil, dan kandungan laman secara langsung.' },
          { icon: '📋', title: 'Log Audit Lengkap', desc: 'Setiap perubahan direkod dengan penuh — siapa, apa, bila.' },
          { icon: '🔒', title: 'Disulitkan SSL 256-bit', desc: 'Sesi dilindungi di bawah Akta Jenayah Komputer 1997.' },
        ].map(f => (
          <div key={f.title} style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '0.375rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', flexShrink: 0,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Bantuan IT Helpdesk:</div>
          <a href="tel:096226678" style={{ fontSize: '0.84rem', color: '#38bdf8', fontWeight: 700 }}>09-6226678</a>
        </div>
      </div>

      {/* Right form pane */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width: '100%', maxWidth: '26rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#0369a1', textDecoration: 'none', marginBottom: '1.25rem' }}>
              ← Kembali ke Laman Utama AFRA
            </Link>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>Log Masuk Pentadbir</h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.35rem' }}>Masukkan ID Pengguna Pentadbir dan kata laluan rasmi.</p>
          </div>

          {error && (
            <div style={{
              display: 'flex', gap: '0.65rem', alignItems: 'flex-start',
              padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '0.375rem', marginBottom: '1.25rem',
            }}>
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <span style={{ fontSize: '0.84rem', color: '#991b1b', fontWeight: 600 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>ID Pengguna Pentadbir</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="cth. admin.hq@afraservices.com.my"
                required
                autoComplete="username"
                style={{
                  padding: '0.8rem 1rem', border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem', background: '#f8fafc',
                  fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Kata Laluan Pentadbir</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '0.8rem 3rem 0.8rem 1rem',
                    border: '1px solid #e2e8f0', borderRadius: '0.375rem',
                    background: '#f8fafc', fontFamily: 'inherit',
                    fontSize: '0.9rem', color: '#0f172a', outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                width: '100%', padding: '0.9rem',
                background: loading ? '#94a3b8' : '#0369a1',
                color: '#ffffff', border: 'none', borderRadius: '0.375rem',
                fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s', fontFamily: 'inherit',
              }}
            >
              {loading ? (
                <><div style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Mengesahkan...</>
              ) : (
                <><LogIn size={16} /> Log Masuk Pentadbir HQ</>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
            fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5,
          }}>
            <Shield size={14} color="#0369a1" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>Log masuk dilindungi dan dipantau di bawah peruntukan Akta Agensi Persendirian 1971 & Akta Jenayah Komputer 1997.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
