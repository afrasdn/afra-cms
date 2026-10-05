-- ============================================================
-- AFRA CMS — Full CMS Upgrade (002)
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- Menjadikan Home / About / Services / Certificates / Contact
-- semuanya boleh diurus dari dashboard.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. SERVICES (8 servis utama — Catalog + Home overview)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'Shield',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS on_services_updated ON public.services;
CREATE TRIGGER on_services_updated BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_services" ON public.services;
CREATE POLICY "public_read_services" ON public.services
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_services" ON public.services;
CREATE POLICY "admin_write_services" ON public.services
  FOR ALL USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(sort_order);

-- ============================================================
-- 2. BRANCHES (13 cawangan — Home + Certificates directory)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT,
  is_hq BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS on_branches_updated ON public.branches;
CREATE TRIGGER on_branches_updated BEFORE UPDATE ON public.branches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_branches" ON public.branches;
CREATE POLICY "public_read_branches" ON public.branches
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_branches" ON public.branches;
CREATE POLICY "admin_write_branches" ON public.branches
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 3. LEADERS (barisan kepimpinan — About Us)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS on_leaders_updated ON public.leaders;
CREATE TRIGGER on_leaders_updated BEFORE UPDATE ON public.leaders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_leaders" ON public.leaders;
CREATE POLICY "public_read_leaders" ON public.leaders
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_leaders" ON public.leaders;
CREATE POLICY "admin_write_leaders" ON public.leaders
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 4. OBJECTIVES (objektif penubuhan — About Us)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS on_objectives_updated ON public.objectives;
CREATE TRIGGER on_objectives_updated BEFORE UPDATE ON public.objectives
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_objectives" ON public.objectives;
CREATE POLICY "public_read_objectives" ON public.objectives
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_objectives" ON public.objectives;
CREATE POLICY "admin_write_objectives" ON public.objectives
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 5. METRICS (strip statistik — Home: 13+, RM5M, 2009, 100%)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value TEXT NOT NULL,
  suffix TEXT,
  label TEXT NOT NULL,
  sub TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS on_metrics_updated ON public.metrics;
CREATE TRIGGER on_metrics_updated BEFORE UPDATE ON public.metrics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_metrics" ON public.metrics;
CREATE POLICY "public_read_metrics" ON public.metrics
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_metrics" ON public.metrics;
CREATE POLICY "admin_write_metrics" ON public.metrics
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 6. ACCREDITATIONS (brand badges — Home: KDN, PDRM, PPKKM...)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.accreditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS on_accreditations_updated ON public.accreditations;
CREATE TRIGGER on_accreditations_updated BEFORE UPDATE ON public.accreditations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.accreditations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_accreditations" ON public.accreditations;
CREATE POLICY "public_read_accreditations" ON public.accreditations
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_accreditations" ON public.accreditations;
CREATE POLICY "admin_write_accreditations" ON public.accreditations
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 7. SITE SETTINGS (key-value: info syarikat, contact, visi/misi,
--    header setiap public page)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
CREATE POLICY "public_read_site_settings" ON public.site_settings
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_write_site_settings" ON public.site_settings;
CREATE POLICY "admin_write_site_settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 8. CERTIFICATES — tambah lajur untuk 6 sijil utama
-- ============================================================
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS authority TEXT,
  ADD COLUMN IF NOT EXISTS license_no TEXT,
  ADD COLUMN IF NOT EXISTS badge_text TEXT;

