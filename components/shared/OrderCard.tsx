// Card order — dipakai di halaman feed dan history
// Menampilkan ringkasan satu order

import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { MapPin, Clock, ShoppingBag } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"

type OrderCardProps = {
  order: {
    id: string
    status: string
    jastip_fee: number
    deadline: string
    delivery_location: string
    items: { name: string; quantity: number; estimated_price: number }[]
    tenants: {
      name: string
      kantins: { name: string } | null
    } | null
  }
  // Mode "feed" = tampilkan fee besar (untuk menarik jastiper)
  // Mode "history" = tampilkan status badge
  mode?: "feed" | "history"
}

export function OrderCard({ order, mode = "history" }: OrderCardProps) {
  const itemCount = order.items?.length ?? 0
  const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0
  const deadlineDate = new Date(order.deadline)
  const isExpired = deadlineDate < new Date()

  // Format waktu deadline
  const deadlineText = isExpired
    ? "Sudah lewat"
    : formatDistanceToNow(deadlineDate, { addSuffix: true, locale: id })

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="border rounded-2xl p-4 bg-white hover:shadow-md transition-all space-y-3">

        {/* Header: nama kantin & tenant */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold leading-tight">
              {order.tenants?.name ?? "—"}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.tenants?.kantins?.name ?? ""}
            </p>
          </div>

          {/* Di mode feed tampilkan fee besar, di history tampilkan status badge */}
          {mode === "feed" ? (
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Fee jastip</p>
              <p className="text-lg font-bold text-orange-600">
                Rp {order.jastip_fee.toLocaleString("id-ID")}
              </p>
            </div>
          ) : (
            <StatusBadge status={order.status} />
          )}
        </div>

        {/* Info: jumlah item & lokasi */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShoppingBag size={14} />
            {totalItems} item ({itemCount} menu)
          </span>
          <span className="flex items-center gap-1 flex-1 min-w-0">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{order.delivery_location}</span>
          </span>
        </div>

        {/* Deadline */}
        <div className={`flex items-center gap-1 text-sm ${isExpired ? "text-red-500" : "text-muted-foreground"}`}>
          <Clock size={14} />
          <span>Deadline: {format(deadlineDate, "dd MMM, HH:mm", { locale: id })} · {deadlineText}</span>
        </div>

        {/* Di mode history, tampilkan fee kecil di bawah */}
        {mode === "history" && (
          <div className="pt-1 border-t flex justify-between text-sm">
            <span className="text-muted-foreground">Fee jastip</span>
            <span className="font-medium text-orange-600">
              Rp {order.jastip_fee.toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
