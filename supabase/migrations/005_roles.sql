-- ============================================================
-- FILE 005: Tambah kolom role ke tabel profiles
-- Jalankan setelah file 001-004
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'mahasiswa'
  CHECK (role IN ('mahasiswa', 'pemilik_warung'));
