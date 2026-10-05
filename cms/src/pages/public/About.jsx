import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { fetchSettings } from '../../lib/content'
import { useLang, L, S } from '../../lib/i18n'
import { Building2, User, Eye, Target, Info, FileDown } from 'lucide-react'

const FALLBACK_LEADERS = [
  { name: "Dato' Seri Zakaria bin Abdul Razak", role: 'Pengarah Urusan', en: { role: 'Managing Director' } },
  { name: 'Fariha Nur Iylia binti Mohamad Yasin', role: 'Pengarah', en: { role: 'Director' } },
]

const FALLBACK_OBJECTIVES = [
  { title: 'Mewujudkan Peluang Pekerjaan', description: 'Memberi keutamaan pekerjaan kepada bekas-bekas anggota Pasukan Keselamatan negara dalam bidang keselamatan profesional.', en: { title: 'Creating Employment Opportunities', description: 'Prioritising jobs for former national security forces personnel in professional security.' } },
  { title: 'Membantu Pihak Berkuasa & Polis', description: 'Membantu pihak Polis Diraja Malaysia (PDRM) dalam mengurangkan kadar jenayah harta benda melalui kawalan pencegahan berkesan.', en: { title: 'Supporting Authorities & Police', description: 'Assisting the Royal Malaysia Police (PDRM) in reducing property crime through effective preventive guarding.' } },
  { title: 'Perlindungan Menyeluruh', description: 'Memberi perlindungan keselamatan optimum terhadap harta benda, premis perniagaan, dan nyawa setiap individu.', en: { title: 'Comprehensive Protection', description: 'Providing optimum security protection for property, business premises and every individual life.' } },
  { title: 'Latihan & Kesedaran Keselamatan', description: 'Melatih, memberi pengetahuan berterusan serta menanam semangat kesedaran keselamatan yang dinamik.', en: { title: 'Training & Security Awareness', description: 'Training, continuous education and instilling a dynamic security-awareness culture.' } },
  { title: 'Teknologi & Piawaian Terkini', description: 'Mengintegrasikan sistem automasi keselamatan pintar dan kawalan rondaan berkomputer selari dengan keperluan era digital.', en: { title: 'Latest Technology & Standards', description: 'Integrating smart security automation and computerised patrol control for the digital era.' } },
]

