// Supabase Server Client
// Dipakai di Server Components dan Server Actions
// Server client bisa membaca cookies untuk tahu siapa user yang sedang login

// "server-only" mencegah file ini tidak sengaja diimport di client component
import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Fungsi ini membuat koneksi ke Supabase dari sisi server
// Harus async karena cookies() di Next.js 16 mengembalikan Promise
export async function createClient() {
  // Di Next.js 16, cookies() harus di-await (ini perubahan dari Next.js 14)
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase SSR perlu akses cookies untuk menyimpan session user
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll dipanggil dari Server Component — error ini bisa diabaikan
            // karena cookies hanya bisa di-set dari Server Action atau Route Handler
          }
        },
      },
    }
  )
}
