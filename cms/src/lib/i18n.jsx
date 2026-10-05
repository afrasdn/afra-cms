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

// ── Kamus fallback BM → EN ──
// Dijana daripada semua pasangan teks BM/EN dalam paparan awam.
// Membolehkan mod EN kekal full-English walaupun baris Supabase belum ada
// terjemahan EN (lajur `en` / `value_en` kosong): L() dan S() akan cuba
// menterjemah nilai BM yang dikenali sebelum fallback ke nilai asal.
// NOTA: teks baharu yang ditaip admin dalam BM (tiada dalam kamus & tiada EN)
// akan kekal dipaparkan seadanya — isi kolum EN di dashboard untuknya.
const BM_EN = {
  ' / 09-6264788 (Faks)': ' / 09-6264788 (Fax)',
  'AFRA Services Sdn. Bhd. Agensi kawalan keselamatan berlesen penuh KDN & PDRM sejak 2009. Melindungi premis korporat, industri, dan institusi awam seluruh Malaysia.': 'AFRA Services Sdn. Bhd. — a fully KDN & PDRM-licensed security agency since 2009. Protecting corporate, industrial and public premises across Malaysia.',
  'CCTV & Automasi': 'CCTV & Automation',
  '15+ Tahun Reputasi Kawalan Berdisiplin & Dipercayai': '15+ Years of Trusted & Disciplined Guarding Reputation',
  '24 Jam Setiap Hari (365 Hari Setahun)': '24 Hours Daily (365 Days a Year)',
  '7 Disember 2009': '7 December 2009',
  'AFRA Services Sdn. Bhd. (No. Pendaftaran: 881616-V) merupakan syarikat kawalan keselamatan berlesen rasmi di Malaysia yang diperbadankan sejak 7 Disember 2009 dengan modal dibenarkan dan berbayar sebanyak RM 5,000,000.00.': 'AFRA Services Sdn. Bhd. (Reg. No.: 881616-V) is an officially licensed security guarding company in Malaysia, incorporated since 7 December 2009 with authorised and paid-up capital of RM 5,000,000.00.',
  'AFRA Services Sdn. Bhd. Agensi kawalan keselamatan berlesen penuh KDN & PDRM sejak 2009. Melindungi premis korporat, industri, dan institusi awam seluruh Malaysia.': 'AFRA Services Sdn. Bhd. — a fully KDN & PDRM-licensed security agency since 2009. Protecting corporate, industrial and public premises across Malaysia.',
  'AFRA Services Sdn. Bhd. beroperasi dengan kelulusan penuh Kementerian Dalam Negeri (KDN), Polis Diraja Malaysia (PDRM), Kementerian Kewangan (MOF) dan pematuhan pensijilan ISO.': 'AFRA Services Sdn. Bhd. operates with full approval from the Ministry of Home Affairs (KDN), Royal Malaysia Police (PDRM), Ministry of Finance (MOF) and ISO certification compliance.',
  'AFRA Services Sdn. Bhd. ditubuhkan dengan matlamat utama untuk menyediakan perkhidmatan kawalan keselamatan bertaraf tinggi kepada sektor swasta, perbankan, perindustrian, dan agensi kerajaan di seluruh Malaysia.': 'AFRA Services Sdn. Bhd. was established to provide high-calibre security guarding to the private sector, banking, industry and government agencies across Malaysia.',
  'AFRA Services Sdn. Bhd. menyediakan pengkhususan perkhidmatan keselamatan menyeluruh yang mematuhi garis panduan ketat Kementerian Dalam Negeri (KDN) dan Polis Diraja Malaysia (PDRM).': 'AFRA Services Sdn. Bhd. provides comprehensive security specialisations in strict compliance with Ministry of Home Affairs (KDN) and Royal Malaysia Police (PDRM) guidelines.',
  'AHLI SAH': 'VALID MEMBER',
  'AKREDITASI & PENGIKTIRAFAN': 'ACCREDITATION & RECOGNITION',
  'AKTIF & SAH': 'ACTIVE & VALID',
  'Agensi Kawalan Keselamatan Berlesen KDN & PDRM': 'KDN & PDRM Licensed Security Agency',
  'Ahad – Khamis: 8:30 Pagi – 5:00 Petang\nJumaat & Sabtu: Tutup': 'Sunday – Thursday: 8:30 AM – 5:00 PM\nFriday & Saturday: Closed',
  'Ahli berdaftar Persatuan Perkhidmatan Kawalan Keselamatan Malaysia yang mematuhi standard piawaian etika, kebajikan pengawal dan kadar gaji minimum.': 'Registered member of the Malaysian Security Services Association, complying with ethics, guard welfare and minimum wage standards.',
  'Akses & Biometrik': 'Access & Biometrics',
  'Alamat Rasmi': 'Official Address',
  'Alat pengesan logam mudah alih untuk pintu masuk premis, dewan persidangan, dan zon berisiko tinggi.': 'Portable handheld metal detector scanner for building entrances, event venues, and high-security checkpoints.',
  'Analisis tingkah laku & zon penceroboh': 'Perimeter breach behavioral analytics',
  'BARU DITAMBAH': 'NEW PRODUCT',
  'BERTAULIAH': 'CERTIFIED',
  'Bacaan cip RFID & QR Code pantas': 'Instant RFID & QR chip decoding',
  'Bateri Li-ion 3800mAh tahan lasak': '3800mAh high endurance Li-ion battery',
  'Berlesen & Patuh': 'Licensed & Compliant',
  'Beroperasi dengan Ibu Pejabat di Kuala Terengganu dan cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak untuk memastikan kesiapsiagaan pantas.': 'Operating from our HQ in Kuala Terengganu with strategic branches across the Peninsula, Sabah and Sarawak for rapid readiness.',
  'Bilik Gerakan & CMS': 'Operations Room & CMS',
  'Borang Permintaan Sebutharga': 'Quotation Request Form',
  'CAWANGAN SELURUH MALAYSIA': 'BRANCHES ACROSS MALAYSIA',
  'CCTV & Automasi Keselamatan': 'CCTV & Security Automation',
  'Cawangan Negeri': 'State Branches',
  'Central Monitoring System (CMS 24 Jam)': 'Central Monitoring System (CMS 24/7)',
  'Central Monitoring System (CMS)': 'Central Monitoring System (CMS 24/7)',
  'Close Protection VIP': 'VIP Close Protection',
  'DILINDUNGI': 'PROTECTED',
  'DAPATKAN SEBUTHARGA': 'GET A QUOTATION',
  'Dilesenkan secara sah di bawah Akta Agensi Persendirian 1971 bagi menjalankan urusan perniagaan kawalan keselamatan dan siasatan persendirian di seluruh Malaysia.': 'Legally licensed under the Private Agencies Act 1971 to conduct security guarding and private investigation business across Malaysia.',
  'Dilindungi perlindungan insurans komprehensif Lonpac': 'Comprehensive Lonpac insurance coverage',
  'Ditubuhkan': 'Established',
  'Ditubuhkan pada 7 Disember 2009, AFRA Services Sdn. Bhd. (881616-V) telah berkembang menjadi sebuah organisasi kawalan keselamatan berwibawa dengan 13 cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak.': 'Established on 7 December 2009, AFRA Services Sdn. Bhd. (881616-V) has grown into a reputable security guarding organisation with 13 strategic branches across the Peninsula, Sabah and Sarawak.',
  'E-mel Pentadbiran': 'Administration Email',
  'Fabrik Aramid / Kevlar gred balistik': 'Aramid / Kevlar ballistic fiber',
  'Faks': 'Fax',
  'HANTAR PERMINTAAN SEBUTHARGA': 'SUBMIT QUOTATION REQUEST',
  'HUBUNGI IBU PEJABAT': 'Call HQ Desk',
  'HUBUNGI KAMI & SEBUTHARGA': 'CONTACT US & QUOTATIONS',
  'Hab Sistem Penggera Pintar Tanpa Wayar (CMS Linked)': 'Wireless Smart Intrusion Alarm Hub (CMS Linked)',
  'Hak Cipta Terpelihara 2009 - 2026 © AFRA Services Sdn. Bhd. (881616-V).': 'Copyright 2009 - 2026 © AFRA Services Sdn. Bhd. (881616-V). All Rights Reserved.',
  'IBU PEJABAT': 'HEADQUARTERS',
  'Ibu Pejabat (HQ)': 'Headquarters (HQ)',
  'Infrared Night Vision & ColorVu': 'Smart IR Night Vision & ColorVu',
  'Insurans Komprehensif': 'Comprehensive Insurance',
  'Insurans Liabiliti Awam & Wang Dalam Perjalanan': 'Public Liability & Cash-In-Transit Insurance',
  'Integrasi sistem CMS & penggajian': 'Direct CMS & payroll integration',
  'Julat isyarat sehingga 15km': 'Up to 15km signal range',
  'Jurulatih bertauliah & berpengalaman ketenteraan': 'Certified veteran trainers with military background',
  'KATALOG PRODUK & PERALATAN': 'Product & Equipment Catalog',
  'KDN, PDRM, Ahli PPKKM & Pengiktirafan Bersijil ISO': 'KDN, PDRM, PPKKM Member & ISO Certified Recognition',
  'KONSULTASI & SEBUTHARGA PERCUMA': 'FREE CONSULTATION & QUOTATION',
  'Kalis calar & tusukan bilah tajam': 'Multi-threat stab & bullet resistance',
  'Kalis jatuh 2 meter & kalis air IP68': '2m drop-proof & IP68 waterproof',
  'Kamera Badan Taktikal AI 4K (Model AFRA-X1)': 'Tactical AI 4K Body-Worn Camera (AFRA-X1)',
  'Kamera Badan Taktikal Pengawal 4K (Body Worn Cam)': '4K Tactical Body Worn Security Camera',
  'Kamera CCTV IP Dome 4K AI Night Vision': '4K AI IP Dome Security Camera with Night Vision',
  'Kamera IP resolusi tinggi & penglihatan malam (Night Vision)': 'High-definition 4K night vision cameras',
  'Kamera badan (body-worn camera) taktikal 4K dengan penstriman GPS langsung ke Pusat Kawalan 24 Jam CMS AFRA dan pengecaman pintar AI.': 'Ultra-high-definition 4K body-worn camera with live GPS streaming to AFRA 24/7 CMS Command Center and on-device AI facial recognition.',
  'Kamera badan beresolusi tinggi dengan penanda masa GPS & audio terenkripsi untuk bukti dokumentasi insiden keselamatan.': 'Law-enforcement grade body-worn camera with encrypted audio-video logs and embedded GPS watermark for evidence capture.',
  'Kamera litar tertutup resolusi 4K dengan sensor pengecaman wajah AI pintar dan penglihatan malam infra-merah 50 meter.': 'Ultra HD 4K dome camera with AI face detection, vehicle classification, and 50-meter smart infrared night vision.',
  'Kami merangkumi kitaran penuh operasi keselamatan dan pertahanan taktikal, daripada kawalan fizikal berskala besar sehingga pengiring bersenjata.': 'We cover the full cycle of security operations and tactical defence — from large-scale physical guarding to armed escorts.',
  'Kawalan Bersenjata (Armed Guard)': 'Armed Guard',
  'Kawalan Keselamatan Bersenjata': 'Armed Security Guarding',
  'Kawalan Keselamatan Statik': 'Static Security Guarding',
  'Kawalan Statik (Static Guard)': 'Static Guard',
  'Kawalan keselamatan fizikal 24/7 di premis korporat, komersial, perindustrian, perbankan dan kediaman oleh anggota keselamatan berdisiplin serta terlatih.': '24/7 physical security guarding for corporate, commercial, industrial, banking and residential premises by disciplined, trained personnel.',
  'Keahlian Rasmi Persatuan Kawalan Keselamatan': 'Official Security Association Membership',
  'Kebenaran rasmi pemilikan dan penggunaan senjata api (Pistol dan Shotgun) untuk kawalan statik bersenjata, van kalis peluru CIT, dan perlindungan orang kenamaan.': 'Official authorisation to possess and use firearms (Pistol and Shotgun) for armed static guarding, CIT armoured vans and VIP protection.',
  'Kekuatan Kewangan Penuh Didaftarkan di Bawah SSM': 'Full Financial Strength Registered Under SSM',
  'KESELAMATAN ANDA, KOMITMEN KAMI.': 'YOUR SAFETY, OUR COMMITMENT.',
  'Kementerian Dalam Negeri': 'Ministry of Home Affairs',
  'Kementerian Kewangan': 'Ministry of Finance',
  'Kenderaan perisai kalis peluru berpiawaian tinggi': 'Certified ballistic armored vehicles',
  'Kerahsiaan maklumat klien dijamin 100%': 'Strict 100% client data confidentiality',
  'Kerahsiaan tinggi (Strict NDA & Confidentiality)': 'Strict non-disclosure & confidential protocol',
  'Ketahanan Bateri 14 Jam & Kalis Air IP68': '14-Hour Battery Life & IP68 Waterproof',
  'Khidmat Kawalan Bersenjata': 'Armed Security Service',
  'Khidmat Kawalan Bersenjata (Armed Guard)': 'Armed Guard Service',
  'Khidmat Kawalan Statik': 'Static Guard Service',
  'Khidmat Kawalan Statik (Static Guard)': 'Static Guard Service',
  'Khidmat Pengawal Peribadi (Bodyguard)': 'VIP Bodyguard & Close Protection',
  'Khidmat penyiasatan korporat dan persendirian secara diskret dan profesional. Menjalankan penyiasatan latar belakang, ketirisan maklumat dalaman syarikat, pemalsuan, dan pengawasan taktikal berlandaskan undang-undang.': 'Discreet corporate intelligence, employee due diligence, integrity audit, asset leakage investigation, and confidential surveillance adhering to legal frameworks.',
  'Komunikasi & Rondaan': 'Comms & Patrol',
  'LIPUTAN KEBANGSAAN': 'NATIONWIDE COVERAGE',
  'Laporan penyiasatan berkomputer & bukti sahih': 'Comprehensive fact-based investigative reporting',
  'Latihan & Audit Taktikal': 'Tactical Training & Audit',
  'Latihan & Kesedaran Keselamatan': 'Training & Security Awareness',
  'Latihan & Konsultasi Keselamatan': 'Training & Security Consultation',
  'Latihan Taktikal & Keselamatan': 'Tactical Training & Security Consultation',
  'Lesen Agensi Persendirian (Seksyen 2(a) & 2(b))': 'Private Agency Licence (Section 2(a) & 2(b))',
  'Lesen Keselamatan KDN & PDRM Berdaftar (881616-V)': 'Licensed Security Agency — KDN & PDRM Registered (881616-V)',
  'Lesen Operasi Berkanun': 'Statutory Operating Licences',
  'Lesen Senjata IPD PDRM': 'PDRM Firearm Licensed',
  'Liputan Operasi Seluruh Malaysia Termasuk Sabah & Sarawak': 'Nationwide Operations Coverage Including Sabah & Sarawak',
  'MAKLUMAT RASMI SYARIKAT': 'OFFICIAL COMPANY INFORMATION',
  'MINTA SEBUTHARGA': 'REQUEST QUOTATION',
  'MINTA SEBUTHARGA SEGERA': 'Request Quote Now',
  'MUAT TURUN PROFIL LENGKAP (PDF)': 'DOWNLOAD FULL PROFILE (PDF)',
  'Maklumat Lanjut': 'Learn More',
  'Melatih, memberi pengetahuan berterusan serta menanam semangat kesedaran keselamatan yang dinamik.': 'Training, continuous education and instilling a dynamic security-awareness culture.',
  'Membantu Pihak Berkuasa & Polis': 'Supporting Authorities & Police',
  'Membantu pihak Polis Diraja Malaysia (PDRM) dalam mengurangkan kadar jenayah harta benda melalui kawalan pencegahan berkesan.': 'Assisting the Royal Malaysia Police (PDRM) in reducing property crime through effective preventive guarding.',
  'Memberi keutamaan pekerjaan kepada bekas-bekas anggota Pasukan Keselamatan negara dalam bidang keselamatan profesional.': 'Prioritising jobs for former national security forces personnel in professional security.',
  'Memberi perlindungan keselamatan optimum terhadap harta benda, premis perniagaan, dan nyawa setiap individu.': 'Providing optimum security protection for property, business premises and every individual life.',
  'Mengintegrasikan sistem automasi keselamatan pintar dan kawalan rondaan berkomputer selari dengan keperluan era digital.': 'Integrating smart security automation and computerised patrol control for the digital era.',
  'Menjadi salah satu Syarikat Perkhidmatan Kawalan Keselamatan yang kukuh dan berdaya saing di Malaysia di mana kepercayaan dan keperimanusiaan menjadi keutamaan kami.': 'To be one of the strongest and most competitive Security Guarding companies in Malaysia, where trust and humanity are our priority.',
  'Mewujudkan Peluang Pekerjaan': 'Creating Employment Opportunities',
  'Minta Sebutharga': 'Request Quote',
  'Minta Sebutharga Perkhidmatan Ini': 'Request Quote for this Service',
  'Misi Syarikat': 'Company Mission',
  'Mod amaran audio & getaran senyap': 'Audio chime & silent vibration alert',
  'Mod malam IR automatik': 'Automatic infrared night mode',
  'Modal Berbayar': 'Paid-Up Capital',
  'Modul diiktiraf Kementerian Dalam Negeri (KDN)': 'KDN-accredited security training modules',
  'Notifikasi serta-merta ke pemilik & balai polis terdekat': 'Direct alarm dispatch to client and nearest police',
  'Objektif Penubuhan': 'Establishment Objectives',
  'PENGKHUSUSAN UTAMA': 'CORE SPECIALISATIONS',
  'PERKHIDMATAN & KATALOG': 'SERVICES & CATALOGUE',
  'PERKHIDMATAN & PENYELESAIAN': 'SERVICES & SOLUTIONS',
  'PERKHIDMATAN MENYELURUH': 'OUR COMPREHENSIVE',
  'PRODUK & PERALATAN KESELAMATAN BERGRED TINGGI': 'High-Grade Security Products & Assets',
  'Pasukan operasi keselamatan AFRA Services sedia membantu merangka pelan penugasan kawalan fizikal, rondaan bersenjata, pengiring CIT, atau integrasi sistem CMS 24/7 di seluruh Malaysia.': 'AFRA Services operations team is ready to structure physical guarding, armed patrols, CIT transit, or 24/7 CMS system integration anywhere across Malaysia.',
  'Pegawai penyiasat berpengalaman bekas unit risikan': 'Seasoned investigators from specialized intelligence units',
  'Pejabat Pengurusan': 'Management Office',
  'Pelesenan & Pematuhan Undang-Undang': 'Licensing & Legal Compliance',
  'Pemanduan defensif & perancangan laluan selamat': 'Defensive driving and strategic transit routing',
  'Pemantauan 24/7 bilik kawalan pintar': '24/7 intelligent command center operations',
  'Pemantauan jarak jauh melalui telefon pintar': 'Remote surveillance mobile phone accessibility',
  'Pemasangan dan penyenggaraan kamera litar tertutup (CCTV) berdefinisi tinggi, sistem kawalan akses biometrik, pagar automatik dan sistem keselamatan pintar bangunan.': 'Installation and maintenance of high-definition CCTV, biometric access control, automated gates and smart building security systems.',
  'Pemasangan, integrasi, dan penyenggaraan sistem kamera litar tertutup (CCTV HD/IP), sistem kawalan akses kad pintar, pengimbas cap jari/biometrik, dan sistem automasi rumah atau bangunan pintar.': 'Supply, installation, and integration of 4K IP security cameras, smart door access control, biometric scanners, and smart building automation.',
  'Pematuhan KDN & PDRM': 'KDN & PDRM Compliant',
  'Pematuhan Rasmi KDN': 'Official KDN Compliance',
  'Pemeriksaan keluar-masuk kenderaan & pelawat': 'Visitor and vehicle access screening',
  'Pendaftaran sah taraf Bumiputera untuk menyertai perolehan kerajaan persekutuan, jabatan kementerian, badan berkanun, dan institusi pengajian tinggi awam.': 'Valid Bumiputera status registration for federal government procurement, ministries, statutory bodies and public universities.',
  'Pengangkutan wang tunai dan barangan berharga menggunakan kenderaan perisai kalis peluru (Armoured Vehicle) dengan pengiring bersenjata serta penjejakan GPS.': 'Cash and valuables transport using bullet-proof armoured vehicles with armed escorts and GPS tracking.',
  'Pengangkutan wang tunai, jongkong emas, surat berharga, dan barangan bernilai tinggi menggunakan van perisai kalis peluru (Armoured Vehicles) yang dilengkapi sistem keselamatan kunci berganda dan penjejakan satelit GPS masa nyata.': 'Secure armored vehicle transport for cash, gold bullion, and high-value commodities equipped with dual-key electronic locking and live GPS satellite tracking.',
  'Pengarah': 'Director',
  'Pengarah Urusan': 'Managing Director',
  'Pengawal Peribadi (VIP Bodyguard)': 'VIP Bodyguard (Close Protection)',
  'Pengawal keselamatan terlatih berdisiplin tinggi': 'Highly disciplined and trained security guards',
  'Pengawal lulus ujian menembak & lesen senjata PDRM': 'PDRM firearm certified security personnel',
  'Pengawasan & CCTV AI': 'AI Surveillance',
  'Pengecaman wajah pantas < 0.2 saat': 'Ultra-fast < 0.2s facial recognition',
  'Pengendalian senjata selamat (Safe Armory Handling)': 'Strict and safe armory handling standards',
  'Pengesanan senjata logam & ferus': 'Ferrous & non-ferrous weapon detection',
  'Pengiktirafan Rasmi & Badan Kawal Selia': 'Official Recognition & Regulatory Bodies',
  'Pengimbas Log Rondaan Pintar (RFID / QR Guard Tour)': 'Smart Guard Tour RFID/QR Patrol Scanner',
  'Pengimbas Logam Pegang Tangan Berkepekaan Tinggi': 'High-Sensitivity Handheld Metal Detector Wand',
  'Penjejakan GPS & komunikasi radio berpusat': 'Live satellite GPS and centralized radio comms',
  'Penjejakan Lokasi GPS Langsung 4G LTE': 'Live GPS Tracking via 4G LTE',
  'Pensijilan kompetensi keselamatan anggota': 'Official competency and safety certification',
  'Pensijilan kualiti antarabangsa bagi pengurusan operasi kawalan keselamatan, rondaan, pemantauan pusat kawalan CMS, dan pengurusan sumber manusia berdisiplin.': 'International quality certification for security guarding operations, patrols, CMS control-centre monitoring and disciplined HR management.',
  'Penyiasat Persendirian (Private Investigation)': 'Private Investigation',
  'Penyulitan audio keselamatan': 'Secure voice encryption',
  'Peralatan Keselamatan': 'Security Equipment',
  'Peralatan berstandard KDN & PDRM': 'KDN & PDRM standard equipment',
  'Peralatan komunikasi taktikal, sistem pengawasan pintar 4K AI, alat kawalan akses biometrik, dan kelengkapan perlindungan anggota yang diuji untuk ketahanan operasi keselamatan.': 'Tactical communication gear, intelligent 4K AI surveillance, biometric access control, and tested security protective assets.',
  'Peranti log rondaan keselamatan kalis air dengan pengesahan koordinat GPS dan pemindahan data masa nyata.': 'Waterproof electronic guard tour patrol checkpoint reader with GPS timestamp authentication and cloud sync.',
  'Perkhidmatan Operasi Berlesen': 'Licensed Operations Services',
  'Perkhidmatan kawalan keselamatan fizikal 24/7 di premis perniagaan, kompleks membeli-belah, hospital, tapak pembinaan, perumahan dan premis kerajaan. Dilengkapi dengan rondaan berkala dan buku log digital.': '24/7 physical security guarding for commercial properties, shopping malls, hospitals, construction sites, residential areas, and government premises.',
  'Perlindungan Menyeluruh': 'Comprehensive Protection',
  'Perlindungan Taktikal': 'Tactical Gear',
  'Perlindungan berisiko tinggi (High-Risk Deterrence)': 'High-risk deterrent protection capability',
  'Perlindungan bersenjata api (Pistol & Shotgun) berlesen untuk sektor berisiko tinggi, institusi perbankan, bilik kebal, dan pengiring taktikal.': 'Licensed firearm protection (Pistol & Shotgun) for high-risk sectors, banking institutions, vaults and tactical escorts.',
  'Perlindungan bersenjata api (Pistol dan Shotgun) berlesen rasmi oleh IPD PDRM. Dikhaskan bagi institusi kewangan, kedai emas, kilang bernilai tinggi, dan premis yang memerlukan pencegahan taktikal.': 'Licensed armed security protection with firearms authorized by PDRM for banking institutions, jewelry outlets, high-value facilities, and critical infrastructures.',
  'Perlindungan eksekutif rapat (Close Protection) untuk orang kenamaan (VVIP/VIP), diplomat, ekspatriat dan tokoh korporat berprofil tinggi secara profesional.': 'Professional close protection for VVIPs/VIPs, diplomats, expatriates and high-profile corporate figures.',
  'Perlindungan eksekutif rapat (Close Protection) untuk orang kenamaan (VVIP/VIP), diplomat, ekspatriat, dan eksekutif korporat. Terlatih dalam pertahanan tanpa senjata, pemanduan defensif, dan penilaian ancaman awal.': 'Close executive protection for dignitaries, diplomats, corporate executives, and VIPs trained in defensive driving, unarmed combat, and risk mitigation.',
  'Perlindungan insurans liabiliti awam (Public Liability), Cash-In-Transit, dan Fideliti (Fidelity Guarantee) sehingga jutaan ringgit bagi melindungi aset pelanggan.': 'Public liability, Cash-In-Transit and Fidelity Guarantee insurance protection worth millions of ringgit safeguarding client assets.',
  'Perlukan Penyelesaian Keselamatan Tersuai untuk Premis Anda?': 'Need a Tailored Security Solution for Your Premise?',
  'Permit & Kuasa Membawa Senjata Api': 'Firearm Carry Permit & Authority',
  'Persatuan Keselamatan': 'Security Services Association',
  'Personel berpengalaman & penampilan profesional': 'Experienced personnel with professional demeanor',
  'Piawaian Pematuhan Pertahanan & Keselamatan Malaysia': 'Malaysian Defence & Security Compliance Standards',
  'Polis Diraja Malaysia': 'Royal Malaysia Police',
  'Polisi Perlindungan Komprehensif': 'Comprehensive Protection Policy',
  'Portfolio Perkhidmatan Kawalan': 'Security Guarding Service Portfolio',
  'Profil Korporat Syarikat': 'Corporate Company Profile',
  'Program latihan intensif Certified Security Guard (CSG), pencegahan kebakaran, pertolongan cemas (First Aid / CPR), latihan pengendalian krisis kecemasan dan taklimat kesedaran keselamatan premis.': 'Premise risk assessment audits, certified security guard (CSG) training, emergency fire evacuation drills, and firearm handling courses for organizations.',
  'Pusat Khidmat & Sebutharga': 'Service Centre & Quotations',
  'Pusat kawalan keselamatan berpusat beroperasi 24 jam sehari, 7 hari seminggu. Menerima isyarat penggera automatik pencerobohan, kebakaran, atau kecemasan perubatan, disusuli tindakan pantas Unit Respon Kecemasan.': 'State-of-the-art 24/7 centralized alarm monitoring center responding instantly to intrusion, panic triggers, and fire alarms with rapid field response.',
  'Pusat kawalan penggera berpusat 24 jam dengan unit respon kecemasan pantas (Rapid Response Team) sekiranya berlaku sebarang penggera pencerobohan atau kecemasan.': '24-hour centralised alarm monitoring centre with Rapid Response Team for intrusion or emergency alarms.',
  'Pusat kawalan penggera pencerobohan tanpa wayar yang disambung terus ke Bilik Kawalan 24 Jam AFRA CMS.': 'Wireless smart security intrusion hub connected 24/7 directly to the AFRA Central Monitoring System command station.',
  'RANGKAIAN OPERASI KEBANGSAAN': 'NATIONAL OPERATIONS NETWORK',
  'Rakaman video HD 1440p / 4K': '1440p / 4K high-res recording',
  'Reka bentuk ergonomik & ringan': 'Ergonomic breathable lightweight fit',
  'Resolusi 4K Ultra HD (8 Megapixel)': '4K Ultra HD resolution (8MP)',
  'Resolusi Ultra HD 4K & Penglihatan Malam IR': 'Ultra HD 4K & IR Night Vision',
  'Respon penggera siren serta-merta': 'Instant siren trigger & CMS alert',
  'Rompi perlindungan taktikal ergonomik pensijilan NIJ standard tinggi untuk anggota kawalan bersenjata dan pengiring CIT.': 'NIJ Level IIIA certified lightweight body armor vest designed for armed guards, CIT escorts, and tactical security details.',
  'SIJIL & PELESENAN RASMI': 'OFFICIAL CERTIFICATES & LICENSING',
  'Sambungan dwi-jalur 4G LTE & Wi-Fi': 'Dual-band 4G LTE & Wi-Fi uplink',
  'Sensitiviti boleh dilaraskan': 'Adjustable sensitivity threshold',
  'Sensor magnetik pintu & tingkap': 'Magnetic door & window sensors',
  'Sentiasa memberi dan menambah mutu perkhidmatan bagi memastikan harta benda dan nyawa pelanggan sentiasa berada dalam keadaan selamat dan terpelihara.': 'To continuously deliver and improve service quality, ensuring client property and lives remain safe and protected at all times.',
  'Setiap cawangan berdaftar dengan permit berasingan bagi memastikan kawalan operasi tempatan yang responsif dan mematuhi arahan IPD setempat.': 'Each branch is registered with its own permit to ensure responsive local operations control in compliance with local IPD directives.',
  'Siapa Kami': 'Who We Are',
  'Sijil Akuan Pendaftaran Syarikat Bumiputera': 'Bumiputera Company Registration Certificate',
  'Sijil Piawaian Kualiti Antarabangsa': 'International Quality Standard Certificate',
  'Sila isi maklumat penugasan keselamatan yang diperlukan. Pegawai operasi kami akan menghubungi anda dalam tempoh 24 jam.': 'Please fill in the required security assignment details. Our operations officer will contact you within 24 hours.',
  'Sila lengkapkan borang di bawah untuk mendapatkan sebutharga rasmi bagi perkhidmatan kawalan keselamatan di premis anda, atau hubungi bilik gerakan kami.': 'Please complete the form below for an official quotation for guarding services at your premises, or contact our operations room.',
  'Sinkronisasi awan CMS automatik': 'Real-time CMS cloud synchronization',
  'Sistem Pengurusan Kualiti Kawalan Keselamatan': 'Security Guarding Quality Management System',
  'Sistem kawalan pintu berpagar automasi pintar': 'Integrated automated barrier & door access control',
  'Sistem pengesahan kehadiran dan pembuka pintu menggunakan teknologi pengecaman wajah 3D dan imbasan biometrik.': 'High-speed biometric time attendance and electronic door access terminal with 3D facial recognition & RFID card reader.',
  'Sistem rondaan berkala (Watchman Clock / QR Patrolling)': 'Periodic digital guard patrol monitoring',
  'Sokongan Kad Pintar RFID Mifare': 'Supports Mifare RFID smart card',
  'Storan dalaman selamat anti-usikan': 'Tamper-proof internal encrypted storage',
  'Sulit & Beretika': 'Discreet & Ethical',
  'TENTANG AFRA SERVICES': 'ABOUT AFRA SERVICES',
  'TEROKAI PERKHIDMATAN': 'EXPLORE SERVICES',
  'Teknologi & Piawaian Terkini': 'Latest Technology & Standards',
  'Telefon & Faks': 'Phone & Fax',
  'Tenaga kerja dan anggota kami sebahagian besarnya terdiri daripada bekas anggota Pasukan Keselamatan negara (Polis & Angkatan Tentera) yang menerapkan disiplin ketenteraan, ketelitian operasi, dan integriti yang tinggi dalam setiap penugasan.': 'Our workforce consists largely of former national security personnel (Police & Armed Forces) who bring military discipline, operational precision and high integrity to every assignment.',
  'Terminal Akses Pintu Biometrik & Cap Jari Pintar': 'Smart Biometric & Facial Access Terminal',
  'Tiada produk dijumpai bagi kategori ini.': 'No products found for this category.',
  'Transceiver dua hala kalis hentakan IP67 dengan frekuensi tersulit MCMC dan bateri berkapasiti tinggi 48 jam.': 'Heavy-duty IP67 shockproof two-way radio transceiver with MCMC encrypted frequencies and 48-hour long battery life.',
  'Unit Respon Pantas (Rapid Response Team) ke lokasi': 'Rapid Response Team field deployment',
  'Van Perisai Kalis Peluru': 'Bullet-Proof Armoured Van',
  'Vest Taktikal Kalis Tikaman & Peluru (Level IIIA)': 'Level IIIA Ballistic & Stab-Proof Tactical Vest',
  'Visi Syarikat': 'Company Vision',
  'Waktu Operasi HQ': 'HQ Operating Hours',
  'Walkie-Talkie Taktikal UHF/VHF Jarak Jauh': 'Long-Range Tactical UHF/VHF Transceiver',
  'Waranti sokongan teknikal penuh': 'Full technical support warranty',
}

