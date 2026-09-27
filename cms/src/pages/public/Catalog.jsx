import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  ShieldCheck, Shield, Crosshair, Truck, UserCheck,
  Activity, Video, Search, GraduationCap, CheckCircle2,
  FileText
} from 'lucide-react'

const DEFAULT_SERVICES = [
  {
    id: 'static',
    code: 'SVC-01',
    icon: Shield,
    title: 'Khidmat Kawalan Statik',
    desc: 'Perkhidmatan kawalan keselamatan fizikal 24/7 di premis perniagaan, kompleks membeli-belah, hospital, tapak pembinaan, perumahan dan premis kerajaan. Dilengkapi dengan rondaan berkala dan buku log digital.',
    features: [
      'Pengawal keselamatan terlatih berdisiplin tinggi',
      'Sistem rondaan berkala (Watchman Clock / QR Patrolling)',
      'Pemeriksaan keluar-masuk kenderaan & pelawat'
    ]
  },
  {
    id: 'armed',
    code: 'SVC-02',
    icon: Crosshair,
    title: 'Khidmat Kawalan Bersenjata',
    desc: 'Perlindungan bersenjata api (Pistol dan Shotgun) berlesen rasmi oleh IPD PDRM. Dikhaskan bagi institusi kewangan, kedai emas, kilang bernilai tinggi, dan premis yang memerlukan pencegahan taktikal.',
    features: [
      'Pengawal lulus ujian menembak & lesen senjata PDRM',
      'Pengendalian senjata selamat (Safe Armory Handling)',
      'Perlindungan berisiko tinggi (High-Risk Deterrence)'
    ]
  },
  {
    id: 'cit',
    code: 'SVC-03',
    icon: Truck,
    title: 'Cash-In-Transit (C.I.T)',
    desc: 'Pengangkutan wang tunai, jongkong emas, surat berharga, dan barangan bernilai tinggi menggunakan van perisai kalis peluru (Armoured Vehicles) yang dilengkapi sistem keselamatan kunci berganda dan penjejakan satelit GPS masa nyata.',
    features: [
      'Kenderaan perisai kalis peluru berpiawaian tinggi',
      'Penjejakan GPS & komunikasi radio berpusat',
      'Dilindungi perlindungan insurans komprehensif Lonpac'
    ]
  },
  {
    id: 'bodyguard',
    code: 'SVC-04',
    icon: UserCheck,
    title: 'Khidmat Pengawal Peribadi (Bodyguard)',
    desc: 'Perlindungan eksekutif rapat (Close Protection) untuk orang kenamaan (VVIP/VIP), diplomat, ekspatriat, dan eksekutif korporat. Terlatih dalam pertahanan tanpa senjata, pemanduan defensif, dan penilaian ancaman awal.',
    features: [
      'Personel berpengalaman & penampilan profesional',
      'Pemanduan defensif & perancangan laluan selamat',
      'Kerahsiaan tinggi (Strict NDA & Confidentiality)'
    ]
  },
  {
    id: 'cms',
    code: 'SVC-05',
    icon: Activity,
    title: 'Central Monitoring System (CMS)',
    desc: 'Pusat kawalan keselamatan berpusat beroperasi 24 jam sehari, 7 hari seminggu. Menerima isyarat penggera automatik pencerobohan, kebakaran, atau kecemasan perubatan, disusuli tindakan pantas Unit Respon Kecemasan.',
    features: [
      'Pemantauan 24/7 bilik kawalan pintar',
      'Unit Respon Pantas (Rapid Response Team) ke lokasi',
      'Notifikasi serta-merta ke pemilik & balai polis terdekat'
    ]
  },
  {
    id: 'cctv',
    code: 'SVC-06',
    icon: Video,
    title: 'CCTV & Automasi Keselamatan',
    desc: 'Pemasangan, integrasi, dan penyenggaraan sistem kamera litar tertutup (CCTV HD/IP), sistem kawalan akses kad pintar, pengimbas cap jari/biometrik, dan sistem automasi rumah atau bangunan pintar.',
    features: [
      'Kamera IP resolusi tinggi & penglihatan malam (Night Vision)',
      'Pemantauan jarak jauh melalui telefon pintar',
      'Sistem kawalan pintu berpagar automasi pintar'
    ]
  },
  {
    id: 'pi',
    code: 'SVC-07',
    icon: Search,
    title: 'Penyiasat Persendirian (Private Investigation)',
    desc: 'Khidmat penyiasatan korporat dan persendirian secara diskret dan profesional. Menjalankan penyiasatan latar belakang, ketirisan maklumat dalaman syarikat, pemalsuan, dan pengawasan taktikal berlandaskan undang-undang.',
    features: [
      'Laporan penyiasatan berkomputer & bukti sahih',
      'Kerahsiaan maklumat klien dijamin 100%',
      'Pegawai penyiasat berpengalaman bekas unit risikan'
    ]
  },
  {
    id: 'training',
    code: 'SVC-08',
    icon: GraduationCap,
    title: 'Latihan Taktikal & Keselamatan',
    desc: 'Program latihan intensif Certified Security Guard (CSG), pencegahan kebakaran, pertolongan cemas (First Aid / CPR), latihan pengendalian krisis kecemasan dan taklimat kesedaran keselamatan premis.',
    features: [
      'Modul diiktiraf Kementerian Dalam Negeri (KDN)',
      'Jurulatih bertauliah & berpengalaman ketenteraan',
      'Pensijilan kompetensi keselamatan anggota'
    ]
  }
]

