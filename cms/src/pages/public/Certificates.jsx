import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { fetchSettings, cleanTitle } from '../../lib/content'
import { useLang, L, S } from '../../lib/i18n'
import {
  Award, FileCheck,
} from 'lucide-react'

// Fallback jika DB kosong / belum run migration 002
// Setiap item ada `en` supaya toggle EN papar English penuh walaupun DB kosong.
const FALLBACK_CERTS = [
  { authority: 'KEMENTERIAN DALAM NEGERI (KDN)', license_no: 'KDN.S.205/642/1-4', title: 'Lesen Agensi Persendirian (Seksyen 2(a) & 2(b))', description: 'Dilesenkan secara sah di bawah Akta Agensi Persendirian 1971 bagi menjalankan urusan perniagaan kawalan keselamatan dan siasatan persendirian di seluruh Malaysia.', badge_text: 'AKTIF & SAH', en: { title: 'Private Agency Licence (Section 2(a) & 2(b))', description: 'Legally licensed under the Private Agencies Act 1971 to conduct security guarding and private investigation business across Malaysia.', badge_text: 'ACTIVE & VALID' } },
  { authority: 'POLIS DIRAJA MALAYSIA (PDRM)', license_no: 'IPD / Cawangan Pelesenan Senjata', title: 'Permit & Kuasa Membawa Senjata Api', description: 'Kebenaran rasmi pemilikan dan penggunaan senjata api (Pistol dan Shotgun) untuk kawalan statik bersenjata, van kalis peluru CIT, dan perlindungan orang kenamaan.', badge_text: 'BERTAULIAH', en: { title: 'Firearm Carry Permit & Authority', description: 'Official authorisation to possess and use firearms (Pistol and Shotgun) for armed static guarding, CIT armoured vans and VIP protection.', badge_text: 'CERTIFIED' } },
  { authority: 'PERSATUAN INDUSTRI KESELAMATAN (PPKKM)', license_no: 'No. Keahlian: PPKKM/09/0412', title: 'Keahlian Rasmi Persatuan Kawalan Keselamatan', description: 'Ahli berdaftar Persatuan Perkhidmatan Kawalan Keselamatan Malaysia yang mematuhi standard piawaian etika, kebajikan pengawal dan kadar gaji minimum.', badge_text: 'AHLI SAH', en: { title: 'Official Security Association Membership', description: 'Registered member of the Malaysian Security Services Association, complying with ethics, guard welfare and minimum wage standards.', badge_text: 'VALID MEMBER' } },
  { authority: 'KEMENTERIAN KEWANGAN MALAYSIA (MOF)', license_no: 'No. Rujukan: 357-02154823', title: 'Sijil Akuan Pendaftaran Syarikat Bumiputera', description: 'Pendaftaran sah taraf Bumiputera untuk menyertai perolehan kerajaan persekutuan, jabatan kementerian, badan berkanun, dan institusi pengajian tinggi awam.', badge_text: 'BUMIPUTERA', en: { title: 'Bumiputera Company Registration Certificate', description: 'Valid Bumiputera status registration for federal government procurement, ministries, statutory bodies and public universities.', badge_text: 'BUMIPUTERA' } },
  { authority: 'ISO 9001:2015 QUALITY MANAGEMENT', license_no: 'Sijil Piawaian Kualiti Antarabangsa', title: 'Sistem Pengurusan Kualiti Kawalan Keselamatan', description: 'Pensijilan kualiti antarabangsa bagi pengurusan operasi kawalan keselamatan, rondaan, pemantauan pusat kawalan CMS, dan pengurusan sumber manusia berdisiplin.', badge_text: 'ISO CERTIFIED', en: { title: 'Security Guarding Quality Management System', description: 'International quality certification for security guarding operations, patrols, CMS control-centre monitoring and disciplined HR management.', license_no: 'International Quality Standard Certificate', badge_text: 'ISO CERTIFIED' } },
  { authority: 'LONPAC INSURANCE BERHAD', license_no: 'Polisi Perlindungan Komprehensif', title: 'Insurans Liabiliti Awam & Wang Dalam Perjalanan', description: 'Perlindungan insurans liabiliti awam (Public Liability), Cash-In-Transit, dan Fideliti (Fidelity Guarantee) sehingga jutaan ringgit bagi melindungi aset pelanggan.', badge_text: 'DILINDUNGI', en: { title: 'Public Liability & Cash-In-Transit Insurance', description: 'Public liability, Cash-In-Transit and Fidelity Guarantee insurance protection worth millions of ringgit safeguarding client assets.', license_no: 'Comprehensive Protection Policy', badge_text: 'PROTECTED' } },
]

