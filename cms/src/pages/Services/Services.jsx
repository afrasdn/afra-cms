import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Card, PageHeader, Btn, Badge, Input, Textarea, Select, EmptyState, ConfirmDialog, Spinner, ENInput, ENTextarea } from '../../components/ui'
import PageHeaderEditor from '../../components/PageHeaderEditor'
import SettingsCard from '../../components/SettingsCard'
import { Plus, Pencil, Trash2, ShieldCheck, Check, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const ICON_OPTIONS = ['Shield', 'Crosshair', 'Truck', 'UserCheck', 'Activity', 'Video', 'Search', 'GraduationCap', 'ShieldCheck', 'FileText']

const EMPTY_FORM = {
  slug: '', code: '', tag: '', title: '', title_en: '',
  description: '', description_en: '', icon: 'Shield',
  image_url: '', features: '', features_en: '', sort_order: 0
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

export default function Services() {
  const { user, profile } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('sort_order').order('created_at', { ascending: false })
    setServices(data ?? [])
    setLoading(false)
  }

  function openNew() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  function openEdit(s) {
    setForm({
      slug: s.slug,
      code: s.code ?? '',
      tag: s.tag ?? '',
      title: s.title,
      title_en: s.en?.title ?? '',
      description: s.description ?? '',
      description_en: s.en?.description ?? '',
      icon: s.icon ?? 'Shield',
      image_url: s.image_url ?? '',
      features: (s.features ?? []).join('\n'),
      features_en: (s.en?.features ?? []).join('\n'),
      sort_order: s.sort_order ?? 0,
    })
    setEditId(s.id)
    setImageFile(null)
    setImagePreview(s.image_url ?? null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Saiz fail melebihi 5MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Tajuk wajib diisi.'); return }
    if (!form.slug.trim()) { toast.error('Slug wajib diisi.'); return }
    setSaving(true)
    try {
      let finalImageUrl = form.image_url.trim() || null

      if (imageFile) {
        const upload = await uploadToCloudinary(imageFile, 'afra/services')
        finalImageUrl = upload.url
      }

      const payload = {
        slug: slugify(form.slug),
        code: form.code.trim() || null,
        tag: form.tag.trim() || null,
        title: form.title.trim(),
        description: form.description.trim() || null,
        icon: form.icon,
        image_url: finalImageUrl,
        features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
        sort_order: parseInt(form.sort_order) || 0,
        en: {
          title: form.title_en.trim() || null,
          description: form.description_en.trim() || null,
          features: form.features_en.split('\n').map(f => f.trim()).filter(Boolean),
        },
      }

      if (editId) {
        const { error } = await supabase.from('services').update(payload).eq('id', editId)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'services', recordId: editId, newData: payload })
        toast.success('Perkhidmatan dikemaskini.')
      } else {
        const { data, error } = await supabase.from('services').insert({ ...payload, is_active: true }).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'services', recordId: data.id, newData: payload })
        toast.success('Perkhidmatan ditambah.')
      }
      closeForm(); load()
    } catch (err) {
      toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(s) {
    await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'services', recordId: s.id, newData: { is_active: !s.is_active } })
    toast.success(`Perkhidmatan ${s.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('services').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'services', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Perkhidmatan dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader
        title="Pengurusan Perkhidmatan"
        subtitle={`${services.length} perkhidmatan — dipapar di Home & Katalog`}
        action={<Btn onClick={openNew}><Plus size={15} /> Tambah Perkhidmatan</Btn>}
      />

      <PageHeaderEditor titleKey="page_services_title" descKey="page_services_desc" cardTitle="Tajuk Header Laman Services (Katalog)" />

      <SettingsCard
        cardTitle="Teks Seksyen Laman Katalog — nombor dikira automatik"
        logTag="catalog_sections"
        fields={[
          { key: 'page_services_tag', label: 'Tag kecil atas tajuk', placeholder: 'cth: Portfolio Perkhidmatan Kawalan' },
          { key: 'catalog_core_tag', label: 'Tag servis utama (taip teks je, nombor auto)', placeholder: 'cth: PENGKHUSUSAN UTAMA' },
          { key: 'catalog_core_title', label: 'Tajuk servis utama', placeholder: 'cth: Perkhidmatan Operasi Berlesen' },
          { key: 'catalog_cta_detail', label: 'Teks butang setiap servis', placeholder: 'cth: MINTA SEBUTHARGA BAGI PERKHIDMATAN INI' },
        ]}
      />

      {showForm && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{editId ? 'Edit Perkhidmatan' : 'Perkhidmatan Baru'}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Tajuk (BM) *" id="svc-title" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))} />
            <ENInput label="Tajuk (EN)" id="svc-title-en" value={form.title_en}
              onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Slug *" id="svc-slug" value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} />
              <Input label="Kod (cth: SVC-01)" id="svc-code" value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
            </div>
            <Input label="Lencana / Tag (cth: Pematuhan KDN & PDRM)" id="svc-tag" value={form.tag}
              onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />

            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea label="Penerangan (BM)" id="svc-desc" rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <ENTextarea label="Penerangan (EN)" id="svc-desc-en" rows={3} value={form.description_en}
                onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} />
            </div>

            <Select label="Ikon" id="svc-icon" value={form.icon}
              onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
              {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </Select>
            <Input label="Susunan" id="svc-sort" type="number" min="0" value={form.sort_order}
              onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />

            {/* Gambar Perkhidmatan */}
            <div style={{ gridColumn: '1 / -1', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', background: '#f8fafc' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Gambar Perkhidmatan (Muat Naik atau URL)
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {imagePreview && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '7rem', height: '5rem', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                    />
                    {imageFile && (
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(form.image_url || null) }}
                        style={{ position: 'absolute', top: '-0.35rem', right: '-0.35rem', background: '#dc2626', border: 'none', borderRadius: '50%', width: '1.25rem', height: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={10} color="white" />
                      </button>
                    )}
                  </div>
                )}

                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem',
                  border: '1px dashed #0369a1', borderRadius: '0.375rem', background: '#ffffff',
                  color: '#0369a1', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer'
                }}>
                  <Upload size={14} />
                  <span>{imageFile ? imageFile.name : 'Pilih fail gambar (Maks 5MB)'}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>

                <div style={{ flex: 1, minWidth: '15rem' }}>
                  <Input
                    placeholder="Atau masukkan pautan URL gambar langsung..."
                    value={form.image_url}
                    onChange={e => {
                      const val = e.target.value
                      setForm(f => ({ ...f, image_url: val }))
                      if (!imageFile) setImagePreview(val || null)
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea label="Ciri-ciri BM (satu per baris)" id="svc-features" rows={3}
                placeholder={'Ciri pertama\nCiri kedua\nCiri ketiga'}
                value={form.features}
                onChange={e => setForm(f => ({ ...f, features: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <ENTextarea label="Ciri-ciri (EN)" id="svc-features-en" rows={3}
                placeholder={'First feature\nSecond feature\nThird feature'}
                value={form.features_en}
                onChange={e => setForm(f => ({ ...f, features_en: e.target.value }))} />
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
        ) : services.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="Tiada perkhidmatan" description="Tambah perkhidmatan pertama untuk dipapar di laman awam." action={<Btn onClick={openNew}>Tambah Perkhidmatan</Btn>} />
        ) : (
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Perkhidmatan', 'Gambar', 'Ciri', 'Status', 'Tindakan'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{s.code ? `${s.code} — ` : ''}{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/{s.slug} · ikon: {s.icon} · susunan: {s.sort_order}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.title} style={{ width: '3rem', height: '2.2rem', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }} />
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Default</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: '#64748b' }}>{(s.features ?? []).length} ciri</td>
                  <td style={{ padding: '1rem 1.25rem' }}><Badge color={s.is_active ? 'green' : 'gray'}>{s.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge></td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleToggle(s)} title={s.is_active ? 'Nyahaktif' : 'Aktifkan'} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: s.is_active ? '#dc2626' : '#16a34a' }}>
                        {s.is_active ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button onClick={() => openEdit(s)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#0369a1' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(s)} style={{ padding: '0.4rem', background: 'none', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
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

      <ConfirmDialog open={!!deleteTarget} title="Padam Perkhidmatan?" message={`"${deleteTarget?.title}" akan dipadam dari laman awam secara kekal.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}
