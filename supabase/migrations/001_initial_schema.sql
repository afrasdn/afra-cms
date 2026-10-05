-- ============================================================
-- AFRA CMS — Initial Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (extended profile for Supabase Auth users)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  cloudinary_public_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CERTIFICATES
-- ============================================================
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuing_body TEXT,
  description TEXT,
  image_url TEXT,
  cloudinary_public_id TEXT,
  document_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SITE CONTENT (Hero, About, CTA sections)
-- ============================================================
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT NOT NULL UNIQUE,  -- e.g. 'hero', 'about_intro', 'cta'
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cloudinary_public_id TEXT,
  cta_text TEXT,
  cta_url TEXT,
  extra_data JSONB,              -- flexible field for section-specific data
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- ============================================================
-- CONTACT MESSAGES (from public contact form)
-- ============================================================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  service_type TEXT,
  state TEXT,
  message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,          -- e.g. 'CREATE', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_contact_messages_read ON public.contact_messages(is_read);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_users_updated BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_certificates_updated BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- USERS: admins can see all, users can see own
CREATE POLICY "admins_all_users" ON public.users
  FOR ALL USING (public.is_admin());
CREATE POLICY "users_own_profile" ON public.users
  FOR SELECT USING (id = auth.uid());

-- CATEGORIES: public read, admin write
CREATE POLICY "public_read_categories" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "admin_write_categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- PRODUCTS: public read (active only), admin all
CREATE POLICY "public_read_active_products" ON public.products
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_products" ON public.products
  FOR ALL USING (public.is_admin());

-- CERTIFICATES: public read (active only), admin all
CREATE POLICY "public_read_active_certs" ON public.certificates
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_certs" ON public.certificates
  FOR ALL USING (public.is_admin());

-- SITE CONTENT: public read, admin write
CREATE POLICY "public_read_site_content" ON public.site_content
  FOR SELECT USING (true);
CREATE POLICY "admin_write_site_content" ON public.site_content
  FOR ALL USING (public.is_admin());

-- CONTACT MESSAGES: anyone can insert (public form), only admin can read
CREATE POLICY "public_insert_contact" ON public.contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_contact" ON public.contact_messages
  FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_update_contact" ON public.contact_messages
  FOR UPDATE USING (public.is_admin());

-- AUDIT LOGS: admin read only, system inserts via service role
CREATE POLICY "admin_read_audit" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

-- ============================================================
-- SEED: Initial site_content sections
-- ============================================================
INSERT INTO public.site_content (section, title, subtitle, description, cta_text, cta_url) VALUES
  ('hero', 'KESELAMATAN ANDA, KOMITMEN KAMI.', NULL, 'AFRA Services Sdn. Bhd. — Agensi kawalan keselamatan berlesen penuh KDN & PDRM sejak 2009. Melindungi premis korporat, industri, dan institusi awam seluruh Malaysia.', 'TEROKAI PERKHIDMATAN', '/catalog'),
  ('about_intro', 'Tentang AFRA Services', 'Berlesen Penuh KDN & PDRM', 'AFRA Services Sdn. Bhd. (No. Pendaftaran: 881616-V) merupakan syarikat kawalan keselamatan berlesen rasmi di Malaysia yang diperbadankan sejak 7 Disember 2009.', NULL, NULL),
  ('cta_banner', 'Perlukan Penyelesaian Keselamatan?', NULL, 'Hubungi pasukan perunding keselamatan kami hari ini untuk penilaian premis percuma dan sebutharga rasmi.', 'HUBUNGI KAMI', 'contact.html')
ON CONFLICT (section) DO NOTHING;

-- ============================================================
-- SEED: Initial categories
-- ============================================================
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Kawalan Keselamatan Statik', 'kawalan-statik', 'Perkhidmatan pengawal keselamatan statik di premis', 1),
  ('Kawalan Keselamatan Bersenjata', 'kawalan-bersenjata', 'Perkhidmatan pengawal bersenjata berlesen PDRM', 2),
  ('Cash-In-Transit (CIT)', 'cash-in-transit', 'Perkhidmatan pengangkutan dan pemindahan wang tunai selamat', 3),
  ('Pengawal Peribadi (VIP)', 'pengawal-peribadi', 'Perkhidmatan bodyguard VIP dan escort', 4),
  ('Central Monitoring System (CMS)', 'cms-pemantauan', 'Sistem pemantauan kawalan keselamatan 24 jam', 5),
  ('CCTV & Automasi', 'cctv-automasi', 'Pemasangan dan penyelenggaraan sistem CCTV dan keselamatan digital', 6),
  ('Penyiasat Persendirian', 'penyiasat-persendirian', 'Perkhidmatan siasatan persendirian berlesen', 7),
  ('Latihan & Konsultasi', 'latihan-konsultasi', 'Program latihan keselamatan dan perkhidmatan konsultasi', 8)
ON CONFLICT (slug) DO NOTHING;
