import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogoutButton } from "@/components/shared/LogoutButton"
import { OrderCard } from "@/components/shared/OrderCard"

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const isPemilik = profile?.role === "pemilik_warung"

  const { data: myTenant } = isPemilik
    ? await supabase.from("tenants").select("id, name").eq("owner_id", user.id).single()
    : { data: null }

  // ============================================================
  // DASHBOARD PEMILIK WARUNG
  // ============================================================
  if (isPemilik) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pemilik Warung</p>
            <h1 className="text-2xl font-bold">{profile?.full_name} 👋</h1>
          </div>
          <LogoutButton />
        </div>

        {myTenant ? (
          <>
            <div className="bg-orange-500 text-white rounded-2xl p-6">
              <p className="text-orange-100 text-sm mb-1">Warung Saya</p>
              <h2 className="text-xl font-bold">{myTenant.name}</h2>
            </div>
            <Link href="/tenant/manage">
              <div className="border rounded-2xl p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">🍽️ Kelola Menu</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Tambah, edit, atau hapus menu</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>
            </Link>
          </>
        ) : (
          <div className="border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center space-y-3">
            <p className="text-4xl">🏪</p>
            <h2 className="font-semibold text-lg">Belum ada warung terdaftar</h2>
            <p className="text-muted-foreground text-sm">
              Klaim warung kamu untuk mulai mengelola menu dan harga
            </p>
            <Link href="/tenant/claim">
              <div className="inline-block mt-2 bg-orange-500 text-white rounded-xl px-6 py-3 font-medium hover:bg-orange-600 transition-colors">
                Klaim Warung Sekarang
              </div>
            </Link>
          </div>
        )}
      </div>
    )
  }

  // ============================================================
  // DASHBOARD MAHASISWA — fetch order aktif
  // ============================================================
  // Order aktif = semua order yang belum selesai/dibatalkan, sebagai penitip ATAU jastiper
  const { data: activeOrders } = await supabase
    .from("orders")
    .select(`
      id, status, jastip_fee, deadline, delivery_location, items,
      tenants ( name, kantins ( name ) )
    `)
    .or(`customer_id.eq.${user.id},runner_id.eq.${user.id}`)
    .not("status", "in", '("completed","cancelled")')
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Mahasiswa</p>
          <h1 className="text-2xl font-bold">Halo, {profile?.full_name || user.email}! 👋</h1>
        </div>
        <LogoutButton />
      </div>

      {/* Tombol aksi utama */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/orders/new">
          <div className="bg-orange-500 text-white rounded-2xl p-5 hover:bg-orange-600 transition-colors h-full">
            <div className="text-2xl mb-2">📋</div>
            <h2 className="font-semibold">Buat Titipan</h2>
            <p className="text-orange-100 text-sm mt-0.5">Pesan makanan</p>
          </div>
        </Link>
        <Link href="/orders/feed">
          <div className="bg-white border rounded-2xl p-5 hover:bg-gray-50 transition-colors h-full">
            <div className="text-2xl mb-2">🏃</div>
            <h2 className="font-semibold">Cari Order</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Dapat fee jastip</p>
          </div>
        </Link>
      </div>

      {/* Order aktif — ini yang hilang sebelumnya! */}
      {activeOrders && activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Order Aktif</h2>
            <Link href="/orders/history" className="text-sm text-orange-600 hover:underline">
              Lihat semua →
            </Link>
          </div>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order as any} mode="history" />
          ))}
        </div>
      )}

      {/* Kalau tidak ada order aktif */}
      {(!activeOrders || activeOrders.length === 0) && (
        <div className="border rounded-2xl p-5 text-center text-muted-foreground">
          <p className="text-3xl mb-2">🍽️</p>
          <p className="text-sm">Belum ada order aktif</p>
          <p className="text-xs mt-1">Buat titipan atau ambil order untuk mulai!</p>
        </div>
      )}
    </div>
  )
}
