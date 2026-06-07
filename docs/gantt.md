# Project Timeline — Titip.in

## Gantt Chart

```mermaid
gantt
    title Titip.in — Jadwal Pengembangan
    dateFormat  YYYY-MM-DD
    section Perencanaan
        Identifikasi masalah & ide         :done, p1, 2025-03-01, 7d
        Penentuan fitur & scope            :done, p2, 2025-03-08, 7d
        Pembagian tugas tim                :done, p3, 2025-03-08, 3d

    section Desain
        ERD & arsitektur sistem            :done, d1, 2025-03-15, 5d
        Use Case Diagram                   :done, d2, 2025-03-15, 3d
        Wireframe UI                       :done, d3, 2025-03-18, 5d

    section Setup & Infrastruktur
        Setup Next.js + Supabase           :done, s1, 2025-03-22, 3d
        Database migrations (tabel + RLS)  :done, s2, 2025-03-25, 4d
        Konfigurasi autentikasi            :done, s3, 2025-03-27, 2d

    section Development Sprint 1 — Auth
        Halaman register & login           :done, dev1, 2025-04-01, 5d
        Proteksi route (middleware)        :done, dev2, 2025-04-05, 2d
        Dua role: mahasiswa & pemilik      :done, dev3, 2025-04-07, 3d

    section Development Sprint 2 — Order
        Form buat titipan (4 langkah)      :done, dev4, 2025-04-10, 7d
        Feed order & ambil order           :done, dev5, 2025-04-17, 5d
        Alur status order                  :done, dev6, 2025-04-22, 5d
        Halaman detail order               :done, dev7, 2025-04-27, 3d

    section Development Sprint 3 — Fitur Pendukung
        Kelola menu (pemilik warung)       :done, dev8, 2025-05-01, 5d
        Sistem review & rating             :done, dev9, 2025-05-06, 4d
        Riwayat order & profil             :done, dev10, 2025-05-10, 4d
        Landing page & UI polish           :done, dev11, 2025-05-14, 3d

    section Testing
        Unit testing fitur autentikasi     :done, t1, 2025-05-17, 3d
        Integration testing alur order     :done, t2, 2025-05-20, 4d
        System testing end-to-end          :done, t3, 2025-05-24, 3d
        User Acceptance Testing (UAT)      :done, t4, 2025-05-27, 4d

    section Deployment & Dokumentasi
        Deploy ke Vercel                   :done, dep1, 2025-06-01, 2d
        Dokumentasi README & SCHEMA        :done, dep2, 2025-06-03, 3d
        Laporan & proposal PKM-KC          :done, dep3, 2025-06-05, 5d
```

## Pembagian Tugas Tim

| No | Nama | Role | Tanggung Jawab |
|---|---|---|---|
| 1 | _(Anggota 1)_ | Lead Developer | Arsitektur sistem, database, backend (Server Actions) |
| 2 | _(Anggota 2)_ | Frontend Developer | UI components, form handling, routing |
| 3 | _(Anggota 3)_ | QA & Dokumentasi | Testing, dokumentasi, laporan PKM-KC |

## Milestone

| Milestone | Target | Status |
|---|---|---|
| Setup project & database | Minggu 2 | ✅ Selesai |
| Fitur autentikasi berjalan | Minggu 4 | ✅ Selesai |
| Alur order end-to-end | Minggu 7 | ✅ Selesai |
| Semua fitur utama selesai | Minggu 10 | ✅ Selesai |
| Testing & bug fix | Minggu 11 | ✅ Selesai |
| Deploy & dokumentasi | Minggu 12 | ✅ Selesai |
