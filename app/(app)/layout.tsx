// Layout untuk semua halaman yang butuh login
// Di sini kita pasang BottomNav yang muncul di semua halaman dalam folder (app)/

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Ambil role untuk menentukan tab navigasi yang tampil
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = (profile?.role ?? "mahasiswa") as "mahasiswa" | "pemilik_warung"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Konten halaman — pb-20 agar tidak tertutup navbar bawah */}
      <main className="max-w-screen-md mx-auto px-4 pt-6 pb-24">
        {children}
      </main>

      <BottomNav role={role} />
    </div>
  )
}
