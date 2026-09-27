import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Card, PageHeader, Btn, Input, Textarea, Select, Toggle, Spinner } from '../../components/ui'
import { Save, ArrowLeft, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [form, setForm] = useState({ name: '', description: '', category_id: '', is_active: true, sort_order: 0 })
  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [existingPublicId, setExistingPublicId] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    loadCategories()
    if (isEdit) loadProduct()
  }, [id])

  async function loadCategories() {
    const { data } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name')
    setCategories(data ?? [])
  }

  async function loadProduct() {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error || !data) { toast.error('Produk tidak dijumpai.'); navigate('/products'); return }
    setForm({ name: data.name, description: data.description ?? '', category_id: data.category_id ?? '', is_active: data.is_active, sort_order: data.sort_order ?? 0 })
    setExistingImage(data.image_url)
    setExistingPublicId(data.cloudinary_public_id)
    setLoading(false)
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Saiz fail melebihi 5MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama produk wajib diisi.'
    if (!form.category_id) errs.category_id = 'Sila pilih kategori.'
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
        const upload = await uploadToCloudinary(imageFile, 'afra/products')
        image_url = upload.url
        cloudinary_public_id = upload.publicId
      }

      const payload = { ...form, image_url, cloudinary_public_id }

      if (isEdit) {
        const { error } = await supabase.from('products').update(payload).eq('id', id)
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'products', recordId: id, newData: payload })
        toast.success('Produk dikemaskini.')
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select().single()
        if (error) throw error
        await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'CREATE', tableName: 'products', recordId: data.id, newData: payload })
        toast.success('Produk berjaya ditambah.')
      }
      navigate('/products')
    } catch (err) {
      toast.error('Ralat menyimpan produk: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={36} /></div>

  return (
    <div style={{ maxWidth: '50rem' }}>
      <PageHeader
        title={isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
        subtitle={isEdit ? 'Kemaskini maklumat produk' : 'Isi borang untuk menambah produk baharu'}
        action={<Btn variant="secondary" onClick={() => navigate('/products')}><ArrowLeft size={15} /> Kembali</Btn>}
      />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Maklumat Produk</h3>
          <Input label="Nama Produk *" id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="cth. Perkhidmatan Pengawal Statik" error={errors.name} />
          <Textarea label="Penerangan" id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Huraian ringkas perkhidmatan atau produk ini..." rows={4} />
          <Select label="Kategori *" id="category_id" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} error={errors.category_id}>
            <option value="">-- Pilih Kategori --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Susunan Paparan" id="sort_order" type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
          <Toggle checked={form.is_active} onChange={v => setForm(f => ({ ...f, is_active: v }))} label="Produk Aktif (dipaparkan di laman awam)" />
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Gambar Produk</h3>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {(imagePreview || existingImage) && (
              <div style={{ position: 'relative' }}>
                <img
                  src={imagePreview || existingImage}
                  alt="Preview"
                  style={{ width: '10rem', height: '10rem', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                />
                {imagePreview && (
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', background: '#dc2626', border: 'none', borderRadius: '50%', width: '1.5rem', height: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={12} color="white" />
                  </button>
                )}
              </div>
            )}
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.65rem',
              width: '10rem', height: '10rem', border: '2px dashed #e2e8f0', borderRadius: '0.5rem',
              cursor: 'pointer', background: '#f8fafc', transition: 'all 0.15s', color: '#64748b',
            }}>
              <Upload size={22} />
              <span style={{ fontSize: '0.76rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>
                {imageFile ? imageFile.name : 'Klik untuk muat naik\n(Maks 5MB)'}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.75rem' }}>Format disokong: JPG, PNG, WebP. Saiz maksimum: 5MB. Imej akan dioptimumkan melalui Cloudinary.</p>
        </Card>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Btn variant="secondary" type="button" onClick={() => navigate('/products')}>Batal</Btn>
          <Btn type="submit" disabled={saving}>
            {saving ? <Spinner size={15} /> : <Save size={15} />}
            {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
          </Btn>
        </div>
      </form>
    </div>
  )
}
