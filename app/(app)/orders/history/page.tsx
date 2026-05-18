// Halaman Riwayat Order — route: /orders/history
// Menampilkan semua order user (sebagai penitip maupun jastiper), dikelompokkan per status

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { OrderCard } from "@/components/shared/OrderCard"

export const revalidate = 0

export default async function OrderHistoryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Ambil SEMUA order user (aktif + selesai + batal), terbaru dulu
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, status, jastip_fee, deadline, delivery_location, items, created_at,
      tenants ( name, kantins ( name ) )
    `)
    .or(`customer_id.eq.${user.id},runner_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  const activeOrders    = orders?.filter(o => !["completed", "cancelled"].includes(o.status)) ?? []
  const completedOrders = orders?.filter(o => o.status === "completed") ?? []
  const cancelledOrders = orders?.filter(o => o.status === "cancelled") ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Order</h1>

      {/* Kosong sama sekali */}
      {(!orders || orders.length === 0) && (
        <div className="border rounded-2xl p-8 text-center text-muted-foreground space-y-2">
          <p className="text-4xl">📋</p>
          <p className="font-medium">Belum ada order</p>
          <p className="text-sm">Buat titipan pertamamu sekarang!</p>
          <Link href="/orders/new">
            <div className="inline-block mt-2 bg-orange-500 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors">
              Buat Titipan
            </div>
          </Link>
        </div>
      )}

      {/* Order aktif */}
      {activeOrders.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Sedang Berlangsung</h2>
          {activeOrders.map(order => (
            <OrderCard key={order.id} order={order as any} mode="history" />
          ))}
        </section>
      )}

      {/* Order selesai */}
      {completedOrders.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Selesai</h2>
          {completedOrders.map(order => (
            <OrderCard key={order.id} order={order as any} mode="history" />
          ))}
        </section>
      )}

      {/* Order dibatalkan */}
      {cancelledOrders.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Dibatalkan</h2>
          {cancelledOrders.map(order => (
            <OrderCard key={order.id} order={order as any} mode="history" />
          ))}
        </section>
      )}
    </div>
  )
}
