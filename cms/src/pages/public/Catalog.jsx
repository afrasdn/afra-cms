import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getServiceIcon, fetchSettings, cleanTitle } from '../../lib/content'
import { useLang, L, S } from '../../lib/i18n'
import {
  ShieldCheck, CheckCircle2, FileText, ArrowRight,
  Radio, Camera, Fingerprint, Shield, Grid, Check, PackageX
} from 'lucide-react'

const DEFAULT_SERVICE_IMAGES = {
  static: '/assets/images/services/svc-static.jpg',
  armed: '/assets/images/services/svc-armed.jpg',
  cit: '/assets/images/services/svc-cit.jpg',
  bodyguard: '/assets/images/services/svc-bodyguard.jpg',
  cms: '/assets/images/services/svc-cms.jpg',
  cctv: '/assets/images/services/svc-cctv.jpg',
  pi: '/assets/images/services/svc-pi.jpg',
  training: '/assets/images/services/svc-training.jpg',
}

const DEFAULT_SERVICE_TAGS = {
  static: 'Pematuhan KDN & PDRM',
  armed: 'Lesen Senjata IPD PDRM',
  cit: 'Van Perisai Kalis Peluru',
  bodyguard: 'Close Protection VIP',
  cms: '24/7 Command Center',
  cctv: '4K AI Surveillance',
  pi: 'Sulit & Beretika',
  training: 'Latihan & Audit Taktikal',
}

const DEFAULT_SERVICE_TAGS_EN = {
  static: 'KDN & PDRM Compliant',
  armed: 'PDRM Firearm Licensed',
  cit: 'Bullet-Proof Armoured Van',
  bodyguard: 'VIP Close Protection',
  cms: '24/7 Command Center',
  cctv: '4K AI Surveillance',
  pi: 'Discreet & Ethical',
  training: 'Tactical Training & Audit',
}

