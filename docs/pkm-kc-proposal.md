# PROPOSAL PKM-KC
# Titip.in: Platform Jasa Titip Makanan Kantin Berbasis Web untuk Mahasiswa

---

## DAFTAR ISI

1. BAB 1 — Pendahuluan
2. BAB 2 — Tinjauan Pustaka
3. BAB 3 — Tahap Pelaksanaan
4. BAB 4 — Biaya dan Jadwal Kegiatan
5. Daftar Pustaka

---

## BAB 1. PENDAHULUAN

### 1.1 Latar Belakang

Kehidupan mahasiswa di kampus identik dengan jadwal yang padat — perkuliahan, tugas, praktikum, dan berbagai kegiatan organisasi. Di tengah kesibukan tersebut, kebutuhan makan tetap tidak bisa diabaikan. Kantin kampus menjadi solusi utama, namun mahasiswa seringkali tidak memiliki waktu untuk datang langsung ke kantin, terutama pada jam istirahat yang pendek atau saat mereka sedang berada jauh dari lokasi kantin.

Di sisi lain, mahasiswa yang sedang dalam perjalanan menuju kantin seringkali hanya membeli untuk kebutuhan sendiri, padahal mereka berpotensi membantu teman-teman lain yang membutuhkan makanan dengan mendapatkan imbalan. Konsep **jasa titip (jastip)** yang sudah lazim di e-commerce sebenarnya dapat diterapkan dalam skala kantin kampus, namun belum ada platform digital yang memfasilitasi hal ini secara terstruktur.

Proses titip-menitip yang ada saat ini masih dilakukan secara informal melalui aplikasi pesan instan (WhatsApp, LINE), yang menimbulkan berbagai masalah: tidak adanya sistem tracking status pesanan, tidak ada standarisasi fee jastip, tidak ada mekanisme rating kepercayaan, dan tidak ada histori transaksi yang tersimpan dengan baik.

Titip.in hadir sebagai solusi berbasis web yang menghubungkan **penitip** (mahasiswa yang ingin memesan makanan) dengan **jastiper** (mahasiswa yang sedang menuju kantin), dalam satu platform terintegrasi dengan fitur manajemen order, tracking status, sistem rating, dan kelola menu oleh pemilik warung.

### 1.2 Tujuan

1. Membangun platform web dua sisi (two-sided marketplace) yang menghubungkan penitip dan jastiper di kantin kampus
2. Menyediakan sistem manajemen order real-time dengan tracking status yang transparan
3. Memberikan fitur kelola menu digital bagi pemilik warung kantin
4. Membangun sistem kepercayaan berbasis rating dan review antar pengguna
5. Menyediakan akses mudah melalui antarmuka mobile-friendly yang dapat diakses dari browser tanpa instalasi

### 1.3 Prediksi Manfaat

**Bagi Penitip (Mahasiswa yang memesan):**
- Menghemat waktu perjalanan ke kantin, terutama saat jadwal padat
- Dapat memesan dari warung favorit kapan saja selama jam operasional
- Transparansi harga dan tracking status pesanan secara real-time

**Bagi Jastiper (Mahasiswa yang mengantar):**
- Mendapatkan penghasilan tambahan dari fee jastip
- Memanfaatkan perjalanan ke kantin yang sudah direncanakan
- Membangun reputasi melalui sistem rating

**Bagi Pemilik Warung:**
- Digitalisasi menu dengan harga yang dapat diperbarui kapan saja
- Peningkatan volume penjualan karena pesanan datang dari mahasiswa yang tidak bisa datang langsung

**Bagi Kampus:**
- Mendukung ekosistem digital kampus
- Mengurangi kepadatan di area kantin pada jam-jam puncak

### 1.4 Luaran

1. **Laporan Kemajuan** — dokumen perkembangan pengembangan sistem
2. **Laporan Akhir** — dokumentasi lengkap proyek
3. **Produk Fungsional** — aplikasi web Titip.in yang dapat diakses di https://titipin-v2bx.vercel.app
4. **Akun Media Sosial** — untuk promosi dan edukasi penggunaan platform

---

## BAB 2. TINJAUAN PUSTAKA

### 2.1 Konsep Two-Sided Marketplace

Two-sided marketplace adalah platform yang menghubungkan dua kelompok pengguna yang saling membutuhkan (Rochet & Tirole, 2003). Contoh sukses meliputi Tokopedia (penjual-pembeli), Gojek (driver-penumpang), dan Airbnb (tuan rumah-tamu). Titip.in mengadopsi model ini dalam skala mikro: penitip dan jastiper di lingkungan kampus.

