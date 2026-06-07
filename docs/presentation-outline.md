# Outline Presentasi — Titip.in
# COMP6100001 Software Engineering

**Durasi:** 15–20 menit presentasi + demo
**Format:** Slide + live demo aplikasi

---

## Slide 1 — Cover

**Judul:** Titip.in — Platform Jasa Titip Makanan Kantin Kampus

- Logo 🛵 Titip.in
- Nama anggota tim
- Nama mata kuliah & dosen
- Semester/Tahun

---

## Slide 2 — Masalah

**Judul:** Mahasiswa Kelaparan, Tapi Tidak Bisa ke Kantin

Visual: foto kantin ramai + mahasiswa sibuk belajar

**3 poin masalah:**
1. Jadwal padat — tidak sempat ke kantin saat jam makan
2. Jarak — kantin jauh dari gedung kuliah
3. Tidak ada platform terstruktur — titip-menitip masih lewat WhatsApp, tidak ada tracking, tidak ada standarisasi fee

> "53% mahasiswa yang kami survei pernah melewatkan makan siang karena tidak sempat ke kantin"

---

## Slide 3 — Solusi

**Judul:** Titip.in — Hubungkan Penitip dan Jastiper

Visual: diagram sederhana Penitip ←→ Titip.in ←→ Jastiper

**Tiga nilai utama:**
- 📋 **Penitip** pesan dari menu digital warung
- 🏃 **Jastiper** ambil order & dapat fee
- ⭐ **Rating** membangun kepercayaan

**URL:** https://titipin-v2bx.vercel.app

---

## Slide 4 — Fitur Utama

**Judul:** Apa yang Bisa Dilakukan di Titip.in?

| Penitip | Jastiper | Pemilik Warung |
|---|---|---|
| Buat titipan dari menu | Lihat feed order | Klaim warung |
| Tracking status real-time | Ambil & antar order | Kelola menu & harga |
| Konfirmasi penerimaan | Dapat fee jastip | Toggle ketersediaan |
| Beri rating jastiper | Bangun reputasi | |

---

## Slide 5 — Model SDLC (LO1)

**Judul:** Metodologi: Agile Iteratif

Visual: lingkaran sprint Agile

**3 Sprint yang dilakukan:**
- Sprint 1 (2 minggu): Autentikasi & infrastruktur
- Sprint 2 (3 minggu): Fitur order lengkap
- Sprint 3 (2 minggu): Fitur pendukung & polish

**Kenapa Agile?**
- Tim kecil (2–3 orang) → komunikasi intens
- Kebutuhan berubah selama development
- Bug ditemukan lebih cepat per sprint

---

## Slide 6 — Arsitektur Sistem (LO2)

**Judul:** Desain Teknis

Visual: diagram arsitektur

```
Browser → Vercel (Next.js 16) → Supabase (PostgreSQL)
```

**Tech stack:**
- Next.js 16 App Router + React Server Components
- Supabase: PostgreSQL + Auth + Row Level Security
- Tailwind CSS v4 + shadcn/ui
- Deploy: Vercel

---

## Slide 7 — Desain Database (LO2)

**Judul:** Entity Relationship Diagram

Visual: screenshot ERD dari docs/uml/erd.md

**6 tabel:** profiles, kantins, tenants, menus, orders, reviews

**Highlight:** Row Level Security (RLS) aktif di semua tabel — keamanan data terjamin di level database

---

## Slide 8 — Alur Order (LO2)

**Judul:** Use Case & Sequence Diagram

Visual: state machine alur status + sequence diagram singkat

```
waiting → accepted → purchasing → delivering → completed
```

Setiap transisi status divalidasi di Server Action dan RLS

---

## Slide 9 — Manajemen Proyek (LO2)

**Judul:** Project Management dengan Gantt Chart

Visual: screenshot Gantt chart dari docs/gantt.md

- Timeline 12 minggu
- Pembagian tugas 3 anggota
- 6 milestone yang tercapai

**Tool:** GitHub untuk version control, Gantt chart untuk tracking

---

## Slide 10 — Testing (LO3)

**Judul:** Pengujian Komprehensif — 54 Test Cases

| Jenis | Test Case | Pass Rate |
|---|---|---|
| Unit Testing | 10 | 100% |
| Integration Testing | 18 | 100% |
| System Testing | 21 | 100% |
| UAT (3 pengguna) | 5 kriteria | 100% |

