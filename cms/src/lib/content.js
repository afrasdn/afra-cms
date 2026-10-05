import {
  Shield, ShieldCheck, ShieldAlert, Crosshair, Truck, UserCheck,
  Activity, Video, Search, GraduationCap, FileText,
} from 'lucide-react'

// Peta nama ikon (dari DB) -> komponen Lucide
export const SERVICE_ICONS = {
  Shield, ShieldCheck, ShieldAlert, Crosshair, Truck, UserCheck,
  Activity, Video, Search, GraduationCap, FileText,
}

export function getServiceIcon(name) {
  return SERVICE_ICONS[name] ?? Shield
}

// Bersihkan tajuk dari token legacy {n} (dah tak digunakan).
// Nombor bilangan (cawangan/servis) diletak automatik oleh kod —
// client cuma taip teks biasa dalam dashboard.
export function cleanTitle(value, fallback) {
  const t = (value ?? '').replace(/\{n\}/g, '').replace(/\s+/g, ' ').trim()
  return t || fallback
}
// Fetch site_settings sebagai map { key: value }.
// Termasuk juga key+'_en' (dari lajur value_en) untuk dwi bahasa,
// cth: map['page_about_title'] (BM) dan map['page_about_title_en'] (EN).
export async function fetchSettings(supabase) {
  // Cuba dengan value_en dulu; kalau migration 006 belum run,
  // retry tanpa value_en supaya BM sedia ada tidak terjejas.
  try {
    const { data, error } = await supabase.from('site_settings').select('key, value, value_en')
    if (error) throw error
    const map = {}
    ;(data ?? []).forEach(r => {
      map[r.key] = r.value ?? ''
      if (r.value_en) map[r.key + '_en'] = r.value_en
    })
    return map
  } catch {
    try {
      const { data } = await supabase.from('site_settings').select('key, value')
      const map = {}
      ;(data ?? []).forEach(r => { map[r.key] = r.value ?? '' })
      return map
    } catch {
      return {}
    }
  }
}