const FALLBACK_SERVICES = [
  {
    slug: 'static', code: 'SVC-01', icon: 'Shield',
    image_url: '/assets/images/services/svc-static.jpg',
    tag: 'Pematuhan KDN & PDRM',
    title: 'Khidmat Kawalan Statik',
    description: 'Perkhidmatan kawalan keselamatan fizikal 24/7 di premis perniagaan, kompleks membeli-belah, hospital, tapak pembinaan, perumahan dan premis kerajaan. Dilengkapi dengan rondaan berkala dan buku log digital.',
    features: ['Pengawal keselamatan terlatih berdisiplin tinggi', 'Sistem rondaan berkala (Watchman Clock / QR Patrolling)', 'Pemeriksaan keluar-masuk kenderaan & pelawat'],
    en: {
      title: 'Static Guard Service',
      description: '24/7 physical security guarding for commercial properties, shopping malls, hospitals, construction sites, residential areas, and government premises.',
      features: ['Highly disciplined and trained security guards', 'Periodic digital guard patrol monitoring', 'Visitor and vehicle access screening'],
    }
  },
  {
    slug: 'armed', code: 'SVC-02', icon: 'Crosshair',
    image_url: '/assets/images/services/svc-armed.jpg',
    tag: 'Lesen Senjata IPD PDRM',
    title: 'Khidmat Kawalan Bersenjata',
    description: 'Perlindungan bersenjata api (Pistol dan Shotgun) berlesen rasmi oleh IPD PDRM. Dikhaskan bagi institusi kewangan, kedai emas, kilang bernilai tinggi, dan premis yang memerlukan pencegahan taktikal.',
    features: ['Pengawal lulus ujian menembak & lesen senjata PDRM', 'Pengendalian senjata selamat (Safe Armory Handling)', 'Perlindungan berisiko tinggi (High-Risk Deterrence)'],
    en: {
      title: 'Armed Security Service',
      description: 'Licensed armed security protection with firearms authorized by PDRM for banking institutions, jewelry outlets, high-value facilities, and critical infrastructures.',
      features: ['PDRM firearm certified security personnel', 'Strict and safe armory handling standards', 'High-risk deterrent protection capability'],
    }
  },
  {
    slug: 'cit', code: 'SVC-03', icon: 'Truck',
    image_url: '/assets/images/services/svc-cit.jpg',
    tag: 'Van Perisai Kalis Peluru',
    title: 'Cash-In-Transit (C.I.T)',
    description: 'Pengangkutan wang tunai, jongkong emas, surat berharga, dan barangan bernilai tinggi menggunakan van perisai kalis peluru (Armoured Vehicles) yang dilengkapi sistem keselamatan kunci berganda dan penjejakan satelit GPS masa nyata.',
    features: ['Kenderaan perisai kalis peluru berpiawaian tinggi', 'Penjejakan GPS & komunikasi radio berpusat', 'Dilindungi perlindungan insurans komprehensif Lonpac'],
    en: {
      title: 'Cash-In-Transit (C.I.T)',
      description: 'Secure armored vehicle transport for cash, gold bullion, and high-value commodities equipped with dual-key electronic locking and live GPS satellite tracking.',
      features: ['Certified ballistic armored vehicles', 'Live satellite GPS and centralized radio comms', 'Comprehensive Lonpac insurance coverage'],
    }
  },
  {
    slug: 'bodyguard', code: 'SVC-04', icon: 'UserCheck',
    image_url: '/assets/images/services/svc-bodyguard.jpg',
    tag: 'Close Protection VIP',
    title: 'Khidmat Pengawal Peribadi (Bodyguard)',
    description: 'Perlindungan eksekutif rapat (Close Protection) untuk orang kenamaan (VVIP/VIP), diplomat, ekspatriat, dan eksekutif korporat. Terlatih dalam pertahanan tanpa senjata, pemanduan defensif, dan penilaian ancaman awal.',
    features: ['Personel berpengalaman & penampilan profesional', 'Pemanduan defensif & perancangan laluan selamat', 'Kerahsiaan tinggi (Strict NDA & Confidentiality)'],
    en: {
      title: 'VIP Bodyguard & Close Protection',
      description: 'Close executive protection for dignitaries, diplomats, corporate executives, and VIPs trained in defensive driving, unarmed combat, and risk mitigation.',
      features: ['Experienced personnel with professional demeanor', 'Defensive driving and strategic transit routing', 'Strict non-disclosure & confidential protocol'],
    }
  },
  {
    slug: 'cms', code: 'SVC-05', icon: 'Activity',
    image_url: '/assets/images/services/svc-cms.jpg',
    tag: '24/7 Command Center',
    title: 'Central Monitoring System (CMS)',
    description: 'Pusat kawalan keselamatan berpusat beroperasi 24 jam sehari, 7 hari seminggu. Menerima isyarat penggera automatik pencerobohan, kebakaran, atau kecemasan perubatan, disusuli tindakan pantas Unit Respon Kecemasan.',
    features: ['Pemantauan 24/7 bilik kawalan pintar', 'Unit Respon Pantas (Rapid Response Team) ke lokasi', 'Notifikasi serta-merta ke pemilik & balai polis terdekat'],
    en: {
      title: 'Central Monitoring System (CMS 24/7)',
      description: 'State-of-the-art 24/7 centralized alarm monitoring center responding instantly to intrusion, panic triggers, and fire alarms with rapid field response.',
      features: ['24/7 intelligent command center operations', 'Rapid Response Team field deployment', 'Direct alarm dispatch to client and nearest police'],
    }
  },
  {
    slug: 'cctv', code: 'SVC-06', icon: 'Video',
    image_url: '/assets/images/services/svc-cctv.jpg',
    tag: '4K AI Surveillance',
    title: 'CCTV & Automasi Keselamatan',
    description: 'Pemasangan, integrasi, dan penyenggaraan sistem kamera litar tertutup (CCTV HD/IP), sistem kawalan akses kad pintar, pengimbas cap jari/biometrik, dan sistem automasi rumah atau bangunan pintar.',
    features: ['Kamera IP resolusi tinggi & penglihatan malam (Night Vision)', 'Pemantauan jarak jauh melalui telefon pintar', 'Sistem kawalan pintu berpagar automasi pintar'],
    en: {
      title: 'CCTV & Security Automation',
      description: 'Supply, installation, and integration of 4K IP security cameras, smart door access control, biometric scanners, and smart building automation.',
      features: ['High-definition 4K night vision cameras', 'Remote surveillance mobile phone accessibility', 'Integrated automated barrier & door access control'],
    }
  },
  {
    slug: 'pi', code: 'SVC-07', icon: 'Search',
    image_url: '/assets/images/services/svc-pi.jpg',
    tag: 'Sulit & Beretika',
    title: 'Penyiasat Persendirian (Private Investigation)',
    description: 'Khidmat penyiasatan korporat dan persendirian secara diskret dan profesional. Menjalankan penyiasatan latar belakang, ketirisan maklumat dalaman syarikat, pemalsuan, dan pengawasan taktikal berlandaskan undang-undang.',
    features: ['Laporan penyiasatan berkomputer & bukti sahih', 'Kerahsiaan maklumat klien dijamin 100%', 'Pegawai penyiasat berpengalaman bekas unit risikan'],
    en: {
      title: 'Private Investigation',
      description: 'Discreet corporate intelligence, employee due diligence, integrity audit, asset leakage investigation, and confidential surveillance adhering to legal frameworks.',
      features: ['Comprehensive fact-based investigative reporting', 'Strict 100% client data confidentiality', 'Seasoned investigators from specialized intelligence units'],
    }
  },
  {
    slug: 'training', code: 'SVC-08', icon: 'GraduationCap',
    image_url: '/assets/images/services/svc-training.jpg',
    tag: 'Latihan & Audit Taktikal',
    title: 'Latihan Taktikal & Keselamatan',
    description: 'Program latihan intensif Certified Security Guard (CSG), pencegahan kebakaran, pertolongan cemas (First Aid / CPR), latihan pengendalian krisis kecemasan dan taklimat kesedaran keselamatan premis.',
    features: ['Modul diiktiraf Kementerian Dalam Negeri (KDN)', 'Jurulatih bertauliah & berpengalaman ketenteraan', 'Pensijilan kompetensi keselamatan anggota'],
    en: {
      title: 'Tactical Training & Security Consultation',
      description: 'Premise risk assessment audits, certified security guard (CSG) training, emergency fire evacuation drills, and firearm handling courses for organizations.',
      features: ['KDN-accredited security training modules', 'Certified veteran trainers with military background', 'Official competency and safety certification'],
    }
  },
]

