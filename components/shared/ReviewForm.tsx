"use client"

// Form rating bintang — muncul di halaman detail order setelah status "completed"
// Hanya ditampilkan ke penitip, bukan jastiper

import { useState } from "react"
import { toast } from "sonner"
import { submitReview } from "@/actions/reviews"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  orderId: string
  runnerName: string
}

export function ReviewForm({ orderId, runnerName }: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Pilih rating bintang dulu")
      return
    }
    setIsLoading(true)
    try {
      const result = await submitReview(orderId, rating, comment)
      if (result?.error) {
        toast.error(result.error)
      } else {
        setSubmitted(true)
        toast.success("Terima kasih atas reviewmu!")
      }
    } catch {
      toast.error("Terjadi kesalahan.")
    } finally {
      setIsLoading(false)
    }
  }

  // Tampilkan konfirmasi setelah submit
  if (submitted) {
    return (
      <div className="border rounded-2xl p-5 text-center space-y-1 bg-green-50 border-green-200">
        <p className="text-2xl">⭐</p>
        <p className="font-semibold text-green-800">Review terkirim!</p>
        <p className="text-sm text-green-700">{"⭐".repeat(rating)} — Terima kasih sudah memberi feedback</p>
      </div>
    )
  }

  const displayRating = hovered || rating

  return (
    <div className="border rounded-2xl p-5 space-y-4">
      <div>
        <h2 className="font-semibold">Beri Rating Jastiper</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Bagaimana layanan {runnerName}?</p>
      </div>

      {/* Bintang — klik untuk pilih, hover untuk preview */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-3xl transition-transform hover:scale-110 focus:outline-none"
          >
            {star <= displayRating ? "⭐" : "☆"}
          </button>
        ))}
      </div>

      {/* Label deskripsi rating */}
      {displayRating > 0 && (
        <p className="text-sm text-muted-foreground -mt-1">
          {["", "Sangat buruk", "Kurang memuaskan", "Cukup baik", "Memuaskan", "Luar biasa!"][displayRating]}
        </p>
      )}

      <Textarea
        placeholder="Komentar tambahan (opsional)..."
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={isLoading || rating === 0}
        onClick={handleSubmit}
      >
        {isLoading ? "Mengirim..." : "Kirim Review"}
      </Button>
    </div>
  )
}
