import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { logAudit } from '../lib/audit'
import { Card, Btn, Input, Textarea, ENInput, ENTextarea } from './ui'
import { Save, Type } from 'lucide-react'
import toast from 'react-hot-toast'

// Kad editor generik untuk sekumpulan teks site_settings (BM + EN).
// Props:
// - cardTitle: tajuk kad
// - fields: [{ key, label, textarea?, rows?, placeholder? }]
// - logTag: label untuk audit log
export default function SettingsCard({ cardTitle, fields, logTag }) {
  const { user, profile } = useAuth()
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)

  const keys = fields.map(f => f.key).join(',')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('key, value, value_en').in('key', fields.map(f => f.key))
      const map = {}
      ;(data ?? []).forEach(r => {
        map[r.key] = r.value ?? ''
        map[r.key + '_en'] = r.value_en ?? ''
      })
      setValues(map)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const rows = fields.map(({ key }) => ({
        key,
        value: values[key] ?? '',
        value_en: values[key + '_en'] ?? '',
        updated_by: user?.id,
      }))
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'site_settings', newData: { section: logTag ?? cardTitle, values } })
      toast.success('Teks dikemaskini (BM + EN).')
    } catch (err) {
      toast.error('Ralat menyimpan: ' + (err.message ?? 'Cuba lagi.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <Type size={16} color="#0369a1" />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{cardTitle}</h3>
      </div>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {fields.map(({ key, label, textarea, rows, placeholder }) => (
          textarea ? (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Textarea label={`${label} (BM)`} id={`sc-${key}`} rows={rows ?? 2}
                placeholder={placeholder} value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
              <ENTextarea label={label} id={`sc-${key}-en`} rows={rows ?? 2}
                value={values[key + '_en'] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key + '_en']: e.target.value }))} />
            </div>
          ) : (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label={`${label} (BM)`} id={`sc-${key}`}
                placeholder={placeholder} value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
              <ENInput label={label} id={`sc-${key}-en`}
                value={values[key + '_en'] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key + '_en']: e.target.value }))} />
            </div>
          )
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : <><Save size={14} /> Simpan Teks</>}
          </Btn>
        </div>
      </form>
    </Card>
  )
}
