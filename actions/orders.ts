"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { NewOrderFormData } from "@/lib/schemas"

// ============================================================
// BUAT ORDER BARU
// ============================================================
export async function createOrder(formData: NewOrderFormData) {
  const supabase = await createClient()

  // Pastikan user sudah login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  // Hitung total estimasi: jumlah semua (harga × qty) + fee jastip
  const itemsTotal = formData.items.reduce(
    (sum, item) => sum + item.estimated_price * item.quantity,
    0
  )
  const totalEstimate = itemsTotal + formData.jastip_fee

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id: user.id,
      tenant_id: formData.tenant_id,
      items: formData.items,
      delivery_location: formData.delivery_location,
      // Konversi string datetime-local ke format ISO yang dimengerti PostgreSQL
      deadline: new Date(formData.deadline).toISOString(),
      jastip_fee: formData.jastip_fee,
      total_estimate: totalEstimate,
      payment_method: formData.payment_method,
      notes: formData.notes || null,
      status: "waiting",
    })
    .select()
    .single()

  if (error) {
    console.error("createOrder error:", error)
    return { error: "Gagal membuat titipan. Silakan coba lagi." }
  }

  // Berhasil → redirect ke halaman detail order
  redirect(`/orders/${order.id}`)
}

// ============================================================
// AMBIL ORDER (jastiper accept)
// ============================================================
export async function acceptOrder(orderId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  // Cek apakah order masih waiting
  const { data: order } = await supabase
    .from("orders")
    .select("status, customer_id")
    .eq("id", orderId)
    .single()

  if (!order) return { error: "Order tidak ditemukan." }
  if (order.status !== "waiting") return { error: "Order ini sudah diambil." }
  if (order.customer_id === user.id) return { error: "Tidak bisa mengambil order sendiri." }

  const { error } = await supabase
    .from("orders")
    .update({ runner_id: user.id, status: "accepted" })
    .eq("id", orderId)
    .eq("status", "waiting") // double-check di query agar tidak race condition

  if (error) return { error: "Gagal mengambil order." }

  redirect(`/orders/${orderId}`)
}

// ============================================================
// UPDATE STATUS ORDER (sesuai flow)
// ============================================================

// Map: status sekarang → status berikutnya yang valid
const STATUS_FLOW: Record<string, string> = {
  accepted: "purchasing",
  purchasing: "delivering",
  delivering: "completed",
}

// Siapa yang boleh update ke status tertentu
const STATUS_ACTOR: Record<string, "runner" | "customer"> = {
  purchasing: "runner",   // jastiper mulai beli
  delivering: "runner",   // jastiper mulai antar
  completed: "customer",  // penitip konfirmasi terima
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  // Ambil data order untuk validasi
  const { data: order } = await supabase
    .from("orders")
    .select("status, customer_id, runner_id")
    .eq("id", orderId)
    .single()

  if (!order) return { error: "Order tidak ditemukan." }

  // Validasi: apakah transisi status ini valid?
  const expectedNext = STATUS_FLOW[order.status]
  if (expectedNext !== newStatus) {
    return { error: "Perubahan status tidak valid." }
  }

  // Validasi: apakah user yang request punya hak untuk update?
  const requiredActor = STATUS_ACTOR[newStatus]
  const isRunner = order.runner_id === user.id
  const isCustomer = order.customer_id === user.id

  if (requiredActor === "runner" && !isRunner) {
    return { error: "Hanya jastiper yang bisa melakukan aksi ini." }
  }
  if (requiredActor === "customer" && !isCustomer) {
    return { error: "Hanya penitip yang bisa melakukan aksi ini." }
  }

  const updateData: any = { status: newStatus }
  // Kalau order completed, catat waktu selesainya
  if (newStatus === "completed") {
    updateData.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)

  if (error) return { error: "Gagal update status." }

  return { success: true }
}

// ============================================================
// CANCEL ORDER
// ============================================================
export async function cancelOrder(orderId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  const { data: order } = await supabase
    .from("orders")
    .select("status, customer_id")
    .eq("id", orderId)
    .single()

  if (!order) return { error: "Order tidak ditemukan." }
  if (order.customer_id !== user.id) return { error: "Hanya penitip yang bisa membatalkan." }
  if (!["waiting", "accepted"].includes(order.status)) {
    return { error: "Order tidak bisa dibatalkan di tahap ini." }
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)

  if (error) return { error: "Gagal membatalkan order." }

  return { success: true }
}