export default function About() {
  const { lang, t } = useLang()
  const [settings, setSettings] = useState({})
  const [leaders, setLeaders] = useState(FALLBACK_LEADERS)
  const [objectives, setObjectives] = useState(FALLBACK_OBJECTIVES)

  useEffect(() => {
    async function load() {
      try {
        const [s, leadersRes, objRes] = await Promise.all([
          fetchSettings(supabase),
          supabase.from('leaders').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('objectives').select('*').eq('is_active', true).order('sort_order'),
        ])
        setSettings(s)
        if (leadersRes.data && leadersRes.data.length > 0) setLeaders(leadersRes.data)
        if (objRes.data && objRes.data.length > 0) setObjectives(objRes.data)
      } catch (err) {
        console.warn('Could not fetch About content:', err)
      }
    }
    load()
  }, [])

  const companyRows = [
    [t.coName, S(settings, 'company_name', lang) || 'AFRA Services Sdn. Bhd.'],
    [t.coReg, S(settings, 'company_reg_no', lang) || '881616-V'],
    [t.coEst, S(settings, 'established_date', lang, '7 December 2009', '7 Disember 2009')],
    [t.coAuthCap, S(settings, 'authorized_capital', lang) || 'RM 5,000,000.00'],
    [t.coPaidCap, S(settings, 'paid_capital', lang) || 'RM 5,000,000.00'],
    [t.coBank, S(settings, 'bank', lang) || 'Public Islamic Bank Berhad (Kuala Terengganu)'],
    [t.coInsurer, S(settings, 'insurer', lang) || 'Lonpac Insurance Berhad'],
    [t.coSecretary, S(settings, 'secretary', lang) || 'Zuki & Rashid Tax Accountants'],
    [t.coAuditor, S(settings, 'auditor', lang) || 'ZRA Consultant Sdn. Bhd.'],
  ]

  return (
    <>
      {/* ── PAGE HEADER (CMS: Site Settings) ── */}
      <div className="page-header-banner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="page-header-tag">
            <Info size={14} />
            <span>{S(settings, 'page_about_tag', lang, 'Corporate Company Profile', 'Profil Korporat Syarikat')}</span>
          </div>
          <h1 className="page-header-title">{S(settings, 'page_about_title', lang, 'ABOUT AFRA SERVICES', 'TENTANG AFRA SERVICES')}</h1>
          <p className="page-header-desc">
            {S(settings, 'page_about_desc', lang, 'Established on 7 December 2009, AFRA Services Sdn. Bhd. (881616-V) has grown into a reputable security guarding organisation with 13 strategic branches across the Peninsula, Sabah and Sarawak.', 'Ditubuhkan pada 7 Disember 2009, AFRA Services Sdn. Bhd. (881616-V) telah berkembang menjadi sebuah organisasi kawalan keselamatan berwibawa dengan 13 cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak.')}
          </p>
        </div>
      </div>

      {/* ── ABOUT CONTENT LAYOUT ── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="about-layout">

          {/* Left Column: Official Profile Table & Leadership */}
          <div>
            <div className="info-card">
              <div className="info-card-title">
                <Building2 size={16} />
                <span>{S(settings, 'about_info_title', lang, 'OFFICIAL COMPANY INFORMATION', 'MAKLUMAT RASMI SYARIKAT')}</span>
              </div>
              <table className="info-table">
                <tbody>
                  {companyRows.map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="leadership-grid">
              {leaders.map((l, idx) => (
                <div className="leader-card" key={l.id ?? idx}>
                  <div className="leader-icon-box">
                    <User size={20} />
                  </div>
                  <div className="leader-name">{l.name}</div>
                  <div className="leader-role">{L(l, lang, 'role')}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <a
                href="/AFRA - PROFIL SYARIKAT 2026 TERKINI.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-navy"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.6rem' }}
              >
                <FileDown size={16} />
                <span>{S(settings, 'about_pdf_button', lang, 'DOWNLOAD FULL PROFILE (PDF)', 'MUAT TURUN PROFIL LENGKAP (PDF)')}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Narrative, Vision, Mission & Objectives */}
          <div className="narrative-box">
            <h2>{S(settings, 'about_narrative_heading', lang, 'Who We Are', 'Siapa Kami')}</h2>
            <p>{S(settings, 'about_narrative_1', lang, 'AFRA Services Sdn. Bhd. was established to provide high-calibre security guarding to the private sector, banking, industry and government agencies across Malaysia.', 'AFRA Services Sdn. Bhd. ditubuhkan dengan matlamat utama untuk menyediakan perkhidmatan kawalan keselamatan bertaraf tinggi kepada sektor swasta, perbankan, perindustrian, dan agensi kerajaan di seluruh Malaysia.')}</p>
            <p>{S(settings, 'about_narrative_2', lang, 'Our workforce consists largely of former national security personnel (Police & Armed Forces) who bring military discipline, operational precision and high integrity to every assignment.', 'Tenaga kerja dan anggota kami sebahagian besarnya terdiri daripada bekas anggota Pasukan Keselamatan negara (Polis & Angkatan Tentera) yang menerapkan disiplin ketenteraan, ketelitian operasi, dan integriti yang tinggi dalam setiap penugasan.')}</p>

            <div className="vision-mission-box">
              <div className="vm-card">
                <h3>
                  <Eye size={18} style={{ color: 'var(--blue-primary)' }} />
                  <span>{S(settings, 'about_vision_label', lang, 'Company Vision', 'Visi Syarikat')}</span>
                </h3>
                <p>{S(settings, 'vision', lang, 'To be one of the strongest and most competitive Security Guarding companies in Malaysia, where trust and humanity are our priority.', 'Menjadi salah satu Syarikat Perkhidmatan Kawalan Keselamatan yang kukuh dan berdaya saing di Malaysia di mana kepercayaan dan keperimanusiaan menjadi keutamaan kami.')}</p>
              </div>

              <div className="vm-card">
                <h3>
                  <Target size={18} style={{ color: 'var(--blue-primary)' }} />
                  <span>{S(settings, 'about_mission_label', lang, 'Company Mission', 'Misi Syarikat')}</span>
                </h3>
                <p>{S(settings, 'mission', lang, 'To continuously deliver and improve service quality, ensuring client property and lives remain safe and protected at all times.', 'Sentiasa memberi dan menambah mutu perkhidmatan bagi memastikan harta benda dan nyawa pelanggan sentiasa berada dalam keadaan selamat dan terpelihara.')}</p>
              </div>
            </div>

            <h2 style={{ marginTop: '2.5rem' }}>{S(settings, 'about_objectives_heading', lang, 'Establishment Objectives', 'Objektif Penubuhan')}</h2>
            <div style={{ marginTop: '1.25rem' }}>
              {objectives.map((o, idx) => (
                <div className="obj-item" key={o.id ?? idx}>
                  <span className="obj-num">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="obj-title">{L(o, lang, 'title')}</div>
                    {L(o, lang, 'description') && <div className="obj-desc">{L(o, lang, 'description')}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
