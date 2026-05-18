// Timeline horizontal yang menampilkan progress order dari waiting → completed

type Status = "waiting" | "accepted" | "purchasing" | "delivering" | "completed" | "cancelled"

const STEPS = [
  { key: "waiting",    label: "Menunggu",  icon: "⏳" },
  { key: "accepted",   label: "Diterima",  icon: "✅" },
  { key: "purchasing", label: "Membeli",   icon: "🛒" },
  { key: "delivering", label: "Diantar",   icon: "🛵" },
  { key: "completed",  label: "Selesai",   icon: "🎉" },
]

// Urutan index tiap status — dipakai untuk tahu langkah mana yang sudah lewat
const STATUS_INDEX: Record<string, number> = {
  waiting: 0, accepted: 1, purchasing: 2, delivering: 3, completed: 4, cancelled: -1,
}

export function StatusTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_INDEX[status] ?? 0
  const isCancelled = status === "cancelled"

  if (isCancelled) {
    return (
      <div className="flex items-center justify-center py-4 text-red-600">
        <span className="text-2xl mr-2">❌</span>
        <span className="font-medium">Order dibatalkan</span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-1">
      {STEPS.map((step, index) => {
        const isDone    = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex

        return (
          <div key={step.key} className="flex items-center flex-1">
            {/* Lingkaran langkah */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all
                ${isDone    ? "bg-orange-500 border-orange-500 text-white" : ""}
                ${isCurrent ? "bg-white border-orange-500 ring-4 ring-orange-100" : ""}
                ${isPending ? "bg-gray-100 border-gray-200 text-gray-400" : ""}
              `}>
                {isDone ? "✓" : step.icon}
              </div>
              <span className={`text-xs text-center leading-tight
                ${isCurrent ? "font-semibold text-orange-600" : ""}
                ${isDone    ? "text-orange-500" : ""}
                ${isPending ? "text-gray-400" : ""}
              `}>
                {step.label}
              </span>
            </div>

            {/* Garis penghubung — tidak tampil di langkah terakhir */}
            {index < STEPS.length - 1 && (
              <div className={`h-0.5 w-full mb-5 ${index < currentIndex ? "bg-orange-400" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
