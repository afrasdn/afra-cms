import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, Input, Textarea, EmptyState, ConfirmDialog, Spinner, ENInput, ENTextarea } from '../../components/ui'
import { Plus, Pencil, Trash2, Target, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_FORM = { title: '', title_en: '', description: '', description_en: '', sort_order: 0 }

export default function Objectives() {
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
    const { data } = await supabase.from('objectives').select('*').order('sort_order').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  function openNew() { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }
  function openEdit(o) { setForm({ title: o.title, title_en: o.en?.title ?? '', description: o.description ?? '', description_en: o.en?.description ?? '', sort_order: o.sort_order ?? 0 }); setEditId(o.id); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Tajuk wajib diisi.'); return }
    setSaving(true)
    try {
      const payload = { title: form.title.trim(), description: form.description.trim() || null, sort_order: parseInt(form.sort_order) || 0, en: { title: form.title_en.trim() || null, description: form.description_en.trim() || null } }
      if (editId) {
        const { error } = await supabase.from('objectives').update(payload).eq('id', editId)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'objectives', recordId: editId, newData: payload })
        toast.success('Objektif dikemaskini.')
      } else {
        const { data, error } = await supabase.from('objectives').insert({ ...payload, is_active: true }).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'objectives', recordId: data.id, newData: payload })
        toast.success('Objektif ditambah.')
      }
      closeForm(); load()
    } catch (err) { toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.')) }
    finally { setSaving(false) }
  }

  async function handleToggle(o) {
    await supabase.from('objectives').update({ is_active: !o.is_active }).eq('id', o.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'objectives', recordId: o.id, newData: { is_active: !o.is_active } })
    toast.success(`Objektif ${o.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('objectives').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'objectives', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Objektif dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader title="Objektif Penubuhan" subtitle={`${items.length} objektif — dipapar di About Us`} action={<Btn onClick={openNew}><Plus size={15} /> Tambah Objektif</Btn>} />
      {showForm && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{editId ? 'Edit Objektif' : 'Objektif Baru'}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Tajuk (BM) *" id="obj-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <ENInput label="Tajuk" id="obj-title-en" value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} />
            <Input label="Susunan" id="obj-sort" type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea label="Penerangan (BM)" id="obj-desc" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <ENTextarea label="Penerangan" id="obj-desc-en" rows={2} value={form.description_en} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} />
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
          <EmptyState icon={Target} title="Tiada objektif" description="Tambah objektif penubuhan untuk dipapar di About Us." action={<Btn onClick={openNew}>Tambah Objektif</Btn>} />
        ) : (
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Objektif', 'Status', 'Tindakan'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{o.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{o.description || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}><Badge color={o.is_active ? 'green' : 'gray'}>{o.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge></td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleToggle(o)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: o.is_active ? '#dc2626' : '#16a34a' }}>
                        {o.is_active ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button onClick={() => openEdit(o)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#0369a1' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(o)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
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
      <ConfirmDialog open={!!deleteTarget} title="Padam Objektif?" message={`"${deleteTarget?.title}" akan dipadam secara kekal.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}
