// Badge berwarna untuk menampilkan status order
// Bisa dipakai di mana saja — feed, history, detail

import { Badge } from "@/components/ui/badge"

type Status = "waiting" | "accepted" | "purchasing" | "delivering" | "completed" | "cancelled"

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  waiting:    { label: "Menunggu Jastiper", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  accepted:   { label: "Jastiper Ditemukan", className: "bg-blue-100 text-blue-800 border-blue-200" },
  purchasing: { label: "Sedang Membeli",    className: "bg-purple-100 text-purple-800 border-purple-200" },
  delivering: { label: "Sedang Diantar",    className: "bg-orange-100 text-orange-800 border-orange-200" },
  completed:  { label: "Selesai",           className: "bg-green-100 text-green-800 border-green-200" },
  cancelled:  { label: "Dibatalkan",        className: "bg-red-100 text-red-800 border-red-200" },
}

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as Status] ?? { label: status, className: "" }
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
