import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Input, Textarea, Spinner, ENInput, ENTextarea } from '../../components/ui'
import { Save, AlignLeft, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

const GROUPS = [
  {
    title: 'Teks Footer',
    icon: AlignLeft,
    keys: [
      { key: 'footer_about', label: 'Perenggan Tentang (kolum utama footer)', textarea: true },
      { key: 'footer_nav_title', label: 'Tajuk kolum pautan (cth: Pautan Pantas)' },
      { key: 'footer_copyright', label: 'Baris Hak Cipta (bawah sekali)' },
      { key: 'footer_tagline', label: 'Tagline Bawah (biru)' },
    ],
  },
  {
    title: 'Pautan Media Sosial',
    icon: Share2,
    keys: [
      { key: 'social_facebook', label: 'Facebook URL (kosongkan untuk sorok)' },
      { key: 'social_instagram', label: 'Instagram URL (kosongkan untuk sorok)' },
      { key: 'social_tiktok', label: 'TikTok URL (kosongkan untuk sorok)' },
    ],
  },
]

export default function FooterSettings() {
  const { user, profile } = useAuth()
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const keys = GROUPS.flatMap(g => g.keys.map(k => k.key))
    const { data } = await supabase.from('site_settings').select('key, value, value_en').in('key', keys)
    const map = {}
    ;(data ?? []).forEach(r => {
      map[r.key] = r.value ?? ''
      map[r.key + '_en'] = r.value_en ?? ''
    })
    setValues(map)
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const keys = GROUPS.flatMap(g => g.keys.map(k => k.key))
      const rows = keys.map(key => ({
        key, value: values[key] ?? '', value_en: values[key + '_en'] ?? '', updated_by: user?.id,
      }))
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'site_settings', newData: { page: 'footer', values } })
      toast.success('Footer dikemaskini.')
    } catch (err) {
      toast.error('Ralat menyimpan: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={36} /></div>

  return (
    <div style={{ maxWidth: '56rem' }}>
      <PageHeader title="Kandungan Footer" subtitle="Teks footer & pautan media sosial di bahagian bawah setiap laman. Alamat/telefon footer ikut Maklumat Hubungi (Contact Us)." />
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {GROUPS.map(g => (
          <Card key={g.title} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <g.icon size={16} color="#0369a1" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{g.title}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {g.keys.map(({ key, label, textarea }) => (
                textarea ? (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Textarea label={`${label} (BM)`} id={`fs-${key}`} rows={3}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
                    <ENTextarea label={label} id={`fs-${key}-en`} rows={3}
                      value={values[key + '_en'] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key + '_en']: e.target.value }))} />
                  </div>
                ) : (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input label={`${label} (BM)`} id={`fs-${key}`}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
                    <ENInput label={label} id={`fs-${key}-en`}
                      value={values[key + '_en'] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key + '_en']: e.target.value }))} />
                  </div>
                )
              ))}
            </div>
          </Card>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '1rem' }}>
          <Btn type="submit" disabled={saving} style={{ boxShadow: '0 4px 12px rgba(3,105,161,0.35)' }}>
            {saving ? <Spinner size={14} /> : <Save size={14} />}
            {saving ? 'Menyimpan...' : 'Simpan Footer'}
          </Btn>
        </div>
      </form>
    </div>
  )
}
