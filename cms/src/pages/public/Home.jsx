import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getServiceIcon, fetchSettings, cleanTitle } from '../../lib/content'
import { useLang, L, S } from '../../lib/i18n'
import {
  ShieldCheck, Shield, ArrowRight
} from 'lucide-react'

// Fallback jika DB kosong / belum run migration 002
// Setiap item ada `en` supaya toggle EN papar English penuh walaupun DB kosong.
const FALLBACK_METRICS = [
  { value: '13', suffix: '+', label: 'Cawangan Negeri', sub: 'Liputan Operasi Seluruh Malaysia Termasuk Sabah & Sarawak', en: { label: 'State Branches', sub: 'Nationwide Operations Coverage Including Sabah & Sarawak' } },
  { value: 'RM5M', suffix: '', label: 'Modal Berbayar', sub: 'Kekuatan Kewangan Penuh Didaftarkan di Bawah SSM', en: { label: 'Paid-Up Capital', sub: 'Full Financial Strength Registered Under SSM' } },
  { value: '2009', suffix: '', label: 'Ditubuhkan', sub: '15+ Tahun Reputasi Kawalan Berdisiplin & Dipercayai', en: { label: 'Established', sub: '15+ Years of Trusted & Disciplined Guarding Reputation' } },
  { value: '100', suffix: '%', label: 'Berlesen & Patuh', sub: 'KDN, PDRM, Ahli PPKKM & Pengiktirafan Bersijil ISO', en: { label: 'Licensed & Compliant', sub: 'KDN, PDRM, PPKKM Member & ISO Certified Recognition' } },
]

const FALLBACK_SERVICES = [
  { slug: 'static', code: null, icon: 'Shield', title: 'Kawalan Statik (Static Guard)', description: 'Kawalan keselamatan fizikal 24/7 di premis korporat, komersial, perindustrian, perbankan dan kediaman oleh anggota keselamatan berdisiplin serta terlatih.', en: { title: 'Static Guard', description: '24/7 physical security guarding for corporate, commercial, industrial, banking and residential premises by disciplined, trained personnel.' } },
  { slug: 'armed', code: null, icon: 'Crosshair', title: 'Kawalan Bersenjata (Armed Guard)', description: 'Perlindungan bersenjata api (Pistol & Shotgun) berlesen untuk sektor berisiko tinggi, institusi perbankan, bilik kebal, dan pengiring taktikal.', en: { title: 'Armed Guard', description: 'Licensed firearm protection (Pistol & Shotgun) for high-risk sectors, banking institutions, vaults and tactical escorts.' } },
  { slug: 'cit', code: null, icon: 'Truck', title: 'Cash-In-Transit (C.I.T)', description: 'Pengangkutan wang tunai dan barangan berharga menggunakan kenderaan perisai kalis peluru (Armoured Vehicle) dengan pengiring bersenjata serta penjejakan GPS.', en: { title: 'Cash-In-Transit (C.I.T)', description: 'Cash and valuables transport using bullet-proof armoured vehicles with armed escorts and GPS tracking.' } },
  { slug: 'bodyguard', code: null, icon: 'UserCheck', title: 'Pengawal Peribadi (VIP Bodyguard)', description: 'Perlindungan eksekutif rapat (Close Protection) untuk orang kenamaan (VVIP/VIP), diplomat, ekspatriat dan tokoh korporat berprofil tinggi secara profesional.', en: { title: 'VIP Bodyguard (Close Protection)', description: 'Professional close protection for VVIPs/VIPs, diplomats, expatriates and high-profile corporate figures.' } },
  { slug: 'cms', code: null, icon: 'Activity', title: 'Central Monitoring System (CMS)', description: 'Pusat kawalan penggera berpusat 24 jam dengan unit respon kecemasan pantas (Rapid Response Team) sekiranya berlaku sebarang penggera pencerobohan atau kecemasan.', en: { title: 'Central Monitoring System (CMS)', description: '24-hour centralised alarm monitoring centre with Rapid Response Team for intrusion or emergency alarms.' } },
  { slug: 'cctv', code: null, icon: 'Video', title: 'CCTV & Automation System', description: 'Pemasangan dan penyenggaraan kamera litar tertutup (CCTV) berdefinisi tinggi, sistem kawalan akses biometrik, pagar automatik dan sistem keselamatan pintar bangunan.', en: { title: 'CCTV & Automation System', description: 'Installation and maintenance of high-definition CCTV, biometric access control, automated gates and smart building security systems.' } },
]