export default function Catalog() {
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('is_active', true)
          .order('sort_order')
        if (data && data.length > 0) {
          setDbProducts(data)
        }
      } catch (err) {
        console.warn('Could not load products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="page-header-banner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="page-header-tag">
            <ShieldCheck size={14} />
            <span>Portfolio Perkhidmatan Kawalan</span>
          </div>
          <h1 className="page-header-title">PERKHIDMATAN &amp; KATALOG</h1>
          <p className="page-header-desc">
            AFRA Services Sdn. Bhd. menyediakan pengkhususan perkhidmatan keselamatan menyeluruh yang mematuhi garis panduan ketat Kementerian Dalam Negeri (KDN) dan Polis Diraja Malaysia (PDRM).
          </p>
        </div>
      </div>

      {/* ── SERVICES DETAILED GRID ── */}
      <section className="services-detail-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          {/* If there are custom products in DB, display them first */}
          {dbProducts.length > 0 && (
            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="section-tagline">PAKEJ KHAS &amp; TAWARAN</span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-heading)' }}>
                  Pakej Perkhidmatan Tambahan
                </h2>
              </div>

              <div className="service-detail-grid">
                {dbProducts.map(p => (
                  <div key={p.id} className="service-detail-card">
                    <div>
                      <div className="service-card-top">
                        <div className="service-icon-box">
                          <Shield size={24} />
                        </div>
                        {p.categories?.name && (
                          <span className="service-code">{p.categories.name}</span>
                        )}
                      </div>
                      <h2 className="service-card-heading">{p.title}</h2>
                      <p className="service-card-desc">{p.description}</p>
                      {p.price && (
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--blue-primary)', marginBottom: '1rem' }}>
                          RM {parseFloat(p.price).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/contact?service=${encodeURIComponent(p.title)}`}
                      className="btn-solid-blue"
                      style={{ marginTop: '1rem', width: 'fit-content' }}
                    >
                      <FileText size={15} />
                      <span>MINTA SEBUTHARGA</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Official Services */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className="section-tagline">8 PENGKHUSUSAN UTAMA</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-heading)' }}>
                Perkhidmatan Operasi Berlesen
              </h2>
            </div>

            <div className="service-detail-grid">
              {DEFAULT_SERVICES.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.id} className="service-detail-card" id={s.id}>
                    <div>
                      <div className="service-card-top">
                        <div className="service-icon-box">
                          <Icon size={24} />
                        </div>
                        <span className="service-code">{s.code}</span>
                      </div>
                      <h2 className="service-card-heading">{s.title}</h2>
                      <p className="service-card-desc">{s.desc}</p>
                      <ul className="service-card-features">
                        {s.features.map((f, idx) => (
                          <li key={idx}>
                            <CheckCircle2 size={16} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Link
                        to={`/contact?service=${encodeURIComponent(s.title)}`}
                        className="btn-outline-navy"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                      >
                        <FileText size={15} />
                        <span>MINTA SEBUTHARGA BAGI PERKHIDMATAN INI</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
