import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, Input, EmptyState, ConfirmDialog, Spinner, ENInput } from '../../components/ui'
import { Plus, Pencil, Trash2, Users, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', role: '', role_en: '', sort_order: 0 }

export default function Leadership() {
  const { user, profile } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('leaders').select('*').order('sort_order').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  function openNew() { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }
  function openEdit(l) { setForm({ name: l.name, role: l.role, role_en: l.en?.role ?? '', sort_order: l.sort_order ?? 0 }); setEditId(l.id); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Nama wajib diisi.'); return }
    if (!form.role.trim()) { toast.error('Jawatan wajib diisi.'); return }
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), role: form.role.trim(), sort_order: parseInt(form.sort_order) || 0, en: { role: form.role_en.trim() || null } }
      if (editId) {
        const { error } = await supabase.from('leaders').update(payload).eq('id', editId)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'leaders', recordId: editId, newData: payload })
        toast.success('Pemimpin dikemaskini.')
      } else {
        const { data, error } = await supabase.from('leaders').insert({ ...payload, is_active: true }).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'leaders', recordId: data.id, newData: payload })
        toast.success('Pemimpin ditambah.')
      }
      closeForm(); load()
    } catch (err) { toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.')) }
    finally { setSaving(false) }
  }

  async function handleToggle(l) {
    await supabase.from('leaders').update({ is_active: !l.is_active }).eq('id', l.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'leaders', recordId: l.id, newData: { is_active: !l.is_active } })
    toast.success(`Pemimpin ${l.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('leaders').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'leaders', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Pemimpin dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader title="Barisan Kepimpinan" subtitle={`${items.length} pemimpin — dipapar di About Us`} action={<Btn onClick={openNew}><Plus size={15} /> Tambah Pemimpin</Btn>} />
      {showForm && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{editId ? 'Edit Pemimpin' : 'Pemimpin Baru'}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Input label="Nama *" id="ld-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Jawatan (BM) *" id="ld-role" value={form.role} placeholder="cth: Pengarah Urusan" onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            <ENInput label="Jawatan" id="ld-role-en" value={form.role_en} placeholder="e.g. Managing Director" onChange={e => setForm(f => ({ ...f, role_en: e.target.value }))} />
            <Input label="Susunan" id="ld-sort" type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Btn variant="secondary" type="button" onClick={closeForm}>Batal</Btn>
              <Btn type="submit" disabled={saving}>{saving ? 'Menyimpan...' : editId ? 'Simpan' : 'Tambah'}</Btn>
            </div>
          </form>
        </Card>
      )}
      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={32} /></div>
        ) : items.length === 0 ? (
          <EmptyState icon={Users} title="Tiada pemimpin" description="Tambah barisan kepimpinan untuk dipapar di About Us." action={<Btn onClick={openNew}>Tambah Pemimpin</Btn>} />
        ) : (
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Nama & Jawatan', 'Status', 'Tindakan'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{l.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{l.role} · susunan: {l.sort_order}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}><Badge color={l.is_active ? 'green' : 'gray'}>{l.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge></td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleToggle(l)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: l.is_active ? '#dc2626' : '#16a34a' }}>
                        {l.is_active ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button onClick={() => openEdit(l)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#0369a1' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(l)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </Card>
      <ConfirmDialog open={!!deleteTarget} title="Padam Pemimpin?" message={`"${deleteTarget?.name}" akan dipadam secara kekal.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}
