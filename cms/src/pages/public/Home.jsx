import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  ShieldCheck, Shield, ShieldAlert, FileText,
  Crosshair, Truck, UserCheck, Activity, Video,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const [siteContent, setSiteContent] = useState(null)

  useEffect(() => {
    async function loadContent() {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('*')
          .eq('section', 'hero')
          .maybeSingle()
        if (data) setSiteContent(data)
      } catch (err) {
        console.warn('Could not fetch site_content:', err)
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
            <span>Lesen Keselamatan KDN &amp; PDRM Berdaftar (881616-V)</span>
          </div>

          <h1 className="hero-title">
            {siteContent?.title ? (
              <span dangerouslySetInnerHTML={{ __html: siteContent.title.replace(/\n/g, '<br>') }} />
            ) : (
              <>
                KESELAMATAN ANDA,<br />
                <span className="highlight-blue">KOMITMEN KAMI.</span>
              </>
            )}
          </h1>

          <p className="hero-desc">
            {siteContent?.description || (
              <>
                Berlesen di bawah <strong>Kementerian Dalam Negeri</strong> sejak 2009, <strong>AFRA Services</strong> menyediakan perkhidmatan kawalan keselamatan bertauliah dari kawalan statik hingga bersenjata di <strong>13 negeri seluruh Malaysia</strong>.
              </>
            )}
          </p>

          <div className="hero-actions">
            <Link className="btn-solid-blue" to="/catalog">
              <ShieldAlert size={16} />
              <span>TEROKAI PERKHIDMATAN</span>
            </Link>
            <Link className="btn-outline-navy" to="/contact">
              <FileText size={16} />
              <span>MINTA SEBUTHARGA</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ── KEY CORPORATE METRICS STRIP ── */}
      <section className="metrics-strip">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="metrics-grid">
            
            <div className="metric-card">
              <span className="metric-num">13<span>+</span></span>
              <span className="metric-label">Cawangan Negeri</span>
              <span className="metric-sub">Liputan Operasi Seluruh Malaysia Termasuk Sabah &amp; Sarawak</span>
            </div>

            <div className="metric-card">
              <span className="metric-num">RM<span>5M</span></span>
              <span className="metric-label">Modal Berbayar</span>
              <span className="metric-sub">Kekuatan Kewangan Penuh Didaftarkan di Bawah SSM</span>
            </div>

            <div className="metric-card">
              <span className="metric-num">2009</span>
              <span className="metric-label">Ditubuhkan</span>
              <span className="metric-sub">15+ Tahun Reputasi Kawalan Berdisiplin &amp; Dipercayai</span>
            </div>

            <div className="metric-card">
              <span className="metric-num">100<span>%</span></span>
              <span className="metric-label">Berlesen &amp; Patuh</span>
              <span className="metric-sub">KDN, PDRM, Ahli PPKKM &amp; Pengiktirafan Bersijil ISO</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── SERVICES & SOLUTIONS OVERVIEW ── */}
      <section className="services-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          <div className="section-header-row">
            <div className="section-titles">
              <span className="section-tagline">OUR COMPREHENSIVE</span>
              <h2 className="section-main-title">SERVICES &amp; SOLUTIONS</h2>
            </div>
            <p className="section-header-desc">
              Kami merangkumi kitaran penuh operasi keselamatan dan pertahanan taktikal, daripada kawalan fizikal berskala besar sehingga pengiring bersenjata.
            </p>
          </div>

          <div className="services-grid">

            {/* Card 1: Kawalan Statik */}
            <div className="service-card">
              <div className="service-card-inner">
                <div>
                  <div className="card-top-meta">
                    <div className="card-icon-wrap">
                      <Shield size={22} />
                    </div>
                    <span className="card-number">01</span>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <h3 className="service-card-title">Kawalan Statik (Static Guard)</h3>
                    <p className="service-card-text">
                      Kawalan keselamatan fizikal 24/7 di premis korporat, komersial, perindustrian, perbankan dan kediaman oleh anggota keselamatan berdisiplin serta terlatih.
                    </p>
                  </div>
                </div>
                <Link to="/catalog#static" className="card-bottom-action">
                  <span>Maklumat Lanjut</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2: Kawalan Bersenjata */}
            <div className="service-card">
              <div className="service-card-inner">
                <div>
                  <div className="card-top-meta">
                    <div className="card-icon-wrap">
                      <Crosshair size={22} />
                    </div>
                    <span className="card-number">02</span>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <h3 className="service-card-title">Kawalan Bersenjata (Armed Guard)</h3>
                    <p className="service-card-text">
                      Perlindungan bersenjata api (Pistol &amp; Shotgun) berlesen untuk sektor berisiko tinggi, institusi perbankan, bilik kebal, dan pengiring taktikal.
                    </p>
                  </div>
                </div>
                <Link to="/catalog#armed" className="card-bottom-action">
                  <span>Maklumat Lanjut</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 3: Cash-In-Transit */}
            <div className="service-card">
              <div className="service-card-inner">
                <div>
                  <div className="card-top-meta">
                    <div className="card-icon-wrap">
                      <Truck size={22} />
                    </div>
                    <span className="card-number">03</span>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <h3 className="service-card-title">Cash-In-Transit (C.I.T)</h3>
                    <p className="service-card-text">
                      Pengangkutan wang tunai dan barangan berharga menggunakan kenderaan perisai kalis peluru (Armoured Vehicle) dengan pengiring bersenjata serta penjejakan GPS.
                    </p>
                  </div>
                </div>
                <Link to="/catalog#cit" className="card-bottom-action">
                  <span>Maklumat Lanjut</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 4: Pengawal Peribadi */}
            <div className="service-card">
              <div className="service-card-inner">
                <div>
                  <div className="card-top-meta">
                    <div className="card-icon-wrap">
                      <UserCheck size={22} />
                    </div>
                    <span className="card-number">04</span>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <h3 className="service-card-title">Pengawal Peribadi (VIP Bodyguard)</h3>
                    <p className="service-card-text">
                      Perlindungan eksekutif rapat (Close Protection) untuk orang kenamaan (VVIP/VIP), diplomat, ekspatriat dan tokoh korporat berprofil tinggi secara profesional.
                    </p>
                  </div>
                </div>
                <Link to="/catalog#bodyguard" className="card-bottom-action">
                  <span>Maklumat Lanjut</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 5: Central Monitoring System */}
            <div className="service-card">
              <div className="service-card-inner">
                <div>
                  <div className="card-top-meta">
                    <div className="card-icon-wrap">
                      <Activity size={22} />
                    </div>
                    <span className="card-number">05</span>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <h3 className="service-card-title">Central Monitoring System (CMS)</h3>
                    <p className="service-card-text">
                      Pusat kawalan penggera berpusat 24 jam dengan unit respon kecemasan pantas (Rapid Response Team) sekiranya berlaku sebarang penggera pencerobohan atau kecemasan.
                    </p>
                  </div>
                </div>
                <Link to="/catalog#cms" className="card-bottom-action">
                  <span>Maklumat Lanjut</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 6: CCTV & Automation */}
            <div className="service-card">
              <div className="service-card-inner">
                <div>
                  <div className="card-top-meta">
                    <div className="card-icon-wrap">
                      <Video size={22} />
                    </div>
                    <span className="card-number">06</span>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <h3 className="service-card-title">CCTV &amp; Automation System</h3>
                    <p className="service-card-text">
                      Pemasangan dan penyenggaraan kamera litar tertutup (CCTV) berdefinisi tinggi, sistem kawalan akses biometrik, pagar automatik dan sistem keselamatan pintar bangunan.
                    </p>
                  </div>
                </div>
                <Link to="/catalog#cctv" className="card-bottom-action">
                  <span>Maklumat Lanjut</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 13 CAWANGAN SELURUH MALAYSIA ── */}
      <section className="branches-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          <div className="section-header-row" style={{ marginBottom: '2rem' }}>
            <div className="section-titles">
              <span className="section-tagline">RANGKAIAN OPERASI KEBANGSAAN</span>
              <h2 className="section-main-title">13 CAWANGAN SELURUH MALAYSIA</h2>
            </div>
            <p className="section-header-desc">
              Beroperasi dengan Ibu Pejabat di Kuala Terengganu dan 12 cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak untuk memastikan kesiapsiagaan pantas.
            </p>
          </div>

          <div className="branches-grid">
            
            <div className="branch-item" style={{ borderColor: 'var(--blue-primary)', background: '#ffffff' }}>
              <div className="branch-header">
                <span className="branch-state">1. TERENGGANU</span>
                <span className="branch-tag-hq">IBU PEJABAT</span>
              </div>
              <p className="branch-address">
                Lot PT 1914 Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.<br />
                <span style={{ color: 'var(--blue-primary)', fontWeight: 700 }}>Tel: 09-6226678 / Faks: 09-6264788</span>
              </p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">2. KUALA LUMPUR</span>
              </div>
              <p className="branch-address">No. 5-6-2 Jalan 3/50, Diamond Square, Off Jalan Gombak, 53000 Kuala Lumpur.</p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">3. PAHANG</span>
              </div>
              <p className="branch-address">1st Floor, B2 Lorong Permatang Badak Perdana 102, 25150 Kuantan, Pahang.</p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">4. KELANTAN</span>
              </div>
              <p className="branch-address">PT 3072-T2 Kg Jalan Banggol Kerian Bandar Baru, 16800 Pasir Puteh, Kelantan.</p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">5. JOHOR</span>
              </div>
              <p className="branch-address">No 7 Jalan Mida 5, Taman Mida, 85000 Segamat, Johor.</p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">6. PULAU PINANG</span>
              </div>
              <p className="branch-address">10-G, Bertam Walk, Jalan Dagangan 16, Pusat Bandar Bertam Perdana, 13200 Kepala Batas.</p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">7. PERAK</span>
              </div>
              <p className="branch-address">No. 1A, Hala Taman Tambun Jaya 1, Taman Tambun Jaya, 31400 Tambun, Ipoh Perak.</p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">8. NEGERI SEMBILAN</span>
              </div>
              <p className="branch-address">No. 23 Tingkat Atas, Jalan Dato’ Abdullah, Kuala Kelawang, 71600 Jelebu.</p>
            </div>

            <div className="branch-item">
              <div className="branch-header">
                <span className="branch-state">9. SABAH &amp; SARAWAK</span>
              </div>
              <p className="branch-address">Kota Kinabalu (Central Shopping Plaza) &amp; Miri (Jalan Bulatan-Piasau), Malaysia Timur.</p>
            </div>

          </div>

        </div>
      </section>

      {/* ── ACCREDITATIONS & REGULATORY BRANDS ── */}
      <section className="brands-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          <div className="brands-header-box">
            <span className="brands-tagline">Pengiktirafan Rasmi &amp; Badan Kawal Selia</span>
            <span className="brands-sub-mono">Piawaian Pematuhan Pertahanan &amp; Keselamatan Malaysia</span>
          </div>

          <div className="brands-badges-row">
            
            <div className="brand-badge">
              <span className="brand-badge-code">KDN</span>
              <span className="brand-badge-name">Kementerian Dalam Negeri</span>
            </div>

            <div className="brand-badge">
              <span className="brand-badge-code">PDRM</span>
              <span className="brand-badge-name">Polis Diraja Malaysia</span>
            </div>

            <div className="brand-badge">
              <span className="brand-badge-code">PPKKM</span>
              <span className="brand-badge-name">Persatuan Keselamatan</span>
            </div>

            <div className="brand-badge">
              <span className="brand-badge-code">MOF</span>
              <span className="brand-badge-name">Kementerian Kewangan</span>
            </div>

            <div className="brand-badge">
              <span className="brand-badge-code">ISO 9001</span>
              <span className="brand-badge-name">Quality Certified</span>
            </div>

            <div className="brand-badge">
              <span className="brand-badge-code">LONPAC</span>
              <span className="brand-badge-name">Insurans Komprehensif</span>
            </div>

          </div>

        </div>
      </section>
    </>
  )
}
