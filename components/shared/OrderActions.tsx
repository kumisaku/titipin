"use client"

// Tombol aksi di halaman detail order
// Tampil berbeda tergantung role user (penitip/jastiper) dan status order

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { acceptOrder, updateOrderStatus, cancelOrder } from "@/actions/orders"
import { Button } from "@/components/ui/button"

type Props = {
  orderId: string
  status: string
  customerId: string
  runnerId: string | null
  currentUserId: string
}

export function OrderActions({ orderId, status, customerId, runnerId, currentUserId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isCustomer = currentUserId === customerId
  const isRunner   = currentUserId === runnerId

  async function handleAction(action: () => Promise<any>) {
    setIsLoading(true)
    try {
      const result = await action()
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Berhasil!")
        // Refresh halaman agar data status terbaru tampil
        router.refresh()
      }
    } catch (error: any) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
      toast.error("Terjadi kesalahan.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── STATUS: waiting ──────────────────────────────────────────
  if (status === "waiting") {
    return (
      <div className="space-y-2">
        {/* Jastiper bisa ambil order — kecuali kalau dia sendiri yang buat */}
        {!isCustomer && (
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="lg"
            disabled={isLoading}
            onClick={() => handleAction(() => acceptOrder(orderId))}
          >
            {isLoading ? "Memproses..." : "🏃 Ambil Order Ini"}
          </Button>
        )}

        {/* Penitip bisa batalkan */}
        {isCustomer && (
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive hover:bg-red-50"
            disabled={isLoading}
            onClick={() => {
              if (confirm("Yakin ingin membatalkan order ini?")) {
                handleAction(() => cancelOrder(orderId))
              }
            }}
          >
            Batalkan Order
          </Button>
        )}

        {/* Kalau bukan customer dan bukan runner, tampilkan info */}
        {!isCustomer && (
          <p className="text-xs text-muted-foreground text-center">
            Kamu akan bertanggung jawab mengambil & mengantarkan order ini
          </p>
        )}
      </div>
    )
  }

  // ── STATUS: accepted ─────────────────────────────────────────
  if (status === "accepted") {
    return (
      <div className="space-y-2">
        {isRunner && (
          <Button
            className="w-full"
            size="lg"
            disabled={isLoading}
            onClick={() => handleAction(() => updateOrderStatus(orderId, "purchasing"))}
          >
            {isLoading ? "Memproses..." : "🛒 Mulai Pesan ke Kantin"}
          </Button>
        )}
        {isCustomer && (
          <>
            <p className="text-sm text-center text-muted-foreground">
              Jastiper sedang menuju kantin…
            </p>
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive hover:bg-red-50"
              disabled={isLoading}
              onClick={() => {
                if (confirm("Yakin ingin membatalkan? Jastiper sudah siap mengambil ordermu.")) {
                  handleAction(() => cancelOrder(orderId))
                }
              }}
            >
              Batalkan Order
            </Button>
          </>
        )}
      </div>
    )
  }

  // ── STATUS: purchasing ───────────────────────────────────────
  if (status === "purchasing") {
    return (
      <div>
        {isRunner && (
          <Button
            className="w-full"
            size="lg"
            disabled={isLoading}
            onClick={() => handleAction(() => updateOrderStatus(orderId, "delivering"))}
          >
            {isLoading ? "Memproses..." : "🛵 Sudah Dapat, Antar Sekarang"}
          </Button>
        )}
        {isCustomer && (
          <p className="text-sm text-center text-muted-foreground py-2">
            Jastiper sedang membeli pesananmu… 🛒
          </p>
        )}
      </div>
    )
  }

  // ── STATUS: delivering ───────────────────────────────────────
  if (status === "delivering") {
    return (
      <div>
        {isCustomer && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            disabled={isLoading}
            onClick={() => handleAction(() => updateOrderStatus(orderId, "completed"))}
          >
            {isLoading ? "Memproses..." : "✅ Sudah Saya Terima!"}
          </Button>
        )}
        {isRunner && (
          <p className="text-sm text-center text-muted-foreground py-2">
            Tunggu penitip konfirmasi penerimaan… 🛵
          </p>
        )}
      </div>
    )
  }

  // Status completed atau cancelled — tidak ada tombol aksi
  return null
}
