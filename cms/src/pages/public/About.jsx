import { Building2, User, Eye, Target, Info, FileDown } from 'lucide-react'

export default function About() {
  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="page-header-banner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="page-header-tag">
            <Info size={14} />
            <span>Profil Korporat Syarikat</span>
          </div>
          <h1 className="page-header-title">TENTANG AFRA SERVICES</h1>
          <p className="page-header-desc">
            Ditubuhkan pada 7 Disember 2009, AFRA Services Sdn. Bhd. (881616-V) telah berkembang menjadi sebuah organisasi kawalan keselamatan berwibawa dengan 13 cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak.
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
                <span>MAKLUMAT RASMI SYARIKAT</span>
              </div>
              <table className="info-table">
                <tbody>
                  <tr><td>Nama Syarikat</td><td>AFRA Services Sdn. Bhd.</td></tr>
                  <tr><td>No. Pendaftaran</td><td style={{ color: 'var(--blue-primary)' }}>881616-V</td></tr>
                  <tr><td>Tarikh Tubuh</td><td>7 Disember 2009</td></tr>
                  <tr><td>Modal Dibenarkan</td><td style={{ color: 'var(--blue-primary)' }}>RM 5,000,000.00</td></tr>
                  <tr><td>Modal Berbayar</td><td style={{ color: 'var(--blue-primary)' }}>RM 5,000,000.00</td></tr>
                  <tr><td>Bank Utama</td><td>Public Islamic Bank Berhad (Kuala Terengganu)</td></tr>
                  <tr><td>Penanggung Insurans</td><td>Lonpac Insurance Berhad</td></tr>
                  <tr><td>Setiausaha Syarikat</td><td>Zuki &amp; Rashid Tax Accountants</td></tr>
                  <tr><td>Syarikat Audit</td><td>ZRA Consultant Sdn. Bhd.</td></tr>
                </tbody>
              </table>
            </div>

            <div className="leadership-grid">
              <div className="leader-card">
                <div className="leader-icon-box">
                  <User size={20} />
                </div>
                <div className="leader-name">Dato' Seri Zakaria<br />bin Abdul Razak</div>
                <div className="leader-role">Pengarah Urusan</div>
              </div>

              <div className="leader-card">
                <div className="leader-icon-box">
                  <User size={20} />
                </div>
                <div className="leader-name">Fariha Nur Iylia<br />binti Mohamad Yasin</div>
                <div className="leader-role">Pengarah</div>
              </div>
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
                <span>MUAT TURUN PROFIL LENGKAP (PDF)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Narrative, Vision, Mission & Objectives */}
          <div className="narrative-box">
            <h2>Siapa Kami</h2>
            <p>
              AFRA Services Sdn. Bhd. ditubuhkan dengan matlamat utama untuk menyediakan perkhidmatan kawalan keselamatan bertaraf tinggi kepada sektor swasta, perbankan, perindustrian, dan agensi kerajaan di seluruh Malaysia.
            </p>
            <p>
              Tenaga kerja dan anggota kami sebahagian besarnya terdiri daripada bekas anggota Pasukan Keselamatan negara (Polis &amp; Angkatan Tentera) yang menerapkan disiplin ketenteraan, ketelitian operasi, dan integriti yang tinggi dalam setiap penugasan.
            </p>

            <div className="vision-mission-box">
              <div className="vm-card">
                <h3>
                  <Eye size={18} style={{ color: 'var(--blue-primary)' }} />
                  <span>Visi Syarikat</span>
                </h3>
                <p>
                  Menjadi salah satu Syarikat Perkhidmatan Kawalan Keselamatan yang kukuh dan berdaya saing di Malaysia di mana kepercayaan dan keperimanusiaan menjadi keutamaan kami.
                </p>
              </div>
              
              <div className="vm-card">
                <h3>
                  <Target size={18} style={{ color: 'var(--blue-primary)' }} />
                  <span>Misi Syarikat</span>
                </h3>
                <p>
                  Sentiasa memberi dan menambah mutu perkhidmatan bagi memastikan harta benda dan nyawa pelanggan sentiasa berada dalam keadaan selamat dan terpelihara.
                </p>
              </div>
            </div>

            <h2 style={{ marginTop: '2.5rem' }}>Objektif Penubuhan</h2>
            <div style={{ marginTop: '1.25rem' }}>
              
              <div className="obj-item">
                <span className="obj-num">01</span>
                <div>
                  <div className="obj-title">Mewujudkan Peluang Pekerjaan</div>
                  <div className="obj-desc">Memberi keutamaan pekerjaan kepada bekas-bekas anggota Pasukan Keselamatan negara dalam bidang keselamatan profesional.</div>
                </div>
              </div>

              <div className="obj-item">
                <span className="obj-num">02</span>
                <div>
                  <div className="obj-title">Membantu Pihak Berkuasa &amp; Polis</div>
                  <div className="obj-desc">Membantu pihak Polis Diraja Malaysia (PDRM) dalam mengurangkan kadar jenayah harta benda melalui kawalan pencegahan berkesan.</div>
                </div>
              </div>

              <div className="obj-item">
                <span className="obj-num">03</span>
                <div>
                  <div className="obj-title">Perlindungan Menyeluruh</div>
                  <div className="obj-desc">Memberi perlindungan keselamatan optimum terhadap harta benda, premis perniagaan, dan nyawa setiap individu.</div>
                </div>
              </div>

              <div className="obj-item">
                <span className="obj-num">04</span>
                <div>
                  <div className="obj-title">Latihan &amp; Kesedaran Keselamatan</div>
                  <div className="obj-desc">Melatih, memberi pengetahuan berterusan serta menanam semangat kesedaran keselamatan yang dinamik.</div>
                </div>
              </div>

              <div className="obj-item">
                <span className="obj-num">05</span>
                <div>
                  <div className="obj-title">Teknologi &amp; Piawaian Terkini</div>
                  <div className="obj-desc">Mengintegrasikan sistem automasi keselamatan pintar dan kawalan rondaan berkomputer selari dengan keperluan era digital.</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
