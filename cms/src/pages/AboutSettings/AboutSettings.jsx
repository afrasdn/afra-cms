import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Input, Textarea, Spinner, ENInput, ENTextarea } from '../../components/ui'
import { Save, Building2, Eye, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const GROUPS = [
  {
    title: 'Maklumat Rasmi Syarikat (jadual About Us)',
    icon: Building2,
    keys: [
      { key: 'company_name', label: 'Nama Syarikat' },
      { key: 'company_reg_no', label: 'No. Pendaftaran' },
      { key: 'established_date', label: 'Tarikh Tubuh' },
      { key: 'authorized_capital', label: 'Modal Dibenarkan' },
      { key: 'paid_capital', label: 'Modal Berbayar' },
      { key: 'bank', label: 'Bank Utama' },
      { key: 'insurer', label: 'Penanggung Insurans' },
      { key: 'secretary', label: 'Setiausaha Syarikat' },
      { key: 'auditor', label: 'Syarikat Audit' },
    ],
  },
  {
    title: 'Naratif, Visi & Misi',
    icon: Eye,
    keys: [
      { key: 'about_narrative_1', label: 'Perenggan Siapa Kami 1', textarea: true },
      { key: 'about_narrative_2', label: 'Perenggan Siapa Kami 2', textarea: true },
      { key: 'vision', label: 'Visi Syarikat', textarea: true },
      { key: 'mission', label: 'Misi Syarikat', textarea: true },
    ],
  },
  {
    title: 'Tajuk Header Laman About Us',
    icon: FileText,
    keys: [
      { key: 'page_about_tag', label: 'Tag kecil atas tajuk' },
      { key: 'page_about_title', label: 'Tajuk' },
      { key: 'page_about_desc', label: 'Penerangan', textarea: true },
    ],
  },
  {
    title: 'Tajuk Kecil & Label Dalam Laman',
    icon: FileText,
    keys: [
      { key: 'about_info_title', label: 'Tajuk kad maklumat syarikat' },
      { key: 'about_narrative_heading', label: 'Tajuk naratif (cth: Siapa Kami)' },
      { key: 'about_vision_label', label: 'Label visi' },
      { key: 'about_mission_label', label: 'Label misi' },
      { key: 'about_objectives_heading', label: 'Tajuk objektif' },
      { key: 'about_pdf_button', label: 'Teks butang PDF' },
    ],
  },
]

export default function AboutSettings() {
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
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'site_settings', newData: { page: 'about', values } })
      toast.success('Laman About Us dikemaskini.')
    } catch (err) {
      toast.error('Ralat menyimpan: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={36} /></div>

  return (
    <div style={{ maxWidth: '56rem' }}>
      <PageHeader title="Info Syarikat (About Us)" subtitle="Jadual maklumat rasmi, naratif, visi/misi & tajuk header laman About Us." />
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
                    <Textarea label={`${label} (BM)`} id={`as-${key}`} rows={2}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
                    <ENTextarea label={label} id={`as-${key}-en`} rows={2}
                      value={values[key + '_en'] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key + '_en']: e.target.value }))} />
                  </div>
                ) : (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input label={`${label} (BM)`} id={`as-${key}`}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
                    <ENInput label={label} id={`as-${key}-en`}
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
            {saving ? 'Menyimpan...' : 'Simpan Laman About Us'}
          </Btn>
        </div>
      </form>
    </div>
  )
}