const FALLBACK_PRODUCTS = [
  {
    id: 'prod-demo-new',
    name: 'Kamera Badan Taktikal AI 4K (Model AFRA-X1)',
    category: 'Pengawasan & CCTV AI',
    filterKey: 'pengawasan',
    image_url: '/assets/images/products/prod-bodycam.jpg',
    description: 'Kamera badan (body-worn camera) taktikal 4K dengan penstriman GPS langsung ke Pusat Kawalan 24 Jam CMS AFRA dan pengecaman pintar AI.',
    specs: ['Resolusi Ultra HD 4K & Penglihatan Malam IR', 'Penjejakan Lokasi GPS Langsung 4G LTE', 'Ketahanan Bateri 14 Jam & Kalis Air IP68'],
    isNew: true,
    en: {
      name: 'Tactical AI 4K Body-Worn Camera (AFRA-X1)',
      category: 'AI Surveillance',
      description: 'Ultra-high-definition 4K body-worn camera with live GPS streaming to AFRA 24/7 CMS Command Center and on-device AI facial recognition.',
      specs: ['Ultra HD 4K & IR Night Vision', 'Live GPS Tracking via 4G LTE', '14-Hour Battery Life & IP68 Waterproof'],
    }
  },
  {
    id: 'prod-1',
    name: 'Walkie-Talkie Taktikal UHF/VHF Jarak Jauh',
    category: 'Komunikasi & Rondaan',
    filterKey: 'komunikasi',
    image_url: '/assets/images/products/prod-walkietalkie.jpg',
    description: 'Transceiver dua hala kalis hentakan IP67 dengan frekuensi tersulit MCMC dan bateri berkapasiti tinggi 48 jam.',
    specs: ['Julat isyarat sehingga 15km', 'Penyulitan audio keselamatan', 'Bateri Li-ion 3800mAh tahan lasak'],
    en: {
      name: 'Long-Range Tactical UHF/VHF Transceiver',
      category: 'Comms & Patrol',
      description: 'Heavy-duty IP67 shockproof two-way radio transceiver with MCMC encrypted frequencies and 48-hour long battery life.',
      specs: ['Up to 15km signal range', 'Secure voice encryption', '3800mAh high endurance Li-ion battery'],
    }
  },
  {
    id: 'prod-2',
    name: 'Pengimbas Log Rondaan Pintar (RFID / QR Guard Tour)',
    category: 'Komunikasi & Rondaan',
    filterKey: 'komunikasi',
    image_url: '/assets/images/products/prod-guardtour.jpg',
    description: 'Peranti log rondaan keselamatan kalis air dengan pengesahan koordinat GPS dan pemindahan data masa nyata.',
    specs: ['Bacaan cip RFID & QR Code pantas', 'Kalis jatuh 2 meter & kalis air IP68', 'Sinkronisasi awan CMS automatik'],
    en: {
      name: 'Smart Guard Tour RFID/QR Patrol Scanner',
      category: 'Comms & Patrol',
      description: 'Waterproof electronic guard tour patrol checkpoint reader with GPS timestamp authentication and cloud sync.',
      specs: ['Instant RFID & QR chip decoding', '2m drop-proof & IP68 waterproof', 'Real-time CMS cloud synchronization'],
    }
  },
  {
    id: 'prod-3',
    name: 'Kamera CCTV IP Dome 4K AI Night Vision',
    category: 'Pengawasan & CCTV AI',
    filterKey: 'pengawasan',
    image_url: '/assets/images/products/prod-cctvdome.jpg',
    description: 'Kamera litar tertutup resolusi 4K dengan sensor pengecaman wajah AI pintar dan penglihatan malam infra-merah 50 meter.',
    specs: ['Resolusi 4K Ultra HD (8 Megapixel)', 'Infrared Night Vision & ColorVu', 'Analisis tingkah laku & zon penceroboh'],
    en: {
      name: '4K AI IP Dome Security Camera with Night Vision',
      category: 'AI Surveillance',
      description: 'Ultra HD 4K dome camera with AI face detection, vehicle classification, and 50-meter smart infrared night vision.',
      specs: ['4K Ultra HD resolution (8MP)', 'Smart IR Night Vision & ColorVu', 'Perimeter breach behavioral analytics'],
    }
  },
  {
    id: 'prod-4',
    name: 'Pengimbas Logam Pegang Tangan Berkepekaan Tinggi',
    category: 'Perlindungan Taktikal',
    filterKey: 'taktikal',
    image_url: '/assets/images/products/prod-metaldetector.jpg',
    description: 'Alat pengesan logam mudah alih untuk pintu masuk premis, dewan persidangan, dan zon berisiko tinggi.',
    specs: ['Pengesanan senjata logam & ferus', 'Mod amaran audio & getaran senyap', 'Sensitiviti boleh dilaraskan'],
    en: {
      name: 'High-Sensitivity Handheld Metal Detector Wand',
      category: 'Tactical Gear',
      description: 'Portable handheld metal detector scanner for building entrances, event venues, and high-security checkpoints.',
      specs: ['Ferrous & non-ferrous weapon detection', 'Audio chime & silent vibration alert', 'Adjustable sensitivity threshold'],
    }
  },
  {
    id: 'prod-5',
    name: 'Kamera Badan Taktikal Pengawal 4K (Body Worn Cam)',
    category: 'Pengawasan & CCTV AI',
    filterKey: 'pengawasan',
    image_url: '/assets/images/products/prod-bodycam.jpg',
    description: 'Kamera badan beresolusi tinggi dengan penanda masa GPS & audio terenkripsi untuk bukti dokumentasi insiden keselamatan.',
    specs: ['Rakaman video HD 1440p / 4K', 'Mod malam IR automatik', 'Storan dalaman selamat anti-usikan'],
    en: {
      name: '4K Tactical Body Worn Security Camera',
      category: 'AI Surveillance',
      description: 'Law-enforcement grade body-worn camera with encrypted audio-video logs and embedded GPS watermark for evidence capture.',
      specs: ['1440p / 4K high-res recording', 'Automatic infrared night mode', 'Tamper-proof internal encrypted storage'],
    }
  },
  {
    id: 'prod-6',
    name: 'Terminal Akses Pintu Biometrik & Cap Jari Pintar',
    category: 'Akses & Biometrik',
    filterKey: 'kawalan',
    image_url: '/assets/images/products/prod-biometric.jpg',
    description: 'Sistem pengesahan kehadiran dan pembuka pintu menggunakan teknologi pengecaman wajah 3D dan imbasan biometrik.',
    specs: ['Pengecaman wajah pantas < 0.2 saat', 'Sokongan Kad Pintar RFID Mifare', 'Integrasi sistem CMS & penggajian'],
    en: {
      name: 'Smart Biometric & Facial Access Terminal',
      category: 'Access & Biometric',
      description: 'High-speed biometric time attendance and electronic door access terminal with 3D facial recognition & RFID card reader.',
      specs: ['Ultra-fast < 0.2s facial recognition', 'Supports Mifare RFID smart card', 'Direct CMS & payroll integration'],
    }
  },
  {
    id: 'prod-7',
    name: 'Vest Taktikal Kalis Tikaman & Peluru (Level IIIA)',
    category: 'Perlindungan Taktikal',
    filterKey: 'taktikal',
    image_url: '/assets/images/products/prod-vest.jpg',
    description: 'Rompi perlindungan taktikal ergonomik pensijilan NIJ standard tinggi untuk anggota kawalan bersenjata dan pengiring CIT.',
    specs: ['Fabrik Aramid / Kevlar gred balistik', 'Reka bentuk ergonomik & ringan', 'Kalis calar & tusukan bilah tajam'],
    en: {
      name: 'Level IIIA Ballistic & Stab-Proof Tactical Vest',
      category: 'Tactical Gear',
      description: 'NIJ Level IIIA certified lightweight body armor vest designed for armed guards, CIT escorts, and tactical security details.',
      specs: ['Aramid / Kevlar ballistic fiber', 'Ergonomic breathable lightweight fit', 'Multi-threat stab & bullet resistance'],
    }
  },
  {
    id: 'prod-8',
    name: 'Hab Sistem Penggera Pintar Tanpa Wayar (CMS Linked)',
    category: 'Akses & Biometrik',
    filterKey: 'kawalan',
    image_url: '/assets/images/products/prod-alarmhub.jpg',
    description: 'Pusat kawalan penggera pencerobohan tanpa wayar yang disambung terus ke Bilik Kawalan 24 Jam AFRA CMS.',
    specs: ['Sambungan dwi-jalur 4G LTE & Wi-Fi', 'Sensor magnetik pintu & tingkap', 'Respon penggera siren serta-merta'],
    en: {
      name: 'Wireless Smart Intrusion Alarm Hub (CMS Linked)',
      category: 'Access & Biometric',
      description: 'Wireless smart security intrusion hub connected 24/7 directly to the AFRA Central Monitoring System command station.',
      specs: ['Dual-band 4G LTE & Wi-Fi uplink', 'Magnetic door & window sensors', 'Instant siren trigger & CMS alert'],
    }
  }
]

