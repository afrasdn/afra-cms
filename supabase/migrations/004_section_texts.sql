-- ============================================================
-- AFRA CMS — Section Texts / Labels (004)
-- Run this in Supabase SQL Editor AFTER 003_footer_settings.sql
-- Menjadikan SEMUA tajuk seksyen & label di setiap public page
-- boleh diurus dari dashboard.
-- Nota: {n} dalam tajuk akan diganti automatik dengan bilangan item.
-- ============================================================

INSERT INTO public.site_settings (key, value) VALUES
  -- ── HOME: hero badge ──
  ('hero_badge', 'Lesen Keselamatan KDN & PDRM Berdaftar (881616-V)'),

  -- ── HOME: seksyen Services & Solutions ──
  ('home_svc_tagline', 'OUR COMPREHENSIVE'),
  ('home_svc_title', 'SERVICES & SOLUTIONS'),
  ('home_svc_desc', 'Kami merangkumi kitaran penuh operasi keselamatan dan pertahanan taktikal, daripada kawalan fizikal berskala besar sehingga pengiring bersenjata.'),

  -- ── HOME: seksyen Cawangan ──
  ('home_branch_tagline', 'RANGKAIAN OPERASI KEBANGSAAN'),
  ('home_branch_title', 'CAWANGAN SELURUH MALAYSIA'),
  ('home_branch_desc', 'Beroperasi dengan Ibu Pejabat di Kuala Terengganu dan cawangan strategik di seluruh Semenanjung, Sabah, dan Sarawak untuk memastikan kesiapsiagaan pantas.'),

  -- ── HOME: seksyen Akreditasi ──
  ('home_brands_tagline', 'Pengiktirafan Rasmi & Badan Kawal Selia'),
  ('home_brands_sub', 'Piawaian Pematuhan Pertahanan & Keselamatan Malaysia'),

  -- ── ABOUT: tag & label ──
  ('page_about_tag', 'Profil Korporat Syarikat'),
  ('about_info_title', 'MAKLUMAT RASMI SYARIKAT'),
  ('about_narrative_heading', 'Siapa Kami'),
  ('about_vision_label', 'Visi Syarikat'),
  ('about_mission_label', 'Misi Syarikat'),
  ('about_objectives_heading', 'Objektif Penubuhan'),
  ('about_pdf_button', 'MUAT TURUN PROFIL LENGKAP (PDF)'),

  -- ── CATALOG: tag & seksyen ──
  ('page_services_tag', 'Portfolio Perkhidmatan Kawalan'),
  ('catalog_extra_tag', 'PAKEJ KHAS & TAWARAN'),
  ('catalog_extra_title', 'Pakej Perkhidmatan Tambahan'),
  ('catalog_core_tag', 'PENGKHUSUSAN UTAMA'),
  ('catalog_core_title', 'Perkhidmatan Operasi Berlesen'),
  ('catalog_cta_main', 'MINTA SEBUTHARGA'),
  ('catalog_cta_detail', 'MINTA SEBUTHARGA BAGI PERKHIDMATAN INI'),

  -- ── CERTIFICATES: tag & seksyen ──
  ('page_certs_tag', 'Pelesenan & Pematuhan Undang-Undang'),
  ('certs_grid_tag', 'AKREDITASI & PENGIKTIRAFAN'),
  ('certs_grid_title', 'Lesen Operasi Berkanun'),
  ('certs_branch_tag', 'LIPUTAN KEBANGSAAN'),
  ('certs_branch_title', 'Cawangan Seluruh Malaysia'),
  ('certs_branch_desc', 'Setiap cawangan berdaftar dengan permit berasingan bagi memastikan kawalan operasi tempatan yang responsif dan mematuhi arahan IPD setempat.'),

  -- ── CONTACT: tag, kad HQ, waktu operasi, borang ──
  ('page_contact_tag', 'Pusat Khidmat & Sebutharga'),
  ('contact_hq_title', 'Ibu Pejabat (HQ)'),
  ('contact_addr_label', 'Alamat Rasmi'),
  ('contact_phone_label', 'Telefon & Faks'),
  ('contact_email_label', 'E-mel Pentadbiran'),
  ('contact_hours_title', 'Waktu Operasi HQ'),
  ('contact_office_label', 'Pejabat Pengurusan'),
  ('contact_office_hours', 'Ahad – Khamis: 8:30 Pagi – 5:00 Petang\nJumaat & Sabtu: Tutup'),
  ('contact_cms_label', 'Bilik Gerakan & CMS'),
  ('contact_cms_hours', '24 Jam Setiap Hari (365 Hari Setahun)'),
  ('contact_form_title', 'Borang Permintaan Sebutharga'),
  ('contact_form_desc', 'Sila isi maklumat penugasan keselamatan yang diperlukan. Pegawai operasi kami akan menghubungi anda dalam tempoh 24 jam.'),
  ('contact_submit_text', 'HANTAR PERMINTAAN SEBUTHARGA'),

  -- ── FOOTER ──
  ('footer_nav_title', 'Pautan Pantas')
ON CONFLICT (key) DO NOTHING;
