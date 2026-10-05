import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, Input, EmptyState, ConfirmDialog, Spinner, ENInput } from '../../components/ui'
import { Plus, Pencil, Trash2, Tag, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

function CategoryRow({ cat, onEdit, onDelete, onToggle }) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '1rem 1.25rem' }}>
        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{cat.name}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/{cat.slug}</div>
      </td>
      <td style={{ padding: '1rem 1.25rem', fontSize: '0.84rem', color: '#64748b' }}>{cat.description || '—'}</td>
      <td style={{ padding: '1rem 1.25rem' }}><Badge color={cat.is_active ? 'green' : 'gray'}>{cat.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge></td>
      <td style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => onToggle(cat)} title={cat.is_active ? 'Nyahaktif' : 'Aktifkan'} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: cat.is_active ? '#dc2626' : '#16a34a' }}>
            {cat.is_active ? <X size={14} /> : <Check size={14} />}
          </button>
          <button onClick={() => onEdit(cat)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#0369a1' }}>
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(cat)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

const EMPTY_FORM = { name: '', name_en: '', slug: '', description: '', description_en: '', sort_order: 0 }

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

export default function Categories() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('sort_order').order('name')
    setCategories(data ?? [])
    setLoading(false)
  }

  function openNew() { setForm(EMPTY_FORM); setEditId(null); setErrors({}); setShowForm(true) }
  function openEdit(cat) {
    setForm({ name: cat.name, name_en: cat.en?.name ?? '', slug: cat.slug, description: cat.description ?? '', description_en: cat.en?.description ?? '', sort_order: cat.sort_order ?? 0 })
    setEditId(cat.id); setErrors({}); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi.'
    if (!form.slug.trim()) errs.slug = 'Slug wajib diisi.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const base = { ...form, en: { name: form.name_en.trim() || null, description: form.description_en.trim() || null } }
      delete base.name_en
      delete base.description_en
      if (editId) {
        const { error } = await supabase.from('categories').update(base).eq('id', editId)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'categories', recordId: editId, newData: form })
        toast.success('Kategori dikemaskini.')
      } else {
        const { data, error } = await supabase.from('categories').insert({ ...base, is_active: true }).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'categories', recordId: data.id, newData: form })
        toast.success('Kategori ditambah.')
      }
      closeForm(); load()
    } catch (err) {
      toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(cat) {
    await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'categories', recordId: cat.id, newData: { is_active: !cat.is_active } })
    toast.success(`Kategori ${cat.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('categories').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'categories', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Kategori dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader title="Pengurusan Kategori" subtitle={`${categories.length} kategori`} action={<Btn onClick={openNew}><Plus size={15} /> Tambah Kategori</Btn>} />

      {showForm && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{editId ? 'Edit Kategori' : 'Kategori Baru'}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Nama Kategori (BM) *" id="cat-name" value={form.name} error={errors.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} />
            <ENInput label="Nama Kategori" id="cat-name-en" value={form.name_en}
              onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} />
            <Input label="Slug *" id="cat-slug" value={form.slug} error={errors.slug}
              onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Penerangan (BM) (pilihan)" id="cat-desc" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <ENInput label="Penerangan" id="cat-desc-en" value={form.description_en}
                onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} />
            </div>
            <Input label="Susunan" id="cat-sort" type="number" min="0" value={form.sort_order}
              onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
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
        ) : categories.length === 0 ? (
          <EmptyState icon={Tag} title="Tiada kategori" description="Tambah kategori pertama untuk mula mengatur produk." action={<Btn onClick={openNew}>Tambah Kategori</Btn>} />
        ) : (
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Nama', 'Penerangan', 'Status', 'Tindakan'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <CategoryRow key={c.id} cat={c} onEdit={openEdit} onDelete={setDeleteTarget} onToggle={handleToggle} />
              ))}
            </tbody>
          </table></div>
        )}
      </Card>

      <ConfirmDialog open={!!deleteTarget} title="Padam Kategori?" message={`"${deleteTarget?.name}" akan dipadam. Produk dalam kategori ini tidak akan dipadam tetapi akan tiada kategori.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}
