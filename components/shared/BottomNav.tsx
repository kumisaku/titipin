"use client"

// Navigasi bawah layar — lebih nyaman di mobile daripada navbar atas
// Tampil berbeda untuk mahasiswa vs pemilik warung

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Plus, ClipboardList, Store, User } from "lucide-react"

type Props = {
  role: "mahasiswa" | "pemilik_warung"
}

const MAHASISWA_TABS = [
  { href: "/dashboard",      icon: Home,          label: "Home" },
  { href: "/orders/feed",    icon: Search,        label: "Cari Order" },
  { href: "/orders/new",     icon: Plus,          label: "Titip",  primary: true },
  { href: "/orders/history", icon: ClipboardList, label: "Riwayat" },
  { href: "/profile",        icon: User,          label: "Profil" },
]

const PEMILIK_TABS = [
  { href: "/dashboard",     icon: Home,  label: "Home" },
  { href: "/tenant/manage", icon: Store, label: "Menu Saya" },
  { href: "/profile",       icon: User,  label: "Profil" },
]

export function BottomNav({ role }: Props) {
  const pathname = usePathname()
  const tabs = role === "pemilik_warung" ? PEMILIK_TABS : MAHASISWA_TABS

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t safe-area-pb">
      <div className="max-w-screen-md mx-auto flex items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          // Tab aktif = path saat ini dimulai dengan href tab
          // Kecuali "/dashboard" hanya aktif kalau persis "/dashboard"
          const isActive = tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href)

          // Tombol "Titip" punya gaya khusus (bulat, menonjol)
          if ((tab as any).primary) {
            return (
              <Link key={tab.href} href={tab.href} className="flex-1 flex justify-center py-2">
                <div className={`
                  flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors
                  ${isActive ? "bg-orange-600" : "bg-orange-500 hover:bg-orange-600"}
                  text-white shadow-lg
                `}>
                  <Icon size={22} />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors
                ${isActive ? "text-orange-600" : "text-gray-400 hover:text-gray-600"}
              `}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
