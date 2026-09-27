import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#f8fafc',
        gap: '0.75rem', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}>
        <div style={{
          width: '2.5rem', height: '2.5rem', border: '3px solid #bae6fd',
          borderTopColor: '#0369a1', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Mengesahkan sesi pentadbir...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
