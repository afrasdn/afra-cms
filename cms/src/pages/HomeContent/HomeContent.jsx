import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Card, PageHeader, Btn, Textarea, Input, Spinner } from '../../components/ui'
import SettingsCard from '../../components/SettingsCard'
import { Save, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

const SECTIONS = [
  { key: 'hero', label: 'Hero — Bahagian Utama Home', desc: 'Tajuk besar & perihal syarikat di bahagian paling atas laman Home.' },
]

const inputStyle = { padding: '0.7rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none', width: '100%' }

// Destinasi button — client pilih dari dropdown, tak perlu taip URL.
// Pilihan "Link luar" akan buka ruangan teks untuk tampal https://...
const CTA_URL_OPTIONS = [
  { value: '/catalog', label: 'Services' },
  { value: '/contact', label: 'Contact Us' },
  { value: '/about', label: 'About Us' },
  { value: '/certificates', label: 'Certificates' },
  { value: '/', label: 'Home' },
]

function CtaUrlField({ id, label, value, onChange }) {
  const known = CTA_URL_OPTIONS.some(o => o.value === (value ?? ''))
  const sel = !value ? '' : known ? value : 'custom'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label htmlFor={id} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{label}</label>
      <select
        id={id}
        value={sel}
        onChange={e => {
          if (e.target.value === 'custom') onChange('https://')
          else onChange(e.target.value)
        }}
        style={{ ...inputStyle, cursor: 'pointer' }}
      >
        <option value="">-- Pilih destinasi button --</option>
        {CTA_URL_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
        <option value="custom">Link luar / lain — tulis sendiri</option>
      </select>
      {sel === 'custom' && (
        <input
          value={value === 'custom' ? '' : (value ?? '')}
          onChange={e => onChange(e.target.value)}
          placeholder="cth: https://wa.me/60123456789"
          style={inputStyle}
        />
      )}
    </div>
  )
}

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

      const payload = { ...form, image_url, cloudinary_public_id, en: form.en ?? {}, section: section.key, updated_by: user?.id }
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

  function setExtra(key, val) {
    setForm(f => ({ ...f, extra_data: { ...((f.extra_data ?? {})), [key]: val } }))
  }

  function setEn(key, val) {
    setForm(f => ({ ...f, en: { ...((f.en ?? {})), [key]: val } }))
  }

  const enField = (lbl, key, Component = 'input', rows) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1' }}>{lbl} (EN)</label>
      {Component === 'textarea' ? (
        <textarea
          value={form.en?.[key] ?? ''}
          onChange={e => setEn(key, e.target.value)}
          rows={rows ?? 3}
          style={{ padding: '0.7rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.375rem', background: '#f0f9ff', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none', resize: 'vertical' }}
        />
      ) : (
        <input
          value={form.en?.[key] ?? ''}
          onChange={e => setEn(key, e.target.value)}
          style={{ padding: '0.7rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.375rem', background: '#f0f9ff', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
        />
      )}
    </div>
  )

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
        {field('Tajuk (BM)', 'title')}
        {enField('Tajuk', 'title')}
        {field('Subjudul / Tag (BM)', 'subtitle')}
        {enField('Subjudul / Tag', 'subtitle')}
        {field('Penerangan (BM)', 'description', 'textarea', 3)}
        {enField('Penerangan', 'description', 'textarea', 3)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {field('Butang 1 — Teks (BM)', 'cta_text')}
          {enField('Butang 1 — Teks', 'cta_text')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <CtaUrlField id="hero-cta1-url" label="Butang 1 — Pergi Ke"
            value={form.cta_url ?? ''}
            onChange={v => setForm(f => ({ ...f, cta_url: v }))} />
          <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '0.76rem', color: '#64748b' }}>
            Destinasi sama untuk BM & EN.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Butang 2 — Teks BM (outline)</label>
            <input
              value={form.extra_data?.cta2_text ?? ''}
              onChange={e => setExtra('cta2_text', e.target.value)}
              placeholder="cth: MINTA SEBUTHARGA"
              style={{ padding: '0.7rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1' }}>Butang 2 — Teks (EN)</label>
            <input
              value={form.en?.cta2_text ?? ''}
              onChange={e => setEn('cta2_text', e.target.value)}
              placeholder="e.g. REQUEST QUOTATION"
              style={{ padding: '0.7rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.375rem', background: '#f0f9ff', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <CtaUrlField id="hero-cta2-url" label="Butang 2 — Pergi Ke"
            value={form.extra_data?.cta2_url ?? ''}
            onChange={v => setExtra('cta2_url', v)} />
          <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '0.76rem', color: '#64748b' }}>
            Destinasi sama untuk BM & EN.
          </div>
        </div>

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
      <PageHeader title="Hero Laman Utama (Home)" subtitle="Edit tajuk besar & perihal di bahagian atas laman Home." />
      {SECTIONS.map(s => (
        <SectionEditor key={s.key} section={s} data={contentMap[s.key]} onSave={load} />
      ))}

      <SettingsCard
        cardTitle="Badge Kecil Atas Tajuk Hero"
        logTag="home_hero_badge"
        fields={[{ key: 'hero_badge', label: 'Teks badge (cth: Lesen Keselamatan KDN ...)' }]}
      />
      <SettingsCard
        cardTitle="Tajuk Seksyen di HOME (Our Comprehensive...)"
        logTag="home_services_header"
        fields={[
          { key: 'home_svc_tagline', label: 'Tagline kecil atas', placeholder: 'cth: OUR COMPREHENSIVE' },
          { key: 'home_svc_title', label: 'Tajuk besar', placeholder: 'cth: SERVICES & SOLUTIONS' },
          { key: 'home_svc_desc', label: 'Penerangan', textarea: true, placeholder: 'cth: Kami merangkumi kitaran penuh operasi...' },
        ]}
      />
    </div>
  )
}
