// Supabase Browser Client
// Dipakai di Client Components — komponen yang ada "use client" di atasnya
// Contoh: form interaktif, tombol yang butuh aksi real-time

import { createBrowserClient } from "@supabase/ssr"

// Fungsi ini membuat koneksi ke Supabase dari sisi browser
// Dipanggil setiap kali komponen perlu akses database dari client
export function createClient() {
  return createBrowserClient(
    // Dua nilai ini diambil dari file .env.local
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
