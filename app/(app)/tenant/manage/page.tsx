// Halaman Kelola Menu — route: /tenant/manage
// Hanya bisa diakses oleh user yang sudah klaim warung

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MenuManager } from "@/components/shared/MenuManager"

export const metadata = { title: "Kelola Menu — Titip.in" }

export default async function ManageTenantPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Ambil warung milik user ini beserta menu-nya
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, name, food_type, open_time, close_time, menus(*)")
    .eq("owner_id", user.id)
    .single()

  // Kalau belum punya warung → arahkan ke halaman klaim
  if (!tenant) redirect("/tenant/claim")

  const menus = (tenant.menus as any[]) ?? []

  return (
    <div className="space-y-6 pb-12">
      {/* Info warung */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1">Warung Saya</p>
        <h1 className="text-xl font-bold">{tenant.name}</h1>
        <p className="text-sm text-muted-foreground">
          {tenant.food_type}
          {tenant.open_time && ` · Buka ${tenant.open_time} – ${tenant.close_time}`}
        </p>
      </div>

      {/* Komponen manajemen menu */}
      <MenuManager
        tenantId={tenant.id}
        tenantName={tenant.name}
        initialMenus={menus}
      />
    </div>
  )
}
