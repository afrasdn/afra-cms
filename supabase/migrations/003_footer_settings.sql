-- ============================================================
-- AFRA CMS — Footer Settings (003)
-- Run this in Supabase SQL Editor AFTER 002_full_cms.sql
-- Menjadikan footer laman awam boleh diurus dari dashboard.
-- ============================================================

INSERT INTO public.site_settings (key, value) VALUES
  ('footer_about', 'AFRA Services Sdn. Bhd. (No. Pendaftaran: 881616-V) merupakan syarikat kawalan keselamatan berlesen rasmi di Malaysia yang diperbadankan sejak 7 Disember 2009 dengan modal dibenarkan dan berbayar sebanyak RM 5,000,000.00.'),
  ('footer_copyright', 'Hak Cipta Terpelihara 2009 - 2026 © AFRA Services Sdn. Bhd. (881616-V).'),
  ('footer_tagline', 'Agensi Kawalan Keselamatan Berlesen KDN & PDRM'),
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_tiktok', '')
ON CONFLICT (key) DO NOTHING;