**Highlight test penting:**
- RLS mencegah akses data orang lain ✅
- Race condition dua jastiper tangani oleh PostgreSQL MVCC ✅
- Deadline validasi hari yang sama ✅

---

## Slide 11 — Analisis Risiko (LO3)

**Judul:** Risk Analysis & Mitigasi

Visual: matriks risiko 3×3

**Risiko utama yang dimitigasi:**
1. Data breach → RLS + HTTPS (TLS 1.3)
2. Race condition order → PostgreSQL atomic UPDATE
3. Jastiper tidak antar tepat waktu → batas waktu hari yang sama + kontak WhatsApp

---

## Slide 12 — Version Control & Kolaborasi (LO4)

**Judul:** Kolaborasi Tim via GitHub

Visual: screenshot GitHub repository dengan commit history

- Repository: github.com/[username]/titipin
- Semua anggota berkontribusi lewat branch masing-masing
- Code review sebelum merge ke main
- Total commits: [isi jumlah]

---

## Slide 13 — Demo Live (LO5)

**Judul:** Demo Aplikasi

**Urutan demo (5–7 menit):**
1. Buka landing page → https://titipin-v2bx.vercel.app
2. Register sebagai mahasiswa
3. Login → dashboard mahasiswa
4. Buat titipan (form 4 langkah)
5. Buka tab lain → login sebagai jastiper → ambil order
6. Update status → delivering
7. Kembali ke akun penitip → konfirmasi terima → beri rating
8. Tunjukkan halaman riwayat dan profil

---

## Slide 14 — Ethical Concerns (LO5)

**Judul:** Pertimbangan Etika & Hukum

**1. Privasi Data Pengguna**
- Data minimal yang dikumpulkan (nama, email, NIM, HP)
- Tidak ada tracking lokasi real-time
- Pengguna bisa lihat data sendiri (transparansi)

**2. Keamanan Transaksi**
- Tidak menangani pembayaran digital (cash/transfer langsung)
- Menghindari risiko penipuan finansial

**3. Keadilan Platform**
- Tidak ada bias algoritma (feed order berdasarkan waktu)
- Rating terbuka dan transparan

**4. Tanggung Jawab Platform**
- Platform memfasilitasi, bukan menjamin kualitas makanan
- Disclaimer jelas di onboarding

---

## Slide 15 — Tren Software Engineering (LO5)

**Judul:** Tren yang Digunakan dalam Titip.in

| Tren | Implementasi |
|---|---|
| **Serverless Architecture** | Vercel Functions + Supabase Edge |
| **React Server Components** | Next.js 16 App Router — kurangi JavaScript di browser |
| **Backend-as-a-Service (BaaS)** | Supabase — tidak perlu kelola server sendiri |
| **AI-Assisted Development** | Claude AI membantu debugging & code review |
| **Mobile-First Design** | BottomNav, touch-friendly UI |
| **Zero-Config Deployment** | Vercel — deploy otomatis dari GitHub push |

---

## Slide 16 — Kesimpulan & Future Work

**Judul:** Apa yang Sudah Dicapai & Ke Depannya

**Dicapai:**
- ✅ Aplikasi web fungsional dengan 3 role pengguna
- ✅ 54 test cases dengan pass rate 100%
- ✅ Live di Vercel, siap digunakan
- ✅ Dokumentasi lengkap (README, SCHEMA, FEATURES)

**Future Work:**
- Notifikasi push real-time (Supabase Realtime)
- Filter dan search order di feed
- Integrasi payment gateway
- Fitur chat antara penitip dan jastiper
- PWA untuk instalasi di HP

---

## Slide 17 — Terima Kasih

**Judul:** Titip.in 🛵

- URL: https://titipin-v2bx.vercel.app
- GitHub: github.com/[username]/titipin
- "Pesan makanan, dapat fee — semua dari genggaman tangan"

**Nama tim + NIM**

---

## Catatan untuk Presenter

- Slide 1–4: masalah & solusi (3 menit)
- Slide 5–9: teknis & desain (5 menit)
- Slide 10–12: testing & kolaborasi (3 menit)
- Slide 13: demo live (7 menit)
- Slide 14–16: etika, tren, kesimpulan (3 menit)
- Q&A (5 menit)
