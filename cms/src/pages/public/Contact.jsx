import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Mail, Phone, MapPin, Clock, Send,
  User, Building2, Shield, MessageSquare,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialService = searchParams.get('service') || ''

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service_type: initialService,
    state: '',
    message: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const s = searchParams.get('service')
    if (s) {
      setForm(prev => ({ ...prev, service_type: s }))
    }
  }, [searchParams])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')
    setSuccess(false)

    try {
      const payload = {
        name: form.name.trim(),
        company: form.company.trim() || null,
        phone: form.phone.trim(),
        email: form.email.trim(),
        service_type: form.service_type,
        state: form.state,
        message: form.message.trim(),
        is_read: false
      }

      const { error } = await supabase.from('contact_messages').insert([payload])
      if (error) throw error

      setSuccess(true)
      setForm({
        name: '',
        company: '',
        phone: '',
        email: '',
        service_type: '',
        state: '',
        message: ''
      })
    } catch (err) {
      console.error('Submission error:', err)
      setErrorMsg(err.message || 'Gagal menghantar permohonan. Sila semak sambungan internet anda.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="page-header-banner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="page-header-tag">
            <Mail size={14} />
            <span>Pusat Khidmat & Sebutharga</span>
          </div>
          <h1 className="page-header-title">HUBUNGI KAMI &amp; SEBUTHARGA</h1>
          <p className="page-header-desc">
            Sila lengkapkan borang di bawah untuk mendapatkan sebutharga rasmi bagi perkhidmatan kawalan keselamatan di premis anda, atau hubungi bilik gerakan kami.
          </p>
        </div>
      </div>

      {/* ── CONTACT CONTENT & FORM ── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="contact-layout">
          
          {/* Left Column: Contact details */}
          <div className="contact-info-panel">
            
            <div className="contact-card-solid">
              <h3 className="contact-card-title">Ibu Pejabat (HQ)</h3>
              <div className="contact-items-col">
                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">Alamat Rasmi</span>
                    <span className="contact-item-val">
                      LOT PT 1914, Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.
                    </span>
                  </div>
                </div>

                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <Phone size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">Telefon &amp; Faks</span>
                    <span className="contact-item-val">
                      <a href="tel:096226678">09-6226678</a> / 09-6264788 (Faks)
                    </span>
                  </div>
                </div>

                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <Mail size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">E-mel Pentadbiran</span>
                    <span className="contact-item-val">
                      <a href="mailto:afraservices@gmail.com">afraservices@gmail.com</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-card-solid">
              <h3 className="contact-card-title">Waktu Operasi HQ</h3>
              <div className="contact-items-col">
                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <Clock size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">Pejabat Pengurusan</span>
                    <span className="contact-item-val">
                      Ahad – Khamis: 8:30 Pagi – 5:00 Petang<br />
                      Jumaat &amp; Sabtu: Tutup
                    </span>
                  </div>
                </div>

                <div className="contact-item-box">
                  <div className="contact-item-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <Shield size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">Bilik Gerakan &amp; CMS</span>
                    <span className="contact-item-val" style={{ color: '#16a34a', fontWeight: 800 }}>
                      24 Jam Setiap Hari (365 Hari Setahun)
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="form-panel-card">
            <div className="form-panel-header">
              <h2 className="form-panel-title">Borang Permintaan Sebutharga</h2>
              <p className="form-panel-desc">
                Sila isi maklumat penugasan keselamatan yang diperlukan. Pegawai operasi kami akan menghubungi anda dalam tempoh 24 jam.
              </p>
            </div>

            {success && (
              <div style={{
                padding: '1.25rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.375rem',
                color: '#166534',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <CheckCircle2 size={22} style={{ color: '#16a34a', flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                    Permintaan Sebutharga Berjaya Dihantar!
                  </div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Terima kasih. Permintaan anda telah direkodkan dalam sistem pentadbiran AFRA Services. Pegawai kami akan menghubungi nombor telefon anda secepat mungkin.
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div style={{
                padding: '1.25rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                color: '#991b1b',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <AlertCircle size={22} style={{ color: '#dc2626', flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Ralat Menghantar</div>
                  <div style={{ fontSize: '0.85rem' }}>{errorMsg}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      <User size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>Nama Penuh</span>
                    </label>
                    <input
                      className="form-input"
                      id="name"
                      type="text"
                      placeholder="cth. Ahmad Faiz"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="company">
                      <Building2 size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>Nama Syarikat / Organisasi</span>
                    </label>
                    <input
                      className="form-input"
                      id="company"
                      type="text"
                      placeholder="cth. Syarikat Maju Sdn Bhd"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      <Phone size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>Nombor Telefon</span>
                    </label>
                    <input
                      className="form-input"
                      id="phone"
                      type="tel"
                      placeholder="cth. 012-3456789"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      <Mail size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>Emel</span>
                    </label>
                    <input
                      className="form-input"
                      id="email"
                      type="email"
                      placeholder="cth. ahmad@syarikat.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="service">
                      <Shield size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>Jenis Perkhidmatan Diperlukan</span>
                    </label>
                    <select
                      className="form-select"
                      id="service"
                      value={form.service_type}
                      onChange={e => setForm({ ...form, service_type: e.target.value })}
                      required
                    >
                      <option value="">-- Sila Pilih Perkhidmatan --</option>
                      <option value="Khidmat Kawalan Statik (Static Guard)">Khidmat Kawalan Statik (Static Guard)</option>
                      <option value="Khidmat Kawalan Bersenjata (Armed Guard)">Khidmat Kawalan Bersenjata (Armed Guard)</option>
                      <option value="Cash-In-Transit (C.I.T)">Cash-In-Transit (C.I.T)</option>
                      <option value="Pengawal Peribadi (VIP Bodyguard)">Pengawal Peribadi (VIP Bodyguard)</option>
                      <option value="Central Monitoring System (CMS 24 Jam)">Central Monitoring System (CMS 24 Jam)</option>
                      <option value="CCTV & Automasi Keselamatan">CCTV &amp; Automasi Keselamatan</option>
                      <option value="Penyiasat Persendirian (Private Investigation)">Penyiasat Persendirian (Private Investigation)</option>
                      <option value="Latihan & Konsultasi Keselamatan">Latihan &amp; Konsultasi Keselamatan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="state">
                      <MapPin size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>Lokasi Negeri Premis</span>
                    </label>
                    <select
                      className="form-select"
                      id="state"
                      value={form.state}
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      required
                    >
                      <option value="">-- Sila Pilih Negeri --</option>
                      <option value="Terengganu (HQ)">Terengganu (HQ)</option>
                      <option value="Kuala Lumpur / Selangor">Kuala Lumpur / Selangor</option>
                      <option value="Pahang">Pahang</option>
                      <option value="Kelantan">Kelantan</option>
                      <option value="Johor">Johor</option>
                      <option value="Melaka">Melaka</option>
                      <option value="Negeri Sembilan">Negeri Sembilan</option>
                      <option value="Perak">Perak</option>
                      <option value="Pulau Pinang">Pulau Pinang</option>
                      <option value="Kedah">Kedah</option>
                      <option value="Perlis">Perlis</option>
                      <option value="Sabah">Sabah</option>
                      <option value="Sarawak">Sarawak</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    <MessageSquare size={14} style={{ color: 'var(--blue-primary)' }} />
                    <span>Butiran Keperluan Keselamatan / Premis</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    id="message"
                    placeholder="Nyatakan jumlah anggota pengawal, masa syif, jenis premis atau sebarang spesifikasi khusus..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button className="btn-submit" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>MENGHANTAR PERMOHONAN...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>HANTAR PERMINTAAN SEBUTHARGA</span>
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}
