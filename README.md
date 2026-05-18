# 🛵 Titip.in

Marketplace jasa titip makanan kantin kampus. Mahasiswa bisa menitipkan pesanan ke teman yang sedang ke kantin, dan mendapatkan fee jastip sebagai imbalan.

## Deskripsi Singkat

Titip.in menghubungkan dua pihak:
- **Penitip** — mahasiswa yang ingin pesan makanan tanpa harus ke kantin sendiri
- **Jastiper** — mahasiswa yang sedang ke kantin dan bisa ambil order untuk dapat fee tambahan

## Stack Teknologi

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui v4 |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Validasi | Zod v4, React Hook Form |
| Notifikasi | Sonner (toast) |
| Icons | Lucide React |

## Struktur Proyek

```
titipin/
├── app/
│   ├── (public)/          # Halaman tanpa login (landing, login, register)
│   └── (app)/             # Halaman protected (dashboard, orders, profile, tenant)
├── actions/               # Server Actions (auth, orders, menus, reviews)
├── components/
│   ├── ui/                # Komponen UI dasar (shadcn/ui)
│   └── shared/            # Komponen reusable (OrderCard, BottomNav, dll)
├── lib/
│   ├── supabase/          # Supabase client (server & browser)
│   └── schemas.ts         # Zod validation schemas
├── supabase/migrations/   # SQL migrations (schema, RLS, seed)
└── proxy.ts               # Middleware (session refresh + route protection)
```

## Cara Menjalankan Lokal

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd titipin
npm install
```

### 2. Setup environment

Buat file `.env.local` di root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 3. Jalankan SQL migrations

Buka Supabase SQL Editor dan jalankan file-file berikut secara berurutan:

1. `supabase/migrations/001_schema.sql` — tabel utama + triggers
2. `supabase/migrations/002_rls.sql` — Row Level Security policies
3. `supabase/migrations/003_seed.sql` — data awal (kantin & tenant)
4. `supabase/migrations/004_menus.sql` — tabel menus
5. `supabase/migrations/005_roles.sql` — kolom role di profiles
6. `supabase/migrations/005b_update_trigger.sql` — update trigger user baru
7. `supabase/migrations/006_reviews.sql` — tabel reviews

### 4. Konfigurasi Supabase Auth

Di dashboard Supabase → Authentication → Settings:
- Matikan **Email Confirmation** (untuk development)

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Alur Penggunaan

### Sebagai Penitip (Mahasiswa)
1. Daftar / masuk sebagai Mahasiswa
2. Klik **Buat Titipan** → pilih kantin → pilih warung → pilih menu → isi detail antar
3. Tunggu jastiper mengambil order
4. Konfirmasi penerimaan → beri rating jastiper

### Sebagai Jastiper (Mahasiswa)
1. Masuk sebagai Mahasiswa
2. Buka tab **Cari Order** → lihat daftar order yang menunggu
3. Ambil order → laporkan progres (belanja → antar)
4. Selesai setelah penitip konfirmasi terima

### Sebagai Pemilik Warung
1. Daftar / masuk sebagai Pemilik Warung
2. Klaim warung di **Klaim Warung**
3. Kelola menu di **Menu Saya** — tambah, edit, hapus item beserta harganya

## Tim

| Nama | Role |
|---|---|
| _(nama anggota 1)_ | Fullstack |
| _(nama anggota 2)_ | Fullstack |
| _(nama anggota 3)_ | Fullstack |
