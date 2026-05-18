"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// ============================================================
// KLAIM WARUNG
// User mengklaim tenant yang belum punya pemilik
// ============================================================
export async function claimTenant(tenantId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  // Cek apakah tenant sudah punya owner
  const { data: tenant } = await supabase
    .from("tenants")
    .select("owner_id, name")
    .eq("id", tenantId)
    .single()

  if (!tenant) return { error: "Warung tidak ditemukan." }
  if (tenant.owner_id) return { error: "Warung ini sudah punya pemilik." }

  const { error } = await supabase
    .from("tenants")
    .update({ owner_id: user.id })
    .eq("id", tenantId)

  if (error) return { error: "Gagal mengklaim warung." }

  // Setelah berhasil klaim → redirect ke halaman manage
  redirect(`/tenant/manage`)
}

// ============================================================
// TAMBAH MENU ITEM
// ============================================================
export async function addMenuItem(formData: {
  tenant_id: string
  name: string
  description?: string
  price: number
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  // Verifikasi user adalah pemilik tenant ini
  const { data: tenant } = await supabase
    .from("tenants")
    .select("owner_id")
    .eq("id", formData.tenant_id)
    .single()

  if (tenant?.owner_id !== user.id) {
    return { error: "Kamu bukan pemilik warung ini." }
  }

  const { error } = await supabase.from("menus").insert({
    tenant_id: formData.tenant_id,
    name: formData.name,
    description: formData.description || null,
    price: formData.price,
    is_available: true,
  })

  if (error) return { error: "Gagal menambah menu." }

  // revalidatePath memberitahu Next.js bahwa halaman ini perlu di-refresh
  revalidatePath("/tenant/manage")
  return { success: true }
}

// ============================================================
// UPDATE MENU ITEM
// ============================================================
export async function updateMenuItem(
  menuId: string,
  data: { name?: string; description?: string; price?: number; is_available?: boolean }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  const { error } = await supabase
    .from("menus")
    .update(data)
    .eq("id", menuId)

  if (error) return { error: "Gagal mengupdate menu." }

  revalidatePath("/tenant/manage")
  return { success: true }
}

// ============================================================
// HAPUS MENU ITEM
// ============================================================
export async function deleteMenuItem(menuId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi habis, silakan login ulang." }

  const { error } = await supabase
    .from("menus")
    .delete()
    .eq("id", menuId)

  if (error) return { error: "Gagal menghapus menu." }

  revalidatePath("/tenant/manage")
  return { success: true }
}
