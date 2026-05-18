-- ============================================================
-- FILE 004: Fitur Menu & Pemilik Warung
-- Jalankan di Supabase SQL Editor setelah file 001-003
-- ============================================================

-- Tambah kolom owner_id ke tabel tenants
-- Pemilik warung akan dilink ke profil mereka lewat kolom ini
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ============================================================
-- TABEL: menus
-- Daftar menu yang dijual oleh setiap tenant
-- ============================================================
CREATE TABLE IF NOT EXISTS public.menus (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        INTEGER NOT NULL DEFAULT 0,   -- harga dalam Rupiah
  is_available BOOLEAN DEFAULT TRUE,          -- bisa diatur on/off oleh pemilik
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- RLS untuk tabel menus
-- ============================================================
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

-- Semua user yang login bisa lihat menu yang tersedia
CREATE POLICY "menus: semua user bisa lihat"
  ON public.menus FOR SELECT
  TO authenticated
  USING (TRUE);

-- Hanya pemilik tenant yang bisa tambah menu
CREATE POLICY "menus: pemilik bisa tambah menu"
  ON public.menus FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants t
      WHERE t.id = tenant_id AND t.owner_id = auth.uid()
    )
  );

-- Hanya pemilik tenant yang bisa edit menu
CREATE POLICY "menus: pemilik bisa edit menu"
  ON public.menus FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants t
      WHERE t.id = tenant_id AND t.owner_id = auth.uid()
    )
  );

-- Hanya pemilik tenant yang bisa hapus menu
CREATE POLICY "menus: pemilik bisa hapus menu"
  ON public.menus FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants t
      WHERE t.id = tenant_id AND t.owner_id = auth.uid()
    )
  );

-- ============================================================
-- RLS tambahan untuk tenants — klaim warung
-- ============================================================

-- User bisa update tenant (untuk klaim) HANYA kalau tenant belum punya owner
-- Atau dia sendiri yang jadi owner-nya
CREATE POLICY "tenants: bisa klaim yang belum ada pemilik"
  ON public.tenants FOR UPDATE
  TO authenticated
  USING (owner_id IS NULL OR owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());