Kunci keberhasilan two-sided marketplace adalah mengatasi masalah "chicken-and-egg" — platform membutuhkan pengguna di kedua sisi secara bersamaan. Titip.in mengatasi ini dengan memanfaatkan komunitas kampus yang sudah ada, di mana satu mahasiswa dapat berperan sebagai penitip sekaligus jastiper.

### 2.2 Progressive Web Application dan Mobile-First Design

Penelitian oleh Google (2018) menunjukkan bahwa 53% pengguna mobile meninggalkan halaman yang memuat lebih dari 3 detik. Titip.in dibangun dengan pendekatan mobile-first menggunakan Next.js App Router dengan Server-Side Rendering (SSR) untuk memastikan performa optimal, serta desain responsif dengan Tailwind CSS untuk kenyamanan penggunaan di perangkat mobile.

### 2.3 Row Level Security sebagai Mekanisme Keamanan Data

Row Level Security (RLS) adalah fitur PostgreSQL yang memungkinkan pembatasan akses data di tingkat baris berdasarkan identitas pengguna (PostgreSQL Documentation, 2023). Titip.in mengimplementasikan RLS di semua tabel untuk memastikan setiap pengguna hanya dapat mengakses data yang menjadi haknya — penitip hanya melihat ordernya sendiri, pemilik warung hanya mengelola menunya sendiri.

### 2.4 Agile Software Development

Metode Agile (Beck et al., 2001) menekankan pengembangan iteratif, kolaborasi tim, dan respons cepat terhadap perubahan. Titip.in dikembangkan dalam 3 sprint dengan total durasi 7 minggu, di mana setiap sprint menghasilkan fitur yang dapat langsung diuji. Pendekatan ini memungkinkan tim menemukan dan memperbaiki bug lebih awal dibandingkan model Waterfall.

### 2.5 Sistem Rating dan Kepercayaan Digital

Dellarocas (2003) dalam penelitiannya menunjukkan bahwa sistem rating online secara signifikan meningkatkan kepercayaan transaksi antar pengguna yang tidak saling mengenal. Titip.in mengimplementasikan sistem rating bintang 1-5 yang hanya dapat diberikan setelah transaksi selesai, memastikan rating mencerminkan pengalaman nyata.

---

## BAB 3. TAHAP PELAKSANAAN

### 3.1 Deskripsi Produk/Sistem

**Titip.in** adalah aplikasi web dua sisi untuk jasa titip makanan kantin kampus. Sistem memiliki tiga jenis pengguna:

1. **Mahasiswa sebagai Penitip** — membuat order, memilih menu dari warung, menentukan lokasi dan deadline antar, membayar fee jastip
2. **Mahasiswa sebagai Jastiper** — melihat order yang tersedia, mengambil order, memperbarui status, mengantarkan makanan
3. **Pemilik Warung** — mendaftarkan warung, mengelola menu digital beserta harga

**Stack Teknologi:**
- Frontend & Backend: Next.js 16 (App Router, React Server Components)
- Database & Auth: Supabase (PostgreSQL + Row Level Security)
- Styling: Tailwind CSS v4, shadcn/ui v4
- Deployment: Vercel (cloud platform)
- Version Control: GitHub

### 3.2 Alur dan Tahapan Pelaksanaan

Pengembangan menggunakan model **Agile Iteratif** dengan 3 sprint:

**Sprint 1 — Autentikasi & Infrastruktur (2 minggu)**
- Setup project Next.js dan Supabase
- Perancangan dan implementasi database schema
- Sistem registrasi dan login dua role
- Proteksi route dengan middleware

**Sprint 2 — Fitur Inti Order (3 minggu)**
- Form pembuatan order 4 langkah
- Feed order untuk jastiper
- Alur status order (waiting → accepted → purchasing → delivering → completed)
- Halaman detail order dengan informasi lengkap

**Sprint 3 — Fitur Pendukung & Polish (2 minggu)**
- Manajemen menu oleh pemilik warung
- Sistem review dan rating
- Riwayat order dan halaman profil
- Landing page dan UI polish
- Deployment dan dokumentasi

### 3.3 Perancangan Produk/Sistem

**Arsitektur Sistem:**

```
User Browser → Vercel (Next.js) → Supabase (PostgreSQL + Auth)
```

Seluruh business logic berada di Server Actions Next.js, yang berkomunikasi langsung dengan Supabase dari server (tidak terekspos ke client). Ini memberikan keamanan tambahan karena database credentials tidak pernah sampai ke browser pengguna.

**Desain Database (6 tabel):**
- `profiles` — data user (nama, NIM, role)
- `kantins` — data kantin kampus
- `tenants` — warung di dalam kantin
- `menus` — item menu per warung
- `orders` — transaksi titipan
- `reviews` — rating dan ulasan

