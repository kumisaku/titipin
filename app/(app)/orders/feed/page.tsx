// Halaman Feed Order — route: /orders/feed
// Jastiper cari order yang tersedia untuk diambil

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrderCard } from "@/components/shared/OrderCard"

export const metadata = { title: "Cari Order — Titip.in" }

// revalidate 0 = halaman ini selalu fresh (tidak di-cache)
// Penting agar order baru langsung muncul
export const revalidate = 0

export default async function OrderFeedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Ambil semua order yang masih waiting
  // RLS sudah memastikan order waiting bisa dilihat semua user
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, status, jastip_fee, deadline, delivery_location, items,
      tenants ( name, kantins ( name ) )
    `)
    .eq("status", "waiting")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-4 pb-12">
      <div>
        <h1 className="text-2xl font-bold">Cari Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ambil order, antarkan, dan dapat fee jastip!
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-5xl mb-3">🏃</p>
          <p className="font-medium">Belum ada order yang tersedia</p>
          <p className="text-sm mt-1">Cek lagi nanti atau beritahu temanmu untuk buat titipan!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{orders.length} order tersedia</p>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order as any}
              mode="feed"
            />
          ))}
        </div>
      )}
    </div>
  )
}