const FALLBACK_BRANCHES = [
  { state: 'TERENGGANU (HQ)', address: 'Lot PT 1914 Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.', contact: 'Tel: 09-6226678 / Faks: 09-6264788', is_hq: true },
  { state: 'KUALA LUMPUR', address: 'No. 5-6-2 Jalan 3/50, Diamond Square, Off Jalan Gombak, 53000 Kuala Lumpur.', contact: 'Tel: 03-40216678', is_hq: false },
  { state: 'PAHANG', address: '1st Floor, B2 Lorong Permatang Badak Perdana 102, 25150 Kuantan, Pahang.', contact: 'Tel: 09-5367888', is_hq: false },
  { state: 'KELANTAN', address: 'PT 3072-T2 Kg Jalan Banggol Kerian Bandar Baru, 16800 Pasir Puteh, Kelantan.', contact: 'Tel: 09-7864455', is_hq: false },
  { state: 'JOHOR', address: 'No 7 Jalan Mida 5, Taman Mida, 85000 Segamat, Johor.', contact: 'Tel: 07-9315566', is_hq: false },
  { state: 'PULAU PINANG', address: '10-G, Bertam Walk, Jalan Dagangan 16, Pusat Bandar Bertam Perdana, 13200 Kepala Batas.', contact: 'Tel: 04-5758899', is_hq: false },
  { state: 'PERAK', address: 'No. 1A, Hala Taman Tambun Jaya 1, Taman Tambun Jaya, 31400 Tambun, Ipoh Perak.', contact: 'Tel: 05-5452233', is_hq: false },
  { state: 'NEGERI SEMBILAN', address: 'No. 23 Tingkat Atas, Jalan Dato’ Abdullah, Kuala Kelawang, 71600 Jelebu.', contact: 'Tel: 06-6136677', is_hq: false },
  { state: 'MELAKA', address: 'No. 45-1, Jalan TU 42, Taman Tasik Utama, Ayer Keroh, 75450 Melaka.', contact: 'Tel: 06-2321188', is_hq: false },
  { state: 'SELANGOR', address: 'No. 18-2, Jalan Elektron U16/E, Denai Alam, 40160 Shah Alam, Selangor.', contact: 'Tel: 03-78319988', is_hq: false },
  { state: 'KEDAH & PERLIS', address: 'No. 56, Kompleks Perniagaan Utama, Jalan Sultanah Sambungan, 05350 Alor Setar, Kedah.', contact: 'Tel: 04-7332211', is_hq: false },
  { state: 'SABAH', address: 'Lot 28, 2nd Floor, Central Shopping Plaza, Jalan Banjaran, 88200 Kota Kinabalu, Sabah.', contact: 'Tel: 088-212345', is_hq: false },
  { state: 'SARAWAK', address: 'Sublot 12, 1st Floor, Jalan Bulatan-Piasau, 98000 Miri, Sarawak.', contact: 'Tel: 085-412233', is_hq: false },
]