-- ============================================================
-- SEEDS — SERVICES (8 servis utama dari hardcoded Catalog.jsx)
-- ============================================================
INSERT INTO public.services (slug, code, title, description, icon, features, sort_order) VALUES
  ('static', 'SVC-01', 'Khidmat Kawalan Statik',
   'Perkhidmatan kawalan keselamatan fizikal 24/7 di premis perniagaan, kompleks membeli-belah, hospital, tapak pembinaan, perumahan dan premis kerajaan. Dilengkapi dengan rondaan berkala dan buku log digital.',
   'Shield',
   '["Pengawal keselamatan terlatih berdisiplin tinggi", "Sistem rondaan berkala (Watchman Clock / QR Patrolling)", "Pemeriksaan keluar-masuk kenderaan & pelawat"]', 1),
  ('armed', 'SVC-02', 'Khidmat Kawalan Bersenjata',
   'Perlindungan bersenjata api (Pistol dan Shotgun) berlesen rasmi oleh IPD PDRM. Dikhaskan bagi institusi kewangan, kedai emas, kilang bernilai tinggi, dan premis yang memerlukan pencegahan taktikal.',
   'Crosshair',
   '["Pengawal lulus ujian menembak & lesen senjata PDRM", "Pengendalian senjata selamat (Safe Armory Handling)", "Perlindungan berisiko tinggi (High-Risk Deterrence)"]', 2),
  ('cit', 'SVC-03', 'Cash-In-Transit (C.I.T)',
   'Pengangkutan wang tunai, jongkong emas, surat berharga, dan barangan bernilai tinggi menggunakan van perisai kalis peluru (Armoured Vehicles) yang dilengkapi sistem keselamatan kunci berganda dan penjejakan satelit GPS masa nyata.',
   'Truck',
   '["Kenderaan perisai kalis peluru berpiawaian tinggi", "Penjejakan GPS & komunikasi radio berpusat", "Dilindungi perlindungan insurans komprehensif Lonpac"]', 3),
  ('bodyguard', 'SVC-04', 'Khidmat Pengawal Peribadi (Bodyguard)',
   'Perlindungan eksekutif rapat (Close Protection) untuk orang kenamaan (VVIP/VIP), diplomat, ekspatriat, dan eksekutif korporat. Terlatih dalam pertahanan tanpa senjata, pemanduan defensif, dan penilaian ancaman awal.',
   'UserCheck',
   '["Personel berpengalaman & penampilan profesional", "Pemanduan defensif & perancangan laluan selamat", "Kerahsiaan tinggi (Strict NDA & Confidentiality)"]', 4),
  ('cms', 'SVC-05', 'Central Monitoring System (CMS)',
   'Pusat kawalan keselamatan berpusat beroperasi 24 jam sehari, 7 hari seminggu. Menerima isyarat penggera automatik pencerobohan, kebakaran, atau kecemasan perubatan, disusuli tindakan pantas Unit Respon Kecemasan.',
   'Activity',
   '["Pemantauan 24/7 bilik kawalan pintar", "Unit Respon Pantas (Rapid Response Team) ke lokasi", "Notifikasi serta-merta ke pemilik & balai polis terdekat"]', 5),
  ('cctv', 'SVC-06', 'CCTV & Automasi Keselamatan',
   'Pemasangan, integrasi, dan penyenggaraan sistem kamera litar tertutup (CCTV HD/IP), sistem kawalan akses kad pintar, pengimbas cap jari/biometrik, dan sistem automasi rumah atau bangunan pintar.',
   'Video',
   '["Kamera IP resolusi tinggi & penglihatan malam (Night Vision)", "Pemantauan jarak jauh melalui telefon pintar", "Sistem kawalan pintu berpagar automasi pintar"]', 6),
  ('pi', 'SVC-07', 'Penyiasat Persendirian (Private Investigation)',
   'Khidmat penyiasatan korporat dan persendirian secara diskret dan profesional. Menjalankan penyiasatan latar belakang, ketirisan maklumat dalaman syarikat, pemalsuan, dan pengawasan taktikal berlandaskan undang-undang.',
   'Search',
   '["Laporan penyiasatan berkomputer & bukti sahih", "Kerahsiaan maklumat klien dijamin 100%", "Pegawai penyiasat berpengalaman bekas unit risikan"]', 7),
  ('training', 'SVC-08', 'Latihan Taktikal & Keselamatan',
   'Program latihan intensif Certified Security Guard (CSG), pencegahan kebakaran, pertolongan cemas (First Aid / CPR), latihan pengendalian krisis kecemasan dan taklimat kesedaran keselamatan premis.',
   'GraduationCap',
   '["Modul diiktiraf Kementerian Dalam Negeri (KDN)", "Jurulatih bertauliah & berpengalaman ketenteraan", "Pensijilan kompetensi keselamatan anggota"]', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEEDS — BRANCHES (13 cawangan dari hardcoded Certificates.jsx)
-- ============================================================
INSERT INTO public.branches (state, address, contact, is_hq, sort_order) VALUES
  ('TERENGGANU (HQ)', 'Lot PT 1914 Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.', 'Tel: 09-6226678 / Faks: 09-6264788', true, 1),
  ('KUALA LUMPUR', 'No. 5-6-2 Jalan 3/50, Diamond Square, Off Jalan Gombak, 53000 Kuala Lumpur.', 'Tel: 03-40216678', false, 2),
  ('PAHANG', '1st Floor, B2 Lorong Permatang Badak Perdana 102, 25150 Kuantan, Pahang.', 'Tel: 09-5367888', false, 3),
  ('KELANTAN', 'PT 3072-T2 Kg Jalan Banggol Kerian Bandar Baru, 16800 Pasir Puteh, Kelantan.', 'Tel: 09-7864455', false, 4),
  ('JOHOR', 'No 7 Jalan Mida 5, Taman Mida, 85000 Segamat, Johor.', 'Tel: 07-9315566', false, 5),
  ('PULAU PINANG', '10-G, Bertam Walk, Jalan Dagangan 16, Pusat Bandar Bertam Perdana, 13200 Kepala Batas.', 'Tel: 04-5758899', false, 6),
  ('PERAK', 'No. 1A, Hala Taman Tambun Jaya 1, Taman Tambun Jaya, 31400 Tambun, Ipoh Perak.', 'Tel: 05-5452233', false, 7),
  ('NEGERI SEMBILAN', 'No. 23 Tingkat Atas, Jalan Dato’ Abdullah, Kuala Kelawang, 71600 Jelebu.', 'Tel: 06-6136677', false, 8),
  ('MELAKA', 'No. 45-1, Jalan TU 42, Taman Tasik Utama, Ayer Keroh, 75450 Melaka.', 'Tel: 06-2321188', false, 9),
  ('SELANGOR', 'No. 18-2, Jalan Elektron U16/E, Denai Alam, 40160 Shah Alam, Selangor.', 'Tel: 03-78319988', false, 10),
  ('KEDAH & PERLIS', 'No. 56, Kompleks Perniagaan Utama, Jalan Sultanah Sambungan, 05350 Alor Setar, Kedah.', 'Tel: 04-7332211', false, 11),
  ('SABAH', 'Lot 28, 2nd Floor, Central Shopping Plaza, Jalan Banjaran, 88200 Kota Kinabalu, Sabah.', 'Tel: 088-212345', false, 12),
  ('SARAWAK', 'Sublot 12, 1st Floor, Jalan Bulatan-Piasau, 98000 Miri, Sarawak.', 'Tel: 085-412233', false, 13);

-- ============================================================
-- SEEDS — LEADERS (dari hardcoded About.jsx)
-- ============================================================
INSERT INTO public.leaders (name, role, sort_order) VALUES
  ('Dato'' Seri Zakaria bin Abdul Razak', 'Pengarah Urusan', 1),
  ('Fariha Nur Iylia binti Mohamad Yasin', 'Pengarah', 2);

-- ============================================================
-- SEEDS — OBJECTIVES (5 objektif dari About.jsx)
-- ============================================================
INSERT INTO public.objectives (title, description, sort_order) VALUES
  ('Mewujudkan Peluang Pekerjaan', 'Memberi keutamaan pekerjaan kepada bekas-bekas anggota Pasukan Keselamatan negara dalam bidang keselamatan profesional.', 1),
  ('Membantu Pihak Berkuasa & Polis', 'Membantu pihak Polis Diraja Malaysia (PDRM) dalam mengurangkan kadar jenayah harta benda melalui kawalan pencegahan berkesan.', 2),
  ('Perlindungan Menyeluruh', 'Memberi perlindungan keselamatan optimum terhadap harta benda, premis perniagaan, dan nyawa setiap individu.', 3),
  ('Latihan & Kesedaran Keselamatan', 'Melatih, memberi pengetahuan berterusan serta menanam semangat kesedaran keselamatan yang dinamik.', 4),
  ('Teknologi & Piawaian Terkini', 'Mengintegrasikan sistem automasi keselamatan pintar dan kawalan rondaan berkomputer selari dengan keperluan era digital.', 5);

-- ============================================================
-- SEEDS — METRICS (4 kad statistik Home)
-- ============================================================
INSERT INTO public.metrics (value, suffix, label, sub, sort_order) VALUES
  ('13', '+', 'Cawangan Negeri', 'Liputan Operasi Seluruh Malaysia Termasuk Sabah & Sarawak', 1),
  ('RM5M', '', 'Modal Berbayar', 'Kekuatan Kewangan Penuh Didaftarkan di Bawah SSM', 2),
  ('2009', '', 'Ditubuhkan', '15+ Tahun Reputasi Kawalan Berdisiplin & Dipercayai', 3),
  ('100', '%', 'Berlesen & Patuh', 'KDN, PDRM, Ahli PPKKM & Pengiktirafan Bersijil ISO', 4);

-- ============================================================
-- SEEDS — ACCREDITATIONS (6 badge Home)
-- ============================================================
INSERT INTO public.accreditations (code, name, sort_order) VALUES
  ('KDN', 'Kementerian Dalam Negeri', 1),
  ('PDRM', 'Polis Diraja Malaysia', 2),
  ('PPKKM', 'Persatuan Keselamatan', 3),
  ('MOF', 'Kementerian Kewangan', 4),
  ('ISO 9001', 'Quality Certified', 5),
  ('LONPAC', 'Insurans Komprehensif', 6);

-- ============================================================
-- SEEDS — CERTIFICATES (6 sijil utama dari hardcoded)
-- ============================================================
INSERT INTO public.certificates (title, issuing_body, authority, license_no, badge_text, description, sort_order) VALUES
  ('Lesen Agensi Persendirian (Seksyen 2(a) & 2(b))', 'KEMENTERIAN DALAM NEGERI (KDN)', 'KEMENTERIAN DALAM NEGERI (KDN)', 'KDN.S.205/642/1-4', 'AKTIF & SAH',
   'Dilesenkan secara sah di bawah Akta Agensi Persendirian 1971 bagi menjalankan urusan perniagaan kawalan keselamatan dan siasatan persendirian di seluruh Malaysia.', 1),
  ('Permit & Kuasa Membawa Senjata Api', 'POLIS DIRAJA MALAYSIA (PDRM)', 'POLIS DIRAJA MALAYSIA (PDRM)', 'IPD / Cawangan Pelesenan Senjata', 'BERTAULIAH',
   'Kebenaran rasmi pemilikan dan penggunaan senjata api (Pistol dan Shotgun) untuk kawalan statik bersenjata, van kalis peluru CIT, dan perlindungan orang kenamaan.', 2),
  ('Keahlian Rasmi Persatuan Kawalan Keselamatan', 'PERSATUAN INDUSTRI KESELAMATAN (PPKKM)', 'PERSATUAN INDUSTRI KESELAMATAN (PPKKM)', 'No. Keahlian: PPKKM/09/0412', 'AHLI SAH',
   'Ahli berdaftar Persatuan Perkhidmatan Kawalan Keselamatan Malaysia yang mematuhi standard piawaian etika, kebajikan pengawal dan kadar gaji minimum.', 3),
  ('Sijil Akuan Pendaftaran Syarikat Bumiputera', 'KEMENTERIAN KEWANGAN MALAYSIA (MOF)', 'KEMENTERIAN KEWANGAN MALAYSIA (MOF)', 'No. Rujukan: 357-02154823', 'BUMIPUTERA',
   'Pendaftaran sah taraf Bumiputera untuk menyertai perolehan kerajaan persekutuan, jabatan kementerian, badan berkanun, dan institusi pengajian tinggi awam.', 4),
  ('Sistem Pengurusan Kualiti Kawalan Keselamatan', 'ISO 9001:2015 QUALITY MANAGEMENT', 'ISO 9001:2015 QUALITY MANAGEMENT', 'Sijil Piawaian Kualiti Antarabangsa', 'ISO CERTIFIED',
   'Pensijilan kualiti antarabangsa bagi pengurusan operasi kawalan keselamatan, rondaan, pemantauan pusat kawalan CMS, dan pengurusan sumber manusia berdisiplin.', 5),
  ('Insurans Liabiliti Awam & Wang Dalam Perjalanan', 'LONPAC INSURANCE BERHAD', 'LONPAC INSURANCE BERHAD', 'Polisi Perlindungan Komprehensif', 'DILINDUNGI',
   'Perlindungan insurans liabiliti awam (Public Liability), Cash-In-Transit, dan Fideliti (Fidelity Guarantee) sehingga jutaan ringgit bagi melindungi aset pelanggan.', 6);

-- ============================================================
-- SEEDS — SITE SETTINGS (info syarikat, contact, visi/misi, headers)
-- ============================================================
INSERT INTO public.site_settings (key, value) VALUES
  ('company_name', 'AFRA Services Sdn. Bhd.'),
  ('company_reg_no', '881616-V'),
  ('established_date', '7 Disember 2009'),
  ('authorized_capital', 'RM 5,000,000.00'),
  ('paid_capital', 'RM 5,000,000.00'),
  ('bank', 'Public Islamic Bank Berhad (Kuala Terengganu)'),
  ('insurer', 'Lonpac Insurance Berhad'),
  ('secretary', 'Zuki & Rashid Tax Accountants'),
  ('auditor', 'ZRA Consultant Sdn. Bhd.'),
  ('hq_address', 'LOT PT 1914, Tingkat 1A, Bukit Besar, 21100 Kuala Terengganu, Terengganu.'),
  ('hq_phone', '09-6226678'),
  ('hq_fax', '09-6264788'),
  ('admin_email', 'admin@afra.com'),
  ('vision', 'Menjadi salah satu Syarikat Perkhidmatan Kawalan Keselamatan yang kukuh dan berdaya saing di Malaysia di mana kepercayaan dan keperimanusiaan menjadi keutamaan kami.'),
  ('mission', 'Sentiasa memberi dan menambah mutu perkhidmatan bagi memastikan harta benda dan nyawa pelanggan sentiasa berada dalam keadaan selamat dan terpelihara.'),
  ('about_narrative_1', 'AFRA Services Sdn. Bhd. ditubuhkan dengan matlamat utama untuk menyediakan perkhidmatan kawalan keselamatan bertaraf tinggi kepada sektor swasta, perbankan, perindustrian, dan agensi kerajaan di seluruh Malaysia.'),
  ('about_narrative_2', 'Tenaga kerja dan anggota kami sebahagian besarnya terdiri daripada bekas anggota Pasukan Keselamatan negara (Polis & Angkatan Tentera) yang menerapkan disiplin ketenteraan, ketelitian operasi, dan integriti yang tinggi dalam setiap penugasan.'),
  ('page_about_title', 'TENTANG AFRA SERVICES'),
  ('page_about_desc', 'Ditubuhkan pada 7 Disember 2009, AFRA Services Sdn. Bhd. (881616-V) telah berkembang menjadi sebuah organisasi kawalan keselamatan berwibawa dengan 13 cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak.'),
  ('page_services_title', 'PERKHIDMATAN & KATALOG'),
  ('page_services_desc', 'AFRA Services Sdn. Bhd. menyediakan pengkhususan perkhidmatan keselamatan menyeluruh yang mematuhi garis panduan ketat Kementerian Dalam Negeri (KDN) dan Polis Diraja Malaysia (PDRM).'),
  ('page_certs_title', 'SIJIL & PELESENAN RASMI'),
  ('page_certs_desc', 'AFRA Services Sdn. Bhd. beroperasi dengan kelulusan penuh Kementerian Dalam Negeri (KDN), Polis Diraja Malaysia (PDRM), Kementerian Kewangan (MOF) dan pematuhan pensijilan ISO.'),
  ('page_contact_title', 'HUBUNGI KAMI & SEBUTHARGA'),
  ('page_contact_desc', 'Sila lengkapkan borang di bawah untuk mendapatkan sebutharga rasmi bagi perkhidmatan kawalan keselamatan di premis anda, atau hubungi bilik gerakan kami.')
ON CONFLICT (key) DO NOTHING;
