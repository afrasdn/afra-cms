---
target_identity: "file:C:\\Users\\syakir\\Downloads\\cms afra\\certificates.html"
target_fingerprint: "sha256:1715edaff4b5999802ef65934ee73100acf27699413a145fe7b633e464c859e1"
target_path: "C:\\Users\\syakir\\Downloads\\cms afra\\certificates.html"
timestamp: 2026-09-27T03-59-56Z
slug: certificates-html
---
# Critique: Sijil, Pelesenan & Cawangan (certificates.html)

**Surface / Mode:** Persuade / Credibility Proof (Pelesenan KDN, PDRM, MOF, PPKKM, ISO 9001, Lonpac, dan 13 Cawangan Seluruh Malaysia).  
**Evaluation Standard:** 10 Nielsen Heuristics (disesuaikan untuk halaman pembuktian kredibiliti) & Impeccable Design Quality Standard.

---

### Nielsen Heuristics Scorecard

| Heuristik | Skor | Catatan |
| :--- | :---: | :--- |
| **1. Ketelusan Status Sistem** | 4/4 | Navigasi aktif 'CERTIFICATES' jelas, susun atur maklumat kredibiliti berstruktur. |
| **2. Keserasian Dunia Sebenar & Bahasa Industri** | 4/4 | Terminologi tepat industri kawalan keselamatan Malaysia: KDN Akta 1971, PDRM Carry & Use, MOF, PPKKM, Lonpac Insurance. |
| **3. Kawalan & Kebebasan Pengguna** | 3/4 | Aliran navigasi lancar. Senarai 13 cawangan jelas dan mudah diskrol. |
| **4. Ketekalan & Piawaian** | 3/4 | Struktur kad seragam, namun terdapat perbezaan kecil pada aksen tajuk footer (`border-left` side-tab). |
| **5. Pencegahan Ralat** | 4/4 | Alamat cawangan lengkap dengan poskod dan negeri tanpa pautan mati atau data rekaan. |
| **6. Pengecaman Berbanding Mengingat Semula** | 4/4 | Kad sijil menggunakan lencana agensi yang jelas dengan ringkasan skop kuasa undang-undang. |
| **7. Fleksibiliti & Kecekapan Penggunaan** | n/a | *(Halaman pembuktian statik; interaksi kompleks tidak terpakai)* |
| **8. Reka Bentuk Estetik & Minimalis** | 3/4 | Bersih dan berwibawa, tetapi ada isu kontras warna biru primer (`#0284c7` vs `#ffffff` = 4.1:1) dan saiz teks mikro. |
| **9. Bantuan Pengecaman Ralat** | n/a | Tiada input borang pada halaman ini. |
| **10. Bantuan & Dokumentasi** | n/a | *(Halaman pembuktian statik)* |

**Jumlah Skor: 25 / 28 (89% - Sangat Baik / Kukuh)**

---

### Design Specificity Verdict: 4/5
Halaman ini mempunyai nilai keaslian industri yang sangat tinggi:
- Mempamerkan badan berkuasa tempatan sebenar (Kementerian Dalam Negeri, PDRM, Kementerian Kewangan Malaysia, PPKKM).
- 13 cawangan fizikal lengkap dari Ibu Pejabat Selangor hingga ke Sabah dan Sarawak dengan alamat fizikal terperinci.
- Tiada kandungan "generic AI slop" seperti perenggan kosong atau pensijilan rekaan.

---

### Kekuatan Utama (Strengths)
1. **Bukti Kredibiliti Berwibawa:** Memenuhi kriteria semakan audit keselamatan komersial dan tender korporat/kerajaan.
2. **Liputan Rangkaian Kebangsaan:** 13 cawangan dipaparkan dalam grid yang kemas dan berstruktur mengikut negeri.
3. **Penyelarasan Header Bersih:** Menggunakan reka bentuk navigasi seragam dengan satu punat *LOGIN* tunggal tanpa kekusutan.

---

### Isu Utama Mengikut Keutamaan (Priority Issues)

#### [P1] Aksesibiliti & Kontras Teks (WCAG AA Compliance)
- **Isu:** Warna `--blue-primary: #0284c7` pada latar belakang putih mencapai nisbah kontras 4.1:1 (di bawah standard WCAG AA 4.5:1 untuk teks biasa). Teks baris hak cipta `#64748b` pada latar `#090e1a` juga 4.1:1.
- **Penyelesaian:** Selaraskan `--blue-primary` kepada `#0369a1` (5.6:1 - lulus WCAG AA) dan baris bawah footer kepada `#94a3b8` (8.2:1).

#### [P2] Anti-Patterns Reka Bentuk UI (Side-Tab & Pill Badge)
- **Isu:**
  1. `.footer-nav-title` masih menggunakan `border-left: 3px solid var(--blue-primary);` (corak side-tab yang tidak tekal dengan halaman lain).
  2. `.page-header-tag` ("AKREDITASI & RANGKAIAN CAWANGAN") menggunakan corak *eyebrow pill chip* terapung (`border-radius: 9999px;`).
- **Penyelesaian:** Buang border-left pada tajuk footer dan tukar styling lencana header kepada *grounded square badge* (`border-radius: 0.375rem;`).

#### [P2] Saiz Tipografi Mikro (Undersized UI Text)
- **Isu:**
  - `.brand-subtitle`: `0.68rem` (~10.88px) terlalu kecil pada skrin resolusi standard.
  - `.branch-badge-hq`: `0.62rem` (~9.92px) sukar dibaca.
- **Penyelesaian:** Naikkan `.brand-subtitle` ke `0.75rem` (12px) dan `.branch-badge-hq` ke `0.72rem` (11.5px).

#### [P3] Favicon & Ikon Tab Pelayar
- **Isu:** Tag `<link rel="icon">` tiada dalam `<head>`.
- **Penyelesaian:** Tambah `<link rel="icon" type="image/png" href="assets/afra-logo.png" />`.
