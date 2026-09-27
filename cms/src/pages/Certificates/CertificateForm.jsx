import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Card, PageHeader, Btn, Input, Textarea, Toggle, Spinner } from '../../components/ui'
import { Save, ArrowLeft, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CertificateForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [form, setForm] = useState({ title: '', issuing_body: '', description: '', document_url: '', is_active: true, sort_order: 0 })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [existingPublicId, setExistingPublicId] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) loadCert()
  }, [id])

  async function loadCert() {
    const { data, error } = await supabase.from('certificates').select('*').eq('id', id).single()
    if (error || !data) { toast.error('Sijil tidak dijumpai.'); navigate('/admin/certificates'); return }
    setForm({ title: data.title, issuing_body: data.issuing_body ?? '', description: data.description ?? '', document_url: data.document_url ?? '', is_active: data.is_active, sort_order: data.sort_order ?? 0 })
    setExistingImage(data.image_url)
    setExistingPublicId(data.cloudinary_public_id)
    setLoading(false)
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Saiz fail melebihi 5MB.'); return }
    setImageFile(file); setImagePreview(URL.createObjectURL(file))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Tajuk wajib diisi.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      let image_url = existingImage
      let cloudinary_public_id = existingPublicId
      if (imageFile) {
        const up = await uploadToCloudinary(imageFile, 'afra/certificates')
        image_url = up.url; cloudinary_public_id = up.publicId
      }
      const payload = { ...form, image_url, cloudinary_public_id }
      if (isEdit) {
        const { error } = await supabase.from('certificates').update(payload).eq('id', id)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'certificates', recordId: id, newData: payload })
        toast.success('Sijil dikemaskini.')
      } else {
        const { data, error } = await supabase.from('certificates').insert(payload).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'certificates', recordId: data.id, newData: payload })
        toast.success('Sijil ditambah.')
      }
      navigate('/admin/certificates')
    } catch (err) {
      toast.error('Ralat: ' + (err.message ?? 'Cuba lagi.'))
    } finally { setSaving(false) }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={36} /></div>

  return (
    <div style={{ maxWidth: '48rem' }}>
      <PageHeader title={isEdit ? 'Edit Sijil' : 'Tambah Sijil Baru'} subtitle="Isi borang maklumat sijil atau lesen." action={<Btn variant="secondary" onClick={() => navigate('/admin/certificates')}><ArrowLeft size={15} /> Kembali</Btn>} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Tajuk Sijil *" id="cert-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} error={errors.title} placeholder="cth. ISO 9001:2015" />
          <Input label="Badan Pengeluar" id="cert-body" value={form.issuing_body} onChange={e => setForm(f => ({ ...f, issuing_body: e.target.value }))} placeholder="cth. SIRIM Berhad" />
          <Textarea label="Penerangan" id="cert-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
          <Input label="URL Dokumen PDF (pilihan)" id="cert-doc" value={form.document_url} onChange={e => setForm(f => ({ ...f, document_url: e.target.value }))} placeholder="https://..." />
          <Input label="Susunan Paparan" id="cert-sort" type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
          <Toggle checked={form.is_active} onChange={v => setForm(f => ({ ...f, is_active: v }))} label="Sijil Aktif (dipaparkan di laman awam)" />
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Gambar Sijil</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            {(imagePreview || existingImage) && (
              <div style={{ position: 'relative' }}>
                <img src={imagePreview || existingImage} alt="Preview" style={{ width: '9rem', height: '9rem', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                {imagePreview && (
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', background: '#dc2626', border: 'none', borderRadius: '50%', width: '1.5rem', height: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={12} color="white" />
                  </button>
                )}
              </div>
            )}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '9rem', height: '9rem', border: '2px dashed #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer', background: '#f8fafc', color: '#94a3b8' }}>
              <Upload size={20} />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, textAlign: 'center' }}>Muat Naik Gambar</span>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Btn variant="secondary" type="button" onClick={() => navigate('/admin/certificates')}>Batal</Btn>
          <Btn type="submit" disabled={saving}>{saving ? <Spinner size={14} /> : <Save size={14} />} {saving ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah Sijil'}</Btn>
        </div>
      </form>
    </div>
  )
}
