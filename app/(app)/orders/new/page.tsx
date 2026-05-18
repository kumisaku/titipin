// Halaman Buat Titipan — route: /orders/new
// Ini Server Component — ambil data kantin & tenant di server
// lalu kirim ke NewOrderForm (Client Component) sebagai props

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewOrderForm } from "@/components/shared/NewOrderForm"

export const metadata = { title: "Buat Titipan — Titip.in" }

export default async function NewOrderPage() {
  const supabase = await createClient()

  // Pastikan user sudah login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch kantins, tenants, dan menus sekaligus (parallel)
  const [{ data: kantins }, { data: tenants }, { data: menus }] = await Promise.all([
    supabase.from("kantins").select("id, name, location_building").order("name"),
    supabase.from("tenants").select("id, kantin_id, name, food_type").eq("is_active", true).order("name"),
    supabase.from("menus").select("id, tenant_id, name, price, is_available").eq("is_available", true).order("name"),
  ])

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold">Buat Titipan</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Isi 4 langkah berikut untuk membuat titipan baru
        </p>
      </div>

      <NewOrderForm
        kantins={kantins ?? []}
        tenants={tenants ?? []}
        menus={menus ?? []}
      />
    </div>
  )
}
