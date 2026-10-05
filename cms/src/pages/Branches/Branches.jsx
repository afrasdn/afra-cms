import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, Input, Textarea, EmptyState, ConfirmDialog, Spinner, Toggle } from '../../components/ui'
import SettingsCard from '../../components/SettingsCard'
import { Plus, Pencil, Trash2, MapPin, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_FORM = { state: '', address: '', contact: '', is_hq: false, sort_order: 0 }

export default function Branches() {
  const { user, profile } = useAuth()
  const [branches, setBranches] = useState([])
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
    const { data } = await supabase.from('branches').select('*').order('sort_order').order('created_at', { ascending: false })
    setBranches(data ?? [])
    setLoading(false)
  }

  function openNew() { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }
  function openEdit(b) {
    setForm({ state: b.state, address: b.address, contact: b.contact ?? '', is_hq: !!b.is_hq, sort_order: b.sort_order ?? 0 })
    setEditId(b.id); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.state.trim()) { toast.error('Nama negeri wajib diisi.'); return }
    if (!form.address.trim()) { toast.error('Alamat wajib diisi.'); return }
    setSaving(true)
    try {
      const payload = {
        state: form.state.trim(), address: form.address.trim(),
        contact: form.contact.trim() || null, is_hq: form.is_hq,
        sort_order: parseInt(form.sort_order) || 0,
      }
      if (editId) {
        const { error } = await supabase.from('branches').update(payload).eq('id', editId)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'branches', recordId: editId, newData: payload })
        toast.success('Cawangan dikemaskini.')
      } else {
        const { data, error } = await supabase.from('branches').insert({ ...payload, is_active: true }).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'branches', recordId: data.id, newData: payload })
        toast.success('Cawangan ditambah.')
      }
      closeForm(); load()
    } catch (err) {
      toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(b) {
    await supabase.from('branches').update({ is_active: !b.is_active }).eq('id', b.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'branches', recordId: b.id, newData: { is_active: !b.is_active } })
    toast.success(`Cawangan ${b.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('branches').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'branches', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Cawangan dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader title="Pengurusan Cawangan" subtitle={`${branches.length} cawangan — dipapar di Home & Sijil`} action={<Btn onClick={openNew}><Plus size={15} /> Tambah Cawangan</Btn>} />

      <SettingsCard
        cardTitle="Tajuk Seksyen di HOME (13 Cawangan...) — nombor dikira automatik"
        logTag="home_branches_header"
        fields={[
          { key: 'home_branch_tagline', label: 'Tagline kecil atas', placeholder: 'cth: RANGKAIAN OPERASI KEBANGSAAN' },
          { key: 'home_branch_title', label: 'Tajuk besar (taip teks je, nombor auto)', placeholder: 'cth: CAWANGAN SELURUH MALAYSIA' },
          { key: 'home_branch_desc', label: 'Penerangan', textarea: true, placeholder: 'cth: Beroperasi dengan Ibu Pejabat di...' },
        ]}
      />

      {showForm && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{editId ? 'Edit Cawangan' : 'Cawangan Baru'}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Negeri / Nama Cawangan *" id="br-state" value={form.state}
              placeholder="cth: TERENGGANU (HQ)"
              onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
            <Input label="No. Telefon / Kontakt" id="br-contact" value={form.contact}
              placeholder="cth: Tel: 09-6226678"
              onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea label="Alamat *" id="br-address" rows={2} value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <Input label="Susunan" id="br-sort" type="number" min="0" value={form.sort_order}
              onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.4rem' }}>
              <Toggle checked={form.is_hq} onChange={v => setForm(f => ({ ...f, is_hq: v }))} label="Ibu Pejabat (HQ)" />
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
        ) : branches.length === 0 ? (
          <EmptyState icon={MapPin} title="Tiada cawangan" description="Tambah cawangan pertama untuk dipapar di laman awam." action={<Btn onClick={openNew}>Tambah Cawangan</Btn>} />
        ) : (
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Cawangan', 'Alamat', 'Status', 'Tindakan'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branches.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {b.state}
                      {b.is_hq && <Badge color="blue">HQ</Badge>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{b.contact || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', color: '#64748b', maxWidth: '24rem' }}>{b.address}</td>
                  <td style={{ padding: '1rem 1.25rem' }}><Badge color={b.is_active ? 'green' : 'gray'}>{b.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge></td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleToggle(b)} title={b.is_active ? 'Nyahaktif' : 'Aktifkan'} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: b.is_active ? '#dc2626' : '#16a34a' }}>
                        {b.is_active ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button onClick={() => openEdit(b)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#0369a1' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(b)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
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

      <ConfirmDialog open={!!deleteTarget} title="Padam Cawangan?" message={`"${deleteTarget?.state}" akan dipadam dari laman awam secara kekal.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}
