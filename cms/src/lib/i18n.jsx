import { createContext, useContext, useState, useEffect } from 'react'

const LANG_KEY = 'afra-lang'

// ── Kamus UI awam (BM + EN) ──
// Nota: isi kandungan CMS (tajuk servis, penerangan, dll) diterjemah
// melalui lajur EN dalam Supabase, bukan di sini. Di sini hanya
// untuk label struktur/UI yang hardcoded.
const STRINGS = {
  ms: {
    navHome: 'UTAMA',
    navAbout: 'TENTANG KAMI',
    navServices: 'PERKHIDMATAN',
    navCertificates: 'SIJIL',
    navContact: 'HUBUNGI KAMI',
    navStaffEmail: 'STAFF EMAIL',
    navLogin: 'LOGIN',
    navKonsol: 'DASHBOARD',
    navAdminLogin: 'LOG MASUK PENTADBIR →',
    navAdminDash: 'DASHBOARD PENTADBIR →',
    // Hero fallback (dipapar hanya jika DB kosong)
    heroBadge: 'Lesen Keselamatan KDN & PDRM Berdaftar (881616-V)',
    heroCta1: 'TEROKAI PERKHIDMATAN',
    heroCta2: 'MINTA SEBUTHARGA',
    moreInfo: 'Maklumat Lanjut',
    // Label jadual syarikat (About Us)
    coName: 'Nama Syarikat',
    coReg: 'No. Pendaftaran',
    coEst: 'Tarikh Tubuh',
    coAuthCap: 'Modal Dibenarkan',
    coPaidCap: 'Modal Berbayar',
    coBank: 'Bank Utama',
    coInsurer: 'Penanggung Insurans',
    coSecretary: 'Setiausaha Syarikat',
    coAuditor: 'Syarikat Audit',
    // Sijil
    refLabel: 'Rujukan',
    issuedBy: 'Badan Pengeluar',
    // Borang contact
    formName: 'Nama Penuh',
    formCompany: 'Nama Syarikat / Organisasi',
    formPhone: 'Nombor Telefon',
    formEmail: 'Emel',
    formService: 'Jenis Perkhidmatan Diperlukan',
    formState: 'Lokasi Negeri Premis',
    formNeeds: 'Butiran Keperluan Keselamatan / Premis',
    formNamePh: 'cth. Ahmad Faiz',
    formCompanyPh: 'cth. Syarikat Maju Sdn Bhd',
    formPhonePh: 'cth. 012-3456789',
    formEmailPh: 'cth. ahmad@syarikat.com',
    formNeedsPh: 'Nyatakan jumlah anggota pengawal, masa syif, jenis premis atau sebarang spesifikasi khusus...',
    formSelectService: '-- Sila Pilih Perkhidmatan --',
    formSelectState: '-- Sila Pilih Negeri --',
    formSuccessTitle: 'Permintaan Sebutharga Berjaya Dihantar!',
    formSuccessDesc: 'Terima kasih. Permintaan anda telah direkodkan dalam sistem pentadbiran AFRA Services. Pegawai kami akan menghubungi nombor telefon anda secepat mungkin.',
    formErrorTitle: 'Ralat Menghantar',
    formErrorFail: 'Gagal menghantar permohonan. Sila semak sambungan internet anda.',
    formSubmitting: 'MENGHANTAR PERMOHONAN...',
    // Footer
    footerLinksTitle: 'Pautan Pantas',
    footHome: 'Laman Utama',
    footAbout: 'Tentang Kami',
    footServices: 'Senarai Perkhidmatan',
    footCerts: 'Sijil & Pelesenan',
    footContact: 'Hubungi Kami',
    footWebmail: 'Staff Webmail',
    // PreviewGate
    gateBadge: 'Page Under Development',
    gateInProgress: 'Sedang Dibangunkan',
    gateDesc: 'Bahagian ini dikhaskan untuk sesi semakan dalaman. Untuk melihat kandungan penuh dan dashboard pengurusan, sila log masuk pentadbir atau kembali ke laman utama.',
    gateLogin: 'PROCEED WITH LOGIN (PENTADBIR)',
    gateBack: 'KEMBALI KE HOMEPAGE',
    gateNote: 'AFRA Services Sdn. Bhd. Sistem Keselamatan & Kawalan CMS',
    gateChecking: 'Memeriksa status kebenaran...',
    gatePages: { about: 'Tentang Kami', catalog: 'Perkhidmatan & Katalog', certificates: 'Sijil & Pelesenan', contact: 'Hubungi Kami & Sebutharga' },
    // 404
    notFoundTitle: 'Halaman Tidak Dijumpai',
    notFoundDesc: 'Maaf, halaman yang anda cari tidak wujud atau telah dipindahkan.',
    notFoundBack: 'Kembali ke Laman Utama',
  },
  en: {
    navHome: 'HOME',
    navAbout: 'ABOUT US',
    navServices: 'SERVICES',
    navCertificates: 'CERTIFICATES',
    navContact: 'CONTACT US',
    navStaffEmail: 'STAFF EMAIL',
    navLogin: 'LOGIN',
    navKonsol: 'DASHBOARD',
    navAdminLogin: 'ADMIN LOGIN →',
    navAdminDash: 'ADMIN DASHBOARD →',
    heroBadge: 'Licensed Security Agency — KDN & PDRM Registered (881616-V)',
    heroCta1: 'EXPLORE SERVICES',
    heroCta2: 'REQUEST QUOTATION',
    moreInfo: 'Learn More',
    coName: 'Company Name',
    coReg: 'Registration No.',
    coEst: 'Incorporation Date',
    coAuthCap: 'Authorised Capital',
    coPaidCap: 'Paid-Up Capital',
    coBank: 'Principal Bank',
    coInsurer: 'Insurer',
    coSecretary: 'Company Secretary',
    coAuditor: 'Auditing Firm',
    refLabel: 'Reference',
    issuedBy: 'Issuing Body',
    formName: 'Full Name',
    formCompany: 'Company / Organisation Name',
    formPhone: 'Phone Number',
    formEmail: 'Email',
    formService: 'Required Service Type',
    formState: 'Premises State / Location',
    formNeeds: 'Security Requirements / Premises Details',
    formNamePh: 'e.g. Ahmad Faiz',
    formCompanyPh: 'e.g. Maju Sdn Bhd',
    formPhonePh: 'e.g. 012-3456789',
    formEmailPh: 'e.g. ahmad@company.com',
    formNeedsPh: 'State the number of guards, shift hours, premises type or any special requirements...',
    formSelectService: '-- Please Select a Service --',
    formSelectState: '-- Please Select a State --',
    formSuccessTitle: 'Quotation Request Sent Successfully!',
    formSuccessDesc: 'Thank you. Your request has been recorded in the AFRA Services administration system. Our officer will contact your phone number as soon as possible.',
    formErrorTitle: 'Submission Error',
    formErrorFail: 'Failed to send your request. Please check your internet connection.',
    formSubmitting: 'SENDING REQUEST...',
    footerLinksTitle: 'Quick Links',
    footHome: 'Home',
    footAbout: 'About Us',
    footServices: 'Our Services',
    footCerts: 'Certificates & Licensing',
    footContact: 'Contact Us',
    footWebmail: 'Staff Webmail',
    gateBadge: 'Page Under Development',
    gateInProgress: 'Under Development',
    gateDesc: 'This section is reserved for internal review. To view the full content and management dashboard, please proceed with admin login or return to the homepage.',
    gateLogin: 'PROCEED WITH LOGIN (ADMIN)',
    gateBack: 'BACK TO HOMEPAGE',
    gateNote: 'AFRA Services Sdn. Bhd. Security & Control CMS System',
    gateChecking: 'Checking authorisation status...',
    gatePages: { about: 'About Us', catalog: 'Services & Catalogue', certificates: 'Certificates & Licensing', contact: 'Contact Us & Quotation' },
    notFoundTitle: 'Page Not Found',
    notFoundDesc: 'Sorry, the page you are looking for does not exist or has been moved.',
    notFoundBack: 'Back to Homepage',
  },
}

