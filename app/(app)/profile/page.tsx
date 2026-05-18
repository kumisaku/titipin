// Halaman Profil User — route: /profile
// Menampilkan info akun, statistik order, dan rating (khusus jastiper)

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/shared/LogoutButton"
import { StatusBadge } from "@/components/shared/StatusBadge"

export const revalidate = 0

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const isMahasiswa = profile?.role !== "pemilik_warung"

  // Statistik order sebagai penitip
  const { data: asCustomer } = await supabase
    .from("orders")
    .select("id, status")
    .eq("customer_id", user.id)

  // Statistik order sebagai jastiper
  const { data: asRunner } = await supabase
    .from("orders")
    .select("id, status, jastip_fee")
    .eq("runner_id", user.id)

  // Rating yang diterima sebagai jastiper
  const { data: reviewsReceived } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", user.id)

  const totalAsCustomer   = asCustomer?.length ?? 0
  const doneAsCustomer    = asCustomer?.filter(o => o.status === "completed").length ?? 0
  const totalAsRunner     = asRunner?.length ?? 0
  const doneAsRunner      = asRunner?.filter(o => o.status === "completed").length ?? 0
  const totalEarned       = asRunner?.filter(o => o.status === "completed")
                              .reduce((s, o) => s + (o.jastip_fee ?? 0), 0) ?? 0
  const avgRating         = reviewsReceived && reviewsReceived.length > 0
    ? (reviewsReceived.reduce((s, r) => s + r.rating, 0) / reviewsReceived.length).toFixed(1)
    : null

  const roleLabel = profile?.role === "pemilik_warung" ? "Pemilik Warung" : "Mahasiswa"
  const initials  = (profile?.full_name ?? user.email ?? "?")
    .split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <LogoutButton />
      </div>

      {/* Avatar & info dasar */}
      <div className="bg-orange-500 rounded-2xl p-6 text-white flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-lg leading-tight truncate">{profile?.full_name ?? "—"}</p>
          <p className="text-orange-100 text-sm">{user.email}</p>
          <p className="text-orange-200 text-xs mt-1">{roleLabel}</p>
          {profile?.nim && <p className="text-orange-200 text-xs">NIM: {profile.nim}</p>}
          {profile?.phone && <p className="text-orange-200 text-xs">📱 {profile.phone}</p>}
        </div>
      </div>

      {/* Rating jastiper — tampil kalau pernah jadi runner */}
      {avgRating && (
        <div className="border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Rating Jastipermu</p>
            <p className="text-3xl font-bold text-orange-600">⭐ {avgRating}</p>
            <p className="text-xs text-muted-foreground mt-0.5">dari {reviewsReceived?.length} review</p>
          </div>
          <div className="text-5xl opacity-20">🏃</div>
        </div>
      )}

      {/* Statistik — hanya untuk mahasiswa */}
      {isMahasiswa && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Statistik</h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Sebagai penitip */}
            <div className="border rounded-2xl p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Sebagai Penitip</p>
              <p className="text-2xl font-bold">{totalAsCustomer}</p>
              <p className="text-xs text-muted-foreground">total titipan</p>
              <p className="text-sm font-medium text-green-600">{doneAsCustomer} selesai</p>
            </div>

            {/* Sebagai jastiper */}
            <div className="border rounded-2xl p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Sebagai Jastiper</p>
              <p className="text-2xl font-bold">{totalAsRunner}</p>
              <p className="text-xs text-muted-foreground">order diambil</p>
              <p className="text-sm font-medium text-green-600">{doneAsRunner} selesai</p>
            </div>
          </div>

          {/* Total fee yang didapat */}
          {totalEarned > 0 && (
            <div className="border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fee Jastip Diterima</p>
                <p className="text-xl font-bold text-orange-600">
                  Rp {totalEarned.toLocaleString("id-ID")}
                </p>
              </div>
              <span className="text-3xl opacity-30">💰</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
