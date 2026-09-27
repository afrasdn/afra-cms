import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, PageHeader, Badge, EmptyState, Spinner } from '../../components/ui'
import { ScrollText } from 'lucide-react'
import { format } from 'date-fns'
import { ms } from 'date-fns/locale'

const ACTION_COLORS = { CREATE: 'green', UPDATE: 'amber', DELETE: 'red' }

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PER_PAGE = 25

  useEffect(() => { load() }, [page])

  async function load() {
    setLoading(true)
    const from = (page - 1) * PER_PAGE
    const { data, count } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + PER_PAGE - 1)
    setLogs(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      <PageHeader title="Log Audit" subtitle={`${total} entri log keseluruhan`} />
      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={32} /></div>
        ) : logs.length === 0 ? (
          <EmptyState icon={ScrollText} title="Tiada log audit" description="Setiap tindakan CRUD akan direkodkan di sini." />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                    {['Tindakan', 'Jadual', 'Pengguna', 'Tarikh & Masa', 'ID Rekod'].map(h => (
                      <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '0.85rem 1.25rem' }}><Badge color={ACTION_COLORS[log.action] ?? 'gray'}>{log.action}</Badge></td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.84rem', fontWeight: 600, color: '#334155', fontFamily: 'monospace' }}>{log.table_name}</td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#64748b' }}>{log.user_email ?? '—'}</td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {format(new Date(log.created_at), "dd MMM yyyy, HH:mm:ss", { locale: ms })}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                        {log.record_id ? log.record_id.slice(0, 8) + '…' : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '0.45rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 700, opacity: page === 1 ? 0.5 : 1, fontFamily: 'inherit' }}
                >← Sebelum</button>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Halaman {page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ padding: '0.45rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 700, opacity: page === totalPages ? 0.5 : 1, fontFamily: 'inherit' }}
                >Seterus →</button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
