import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../lib/audit'
import { Card, PageHeader, Btn, Badge, EmptyState, ConfirmDialog, Spinner } from '../../components/ui'
import { Plus, Pencil, Trash2, Package, Search, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Products() {
  const { user, profile } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*, categories(name)').order('sort_order').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name').eq('is_active', true).order('name'),
      ])
      setProducts(prods ?? [])
      setCategories(cats ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(product) {
    const { error } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    if (error) { toast.error('Gagal kemaskini status.'); return }
    await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'UPDATE', tableName: 'products', recordId: product.id, oldData: { is_active: product.is_active }, newData: { is_active: !product.is_active } })
    toast.success(`Produk ${product.is_active ? 'dinyahaktif' : 'diaktifkan'}.`)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await logAudit({ userId: user?.id, userEmail: profile?.email, action: 'DELETE', tableName: 'products', recordId: deleteTarget.id, oldData: deleteTarget })
      toast.success('Produk dipadam.')
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Gagal memadam produk.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || p.category_id === filterCat
    const matchActive = filterActive === '' ? true : filterActive === 'active' ? p.is_active : !p.is_active
    return matchSearch && matchCat && matchActive
  })

  return (
    <div>
      <PageHeader
        title="Pengurusan Produk"
        subtitle={`${products.length} produk dalam sistem`}
        action={
          <Link to="/products/new">
            <Btn><Plus size={15} /> Tambah Produk</Btn>
          </Link>
        }
      />

      {/* Filters */}
      <Card style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem',
              border: '1px solid #e2e8f0', borderRadius: '0.375rem',
              background: '#f8fafc', fontFamily: 'inherit', fontSize: '0.86rem', outline: 'none',
            }}
          />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '0.6rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', fontFamily: 'inherit', fontSize: '0.86rem', outline: 'none', cursor: 'pointer' }}>
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterActive} onChange={e => setFilterActive(e.target.value)} style={{ padding: '0.6rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', fontFamily: 'inherit', fontSize: '0.86rem', outline: 'none', cursor: 'pointer' }}>
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </Card>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={32} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="Tiada produk dijumpai" description="Tambah produk pertama atau ubah penapis carian." action={<Link to="/products/new"><Btn>Tambah Produk</Btn></Link>} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  {['Produk', 'Kategori', 'Status', 'Tindakan'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.375rem', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.375rem', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Package size={16} color="#94a3b8" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{p.name}</div>
                          {p.description && <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '20rem' }}>{p.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge color="blue">{p.categories?.name ?? '—'}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge color={p.is_active ? 'green' : 'gray'}>{p.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => toggleActive(p)} title={p.is_active ? 'Nyahaktif' : 'Aktifkan'} style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#64748b' }}>
                          {p.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <Link to={`/products/${p.id}/edit`}>
                          <button title="Edit" style={{ padding: '0.4rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.25rem', cursor: 'pointer', color: '#0369a1' }}>
                            <Pencil size={14} />
                          </button>
                        </Link>
                        <button onClick={() => setDeleteTarget(p)} title="Padam" style={{ padding: '0.4rem', background: 'none', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Padam Produk?"
        message={`Produk "${deleteTarget?.name}" akan dipadam secara kekal. Tindakan ini tidak boleh dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
