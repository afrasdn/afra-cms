import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Badge, Btn, EmptyState, Spinner } from '../../components/ui'
import { MessageSquare, Mail, Phone, Building2, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { ms } from 'date-fns/locale'
import toast from 'react-hot-toast'

function MessageCard({ msg, onRead, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      border: `1px solid ${msg.is_read ? '#e2e8f0' : '#bae6fd'}`,
      borderLeft: `4px solid ${msg.is_read ? '#e2e8f0' : '#0369a1'}`,
      borderRadius: '0.5rem',
      padding: '1rem 1.25rem',
      background: msg.is_read ? '#fafafa' : '#f0f9ff',
      marginBottom: '0.75rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{msg.name}</span>
            {!msg.is_read && <Badge color="blue">Baru</Badge>}
            {msg.service_type && <Badge color="gray">{msg.service_type}</Badge>}
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {msg.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}><Mail size={12} />{msg.email}</span>}
            {msg.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}><Phone size={12} />{msg.phone}</span>}
            {msg.company && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}><Building2 size={12} />{msg.company}</span>}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {format(new Date(msg.created_at), "dd MMMM yyyy, HH:mm", { locale: ms })}
            {msg.state && ` · ${msg.state}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setExpanded(v => !v)} style={{ padding: '0.4rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#64748b' }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {!msg.is_read && (
            <button onClick={() => onRead(msg)} title="Tandai dibaca" style={{ padding: '0.4rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.25rem', cursor: 'pointer', color: '#16a34a' }}>
              <Check size={14} />
            </button>
          )}
          <button onClick={() => onDelete(msg)} style={{ padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {expanded && msg.message && (
        <div style={{ marginTop: '0.85rem', padding: '0.85rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {msg.message}
        </div>
      )}
    </div>
  )
}

export default function ContactMessages() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  async function markRead(msg) {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'contact_messages', recordId: msg.id, newData: { is_read: true } })
    toast.success('Ditandai sebagai dibaca.')
    load()
  }

  async function deleteMsg(msg) {
    await supabase.from('contact_messages').delete().eq('id', msg.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'contact_messages', recordId: msg.id, oldData: msg })
    toast.success('Mesej dipadam.')
    load()
  }

  async function markAllRead() {
    await supabase.from('contact_messages').update({ is_read: true }).eq('is_read', false)
    toast.success('Semua mesej ditandai dibaca.')
    load()
  }

  const filtered = messages.filter(m => filter === 'all' ? true : filter === 'unread' ? !m.is_read : m.is_read)
  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      <PageHeader
        title="Peti Mesej Kenalan"
        subtitle={`${messages.length} mesej · ${unreadCount} belum dibaca`}
        action={unreadCount > 0 ? <Btn variant="secondary" onClick={markAllRead}><Check size={14} /> Tandai Semua Dibaca</Btn> : null}
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[{ v: 'all', l: 'Semua' }, { v: 'unread', l: 'Belum Dibaca' }, { v: 'read', l: 'Sudah Dibaca' }].map(({ v, l }) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid',
            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            background: filter === v ? '#0369a1' : '#f1f5f9',
            color: filter === v ? '#ffffff' : '#475569',
            borderColor: filter === v ? '#0369a1' : '#e2e8f0',
          }}>{l}</button>
        ))}
      </div>

      <Card style={{ padding: '1.25rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={32} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Tiada mesej" description="Tiada mesej dalam kategori ini." />
        ) : (
          filtered.map(m => <MessageCard key={m.id} msg={m} onRead={markRead} onDelete={deleteMsg} />)
        )}
      </Card>
    </div>
  )
}
