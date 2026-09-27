import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Card, PageHeader, Btn, Textarea, Input, Spinner } from '../../components/ui'
import { Save, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

const SECTIONS = [
  { key: 'hero',        label: 'Hero — Bahagian Utama',     desc: 'Tajuk besar, perihal syarikat, dan butang CTA di bahagian paling atas laman.' },
  { key: 'about_intro', label: 'Tentang Kami — Pengenalan', desc: 'Tajuk dan teks perkenalan syarikat di bahagian About Us.' },
  { key: 'cta_banner',  label: 'Banner CTA Bawah',           desc: 'Paparan CTA di bahagian bawah laman — ajak pengunjung hubungi.' },
]

function SectionEditor({ section, data, onSave }) {
  const { user, profile } = useAuth()
  const [form, setForm] = useState(data ?? {})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(data ?? {}) }, [data])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      let image_url = form.image_url
      let cloudinary_public_id = form.cloudinary_public_id

      if (imageFile) {
        const up = await uploadToCloudinary(imageFile, 'afra/site-content')
        image_url = up.url
        cloudinary_public_id = up.publicId
      }

      const payload = { ...form, image_url, cloudinary_public_id, section: section.key, updated_by: user?.id }
      const { error } = await supabase.from('site_content').upsert(payload, { onConflict: 'section' })
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'site_content', newData: payload })
      toast.success(`${section.label} dikemaskini.`)
      onSave()
    } catch (err) {
      toast.error('Ralat menyimpan: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Saiz fail melebihi 5MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const field = (lbl, key, Component = 'input', rows) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{lbl}</label>
      {Component === 'textarea' ? (
        <textarea
          value={form[key] ?? ''}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={rows ?? 3}
          style={{ padding: '0.7rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none', resize: 'vertical' }}
        />
      ) : (
        <input
          value={form[key] ?? ''}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{ padding: '0.7rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
        />
      )}
    </div>
  )

  return (
    <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{section.label}</h3>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{section.desc}</p>
      </div>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {field('Tajuk', 'title')}
        {field('Subjudul / Tag', 'subtitle')}
        {field('Penerangan', 'description', 'textarea', 3)}
        {section.key !== 'about_intro' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('Teks Butang CTA', 'cta_text')}
            {field('URL Butang CTA', 'cta_url')}
          </div>
        )}

        {/* Image upload */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.5rem' }}>Gambar Bahagian</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            {(imagePreview || form.image_url) && (
              <div style={{ position: 'relative' }}>
                <img src={imagePreview || form.image_url} alt="preview" style={{ width: '8rem', height: '5rem', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }} />
                {imagePreview && (
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} style={{ position: 'absolute', top: '-0.4rem', right: '-0.4rem', background: '#dc2626', border: 'none', borderRadius: '50%', width: '1.25rem', height: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={10} color="white" />
                  </button>
                )}
              </div>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', border: '1px dashed #e2e8f0', borderRadius: '0.375rem', cursor: 'pointer', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
              <Upload size={15} />
              {imageFile ? imageFile.name : 'Pilih Gambar'}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn type="submit" disabled={saving}>
            {saving ? <Spinner size={14} /> : <Save size={14} />}
            {saving ? 'Menyimpan...' : 'Simpan Bahagian Ini'}
          </Btn>
        </div>
      </form>
    </Card>
  )
}

export default function HomeContent() {
  const [contentMap, setContentMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('site_content').select('*')
    const map = {}
    ;(data ?? []).forEach(row => { map[row.section] = row })
    setContentMap(map)
    setLoading(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={36} /></div>

  return (
    <div style={{ maxWidth: '52rem' }}>
      <PageHeader title="Kandungan Laman Utama" subtitle="Edit teks dan gambar setiap bahagian laman awam." />
      {SECTIONS.map(s => (
        <SectionEditor key={s.key} section={s} data={contentMap[s.key]} onSave={load} />
      ))}
    </div>
  )
}
