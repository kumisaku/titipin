// Halaman Klaim Warung — route: /tenant/claim
// User memilih warung yang belum ada pemiliknya dan mengklaimnya

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { claimTenant } from "@/actions/menus"
import { Button } from "@/components/ui/button"

export const metadata = { title: "Klaim Warung — Titip.in" }

export default async function ClaimTenantPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Cek apakah user sudah punya warung — kalau iya, langsung ke manage
  const { data: myTenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (myTenant) redirect("/tenant/manage")

  // Ambil semua tenant yang belum punya pemilik
  const { data: unclaimedTenants } = await supabase
    .from("tenants")
    .select("id, name, food_type, kantins(name, location_building)")
    .is("owner_id", null)
    .eq("is_active", true)
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Klaim Warung Kamu</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pilih warung yang kamu miliki untuk mulai mengelola menu dan harga
        </p>
      </div>

      {unclaimedTenants?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">🏪</p>
          <p>Semua warung sudah punya pemilik.</p>
          <p className="text-sm mt-1">Hubungi admin untuk mendaftarkan warung baru.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unclaimedTenants?.map((tenant) => {
            const kantin = tenant.kantins as any
            return (
              <div key={tenant.id} className="border rounded-xl p-4 flex items-center justify-between gap-4 bg-white">
                <div>
                  <p className="font-semibold">{tenant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tenant.food_type && `${tenant.food_type} · `}
                    {kantin?.name} — {kantin?.location_building}
                  </p>
                </div>
                {/* Form action langsung panggil Server Action */}
                <form action={claimTenant.bind(null, tenant.id)}>
                  <Button type="submit" size="sm">
                    Klaim Warung Ini
                  </Button>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
