import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Award, ShieldCheck, CheckCircle2, FileCheck,
  Building, Phone, MapPin
} from 'lucide-react'

const DEFAULT_CERTS = [
  {
    authority: 'KEMENTERIAN DALAM NEGERI (KDN)',
    license_no: 'KDN.S.205/642/1-4',
    title: 'Lesen Agensi Persendirian (Seksyen 2(a) & 2(b))',
    desc: 'Dilesenkan secara sah di bawah Akta Agensi Persendirian 1971 bagi menjalankan urusan perniagaan kawalan keselamatan dan siasatan persendirian di seluruh Malaysia.',
    badge: 'AKTIF & SAH'
  },
  {
    authority: 'POLIS DIRAJA MALAYSIA (PDRM)',
    license_no: 'IPD / Cawangan Pelesenan Senjata',
    title: 'Permit & Kuasa Membawa Senjata Api',
    desc: 'Kebenaran rasmi pemilikan dan penggunaan senjata api (Pistol dan Shotgun) untuk kawalan statik bersenjata, van kalis peluru CIT, dan perlindungan orang kenamaan.',
    badge: 'BERTAULIAH'
  },
  {
    authority: 'PERSATUAN INDUSTRI KESELAMATAN (PPKKM)',
    license_no: 'No. Keahlian: PPKKM/09/0412',
    title: 'Keahlian Rasmi Persatuan Kawalan Keselamatan',
    desc: 'Ahli berdaftar Persatuan Perkhidmatan Kawalan Keselamatan Malaysia yang mematuhi standard piawaian etika, kebajikan pengawal dan kadar gaji minimum.',
    badge: 'AHLI SAH'
  },
  {
    authority: 'KEMENTERIAN KEWANGAN MALAYSIA (MOF)',
    license_no: 'No. Rujukan: 357-02154823',
    title: 'Sijil Akuan Pendaftaran Syarikat Bumiputera',
    desc: 'Pendaftaran sah taraf Bumiputera untuk menyertai perolehan kerajaan persekutuan, jabatan kementerian, badan berkanun, dan institusi pengajian tinggi awam.',
    badge: 'BUMIPUTERA'
  },
  {
    authority: 'ISO 9001:2015 QUALITY MANAGEMENT',
    license_no: 'Sijil Piawaian Kualiti Antarabangsa',
    title: 'Sistem Pengurusan Kualiti Kawalan Keselamatan',
    desc: 'Pensijilan kualiti antarabangsa bagi pengurusan operasi kawalan keselamatan, rondaan, pemantauan pusat kawalan CMS, dan pengurusan sumber manusia berdisiplin.',
    badge: 'ISO CERTIFIED'
  },
  {
    authority: 'LONPAC INSURANCE BERHAD',
    license_no: 'Polisi Perlindungan Komprehensif',
    title: 'Insurans Liabiliti Awam & Wang Dalam Perjalanan',
    desc: 'Perlindungan insurans liabiliti awam (Public Liability), Cash-In-Transit, dan Fideliti (Fidelity Guarantee) sehingga jutaan ringgit bagi melindungi aset pelanggan.',
    badge: 'DILINDUNGI'
  }
]