export default function Catalog() {
  const { lang, t } = useLang()
  const [services, setServices] = useState(FALLBACK_SERVICES)
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [activeFilter, setActiveFilter] = useState('all')
  const [settings, setSettings] = useState({})

  useEffect(() => {
    async function loadAll() {
      try {
        const [prodRes, svcRes, s] = await Promise.all([
          supabase.from('products').select('*, categories(name)').eq('is_active', true).order('sort_order'),
          supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
          fetchSettings(supabase),
        ])
        
        // Merge Supabase services if available
        if (svcRes.data && svcRes.data.length > 0) {
          const mergedServices = svcRes.data.map(dbSvc => {
            const fallback = FALLBACK_SERVICES.find(f => f.slug === dbSvc.slug) || {}
            return {
              ...fallback,
              ...dbSvc,
              image_url: dbSvc.image_url || DEFAULT_SERVICE_IMAGES[dbSvc.slug] || fallback.image_url || '/assets/images/services/svc-static.jpg',
              tag: dbSvc.tag || DEFAULT_SERVICE_TAGS[dbSvc.slug] || fallback.tag || 'Pematuhan KDN & PDRM',
            }
          })
          setServices(mergedServices)
        }

        // Merge Supabase products if available
        if (prodRes.data && prodRes.data.length > 0) {
          const mappedProducts = prodRes.data.map(dbProd => {
            const catName = dbProd.categories?.name || dbProd.category || 'Peralatan Keselamatan'
            const lower = catName.toLowerCase()
            let filterKey = 'all'
            if (lower.includes('komunikasi') || lower.includes('rondaan')) filterKey = 'komunikasi'
            else if (lower.includes('cctv') || lower.includes('automasi') || lower.includes('pengawasan')) filterKey = 'pengawasan'
            else if (lower.includes('biometrik') || lower.includes('akses') || lower.includes('cms')) filterKey = 'kawalan'
            else if (lower.includes('statik') || lower.includes('bersenjata') || lower.includes('taktikal') || lower.includes('cit') || lower.includes('pengawal') || lower.includes('vip')) filterKey = 'taktikal'

            return {
              id: dbProd.id,
              name: dbProd.name,
              category: catName,
              filterKey,
              image_url: dbProd.image_url || '/assets/images/products/prod-cctvdome.jpg',
              description: dbProd.description || '',
              specs: dbProd.specifications 
                ? (Array.isArray(dbProd.specifications) ? dbProd.specifications : String(dbProd.specifications).split('\n').filter(Boolean)) 
                : (dbProd.specs || ['Peralatan berstandard KDN & PDRM', 'Waranti sokongan teknikal penuh']),
              en: dbProd.en,
              is_new: true,
            }
          })
          
          // Prepend newly added database products to default products
          const existingIds = new Set(mappedProducts.map(p => p.id))
          const remainingFallbacks = FALLBACK_PRODUCTS.filter(p => !existingIds.has(p.id))
          setProducts([...mappedProducts, ...remainingFallbacks])
        }

        setSettings(s)
      } catch (err) {
        console.warn('Could not load catalog data:', err)
      }
    }
    loadAll()
  }, [])

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => {
        if (p.filterKey === activeFilter) return true
        const cat = (p.category || '').toLowerCase()
        if (activeFilter === 'komunikasi') return cat.includes('komunikasi') || cat.includes('rondaan')
        if (activeFilter === 'pengawasan') return cat.includes('pengawasan') || cat.includes('cctv') || cat.includes('automasi')
        if (activeFilter === 'kawalan') return cat.includes('kawalan') || cat.includes('akses') || cat.includes('biometrik') || cat.includes('cms')
        if (activeFilter === 'taktikal') return cat.includes('taktikal') || cat.includes('statik') || cat.includes('bersenjata') || cat.includes('cit') || cat.includes('pengawal')
        return false
      })

  return (
    <>
      {/* ── PAGE HEADER (CMS: Site Settings) ── */}
      <div className="page-header-banner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="page-header-tag">
            <ShieldCheck size={14} />
            <span>{S(settings, 'page_services_tag', lang) || (lang === 'en' ? 'Security Guarding Service Portfolio' : 'Portfolio Perkhidmatan Kawalan')}</span>
          </div>
          <h1 className="page-header-title">{S(settings, 'page_services_title', lang) || (lang === 'en' ? 'SERVICES & CATALOGUE' : 'PERKHIDMATAN & KATALOG')}</h1>
          <p className="page-header-desc">
            {S(settings, 'page_services_desc', lang) || (lang === 'en' ? 'AFRA Services Sdn. Bhd. provides comprehensive security specialisations in strict compliance with Ministry of Home Affairs (KDN) and Royal Malaysia Police (PDRM) guidelines.' : 'AFRA Services Sdn. Bhd. menyediakan pengkhususan perkhidmatan keselamatan menyeluruh yang mematuhi garis panduan ketat Kementerian Dalam Negeri (KDN) dan Polis Diraja Malaysia (PDRM).')}
          </p>
        </div>
      </div>

      {/* ── 8 CORE SERVICES SECTION (CMS: Services) ── */}
      <section className="services-detail-section">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-tagline">{services.length} {cleanTitle(S(settings, 'catalog_core_tag', lang), lang === 'en' ? 'CORE SPECIALISATIONS' : 'PENGKHUSUSAN UTAMA')}</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, color: 'var(--text-heading)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
              {S(settings, 'catalog_core_title', lang) || (lang === 'en' ? 'Licensed Operations Services' : 'Perkhidmatan Operasi Berlesen')}
            </h2>
          </div>

          <div className="service-detail-grid">
            {services.map(s => {
              const Icon = getServiceIcon(s.icon)
              const features = L(s, lang, 'features') ?? []
              const svcTitle = L(s, lang, 'title') || s.title
              const svcDesc = L(s, lang, 'description') || s.description
              const imageUrl = s.image_url || DEFAULT_SERVICE_IMAGES[s.slug] || '/assets/images/services/svc-static.jpg'
              const tagText = L(s, lang, 'tag') || s.tag || (lang === 'en' ? (DEFAULT_SERVICE_TAGS_EN[s.slug] || 'Official KDN Compliance') : (DEFAULT_SERVICE_TAGS[s.slug] || 'Pematuhan Rasmi KDN'))

              return (
                <div key={s.id ?? s.slug} className="service-detail-card" id={s.slug}>
                  <div className="service-card-media">
                    <img src={imageUrl} alt={svcTitle} loading="lazy" />
                    <div className="service-card-media-overlay">
                      <span className="service-code-badge">{s.code || 'SVC'}</span>
                      <span className="service-kdn-tag">
                        <ShieldCheck size={13} />
                        {tagText}
                      </span>
                    </div>
                  </div>

                  <div className="service-card-content">
                    <div>
                      <div className="service-header-inline">
                        <div className="service-icon-box">
                          <Icon size={22} />
                        </div>
                        <h2 className="service-card-heading">{svcTitle}</h2>
                      </div>
                      <p className="service-card-desc">{svcDesc}</p>
                      {features.length > 0 && (
                        <ul className="service-card-features">
                          {features.map((f, idx) => (
                            <li key={idx}>
                              <CheckCircle2 size={16} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Link
                      to={`/contact?service=${encodeURIComponent(svcTitle ?? '')}`}
                      className="service-card-action"
                    >
                      <span>{S(settings, 'catalog_cta_detail', lang) || (lang === 'en' ? 'Request Quote for this Service' : 'Minta Sebutharga Perkhidmatan Ini')}</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── DYNAMIC PRODUCTS & EQUIPMENT CATALOG SECTION ── */}
      <section id="productsCatalogSection" style={{ paddingBottom: '5rem', borderTop: '1px solid var(--border)', paddingTop: '4.5rem', background: 'var(--bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--blue-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              <ShieldCheck size={14} />
              <span>{lang === 'en' ? 'High-Grade Security Products & Assets' : 'PRODUK & PERALATAN KESELAMATAN BERGRED TINGGI'}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', fontWeight: 900, color: 'var(--text-heading)', marginTop: '0.35rem', textTransform: 'uppercase' }}>
              {lang === 'en' ? 'Product & Equipment Catalog' : 'KATALOG PRODUK & PERALATAN'}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '46rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              {lang === 'en'
                ? 'Tactical communication gear, intelligent 4K AI surveillance, biometric access control, and tested security protective assets.'
                : 'Peralatan komunikasi taktikal, sistem pengawasan pintar 4K AI, alat kawalan akses biometrik, dan kelengkapan perlindungan anggota yang diuji untuk ketahanan operasi keselamatan.'}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="catalog-filter-bar">
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <Grid size={14} />
              <span>{lang === 'en' ? `All Products (${products.length})` : `Semua Produk (${products.length})`}</span>
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'komunikasi' ? 'active' : ''}`}
              onClick={() => setActiveFilter('komunikasi')}
            >
              <Radio size={14} />
              <span>{lang === 'en' ? 'Comms & Patrol' : 'Komunikasi & Rondaan'}</span>
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'pengawasan' ? 'active' : ''}`}
              onClick={() => setActiveFilter('pengawasan')}
            >
              <Camera size={14} />
              <span>{lang === 'en' ? 'AI Surveillance' : 'Pengawasan & CCTV AI'}</span>
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'kawalan' ? 'active' : ''}`}
              onClick={() => setActiveFilter('kawalan')}
            >
              <Fingerprint size={14} />
              <span>{lang === 'en' ? 'Access & Biometrics' : 'Akses & Biometrik'}</span>
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'taktikal' ? 'active' : ''}`}
              onClick={() => setActiveFilter('taktikal')}
            >
              <Shield size={14} />
              <span>{lang === 'en' ? 'Tactical Gear' : 'Perlindungan Taktikal'}</span>
            </button>
          </div>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))', gap: '1.75rem' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', background: '#ffffff', border: '1px dashed var(--border)', borderRadius: '0.75rem' }}>
                <PackageX size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
                <p style={{ fontWeight: 700 }}>{lang === 'en' ? 'No products found for this category.' : 'Tiada produk dijumpai bagi kategori ini.'}</p>
              </div>
            ) : (
              filteredProducts.map(p => {
                const pName = L(p, lang, 'name') || p.name
                const pDesc = L(p, lang, 'description') || p.description
                const pCategory = L(p, lang, 'category') || p.category || p.categories?.name || (lang === 'en' ? 'Security Equipment' : 'Peralatan Keselamatan')
                const pSpecs = (lang === 'en' && p.en?.specs) ? p.en.specs : (p.specs ?? [])

                return (
                  <div key={p.id} className="product-card">
                    <div className="product-card-media">
                      <img src={p.image_url || '/assets/images/products/prod-cctvdome.jpg'} alt={pName} loading="lazy" />
                      <span className="product-category-tag">{pCategory}</span>
                      {(p.is_new || p.isNew) && (
                        <span style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: '#16a34a',
                          color: '#ffffff',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          letterSpacing: '0.05em',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                          textTransform: 'uppercase'
                        }}>
                          {lang === 'en' ? 'NEW PRODUCT' : 'BARU DITAMBAH'}
                        </span>
                      )}
                    </div>
                    <div className="product-card-body">
                      <div>
                        <h3 className="product-title">{pName}</h3>
                        <p className="product-desc">{pDesc}</p>
                        {pSpecs.length > 0 && (
                          <div className="product-specs">
                            {pSpecs.map((spec, sIdx) => (
                              <div key={sIdx} className="product-spec-item">
                                <Check size={14} />
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/contact?product=${encodeURIComponent(pName ?? '')}`}
                        className="product-btn-quote"
                      >
                        <FileText size={14} />
                        <span>{lang === 'en' ? 'Request Quote' : 'Minta Sebutharga'}</span>
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>
      </section>

      {/* ── CLOSING CTA BANNER ── */}
      <section style={{ paddingBottom: '5.5rem', paddingTop: '2.5rem' }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="hero-cta-box">
            <div>
              <span className="section-tagline" style={{ color: '#38bdf8' }}>
                {S(settings, 'catalog_cta_tag', lang) || (lang === 'en' ? 'FREE CONSULTATION & QUOTATION' : 'KONSULTASI & SEBUTHARGA PERCUMA')}
              </span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 900, color: '#ffffff', marginTop: '0.5rem', lineHeight: 1.25 }}>
                {S(settings, 'catalog_cta_heading', lang) || (lang === 'en' ? 'Need a Tailored Security Solution for Your Premise?' : 'Perlukan Penyelesaian Keselamatan Tersuai untuk Premis Anda?')}
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.65, marginTop: '0.75rem', maxWidth: '42rem' }}>
                {S(settings, 'catalog_cta_sub', lang) || (lang === 'en' ? 'AFRA Services operations team is ready to structure physical guarding, armed patrols, CIT transit, or 24/7 CMS system integration anywhere across Malaysia.' : 'Pasukan operasi keselamatan AFRA Services sedia membantu merangka pelan penugasan kawalan fizikal, rondaan bersenjata, pengiring CIT, atau integrasi sistem CMS 24/7 di seluruh Malaysia.')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link to="/contact" className="btn-solid-blue" style={{ background: '#38bdf8', color: '#0f172a' }}>
                <FileText size={15} />
                <span>{lang === 'en' ? 'Request Quote Now' : 'MINTA SEBUTHARGA SEGERA'}</span>
              </Link>
              <a href="tel:096226678" className="btn-outline-navy" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff', background: 'transparent' }}>
                <span>{lang === 'en' ? 'Call HQ Desk' : 'HUBUNGI IBU PEJABAT'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