const LanguageContext = createContext({ lang: 'ms', setLang: () => {}, t: STRINGS.ms })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      return saved === 'en' || saved === 'ms' ? saved : 'ms'
    } catch {
      return 'ms'
    }
  })

  function setLang(l) {
    setLangState(l)
    try { localStorage.setItem(LANG_KEY, l) } catch { /* abaikan */ }
  }

  useEffect(() => {
    document.documentElement.lang = lang === 'ms' ? 'ms' : 'en'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: STRINGS[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

// Pilih field EN dari baris jadual bila lang==='en' (fallback BM bila EN kosong).
// cth: L(row, lang, 'title') -> row.en.title || row.title
export function L(row, lang, field) {
  if (lang === 'en' && row?.en && typeof row.en[field] !== 'undefined' && row.en[field] !== null) {
    if (Array.isArray(row.en[field])) return row.en[field].length > 0 ? row.en[field] : (row[field] ?? [])
    const s = String(row.en[field]).trim()
    if (s) return row.en[field]
  }
  return row?.[field]
}

// Pilih nilai site_settings bila lang==='en' (map ada key + key+'_en').
// cth: S(settings, 'page_about_title', lang)
export function S(map, key, lang) {
  if (lang === 'en') {
    const en = map?.[key + '_en']
    if (en && String(en).trim()) return en
  }
  return map?.[key]
}

// Toggle pill BM | EN untuk header awam
export function LangToggle({ dark = false }) {
  const { lang, setLang } = useLang()
  const btn = (code, label) => ({
    padding: '0.35rem 0.7rem',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    background: lang === code ? '#0369a1' : 'transparent',
    color: lang === code ? '#ffffff' : dark ? '#cbd5e1' : '#64748b',
    transition: 'all 0.15s',
  })
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.15rem',
      padding: '0.2rem', borderRadius: '9999px',
      background: dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
      border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e2e8f0',
    }}>
      <button onClick={() => setLang('ms')} style={btn('ms', 'BM')} aria-label="Bahasa Melayu">BM</button>
      <button onClick={() => setLang('en')} style={btn('en', 'EN')} aria-label="English">EN</button>
    </div>
  )
}