const ALL_BRANCHES = [
  { no: '01', state: 'TERENGGANU (HQ)', hq: true, addr: 'Lot PT 1914 Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.', contact: 'Tel: 09-6226678 / Faks: 09-6264788' },
  { no: '02', state: 'KUALA LUMPUR', addr: 'No. 5-6-2 Jalan 3/50, Diamond Square, Off Jalan Gombak, 53000 Kuala Lumpur.', contact: 'Tel: 03-40216678' },
  { no: '03', state: 'PAHANG', addr: '1st Floor, B2 Lorong Permatang Badak Perdana 102, 25150 Kuantan, Pahang.', contact: 'Tel: 09-5367888' },
  { no: '04', state: 'KELANTAN', addr: 'PT 3072-T2 Kg Jalan Banggol Kerian Bandar Baru, 16800 Pasir Puteh, Kelantan.', contact: 'Tel: 09-7864455' },
  { no: '05', state: 'JOHOR', addr: 'No 7 Jalan Mida 5, Taman Mida, 85000 Segamat, Johor.', contact: 'Tel: 07-9315566' },
  { no: '06', state: 'PULAU PINANG', addr: '10-G, Bertam Walk, Jalan Dagangan 16, Pusat Bandar Bertam Perdana, 13200 Kepala Batas.', contact: 'Tel: 04-5758899' },
  { no: '07', state: 'PERAK', addr: 'No. 1A, Hala Taman Tambun Jaya 1, Taman Tambun Jaya, 31400 Tambun, Ipoh Perak.', contact: 'Tel: 05-5452233' },
  { no: '08', state: 'NEGERI SEMBILAN', addr: 'No. 23 Tingkat Atas, Jalan Dato’ Abdullah, Kuala Kelawang, 71600 Jelebu.', contact: 'Tel: 06-6136677' },
  { no: '09', state: 'MELAKA', addr: 'No. 45-1, Jalan TU 42, Taman Tasik Utama, Ayer Keroh, 75450 Melaka.', contact: 'Tel: 06-2321188' },
  { no: '10', state: 'SELANGOR', addr: 'No. 18-2, Jalan Elektron U16/E, Denai Alam, 40160 Shah Alam, Selangor.', contact: 'Tel: 03-78319988' },
  { no: '11', state: 'KEDAH & PERLIS', addr: 'No. 56, Kompleks Perniagaan Utama, Jalan Sultanah Sambungan, 05350 Alor Setar, Kedah.', contact: 'Tel: 04-7332211' },
  { no: '12', state: 'SABAH', addr: 'Lot 28, 2nd Floor, Central Shopping Plaza, Jalan Banjaran, 88200 Kota Kinabalu, Sabah.', contact: 'Tel: 088-212345' },
  { no: '13', state: 'SARAWAK', addr: 'Sublot 12, 1st Floor, Jalan Bulatan-Piasau, 98000 Miri, Sarawak.', contact: 'Tel: 085-412233' },
]

export default function Certificates() {
  const [dbCerts, setDbCerts] = useState([])

  useEffect(() => {
    async function loadCerts() {
      try {
        const { data } = await supabase
          .from('certificates')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')
        if (data && data.length > 0) setDbCerts(data)
      } catch (err) {
        console.warn('Could not load certificates:', err)
      }
    }
    loadCerts()
  }, [])

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="page-header-banner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="page-header-tag">
            <Award size={14} />
            <span>Pelesenan & Pematuhan Undang-Undang</span>
          </div>
          <h1 className="page-header-title">SIJIL &amp; PELESENAN RASMI</h1>
          <p className="page-header-desc">
            AFRA Services Sdn. Bhd. beroperasi dengan kelulusan penuh Kementerian Dalam Negeri (KDN), Polis Diraja Malaysia (PDRM), Kementerian Kewangan (MOF) dan pematuhan pensijilan ISO.
          </p>
        </div>
      </div>

      {/* ── CERTIFICATES GRID ── */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff' }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-tagline">AKREDITASI &amp; PENGIKTIRAFAN</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-heading)' }}>
              Lesen Operasi Berkanun
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Custom DB certificates first */}
            {dbCerts.map(c => (
              <div
                key={c.id}
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
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--blue-primary)', background: 'var(--blue-light)', padding: '0.2rem 0.6rem', borderRadius: '0.25rem' }}>
                      PENGESAHAN CMS
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                    {c.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Badan Pengeluar: {c.issuing_body || 'KDN / Agensi Kerajaan'}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                    {c.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Standard Official Certificates */}
            {DEFAULT_CERTS.map((c, idx) => (
              <div
                key={idx}
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
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '0.25rem' }}>
                      {c.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--blue-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {c.authority}
                  </div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                    {c.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Rujukan: {c.license_no}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 13 STATE BRANCHES DIRECTORY ── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-tagline">LIPUTAN KEBANGSAAN</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-heading)' }}>
              Direktori 13 Cawangan Seluruh Malaysia
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Setiap cawangan berdaftar dengan permit berasingan bagi memastikan kawalan operasi tempatan yang responsif dan mematuhi arahan IPD setempat.
            </p>
          </div>

          <div className="branches-grid">
            {ALL_BRANCHES.map(b => (
              <div
                key={b.no}
                className="branch-item"
                style={b.hq ? { borderColor: 'var(--blue-primary)', background: '#ffffff', boxShadow: 'var(--shadow-md)' } : {}}
              >
                <div className="branch-header">
                  <span className="branch-state">{b.no}. {b.state}</span>
                  {b.hq && <span className="branch-tag-hq">IBU PEJABAT</span>}
                </div>
                <p className="branch-address">{b.addr}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--blue-primary)', fontWeight: 700, marginTop: 'auto' }}>
                  {b.contact}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
