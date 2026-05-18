"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitReview(orderId: string, rating: number, comment: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Kamu harus login" }

  // Ambil data order untuk validasi
  const { data: order } = await supabase
    .from("orders")
    .select("id, status, customer_id, runner_id")
    .eq("id", orderId)
    .single()

  if (!order) return { error: "Order tidak ditemukan" }
  if (order.status !== "completed") return { error: "Order belum selesai" }
  if (order.customer_id !== user.id) return { error: "Hanya penitip yang bisa memberi review" }
  if (!order.runner_id) return { error: "Order ini tidak punya jastiper" }

  const { error } = await supabase.from("reviews").insert({
    order_id: orderId,
    reviewer_id: user.id,
    reviewee_id: order.runner_id,
    rating,
    comment: comment.trim() || null,
  })

  if (error) {
    // Kode 23505 = unique constraint — berarti sudah pernah review order ini
    if (error.code === "23505") return { error: "Kamu sudah memberi review untuk order ini" }
    return { error: "Gagal menyimpan review" }
  }

  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}