export default function Certificates() {
  const { lang, t } = useLang()
  const [certs, setCerts] = useState(FALLBACK_CERTS)
  const [branches, setBranches] = useState(FALLBACK_BRANCHES)
  const [settings, setSettings] = useState({})

  useEffect(() => {
    async function loadAll() {
      try {
        const [certRes, branchRes, s] = await Promise.all([
          supabase.from('certificates').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('branches').select('*').eq('is_active', true).order('sort_order'),
          fetchSettings(supabase),
        ])
        if (certRes.data && certRes.data.length > 0) setCerts(certRes.data)
        if (branchRes.data && branchRes.data.length > 0) setBranches(branchRes.data)
        setSettings(s)
      } catch (err) {
        console.warn('Could not load certificates:', err)
      }
    }
    loadAll()
  }, [])

  return (
    <>
      {/* ── PAGE HEADER (CMS: Site Settings) ── */}
      <div className="page-header-banner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="page-header-tag">
            <Award size={14} />
            <span>{S(settings, 'page_certs_tag', lang, 'Licensing & Legal Compliance', 'Pelesenan & Pematuhan Undang-Undang')}</span>
          </div>
          <h1 className="page-header-title">{S(settings, 'page_certs_title', lang, 'OFFICIAL CERTIFICATES & LICENSING', 'SIJIL & PELESENAN RASMI')}</h1>
          <p className="page-header-desc">
            {S(settings, 'page_certs_desc', lang, 'AFRA Services Sdn. Bhd. operates with full approval from the Ministry of Home Affairs (KDN), Royal Malaysia Police (PDRM), Ministry of Finance (MOF) and ISO certification compliance.', 'AFRA Services Sdn. Bhd. beroperasi dengan kelulusan penuh Kementerian Dalam Negeri (KDN), Polis Diraja Malaysia (PDRM), Kementerian Kewangan (MOF) dan pematuhan pensijilan ISO.')}
          </p>
        </div>
      </div>

      {/* ── CERTIFICATES GRID (CMS: Sijil & Lesen) ── */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff' }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-tagline">{S(settings, 'certs_grid_tag', lang, 'ACCREDITATION & RECOGNITION', 'AKREDITASI & PENGIKTIRAFAN')}</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-heading)' }}>
              {S(settings, 'certs_grid_title', lang, 'Statutory Operating Licences', 'Lesen Operasi Berkanun')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {certs.map((c, idx) => (
              <div
                key={c.id ?? idx}
                style={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="service-icon-box">
                      <FileCheck size={20} />
                    </div>
                    {(c.badge_text || L(c, lang, 'badge_text')) && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '0.25rem' }}>
                        {L(c, lang, 'badge_text')}
                      </span>
                    )}
                  </div>
                  {(c.authority || c.issuing_body) && (
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--blue-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {c.authority || c.issuing_body}
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                    {L(c, lang, 'title')}
                  </h3>
                  {(c.license_no || L(c, lang, 'license_no')) && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {t.refLabel}: {L(c, lang, 'license_no') || c.license_no}
                    </div>
                  )}
                  {L(c, lang, 'description') && (
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                      {L(c, lang, 'description')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── BRANCHES DIRECTORY (CMS: Cawangan) ── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-tagline">{S(settings, 'certs_branch_tag', lang, 'NATIONWIDE COVERAGE', 'LIPUTAN KEBANGSAAN')}</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-heading)' }}>
              {lang === 'en' ? `Directory of ${branches.length} ${cleanTitle(S(settings, 'certs_branch_title', lang, 'Branches Across Malaysia', 'Cawangan Seluruh Malaysia'), '').replace(/^directory\s+of\s+/i, '')}` : `Direktori ${branches.length} ${cleanTitle(S(settings, 'certs_branch_title', lang, 'Branches Across Malaysia', 'Cawangan Seluruh Malaysia'), '').replace(/^direktori\s+/i, '')}`}
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {S(settings, 'certs_branch_desc', lang, 'Each branch is registered with its own permit to ensure responsive local operations control in compliance with local IPD directives.', 'Setiap cawangan berdaftar dengan permit berasingan bagi memastikan kawalan operasi tempatan yang responsif dan mematuhi arahan IPD setempat.')}
            </p>
          </div>

          <div className="branches-grid">
            {branches.map((b, idx) => (
              <div
                key={b.id ?? idx}
                className="branch-item"
                style={b.is_hq ? { borderColor: 'var(--blue-primary)', background: '#ffffff', boxShadow: 'var(--shadow-md)' } : {}}
              >
                <div className="branch-header">
                  <span className="branch-state">{String(idx + 1).padStart(2, '0')}. {b.state}</span>
                  {b.is_hq && <span className="branch-tag-hq">{lang === 'en' ? 'HEADQUARTERS' : 'IBU PEJABAT'}</span>}
                </div>
                <p className="branch-address">{b.address}</p>
                {b.contact && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--blue-primary)', fontWeight: 700, marginTop: 'auto' }}>
                    {b.contact}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
