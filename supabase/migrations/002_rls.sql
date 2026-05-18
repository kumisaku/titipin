-- ============================================================
-- FILE 002: Row Level Security (RLS)
-- Jalankan file ini KEDUA, setelah 001_schema.sql
-- ============================================================
-- RLS = "satpam" di level database
-- Tanpa RLS: siapapun yang punya anon key bisa baca SEMUA data
-- Dengan RLS: setiap user hanya bisa akses data yang diizinkan
-- auth.uid() = fungsi Supabase untuk mendapatkan ID user yang sedang login
-- ============================================================

-- ============================================================
-- AKTIFKAN RLS di semua tabel
-- ============================================================
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kantins   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES: profiles
-- ============================================================

-- Siapapun yang login bisa lihat profile orang lain (untuk tampilkan nama jastiper/penitip)
CREATE POLICY "profiles: semua user bisa lihat"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (TRUE);

-- User hanya bisa edit profile miliknya sendiri
CREATE POLICY "profiles: hanya bisa edit milik sendiri"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- POLICIES: kantins
-- Kantin adalah data publik — semua user yang login boleh lihat
-- ============================================================
CREATE POLICY "kantins: semua user bisa lihat"
  ON public.kantins FOR SELECT
  TO authenticated
  USING (TRUE);

-- ============================================================
-- POLICIES: tenants
-- Tenant juga data publik
-- ============================================================
CREATE POLICY "tenants: semua user bisa lihat"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (TRUE);

-- ============================================================
-- POLICIES: orders
-- Ini yang paling kompleks — ada beberapa aturan berbeda
-- ============================================================

-- SELECT: User bisa lihat order yang:
-- 1. Status-nya 'waiting' (feed publik untuk jastiper), ATAU
-- 2. Dia yang pesan (sebagai customer), ATAU
-- 3. Dia yang ngantarin (sebagai runner)
CREATE POLICY "orders: bisa lihat order sendiri atau yang waiting"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    status = 'waiting'
    OR customer_id = auth.uid()
    OR runner_id = auth.uid()
  );

-- INSERT: Hanya user yang login bisa buat order
-- customer_id harus = id user yang sedang login (tidak bisa bikin order atas nama orang lain)
CREATE POLICY "orders: user bisa buat order sendiri"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- UPDATE: User hanya bisa update order yang melibatkan dia
-- (sebagai customer ATAU runner)
-- Validasi lebih detail (siapa boleh update ke status apa) dilakukan di Server Action
CREATE POLICY "orders: bisa update order yang melibatkan diri sendiri"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid()
    OR runner_id = auth.uid()
    -- Jastiper baru bisa update (accept) order yang masih waiting
    -- meskipun runner_id masih NULL saat itu
    OR (status = 'waiting' AND runner_id IS NULL)
  )
  WITH CHECK (
    customer_id = auth.uid()
    OR runner_id = auth.uid()
    OR auth.uid() IS NOT NULL  -- untuk kasus accept: runner_id baru diisi
  );

-- ============================================================
-- POLICIES: reviews
-- ============================================================

-- SELECT: Siapapun yang login bisa lihat review (untuk tampilkan rating)
CREATE POLICY "reviews: semua user bisa lihat"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (TRUE);

-- INSERT: User hanya bisa buat review untuk order yang:
-- 1. Sudah completed
-- 2. Dia terlibat (sebagai customer atau runner)
-- 3. Belum pernah review dari akun yang sama
CREATE POLICY "reviews: bisa buat review untuk order yang completed dan terlibat"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
        AND o.status = 'completed'
        AND (o.customer_id = auth.uid() OR o.runner_id = auth.uid())
    )
  );
