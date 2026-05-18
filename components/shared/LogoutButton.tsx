"use client"

// Tombol logout — butuh "use client" karena kita perlu handle onClick
// Tapi action logout-nya sendiri jalan di server (Server Action)

import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    await logout()
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "Keluar..." : "Keluar"}
    </Button>
  )
}