function dictEN(value) {
  if (typeof value !== 'string') return value
  const hit = BM_EN[value.trim()]
  return typeof hit === 'string' && hit !== '' ? hit : value
}

// Keutamaan EN untuk satu nilai mentah: kolum EN -> kamus BM→EN -> fallback English.
// Digunakan untuk kandungan site_content/hero yang tiada lajur `en` dalam DB.
// Tidak sesekali pulangkan BM yang tidak dikenali bila fallback diberi.
export function pickEN(bmVal, enVal, fallback) {
  if (typeof enVal === 'string' && enVal.trim() !== '') return enVal
  if (Array.isArray(enVal) && enVal.length > 0) return enVal
  if (typeof bmVal === 'string' && bmVal.trim() !== '') {
    const hit = BM_EN[bmVal.trim()]
    if (typeof hit === 'string' && hit !== '') return hit
  }
  if (typeof fallback !== 'undefined') return fallback
  return bmVal
}

// Pilih field EN dari baris jadual bila lang==='en'.
// Keutamaan: row.en[field] -> kamus BM→EN -> nilai BM asal.
// cth: L(row, lang, 'title') -> row.en.title || row.title
export function L(row, lang, field) {
  const bmVal = row?.[field]
  if (lang !== 'en') return bmVal
  const enObj = row?.en
  if (enObj && typeof enObj[field] !== 'undefined' && enObj[field] !== null) {
    const ev = enObj[field]
    if (Array.isArray(ev)) {
      if (ev.length > 0) return ev
    } else if (String(ev).trim() !== '') {
      return ev
    }
  }
  if (Array.isArray(bmVal)) {
    if (bmVal.length === 0) return bmVal
    return bmVal.map(el => (typeof el === 'string' ? dictEN(el) : el))
  }
  if (typeof bmVal === 'string') return dictEN(bmVal)
  return bmVal
}

// Pilih nilai site_settings bila lang==='en' (map ada key + key+'_en').
// Boleh terima fallback eksplisit: S(map, key, lang, enFallback, msFallback).
// Dalam mod EN keutamaan: value_en -> enFallback -> kamus BM→EN -> nilai BM.
// cth: S(settings, 'page_about_title', lang)
export function S(map, key, lang, enFallback, msFallback) {
  const bm = map?.[key]
  const hasBm = bm != null && String(bm).trim() !== ''
  if (lang === 'en') {
    const en = map?.[key + '_en']
    if (en != null && String(en).trim() !== '') return en
    if (typeof enFallback === 'string' && enFallback !== '') return enFallback
    if (hasBm) {
      const s = String(bm)
      const hit = BM_EN[s.trim()]
      return typeof hit === 'string' && hit !== '' ? hit : bm
    }
    if (typeof enFallback !== 'undefined') return enFallback
    if (typeof msFallback !== 'undefined') return msFallback
    return undefined
  }
  if (hasBm) return bm
  if (typeof msFallback !== 'undefined') return msFallback
  if (typeof enFallback !== 'undefined') return enFallback
  return undefined
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
