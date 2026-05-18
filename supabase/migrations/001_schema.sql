-- ============================================================
-- FILE 001: Schema — Membuat semua tabel database Titip.in
-- Jalankan file ini PERTAMA di Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TABEL: profiles
-- Menyimpan data tambahan user selain email & password
-- Supabase Auth sudah punya tabel auth.users (email, password, dll)
-- Kita extend dengan tabel profiles untuk data seperti NIM, nama, dll
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  -- id sama dengan id di auth.users (relasi 1-to-1)
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  nim         TEXT,                    -- Nomor Induk Mahasiswa
  phone       TEXT,
  avatar_url  TEXT,                    -- URL foto profil (fitur fase 2)
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABEL: kantins
-- Daftar kantin yang ada di kampus
-- ============================================================
CREATE TABLE IF NOT EXISTS public.kantins (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  location_building   TEXT NOT NULL,   -- Contoh: "Gedung A", "Fakultas Teknik"
  description         TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABEL: tenants
-- Warung/stan yang ada di dalam kantin
-- Satu kantin bisa punya banyak tenant
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kantin_id   UUID NOT NULL REFERENCES public.kantins(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  food_type   TEXT,                    -- Contoh: "Nasi & Lauk", "Minuman", "Snack"
  open_time   TIME,                    -- Contoh: 07:00
  close_time  TIME,                    -- Contoh: 16:00
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABEL: orders
-- Inti dari aplikasi — setiap titipan adalah satu order
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Siapa yang memesan (penitip)
  customer_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Siapa yang mengantarkan (jastiper) — nullable karena belum ada saat order dibuat
  runner_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Di tenant mana pesan
  tenant_id         UUID NOT NULL REFERENCES public.tenants(id) ON DELETE RESTRICT,

  -- Daftar item yang dipesan — disimpan sebagai JSON array
  -- Contoh: [{"name": "Nasi Goreng", "quantity": 1, "notes": "pedas", "estimated_price": 15000}]
  items             JSONB NOT NULL DEFAULT '[]',

  -- Detail pengantaran
  delivery_location TEXT NOT NULL,     -- Contoh: "Ruang 301 Gedung B"
  deadline          TIMESTAMPTZ NOT NULL,
  jastip_fee        INTEGER NOT NULL DEFAULT 0,  -- dalam Rupiah
  total_estimate    INTEGER NOT NULL DEFAULT 0,  -- total harga item + jastip_fee

  -- Metode pembayaran
  payment_method    TEXT NOT NULL CHECK (payment_method IN ('cash', 'transfer')),

  -- Status order mengikuti flow:
  -- waiting → accepted → purchasing → delivering → completed
  -- atau: waiting/accepted → cancelled
  status            TEXT NOT NULL DEFAULT 'waiting'
                    CHECK (status IN ('waiting', 'accepted', 'purchasing', 'delivering', 'completed', 'cancelled')),

  notes             TEXT,              -- Catatan tambahan dari penitip

  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at      TIMESTAMPTZ                          -- diisi saat status = completed
);

-- ============================================================
-- TABEL: reviews
-- Review setelah order selesai — dua arah (penitip → jastiper & sebaliknya)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Satu order hanya boleh punya satu review per pasangan reviewer-reviewee
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reviewer_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  -- yang memberi review
  reviewee_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  -- yang menerima review

  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Satu order hanya boleh di-review sekali oleh reviewer yang sama
  UNIQUE(order_id, reviewer_id)
);

-- ============================================================
-- FUNGSI & TRIGGER: Auto-update updated_at di tabel orders
-- Setiap kali row di orders diupdate, kolom updated_at otomatis terisi
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNGSI & TRIGGER: Auto-create profile saat user register
-- Saat user baru dibuat di auth.users, otomatis buat row di profiles
-- Ini mencegah user yang sudah register tapi belum punya profile
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, nim, phone)
  VALUES (
    NEW.id,
    -- Ambil dari metadata yang kita kirim saat register
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'nim', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
