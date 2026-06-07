# Model SDLC — Titip.in

## Model yang Digunakan: Agile (Iterative & Incremental)

Titip.in dikembangkan menggunakan pendekatan **Agile dengan metode iteratif**, di mana pengembangan dibagi menjadi sprint-sprint kecil. Setiap sprint menghasilkan fitur yang dapat langsung diuji dan digunakan.

### Alasan Pemilihan Agile

| Alasan | Penjelasan |
|---|---|
| Tim kecil (2–3 orang) | Agile cocok untuk tim kecil yang komunikasinya intensif |
| Kebutuhan berubah | Fitur dikembangkan dan disempurnakan berdasarkan hasil testing |
| Deliverable per sprint | Setiap sprint menghasilkan fitur yang bisa didemonstrasikan |
| Risiko lebih rendah | Bug ditemukan lebih cepat karena testing dilakukan setiap sprint |

---

## Fase-Fase SDLC pada Titip.in

### 1. Planning (Perencanaan)

**Aktivitas:**
- Identifikasi masalah: mahasiswa kesulitan memesan makanan kantin saat sibuk
- Penentuan target pengguna: mahasiswa kampus
- Penetapan fitur MVP (Minimum Viable Product)
- Pembagian tugas dan pemilihan teknologi

**Output:**
- Daftar fitur prioritas
- Stack teknologi: Next.js 16, Supabase, Tailwind CSS
- Timeline pengembangan (lihat [Gantt Chart](gantt.md))

---

### 2. Requirements Analysis (Analisis Kebutuhan)

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Role |
|---|---|---|
| FR-01 | User dapat mendaftar sebagai mahasiswa atau pemilik warung | Semua |
| FR-02 | User dapat login dan logout | Semua |
| FR-03 | Penitip dapat membuat order dari menu warung | Mahasiswa |
| FR-04 | Jastiper dapat melihat dan mengambil order | Mahasiswa |
| FR-05 | Jastiper dapat update status order secara bertahap | Mahasiswa |
| FR-06 | Penitip dapat konfirmasi penerimaan makanan | Mahasiswa |
| FR-07 | Penitip dapat memberi rating ke jastiper | Mahasiswa |
| FR-08 | Pemilik warung dapat klaim dan kelola warung | Pemilik Warung |
| FR-09 | Pemilik warung dapat CRUD menu dengan harga | Pemilik Warung |
| FR-10 | User dapat melihat riwayat order | Semua |

**Kebutuhan Non-Fungsional:**

| ID | Kebutuhan | Keterangan |
|---|---|---|
| NFR-01 | Performa | Halaman dimuat < 3 detik |
| NFR-02 | Keamanan | RLS di semua tabel, autentikasi wajib |
| NFR-03 | Usability | Responsif mobile-first, navigasi jelas |
| NFR-04 | Availability | Deploy di Vercel (uptime 99.9%) |
| NFR-05 | Skalabilitas | Supabase PostgreSQL dapat handle ribuan user |

---

### 3. System Design (Desain Sistem)

**Arsitektur Sistem:**

```
┌─────────────────────────────────────────────┐
│              User (Browser/Mobile)          │
└────────────────────┬────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────┐
│         Next.js 16 App (Vercel)             │
│  ┌──────────────┐  ┌────────────────────┐   │
│  │ Server       │  │ Client Components  │   │
│  │ Components   │  │ (React 19)         │   │
│  │ (SSR/RSC)    │  │                    │   │
│  └──────┬───────┘  └────────┬───────────┘   │
│         │ Server Actions    │               │
└─────────┼───────────────────┼───────────────┘
          │                   │
┌─────────▼───────────────────▼───────────────┐
│              Supabase                        │
│  ┌──────────────┐  ┌────────────────────┐   │
│  │ PostgreSQL   │  │ Auth Service       │   │
│  │ + RLS        │  │ (JWT Sessions)     │   │
│  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Output desain:** ERD, Use Case Diagram, Sequence Diagram (lihat folder [docs/uml/](uml/))

---

### 4. Implementation (Implementasi)

Pengembangan dibagi 3 sprint:

| Sprint | Fitur | Durasi |
|---|---|---|
| Sprint 1 | Autentikasi, register/login, dua role | 2 minggu |
| Sprint 2 | Buat order, feed, detail, alur status | 3 minggu |
| Sprint 3 | Menu warung, review, riwayat, profil, landing page | 2 minggu |

**Tools yang digunakan:**
- **IDE**: Visual Studio Code
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Database GUI**: Supabase Dashboard
- **Deployment**: Vercel

---

### 5. Testing (Pengujian)

Empat jenis testing dilakukan (lihat [Test Cases](testing/test-cases.md)):

| Jenis Testing | Cakupan |
|---|---|
| Unit Testing | Validasi schema Zod, fungsi kalkulasi total |
| Integration Testing | Server Actions + Supabase (login, createOrder, updateStatus) |
| System Testing | Alur end-to-end dari register sampai review |
| Acceptance Testing | Pengujian oleh pengguna nyata (mahasiswa kampus) |

---

### 6. Deployment (Penerapan)

- **Platform**: Vercel (otomatis deploy saat push ke branch `main`)
- **Database**: Supabase cloud (region Singapore)
- **URL Produksi**: https://titipin-v2bx.vercel.app
- **CI/CD**: Vercel auto-deploy dari GitHub

---

### 7. Maintenance

- Bug dilaporkan melalui GitHub Issues
- Hotfix di-deploy melalui push ke `main`
- Data production di Supabase di-backup otomatis oleh platform

---

## Iterasi Pengembangan

Titip.in menggunakan iterasi pendek di mana setiap fitur diuji sebelum fitur berikutnya dikembangkan. Contoh iterasi nyata selama pengembangan:

| Iterasi | Masalah Ditemukan | Solusi |
|---|---|---|
| Sprint 1 | Email konfirmasi memblokir login | Matikan email confirmation di Supabase |
| Sprint 1 | Redirect setelah login melempar error toast | Re-throw NEXT_REDIRECT di catch block |
| Sprint 2 | Form order tidak bisa pakai `z.coerce.number()` | Ganti ke `z.number()` (Zod v4 breaking change) |
| Sprint 2 | BottomNav menutupi tombol aksi order | Ubah posisi action bar ke `bottom-16` |
| Sprint 3 | Halaman riwayat masih placeholder | Implementasi halaman riwayat lengkap |