const FALLBACK_BRANCHES = [
  { state: 'TERENGGANU', address: 'Lot PT 1914 Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.', contact: 'Tel: 09-6226678 / Faks: 09-6264788', is_hq: true },
  { state: 'KUALA LUMPUR', address: 'No. 5-6-2 Jalan 3/50, Diamond Square, Off Jalan Gombak, 53000 Kuala Lumpur.', contact: '', is_hq: false },
  { state: 'PAHANG', address: '1st Floor, B2 Lorong Permatang Badak Perdana 102, 25150 Kuantan, Pahang.', contact: '', is_hq: false },
  { state: 'KELANTAN', address: 'PT 3072-T2 Kg Jalan Banggol Kerian Bandar Baru, 16800 Pasir Puteh, Kelantan.', contact: '', is_hq: false },
  { state: 'JOHOR', address: 'No 7 Jalan Mida 5, Taman Mida, 85000 Segamat, Johor.', contact: '', is_hq: false },
  { state: 'PULAU PINANG', address: '10-G, Bertam Walk, Jalan Dagangan 16, Pusat Bandar Bertam Perdana, 13200 Kepala Batas.', contact: '', is_hq: false },
  { state: 'PERAK', address: 'No. 1A, Hala Taman Tambun Jaya 1, Taman Tambun Jaya, 31400 Tambun, Ipoh Perak.', contact: '', is_hq: false },
  { state: 'NEGERI SEMBILAN', address: 'No. 23 Tingkat Atas, Jalan Dato’ Abdullah, Kuala Kelawang, 71600 Jelebu.', contact: '', is_hq: false },
  { state: 'SABAH & SARAWAK', address: 'Kota Kinabalu (Central Shopping Plaza) & Miri (Jalan Bulatan-Piasau), Malaysia Timur.', contact: '', is_hq: false },
]

const FALLBACK_BRANDS = [
  { code: 'KDN', name: 'Kementerian Dalam Negeri', en: { name: 'Ministry of Home Affairs' } },
  { code: 'PDRM', name: 'Polis Diraja Malaysia', en: { name: 'Royal Malaysia Police' } },
  { code: 'PPKKM', name: 'Persatuan Keselamatan', en: { name: 'Security Services Association' } },
  { code: 'MOF', name: 'Kementerian Kewangan', en: { name: 'Ministry of Finance' } },
  { code: 'ISO 9001', name: 'Quality Certified', en: { name: 'Quality Certified' } },
  { code: 'LONPAC', name: 'Insurans Komprehensif', en: { name: 'Comprehensive Insurance' } },
]

