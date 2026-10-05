import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { logAudit } from '../lib/audit'
import { Card, Btn, Input, Textarea, ENInput, ENTextarea } from './ui'
import { Save, Type } from 'lucide-react'
import toast from 'react-hot-toast'

// Kad editor kecil untuk tajuk header laman awam (BM + EN).
// Guna dalam page admin yang berkaitan supaya tajuk kekal
// di bawah group sidebar page tersebut.
// Props: titleKey, descKey, cardTitle
export default function PageHeaderEditor({ titleKey, descKey, cardTitle = 'Tajuk Header Laman Awam' }) {
  const { user, profile } = useAuth()
  const [title, setTitle] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [desc, setDesc] = useState('')
  const [descEn, setDescEn] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('key, value, value_en').in('key', [titleKey, descKey])
      ;(data ?? []).forEach(r => {
        if (r.key === titleKey) { setTitle(r.value ?? ''); setTitleEn(r.value_en ?? '') }
        if (r.key === descKey) { setDesc(r.value ?? ''); setDescEn(r.value_en ?? '') }
      })
    }
    load()
  }, [titleKey, descKey])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const rows = [
        { key: titleKey, value: title, value_en: titleEn, updated_by: user?.id },
        { key: descKey, value: desc, value_en: descEn, updated_by: user?.id },
      ]
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'site_settings', newData: { header: titleKey, title, titleEn, desc, descEn } })
      toast.success('Tajuk header dikemaskini (BM + EN).')
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Tajuk Header (BM)" id={`phe-title-${titleKey}`} value={title}
            onChange={e => setTitle(e.target.value)} />
          <ENInput label="Tajuk Header" id={`phe-title-${titleKey}-en`} value={titleEn}
            onChange={e => setTitleEn(e.target.value)} />
        </div>
        <Textarea label="Penerangan Header (BM)" id={`phe-desc-${descKey}`} rows={2} value={desc}
          onChange={e => setDesc(e.target.value)} />
        <ENTextarea label="Penerangan Header" id={`phe-desc-${descKey}-en`} rows={2} value={descEn}
          onChange={e => setDescEn(e.target.value)} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : <><Save size={14} /> Simpan Tajuk</>}
          </Btn>
        </div>
      </form>
    </Card>
  )
}
