import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, Input, EmptyState, ConfirmDialog, Spinner, Toggle } from '../../components/ui'
import { Users as UsersIcon, Plus, Trash2, RefreshCw, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ms } from 'date-fns/locale'

const EMPTY_FORM = { email: '', full_name: '', password: '' }

export default function Users() {
  const { user: currentUser, profile } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    setUsers(data ?? [])
    setLoading(false)
  }

  function validate() {
    const errs = {}
    if (!form.email.trim()) errs.email = 'E-mel wajib diisi.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format e-mel tidak sah.'
    if (!form.password || form.password.length < 8) errs.password = 'Kata laluan sekurang-kurangnya 8 aksara.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      // Supabase Auth admin.createUser() requires service_role key which must
      // NOT be exposed in frontend. Use signUp instead — user gets email confirm.
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name } },
      })
      if (error) throw error
      // Update the auto-created profile row with full_name
      if (data.user) {
        await supabase.from('users').update({ full_name: form.full_name }).eq('id', data.user.id)
        await logAudit({ userId: currentUser?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'users', recordId: data.user.id, newData: { email: form.email } })
      }
      toast.success('Pentadbir baharu didaftarkan. Semak e-mel untuk pengesahan.')
      setShowForm(false); setForm(EMPTY_FORM); load()
    } catch (err) {
      toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.'))
    } finally { setSaving(false) }
  }

  async function toggleActive(u) {
    if (u.id === currentUser?.id) { toast.error('Anda tidak boleh nyahaktif akaun sendiri.'); return }
    await supabase.from('users').update({ is_active: !u.is_active }).eq('id', u.id)
    await logAudit({ userId: currentUser?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'users', recordId: u.id, newData: { is_active: !u.is_active } })
    toast.success(`Akaun ${u.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    if (deleteTarget.id === currentUser?.id) { toast.error('Anda tidak boleh memadam akaun sendiri.'); return }
    setDeleting(true)
    try {
      await supabase.from('users').delete().eq('id', deleteTarget.id)
      await logAudit({ userId: currentUser?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'users', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Pengguna dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam pengguna.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader
        title="Pengurusan Pengguna"
        subtitle={`${users.length} akaun pentadbir didaftarkan`}
        action={<Btn onClick={() => { setShowForm(true); setErrors({}); setForm(EMPTY_FORM) }}><Plus size={15} /> Tambah Pentadbir</Btn>}
      />

      {showForm && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
            <Shield size={16} color="#0369a1" />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Tambah Pentadbir Baru</h3>
          </div>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Nama Penuh" id="u-name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Nama Pentadbir" />
            <Input label="E-mel Pentadbir *" id="u-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} placeholder="admin@afraservices.com.my" />
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Kata Laluan Sementara *" id="u-pass" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password} placeholder="Minimum 8 aksara" />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Btn variant="secondary" type="button" onClick={() => setShowForm(false)}>Batal</Btn>
              <Btn type="submit" disabled={saving}>{saving ? 'Mencipta...' : 'Cipta Pentadbir'}</Btn>
            </div>
          </form>
          <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.75rem' }}>
            ⚠️ Peranan ditetapkan sebagai <strong>admin</strong> secara automatik. Pentadbir baru akan menerima e-mel pengesahan.
          </p>
        </Card>
      )}

      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={32} /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="Tiada pengguna" description="Tambah pentadbir pertama." action={<Btn onClick={() => setShowForm(true)}>Tambah Pentadbir</Btn>} />
        ) : (
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                {['Pengguna', 'Peranan', 'Status', 'Didaftar', 'Tindakan'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                        {u.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{u.full_name || '—'}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}><Badge color="blue">{u.role?.toUpperCase()}</Badge></td>
                  <td style={{ padding: '1rem 1.25rem' }}><Badge color={u.is_active ? 'green' : 'gray'}>{u.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge></td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                    {format(new Date(u.created_at), 'dd MMM yyyy', { locale: ms })}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {u.id !== currentUser?.id && (
                        <>
                          <Toggle checked={u.is_active} onChange={() => toggleActive(u)} />
                          <button onClick={() => setDeleteTarget(u)} style={{ padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {u.id === currentUser?.id && <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic' }}>Akaun anda</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Padam Pentadbir?"
        message={`Akaun "${deleteTarget?.email}" akan dipadam secara kekal dari sistem. Tindakan ini tidak boleh dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
