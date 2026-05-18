// Halaman Detail Order — route: /orders/[id]
// Menampilkan semua info order: status, penitip, jastiper, items, aksi

import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { MapPin, Clock, CreditCard } from "lucide-react"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { UserCard } from "@/components/shared/UserCard"
import { OrderActions } from "@/components/shared/OrderActions"
import { ReviewForm } from "@/components/shared/ReviewForm"

export const revalidate = 0

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch order dengan semua relasi yang dibutuhkan
  // Supabase join dengan nama alias: customer dan runner
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      tenants ( name, food_type, kantins ( name, location_building ) ),
      customer:profiles!orders_customer_id_fkey ( id, full_name, phone ),
      runner:profiles!orders_runner_id_fkey ( id, full_name, phone )
    `)
    .eq("id", id)
    .single()

  if (!order) notFound()

  // Cek apakah sudah ada review untuk order ini
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id, rating, comment")
    .eq("order_id", id)
    .maybeSingle()

  // Cek apakah user berhak lihat order ini
  // (RLS sudah handle ini di DB, tapi double check di app layer)
  const isCustomer = user.id === order.customer_id
  const isRunner   = user.id === order.runner_id
  const isWaiting  = order.status === "waiting"
  if (!isCustomer && !isRunner && !isWaiting) redirect("/orders/feed")

  const items = order.items as { name: string; quantity: number; notes?: string; estimated_price: number }[]
  const itemsTotal = items.reduce((s, i) => s + i.estimated_price * i.quantity, 0)
  const tenant = order.tenants as any
  const customer = order.customer as any
  const runner = order.runner as any

  const paymentLabel = order.payment_method === "cash" ? "💵 Tunai" : "📱 Transfer"

  return (
    <div className="space-y-5 pb-36">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <StatusBadge status={order.status} />
        </div>
        <h1 className="text-xl font-bold">{tenant?.name}</h1>
        <p className="text-muted-foreground text-sm">{tenant?.kantins?.name} — {tenant?.kantins?.location_building}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Timeline status */}
      <div className="border rounded-2xl p-4">
        <StatusTimeline status={order.status} />
      </div>

      {/* Info penitip & jastiper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {customer && (
          <UserCard label="Penitip" profile={customer} />
        )}
        {runner ? (
          <UserCard label="Jastiper" profile={runner} />
        ) : (
          <div className="border rounded-xl p-4 border-dashed flex items-center justify-center text-muted-foreground text-sm">
            Menunggu jastiper…
          </div>
        )}
      </div>

      {/* Daftar item pesanan */}
      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">Pesanan</h2>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between gap-4 text-sm">
              <div className="flex-1">
                <p className="font-medium">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></p>
                {item.notes && <p className="text-muted-foreground text-xs">{item.notes}</p>}
              </div>
              <p className="font-medium shrink-0">
                Rp {(item.estimated_price * item.quantity).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>Rp {itemsTotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Fee Jastip</span>
            <span>Rp {order.jastip_fee.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="text-orange-600">Rp {order.total_estimate.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Info pengantaran */}
      <div className="border rounded-2xl p-4 space-y-2 text-sm">
        <h2 className="font-semibold mb-3">Detail Pengantaran</h2>

        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin size={16} className="shrink-0 mt-0.5" />
          <span>{order.delivery_location}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} className="shrink-0" />
          <span>
            Deadline: {format(new Date(order.deadline), "EEEE, dd MMMM yyyy · HH:mm", { locale: localeId })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard size={16} className="shrink-0" />
          <span>Pembayaran: {paymentLabel}</span>
        </div>

        {order.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mt-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Catatan</p>
            <p>{order.notes}</p>
          </div>
        )}
      </div>

      {/* Form review — hanya muncul kalau order selesai dan penitip belum review */}
      {order.status === "completed" && isCustomer && runner && !existingReview && (
        <ReviewForm orderId={order.id} runnerName={runner.full_name} />
      )}

      {/* Review yang sudah dikirim */}
      {order.status === "completed" && existingReview && (
        <div className="border rounded-2xl p-5 bg-green-50 border-green-200 space-y-1">
          <h2 className="font-semibold text-green-800">Review Kamu</h2>
          <p className="text-lg">{"⭐".repeat(existingReview.rating)}</p>
          {existingReview.comment && (
            <p className="text-sm text-green-700">{existingReview.comment}</p>
          )}
        </div>
      )}

      {/* Tombol aksi — fixed di bawah layar, di atas BottomNav (tinggi ~64px) */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t max-w-screen-md mx-auto">
        <OrderActions
          orderId={order.id}
          status={order.status}
          customerId={order.customer_id}
          runnerId={order.runner_id}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}
