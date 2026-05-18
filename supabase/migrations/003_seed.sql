-- ============================================================
-- FILE 003: Seed Data — Data awal kantin & tenant
-- Jalankan file ini KETIGA, setelah 001 dan 002
-- ============================================================
-- "Seed data" = data awal yang kita masukkan supaya app tidak kosong saat pertama dibuka
-- Data user (penitip/jastiper) tidak bisa di-seed di sini
-- karena harus dibuat lewat Supabase Auth (punya password hash, dll)
-- ============================================================

-- ============================================================
-- KANTIN
-- ============================================================
INSERT INTO public.kantins (id, name, location_building, description) VALUES
  (
    'a1b2c3d4-0001-0000-0000-000000000001',
    'Kantin Pusat',
    'Gedung Rektorat Lt. 1',
    'Kantin utama kampus dengan pilihan menu terlengkap. Buka setiap hari kerja.'
  ),
  (
    'a1b2c3d4-0002-0000-0000-000000000002',
    'Kantin Teknik',
    'Gedung Fakultas Teknik',
    'Kantin khusus area fakultas teknik. Dekat lab dan ruang kelas.'
  ),
  (
    'a1b2c3d4-0003-0000-0000-000000000003',
    'Kantin FEB',
    'Gedung Fakultas Ekonomi & Bisnis',
    'Kantin di area FEB. Terkenal dengan menu mie ayam dan es teh-nya.'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TENANT (warung dalam kantin)
-- ============================================================
INSERT INTO public.tenants (kantin_id, name, food_type, open_time, close_time) VALUES
  -- Kantin Pusat
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Bu Sari', 'Nasi & Lauk', '07:00', '15:00'),
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Bakso Pak Budi', 'Bakso & Mie', '08:00', '16:00'),
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Es & Jus Segar', 'Minuman', '07:00', '16:00'),
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Warung Padang Mini', 'Nasi Padang', '07:30', '14:00'),

  -- Kantin Teknik
  ('a1b2c3d4-0002-0000-0000-000000000002', 'Nasi Goreng Mas Agus', 'Nasi Goreng', '08:00', '15:00'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'Gorengan & Snack', 'Snack', '07:00', '17:00'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'Kopi & Minuman', 'Minuman & Kopi', '07:00', '16:00'),

  -- Kantin FEB
  ('a1b2c3d4-0003-0000-0000-000000000003', 'Mie Ayam & Bakso Bu Rini', 'Mie & Bakso', '08:00', '15:00'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'Warteg Pak Joko', 'Nasi & Lauk', '07:00', '14:00'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'Es Teh & Minuman Segar', 'Minuman', '07:30', '16:00')

ON CONFLICT DO NOTHING;
