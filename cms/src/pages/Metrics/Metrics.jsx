import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, Input, EmptyState, ConfirmDialog, Spinner, ENInput } from '../../components/ui'
import { Plus, Pencil, Trash2, BarChart3, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_FORM = { value: '', suffix: '', label: '', label_en: '', sub: '', sub_en: '', sort_order: 0 }

export default function Metrics() {
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
    const { data } = await supabase.from('metrics').select('*').order('sort_order').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  function openNew() { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }
  function openEdit(m) { setForm({ value: m.value, suffix: m.suffix ?? '', label: m.label, label_en: m.en?.label ?? '', sub: m.sub ?? '', sub_en: m.en?.sub ?? '', sort_order: m.sort_order ?? 0 }); setEditId(m.id); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.value.trim()) { toast.error('Nilai wajib diisi.'); return }
    if (!form.label.trim()) { toast.error('Label wajib diisi.'); return }
    setSaving(true)
    try {
      const payload = { value: form.value.trim(), suffix: form.suffix.trim() || null, label: form.label.trim(), sub: form.sub.trim() || null, sort_order: parseInt(form.sort_order) || 0, en: { label: form.label_en.trim() || null, sub: form.sub_en.trim() || null } }
      if (editId) {
        const { error } = await supabase.from('metrics').update(payload).eq('id', editId)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'metrics', recordId: editId, newData: payload })
        toast.success('Metrik dikemaskini.')
      } else {
        const { data, error } = await supabase.from('metrics').insert({ ...payload, is_active: true }).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'metrics', recordId: data.id, newData: payload })
        toast.success('Metrik ditambah.')
      }
      closeForm(); load()
    } catch (err) { toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.')) }
    finally { setSaving(false) }
  }

  async function handleToggle(m) {
    await supabase.from('metrics').update({ is_active: !m.is_active }).eq('id', m.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'metrics', recordId: m.id, newData: { is_active: !m.is_active } })
    toast.success(`Metrik ${m.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('metrics').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'metrics', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Metrik dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader title="Strip Metrik Home" subtitle={`${items.length} metrik — cth: 13+ Cawangan, RM5M Modal`} action={<Btn onClick={openNew}><Plus size={15} /> Tambah Metrik</Btn>} />
      {showForm && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{editId ? 'Edit Metrik' : 'Metrik Baru'}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Input label="Nilai * (cth: 13, RM5M, 2009)" id="mt-value" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
            <Input label="Suffix (cth: +, %)" id="mt-suffix" value={form.suffix} onChange={e => setForm(f => ({ ...f, suffix: e.target.value }))} />
            <Input label="Susunan" id="mt-sort" type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Label (BM) *" id="mt-label" value={form.label} placeholder="cth: Cawangan Negeri" onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
              <ENInput label="Label" id="mt-label-en" value={form.label_en} placeholder="e.g. State Branches" onChange={e => setForm(f => ({ ...f, label_en: e.target.value }))} />
              <Input label="Sub-label (BM)" id="mt-sub" value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))} />
              <ENInput label="Sub-label" id="mt-sub-en" value={form.sub_en} onChange={e => setForm(f => ({ ...f, sub_en: e.target.value }))} />
            </div>
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
          <EmptyState icon={BarChart3} title="Tiada metrik" description="Tambah metrik statistik untuk strip Home." action={<Btn onClick={openNew}>Tambah Metrik</Btn>} />
        ) : (
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Metrik', 'Status', 'Tindakan'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '1rem' }}>{m.value}{m.suffix} <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>— {m.label}</span></div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.sub || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}><Badge color={m.is_active ? 'green' : 'gray'}>{m.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge></td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleToggle(m)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: m.is_active ? '#dc2626' : '#16a34a' }}>
                        {m.is_active ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button onClick={() => openEdit(m)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#0369a1' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(m)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
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
      <ConfirmDialog open={!!deleteTarget} title="Padam Metrik?" message={`"${deleteTarget?.label}" akan dipadam secara kekal.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}