**Alur Status Order:**
```
waiting → accepted → purchasing → delivering → completed
                           ↘ cancelled (oleh penitip)
```

### 3.4 Pengujian

Empat jenis pengujian dilakukan secara bertahap:

| Jenis | Cakupan | Jumlah Test Case | Hasil |
|---|---|---|---|
| Unit Testing | Validasi form, kalkulasi harga | 10 | 10/10 Pass |
| Integration Testing | Server Actions + Database | 18 | 18/18 Pass |
| System Testing | Alur end-to-end per role | 21 | 21/21 Pass |
| User Acceptance Testing | 3 pengguna nyata | 5 kriteria | 5/5 Pass |

Detail test cases tersedia di [docs/testing/test-cases.md](testing/test-cases.md).

---

## BAB 4. BIAYA DAN JADWAL KEGIATAN

### 4.1 Anggaran Biaya

| No | Jenis Pengeluaran | Sumber Dana | Besaran Dana (Rp) |
|---|---|---|---|
| 1 | **Bahan habis pakai (maks. 60%)** | | |
| | ATK dan kebutuhan dokumentasi | Perguruan Tinggi | 200.000 |
| | Subtotal | | **200.000** |
| 2 | **Sewa dan jasa (maks. 15%)** | | |
| | Sewa domain (1 tahun) | Belmawa | 150.000 |
| | Sewa server/hosting tambahan (jika diperlukan) | Belmawa | 350.000 |
| | Subtotal | | **500.000** |
| 3 | **Transportasi lokal (maks. 30%)** | | |
| | Transportasi pengumpulan data (survey kantin) | Belmawa | 300.000 |
| | Transportasi UAT dan pengujian lapangan | Belmawa | 200.000 |
| | Subtotal | | **500.000** |
| 4 | **Lain-lain (maks. 15%)** | | |
| | Biaya publikasi media sosial (paid ads) | Belmawa | 500.000 |
| | Biaya akses jurnal ilmiah referensi | Belmawa | 300.000 |
| | Subtotal | | **800.000** |
| | **TOTAL** | | **2.000.000** |

| Rekap Sumber Dana | Jumlah |
|---|---|
| Belmawa | Rp 1.800.000 |
| Perguruan Tinggi | Rp 200.000 |
| Instansi Lain | Rp 0 |
| **Total** | **Rp 2.000.000** |

> Catatan: Biaya hosting utama (Vercel free tier + Supabase free tier) tidak dikenakan biaya sehingga anggaran dapat dialokasikan ke pengembangan konten dan pengujian.

### 4.2 Jadwal Kegiatan

| No | Jenis Kegiatan | Bulan 1 | Bulan 2 | Bulan 3 | Penanggung Jawab |
|---|---|---|---|---|---|
| 1 | Identifikasi masalah & studi literatur | ████ | | | Semua |
| 2 | Perancangan sistem (ERD, Use Case, UI) | ████ | | | Anggota 1 & 2 |
| 3 | Sprint 1: Setup & Autentikasi | ████ | | | Anggota 1 & 2 |
| 4 | Sprint 2: Fitur Order | | ████████ | | Anggota 1 & 2 |
| 5 | Sprint 3: Fitur Pendukung & Polish | | | ████ | Semua |
| 6 | Unit & Integration Testing | | ████ | | Anggota 3 |
| 7 | System Testing & UAT | | | ████ | Anggota 3 |
| 8 | Pembuatan Akun Media Sosial | | ████ | | Anggota 3 |
| 9 | Posting konten media sosial | | ████ | ████ | Anggota 3 |
| 10 | Deployment ke Vercel | | | ████ | Anggota 1 |
| 11 | Pembuatan Laporan Kemajuan | | ████ | | Semua |
| 12 | Pembuatan Laporan Akhir | | | ████ | Semua |

---

## DAFTAR PUSTAKA

Beck, K., et al. (2001). *Manifesto for Agile Software Development*. Agile Alliance. https://agilemanifesto.org

Dellarocas, C. (2003). The digitization of word of mouth: Promise and challenges of online feedback mechanisms. *Management Science*, 49(10), 1407–1424.

Google. (2018). *Find out how you stack up to new industry benchmarks for mobile page speed*. Google Developers. https://developers.google.com/web/updates/2018/08/chrome-speed

PostgreSQL Global Development Group. (2023). *Row Security Policies*. PostgreSQL Documentation. https://www.postgresql.org/docs/current/ddl-rowsecurity.html

Rochet, J. C., & Tirole, J. (2003). Platform competition in two-sided markets. *Journal of the European Economic Association*, 1(4), 990–1029.

Supabase Inc. (2024). *Supabase Documentation*. https://supabase.com/docs

Vercel Inc. (2024). *Next.js Documentation*. https://nextjs.org/docs
