import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { fetchSettings } from '../../lib/content'
import { useLang, L, S } from '../../lib/i18n'
import {
  Mail, Phone, MapPin, Clock, Send,
  User, Building2, Shield, MessageSquare,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'

const FALLBACK_SERVICES = [
  'Khidmat Kawalan Statik (Static Guard)',
  'Khidmat Kawalan Bersenjata (Armed Guard)',
  'Cash-In-Transit (C.I.T)',
  'Pengawal Peribadi (VIP Bodyguard)',
  'Central Monitoring System (CMS 24 Jam)',
  'CCTV & Automasi Keselamatan',
  'Penyiasat Persendirian (Private Investigation)',
  'Latihan & Konsultasi Keselamatan',
]

const FALLBACK_SERVICES_EN = [
  'Static Guard Service',
  'Armed Guard Service',
  'Cash-In-Transit (C.I.T)',
  'VIP Bodyguard (Close Protection)',
  'Central Monitoring System (CMS 24/7)',
  'CCTV & Security Automation',
  'Private Investigation',
  'Training & Security Consultation',
]

const FALLBACK_STATES = [
  'Terengganu (HQ)', 'Kuala Lumpur / Selangor', 'Pahang', 'Kelantan',
  'Johor', 'Melaka', 'Negeri Sembilan', 'Perak', 'Pulau Pinang',
  'Kedah', 'Perlis', 'Sabah', 'Sarawak',
]

export default function Contact() {
  const { lang, t } = useLang()
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
  const [settings, setSettings] = useState({})
  const [serviceOptions, setServiceOptions] = useState(lang === 'en' ? FALLBACK_SERVICES_EN : FALLBACK_SERVICES)
  const [stateOptions, setStateOptions] = useState(FALLBACK_STATES)

  useEffect(() => {
    async function loadCMS() {
      try {
        const [s, svcRes, brRes] = await Promise.all([
          fetchSettings(supabase),
          supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('branches').select('state').eq('is_active', true).order('sort_order'),
        ])
        setSettings(s)
        if (svcRes.data && svcRes.data.length > 0) setServiceOptions(svcRes.data)
        if (brRes.data && brRes.data.length > 0) setStateOptions(brRes.data.map(r => r.state))
      } catch (err) {
        console.warn('Could not fetch contact CMS data:', err)
      }
    }
    loadCMS()
  }, [])

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
      setErrorMsg(err.message || t.formErrorFail)
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
            <span>{S(settings, 'page_contact_tag', lang, 'Service Centre & Quotations', 'Pusat Khidmat & Sebutharga')}</span>
          </div>
          <h1 className="page-header-title">{S(settings, 'page_contact_title', lang, 'CONTACT US & QUOTATIONS', 'HUBUNGI KAMI & SEBUTHARGA')}</h1>
          <p className="page-header-desc">
            {S(settings, 'page_contact_desc', lang, 'Please complete the form below for an official quotation for guarding services at your premises, or contact our operations room.', 'Sila lengkapkan borang di bawah untuk mendapatkan sebutharga rasmi bagi perkhidmatan kawalan keselamatan di premis anda, atau hubungi bilik gerakan kami.')}
          </p>
        </div>
      </div>

      {/* ── CONTACT CONTENT & FORM ── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="contact-layout">
          
          {/* Left Column: Contact details */}
          <div className="contact-info-panel">
            
            <div className="contact-card-solid">
              <h3 className="contact-card-title">{S(settings, 'contact_hq_title', lang, 'Headquarters (HQ)', 'Ibu Pejabat (HQ)')}</h3>
              <div className="contact-items-col">
                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">{S(settings, 'contact_addr_label', lang, 'Official Address', 'Alamat Rasmi')}</span>
                    <span className="contact-item-val">
                      {S(settings, 'hq_address', lang) || 'LOT PT 1914, Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.'}
                    </span>
                  </div>
                </div>

                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <Phone size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">{S(settings, 'contact_phone_label', lang, 'Phone & Fax', 'Telefon & Faks')}</span>
                    <span className="contact-item-val">
                      <a href={`tel:${(S(settings, 'hq_phone', lang) || '09-6226678').replace(/[^0-9]/g, '')}`}>{S(settings, 'hq_phone', lang) || '09-6226678'}</a>{S(settings, 'hq_fax', lang) ? ` / ${S(settings, 'hq_fax', lang)} (${lang === 'en' ? 'Fax' : 'Faks'})` : (lang === 'en' ? ' / 09-6264788 (Fax)' : ' / 09-6264788 (Faks)')}
                    </span>
                  </div>
                </div>

                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <Mail size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">{S(settings, 'contact_email_label', lang, 'Administration Email', 'E-mel Pentadbiran')}</span>
                    <span className="contact-item-val">
                      <a href={`mailto:${S(settings, 'admin_email', lang) || 'afraservices@gmail.com'}`}>{S(settings, 'admin_email', lang) || 'afraservices@gmail.com'}</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-card-solid">
              <h3 className="contact-card-title">{S(settings, 'contact_hours_title', lang, 'HQ Operating Hours', 'Waktu Operasi HQ')}</h3>
              <div className="contact-items-col">
                <div className="contact-item-box">
                  <div className="contact-item-icon">
                    <Clock size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">{S(settings, 'contact_office_label', lang, 'Management Office', 'Pejabat Pengurusan')}</span>
                    <span className="contact-item-val">
                      {(S(settings, 'contact_office_hours', lang, 'Sunday – Thursday: 8:30 AM – 5:00 PM\nFriday & Saturday: Closed', 'Ahad – Khamis: 8:30 Pagi – 5:00 Petang\nJumaat & Sabtu: Tutup')).split('\n').map((line, i, arr) => (
                        <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                      ))}
                    </span>
                  </div>
                </div>

                <div className="contact-item-box">
                  <div className="contact-item-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <Shield size={16} />
                  </div>
                  <div className="contact-item-content">
                    <span className="contact-item-lbl">{S(settings, 'contact_cms_label', lang, 'Operations Room & CMS', 'Bilik Gerakan & CMS')}</span>
                    <span className="contact-item-val" style={{ color: '#16a34a', fontWeight: 800 }}>
                      {S(settings, 'contact_cms_hours', lang, '24 Hours Daily (365 Days a Year)', '24 Jam Setiap Hari (365 Hari Setahun)')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="form-panel-card">
            <div className="form-panel-header">
              <h2 className="form-panel-title">{S(settings, 'contact_form_title', lang, 'Quotation Request Form', 'Borang Permintaan Sebutharga')}</h2>
              <p className="form-panel-desc">
                {S(settings, 'contact_form_desc', lang, 'Please fill in the required security assignment details. Our operations officer will contact you within 24 hours.', 'Sila isi maklumat penugasan keselamatan yang diperlukan. Pegawai operasi kami akan menghubungi anda dalam tempoh 24 jam.')}
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
                    {t.formSuccessTitle}
                  </div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {t.formSuccessDesc}
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
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t.formErrorTitle}</div>
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
                      <span>{t.formName}</span>
                    </label>
                    <input
                      className="form-input"
                      id="name"
                      type="text"
                      placeholder={t.formNamePh}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="company">
                      <Building2 size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>{t.formCompany}</span>
                    </label>
                    <input
                      className="form-input"
                      id="company"
                      type="text"
                      placeholder={t.formCompanyPh}
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      <Phone size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>{t.formPhone}</span>
                    </label>
                    <input
                      className="form-input"
                      id="phone"
                      type="tel"
                      placeholder={t.formPhonePh}
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      <Mail size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>{t.formEmail}</span>
                    </label>
                    <input
                      className="form-input"
                      id="email"
                      type="email"
                      placeholder={t.formEmailPh}
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
                      <span>{t.formService}</span>
                    </label>
                    <select
                      className="form-select"
                      id="service"
                      value={form.service_type}
                      onChange={e => setForm({ ...form, service_type: e.target.value })}
                      required
                    >
                      <option value="">{t.formSelectService}</option>
                      {(serviceOptions.every(s => typeof s === 'string') && lang === 'en' ? FALLBACK_SERVICES_EN : serviceOptions).map((s, idx) => {
                        const label = typeof s === 'string' ? s : (L(s, lang, 'title') ?? '')
                        return <option key={label + idx} value={label}>{label}</option>
                      })}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="state">
                      <MapPin size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>{t.formState}</span>
                    </label>
                    <select
                      className="form-select"
                      id="state"
                      value={form.state}
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      required
                    >
                      <option value="">{t.formSelectState}</option>
                      {stateOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    <MessageSquare size={14} style={{ color: 'var(--blue-primary)' }} />
                      <span>{t.formNeeds}</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      id="message"
                      placeholder={t.formNeedsPh}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button className="btn-submit" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>{t.formSubmitting}</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{S(settings, 'contact_submit_text', lang, 'SUBMIT QUOTATION REQUEST', 'HANTAR PERMINTAAN SEBUTHARGA')}</span>
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
