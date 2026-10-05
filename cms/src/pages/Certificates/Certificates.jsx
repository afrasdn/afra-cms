import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, EmptyState, ConfirmDialog, Spinner } from '../../components/ui'
import PageHeaderEditor from '../../components/PageHeaderEditor'
import SettingsCard from '../../components/SettingsCard'
import { Plus, Pencil, Trash2, Award, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Certificates() {
  const { user, profile } = useAuth()
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('certificates').select('*').order('sort_order').order('created_at', { ascending: false })
    setCerts(data ?? [])
    setLoading(false)
  }

  async function toggleActive(cert) {
    await supabase.from('certificates').update({ is_active: !cert.is_active }).eq('id', cert.id)
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'certificates', recordId: cert.id, newData: { is_active: !cert.is_active } })
    toast.success(`Sijil ${cert.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await supabase.from('certificates').delete().eq('id', deleteTarget.id)
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'certificates', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Sijil dipadam.')
      setDeleteTarget(null); load()
    } catch { toast.error('Gagal memadam.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      <PageHeader title="Sijil & Pelesenan" subtitle={`${certs.length} sijil dalam sistem`} action={<Link to="/admin/certificates/new"><Btn><Plus size={15} /> Tambah Sijil</Btn></Link>} />

      <PageHeaderEditor titleKey="page_certs_title" descKey="page_certs_desc" cardTitle="Tajuk Header Laman Certificates" />

      <SettingsCard
        cardTitle="Teks Seksyen Laman Certificates — nombor dikira automatik"
        logTag="certs_sections"
        fields={[
          { key: 'page_certs_tag', label: 'Tag kecil atas tajuk', placeholder: 'cth: Pelesenan & Pematuhan Undang-Undang' },
          { key: 'certs_grid_tag', label: 'Tag grid sijil', placeholder: 'cth: AKREDITASI & PENGIKTIRAFAN' },
          { key: 'certs_grid_title', label: 'Tajuk grid sijil', placeholder: 'cth: Lesen Operasi Berkanun' },
          { key: 'certs_branch_tag', label: 'Tag direktori cawangan', placeholder: 'cth: LIPUTAN KEBANGSAAN' },
          { key: 'certs_branch_title', label: 'Tajuk direktori (taip teks je, nombor auto)', placeholder: 'cth: Cawangan Seluruh Malaysia' },
          { key: 'certs_branch_desc', label: 'Penerangan direktori', textarea: true, placeholder: 'cth: Setiap cawangan berdaftar...' },
        ]}
      />

      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={32} /></div>
        ) : certs.length === 0 ? (
          <EmptyState icon={Award} title="Tiada sijil" description="Tambah sijil atau lesen syarikat untuk dipaparkan di laman awam." action={<Link to="/admin/certificates/new"><Btn>Tambah Sijil</Btn></Link>} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))', gap: '1.25rem', padding: '1.25rem' }}>
            {certs.map(cert => (
              <div key={cert.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.625rem', overflow: 'hidden', background: '#fff' }}>
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.title} style={{ width: '100%', height: '10rem', objectFit: 'cover', borderBottom: '1px solid #e2e8f0' }} />
                ) : (
                  <div style={{ width: '100%', height: '10rem', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    <Award size={36} color="#cbd5e1" />
                  </div>
                )}
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, flex: 1 }}>{cert.title}</h4>
                    <Badge color={cert.is_active ? 'green' : 'gray'}>{cert.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge>
                  </div>
                  {cert.issuing_body && <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '0.5rem' }}>{cert.issuing_body}</p>}
                  {cert.description && <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>{cert.description}</p>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
                    <button onClick={() => toggleActive(cert)} style={{ padding: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#64748b' }}>
                      {cert.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <Link to={`/admin/certificates/${cert.id}/edit`} style={{ flex: 1 }}>
                      <Btn variant="secondary" size="sm" style={{ width: '100%', justifyContent: 'center' }}><Pencil size={13} /> Edit</Btn>
                    </Link>
                    <button onClick={() => setDeleteTarget(cert)} style={{ padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog open={!!deleteTarget} title="Padam Sijil?" message={`"${deleteTarget?.title}" akan dipadam secara kekal.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}
