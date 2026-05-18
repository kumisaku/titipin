-- Tabel reviews: penitip memberi rating ke jastiper setelah order selesai
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),  -- penitip
  reviewee_id UUID NOT NULL REFERENCES profiles(id),  -- jastiper
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  -- Satu order hanya boleh punya satu review
  UNIQUE (order_id)
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Semua user yang login bisa baca review (untuk tampilkan rating jastiper)
CREATE POLICY "reviews_select" ON reviews
  FOR SELECT TO authenticated USING (true);

-- Hanya penitip (reviewer) yang bisa buat review, dan hanya untuk order miliknya
CREATE POLICY "reviews_insert" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = auth.uid());
