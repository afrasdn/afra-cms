import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Card, Spinner } from '../components/ui'
import { Package, Tag, Award, MessageSquare, TrendingUp, Clock, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ms } from 'date-fns/locale'

function StatCard({ icon: Icon, label, value, color = '#0369a1', loading }) {
  return (
    <Card style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{label}</p>
          {loading ? <Spinner size={20} /> : (
            <p style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</p>
          )}
        </div>
        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.5rem', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, certificates: 0, unreadMessages: 0 })
  const [recentMessages, setRecentMessages] = useState([])
  const [recentAudit, setRecentAudit] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [p, c, cert, msg, audit] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('certificates').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
        ])
        setStats({
          products: p.count ?? 0,
          categories: c.count ?? 0,
          certificates: cert.count ?? 0,
          unreadMessages: msg.count ?? 0,
        })
        setRecentAudit(audit.data ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
    { icon: Package,       label: 'Jumlah Produk',       value: stats.products,       color: '#0369a1', to: '/products' },
    { icon: Tag,           label: 'Kategori Aktif',       value: stats.categories,      color: '#7c3aed', to: '/categories' },
    { icon: Award,         label: 'Sijil & Lesen',        value: stats.certificates,    color: '#059669', to: '/admin/certificates' },
    { icon: MessageSquare, label: 'Mesej Belum Dibaca',   value: stats.unreadMessages,  color: '#dc2626', to: '/contact-messages' },
  ]

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '0.75rem', padding: '1.75rem 2rem', marginBottom: '1.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: '1px solid #bae6fd',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>PORTAL PENTADBIRAN AFRA SERVICES</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>Selamat Kembali, Pentadbir 👋</h2>
          <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '0.35rem' }}>Semua sistem beroperasi normal. Pantau status laman dan urus kandungan di sini.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '0.6rem 1rem' }}>
          <TrendingUp size={14} color="#0369a1" />
          <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 700 }}>AFRA CMS v1.0</span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {statCards.map(s => (
          <Link key={s.label} to={s.to} style={{ textDecoration: 'none' }}>
            <StatCard {...s} loading={loading} />
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Tindakan Pantas</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { to: '/products/new', label: 'Tambah Produk Baru', icon: Package },
              { to: '/admin/certificates/new', label: 'Tambah Sijil / Lesen', icon: Award },
              { to: '/contact-messages', label: 'Semak Mesej Kenalan', icon: MessageSquare },
              { to: '/home-content', label: 'Edit Kandungan Laman Utama', icon: Eye },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 0.85rem', borderRadius: '0.375rem',
                background: '#f8fafc', border: '1px solid #e2e8f0',
                fontSize: '0.84rem', fontWeight: 600, color: '#334155',
                textDecoration: 'none', transition: 'all 0.15s',
              }}>
                <Icon size={15} color="#0369a1" />
                {label}
              </Link>
            ))}
          </div>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            <Clock size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />
            Aktiviti Terkini
          </p>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div>
          ) : recentAudit.length === 0 ? (
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', textAlign: 'center', padding: '1.5rem' }}>Tiada aktiviti lagi.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentAudit.map(log => (
                <div key={log.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem',
                    borderRadius: '0.25rem', flexShrink: 0, marginTop: '0.1rem',
                    background: log.action === 'DELETE' ? '#fef2f2' : log.action === 'CREATE' ? '#f0fdf4' : '#fffbeb',
                    color: log.action === 'DELETE' ? '#dc2626' : log.action === 'CREATE' ? '#16a34a' : '#b45309',
                  }}>
                    {log.action}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>{log.table_name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {log.user_email} · {format(new Date(log.created_at), 'dd MMM, HH:mm', { locale: ms })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
