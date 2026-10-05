import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Input, Textarea, Spinner, ENInput, ENTextarea } from '../../components/ui'
import { Save, Phone, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const GROUPS = [
  {
    title: 'Maklumat Hubungi (kad HQ di Contact Us + footer)',
    icon: Phone,
    keys: [
      { key: 'hq_address', label: 'Alamat HQ', textarea: true },
      { key: 'hq_phone', label: 'Telefon HQ' },
      { key: 'hq_fax', label: 'Faks HQ' },
      { key: 'admin_email', label: 'E-mel Pentadbiran' },
    ],
  },
  {
    title: 'Tajuk Header Laman Contact Us',
    icon: FileText,
    keys: [
      { key: 'page_contact_tag', label: 'Tag kecil atas tajuk' },
      { key: 'page_contact_title', label: 'Tajuk' },
      { key: 'page_contact_desc', label: 'Penerangan', textarea: true },
    ],
  },
  {
    title: 'Kad HQ & Waktu Operasi (kiri)',
    icon: Phone,
    keys: [
      { key: 'contact_hq_title', label: 'Tajuk kad HQ' },
      { key: 'contact_addr_label', label: 'Label alamat' },
      { key: 'contact_phone_label', label: 'Label telefon' },
      { key: 'contact_email_label', label: 'Label e-mel' },
      { key: 'contact_hours_title', label: 'Tajuk kad waktu operasi' },
      { key: 'contact_office_label', label: 'Label pejabat pengurusan' },
      { key: 'contact_office_hours', label: 'Waktu pejabat (satu baris = satu baris paparan)', textarea: true },
      { key: 'contact_cms_label', label: 'Label bilik gerakan' },
      { key: 'contact_cms_hours', label: 'Waktu bilik gerakan' },
    ],
  },
  {
    title: 'Borang Sebutharga (kanan)',
    icon: FileText,
    keys: [
      { key: 'contact_form_title', label: 'Tajuk borang' },
      { key: 'contact_form_desc', label: 'Penerangan borang', textarea: true },
      { key: 'contact_submit_text', label: 'Teks butang hantar' },
    ],
  },
]

export default function ContactSettings() {
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
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'site_settings', newData: { page: 'contact', values } })
      toast.success('Laman Contact Us dikemaskini.')
    } catch (err) {
      toast.error('Ralat menyimpan: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={36} /></div>

  return (
    <div style={{ maxWidth: '56rem' }}>
      <PageHeader title="Maklumat Hubungi (Contact Us)" subtitle="Alamat, telefon, e-mel & tajuk header laman Contact Us." />
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
                    <Textarea label={`${label} (BM)`} id={`cs-${key}`} rows={2}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
                    <ENTextarea label={label} id={`cs-${key}-en`} rows={2}
                      value={values[key + '_en'] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key + '_en']: e.target.value }))} />
                  </div>
                ) : (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input label={`${label} (BM)`} id={`cs-${key}`}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
                    <ENInput label={label} id={`cs-${key}-en`}
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
            {saving ? 'Menyimpan...' : 'Simpan Laman Contact Us'}
          </Btn>
        </div>
      </form>
    </div>
  )
}
