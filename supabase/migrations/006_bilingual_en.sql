-- ============================================================
-- AFRA CMS — Bilingual EN support (006)
-- Run this in Supabase SQL Editor AFTER 005_cleanup_count_tokens.sql
--
-- Strategi: setiap jadual kandungan dapat SATU lajur `en` (JSONB)
-- yang memegang versi English bagi field teks, cth:
--   services.en = {"title": "...", "description": "...", "features": [...]}
-- Kod akan guna versi EN bila pelawat pilih English, dan
-- fallback ke BM bila EN kosong. Tiada data sedia ada terjejas.
-- ============================================================

ALTER TABLE public.services       ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.branches       ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.leaders        ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.objectives     ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.metrics        ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.accreditations ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.certificates   ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.products       ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.categories     ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.site_content   ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}'::jsonb;

-- site_settings: satu nilai EN sebaris (key sama, cth: value_en)
ALTER TABLE public.site_settings  ADD COLUMN IF NOT EXISTS value_en TEXT;

-- Rujukan field EN mengikut jadual (untuk borang admin):
-- services:      title, description, features(array)
-- branches:      state, address, contact
-- leaders:       role (nama tidak diterjemah)
-- objectives:    title, description
-- metrics:       label, sub (value/suffix tidak diterjemah)
-- accreditations:name (code tidak diterjemah)
-- certificates:  title, description
-- products:      name, description
-- categories:    name, description
-- site_content:  title, subtitle, description, cta_text, cta2_text
-- site_settings: value_en untuk setiap key
