-- ============================================================
-- AFRA CMS — Cleanup {n} tokens (005)
-- Run this in Supabase SQL Editor AFTER 004_section_texts.sql
-- Tajuk kini teks biasa — nombor bilangan diletak automatik
-- oleh kod, client tak perlu taip {n} lagi.
-- ============================================================

UPDATE public.site_settings SET value = 'CAWANGAN SELURUH MALAYSIA'
  WHERE key = 'home_branch_title';
UPDATE public.site_settings SET value = 'PENGKHUSUSAN UTAMA'
  WHERE key = 'catalog_core_tag';
UPDATE public.site_settings SET value = 'Cawangan Seluruh Malaysia'
  WHERE key = 'certs_branch_title';