// Normalisasi URL CTA dari dashboard:
// - kosong -> fallback | http(s) -> link luar | lain -> route dalam (/xxx, tanpa .html)
function normalizeUrl(u, fallback) {
  if (!u || !u.trim()) return { external: false, to: fallback }
  const t = u.trim()
  if (/^https?:\/\//i.test(t)) return { external: true, to: t }
  return { external: false, to: '/' + t.replace(/\.html?$/i, '').replace(/^\/+/, '') }
}

function CtaButton({ text, url, fallbackUrl, className, icon }) {
  const target = normalizeUrl(url, fallbackUrl)
  const inner = (<><span>{text}</span></>)
  if (target.external) {
    return <a className={className} href={target.to} target="_blank" rel="noopener noreferrer">{icon}{inner}</a>
  }
  return <Link className={className} to={target.to}>{icon}{inner}</Link>
}

export default function Home() {
  const { lang, t } = useLang()
  const [siteContent, setSiteContent] = useState(null)
  const [settings, setSettings] = useState({})
  const [metrics, setMetrics] = useState(FALLBACK_METRICS)
  const [services, setServices] = useState(FALLBACK_SERVICES)
  const [branches, setBranches] = useState(FALLBACK_BRANCHES)
  const [brands, setBrands] = useState(FALLBACK_BRANDS)

  useEffect(() => {
    async function loadContent() {
      try {
        const [heroRes, metricsRes, servicesRes, branchesRes, brandsRes, s] = await Promise.all([
          supabase.from('site_content').select('*').eq('section', 'hero').maybeSingle(),
          supabase.from('metrics').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('services').select('*').eq('is_active', true).order('sort_order').limit(6),
          supabase.from('branches').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('accreditations').select('*').eq('is_active', true).order('sort_order'),
          fetchSettings(supabase),
        ])
        if (heroRes.data) setSiteContent(heroRes.data)
        if (metricsRes.data && metricsRes.data.length > 0) setMetrics(metricsRes.data)
        if (servicesRes.data && servicesRes.data.length > 0) setServices(servicesRes.data)
        if (branchesRes.data && branchesRes.data.length > 0) setBranches(branchesRes.data)
        if (brandsRes.data && brandsRes.data.length > 0) setBrands(brandsRes.data)
        setSettings(s)
      } catch (err) {
        console.warn('Could not fetch CMS content, using fallback:', err)
      }
    }
    loadContent()
  }, [])

  return (
    <>
      {/* ── HERO SECTION ── */}
      <section className="hero-section">
        <div className="hero-content max-w-7xl px-6 sm:px-8">

          {/* Large AFRA Emblem */}
          <div className="hero-emblem-wrap">
            <img
              src="/assets/afra-logo.png"
              alt="AFRA Official Emblem"
              className="hero-logo-img"
              onError={e => { e.currentTarget.src = '/assets/afra-logo-hd.png' }}
            />
          </div>

          <div className="hero-badge-pill">
            <ShieldCheck size={16} />
            <span>{S(settings, 'hero_badge', lang) || t.heroBadge}</span>
          </div>

          <h1 className="hero-title">
            {L(siteContent, lang, 'title') ? (
              <span dangerouslySetInnerHTML={{ __html: String(L(siteContent, lang, 'title')).replace(/\n/g, '<br>') }} />
            ) : lang === 'en' ? (
              <>
                YOUR SAFETY,<br />
                <span className="highlight-blue">OUR COMMITMENT.</span>
              </>
            ) : (
              <>
                KESELAMATAN ANDA,<br />
                <span className="highlight-blue">KOMITMEN KAMI.</span>
              </>
            )}
          </h1>

          <p className="hero-desc">
            {L(siteContent, lang, 'description') || (lang === 'en' ? (
              <>
                Licensed under the <strong>Ministry of Home Affairs</strong> since 2009, <strong>AFRA Services</strong> provides certified security guarding — from static to armed protection — across <strong>13 states throughout Malaysia</strong>.
              </>
            ) : (
              <>
                Berlesen di bawah <strong>Kementerian Dalam Negeri</strong> sejak 2009, <strong>AFRA Services</strong> menyediakan perkhidmatan kawalan keselamatan bertauliah dari kawalan statik hingga bersenjata di <strong>13 negeri seluruh Malaysia</strong>.
              </>
            ))}
          </p>

          <div className="hero-actions">
            <CtaButton
              text={L(siteContent, lang, 'cta_text') || t.heroCta1}
              url={siteContent?.cta_url}
              fallbackUrl="/catalog"
              className="btn-solid-blue"
              icon={<Shield size={16} />}
            />
            <CtaButton
              text={(lang === 'en' && siteContent?.en?.cta2_text?.trim() ? siteContent.en.cta2_text : siteContent?.extra_data?.cta2_text) || t.heroCta2}
              url={siteContent?.extra_data?.cta2_url}
              fallbackUrl="/contact"
              className="btn-outline-navy"
            />
          </div>

        </div>
      </section>

      {/* ── KEY CORPORATE METRICS STRIP (CMS: Metrics) ── */}
      <section className="metrics-strip">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="metrics-grid">
            {metrics.map((m, idx) => (
              <div className="metric-card" key={m.id ?? idx}>
                <span className="metric-num">{m.value}{m.suffix && <span>{m.suffix}</span>}</span>
                <span className="metric-label">{L(m, lang, 'label')}</span>
                {L(m, lang, 'sub') && <span className="metric-sub">{L(m, lang, 'sub')}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES & SOLUTIONS OVERVIEW (CMS: Services) ── */}
      <section className="services-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div className="section-header-row">
            <div className="section-titles">
              <span className="section-tagline">{S(settings, 'home_svc_tagline', lang, 'OUR COMPREHENSIVE', 'PERKHIDMATAN MENYELURUH')}</span>
              <h2 className="section-main-title">{S(settings, 'home_svc_title', lang, 'SERVICES & SOLUTIONS', 'PERKHIDMATAN & PENYELESAIAN')}</h2>
            </div>
            <p className="section-header-desc">
              {S(settings, 'home_svc_desc', lang, 'We cover the full cycle of security operations and tactical defence — from large-scale physical guarding to armed escorts.', 'Kami merangkumi kitaran penuh operasi keselamatan dan pertahanan taktikal, daripada kawalan fizikal berskala besar sehingga pengiring bersenjata.')}
            </p>
          </div>

          <div className="services-grid">
            {services.map((s, idx) => {
              const Icon = getServiceIcon(s.icon)
              return (
                <div className="service-card" key={s.id ?? s.slug ?? idx}>
                  <div className="service-card-inner">
                    <div>
                      <div className="card-top-meta">
                        <div className="card-icon-wrap">
                          <Icon size={22} />
                        </div>
                        <span className="card-number">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <div style={{ marginTop: '1.25rem' }}>
                        <h3 className="service-card-title">{L(s, lang, 'title')}</h3>
                        <p className="service-card-text">{L(s, lang, 'description')}</p>
                      </div>
                    </div>
                    <Link to={`/catalog#${s.slug ?? ''}`} className="card-bottom-action">
                      <span>{t.moreInfo}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── CAWANGAN SELURUH MALAYSIA (CMS: Branches) ── */}
      <section className="branches-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div className="section-header-row" style={{ marginBottom: '2rem' }}>
            <div className="section-titles">
              <span className="section-tagline">{S(settings, 'home_branch_tagline', lang, 'NATIONAL OPERATIONS NETWORK', 'RANGKAIAN OPERASI KEBANGSAAN')}</span>
              <h2 className="section-main-title">{branches.length} {cleanTitle(S(settings, 'home_branch_title', lang, 'BRANCHES ACROSS MALAYSIA', 'CAWANGAN SELURUH MALAYSIA'), '')}</h2>
            </div>
            <p className="section-header-desc">
              {S(settings, 'home_branch_desc', lang, 'Operating from our HQ in Kuala Terengganu with strategic branches across the Peninsula, Sabah and Sarawak for rapid readiness.', 'Beroperasi dengan Ibu Pejabat di Kuala Terengganu dan cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak untuk memastikan kesiapsiagaan pantas.')}
            </p>
          </div>

          <div className="branches-grid">
            {branches.map((b, idx) => (
              <div
                key={b.id ?? idx}
                className="branch-item"
                style={b.is_hq ? { borderColor: 'var(--blue-primary)', background: '#ffffff' } : {}}
              >
                <div className="branch-header">
                  <span className="branch-state">{idx + 1}. {b.state}</span>
                  {b.is_hq && <span className="branch-tag-hq">{lang === 'en' ? 'HEADQUARTERS' : 'IBU PEJABAT'}</span>}
                </div>
                <p className="branch-address">
                  {b.address}
                  {b.contact && (
                    <>
                      <br />
                      <span style={{ color: 'var(--blue-primary)', fontWeight: 700 }}>{b.contact}</span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── ACCREDITATIONS (CMS: Accreditations) ── */}
      <section className="brands-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div className="brands-header-box">
            <span className="brands-tagline">{S(settings, 'home_brands_tagline', lang, 'Official Recognition & Regulatory Bodies', 'Pengiktirafan Rasmi & Badan Kawal Selia')}</span>
            <span className="brands-sub-mono">{S(settings, 'home_brands_sub', lang, 'Malaysian Defence & Security Compliance Standards', 'Piawaian Pematuhan Pertahanan & Keselamatan Malaysia')}</span>
          </div>

          <div className="brands-badges-row">
            {brands.map((b, idx) => (
              <div className="brand-badge" key={b.id ?? idx}>
                <span className="brand-badge-code">{b.code}</span>
                <span className="brand-badge-name">{L(b, lang, 'name')}</span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
