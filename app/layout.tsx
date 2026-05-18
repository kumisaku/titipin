// Root Layout — ini adalah layout paling atas yang membungkus SEMUA halaman
// Di sini kita taruh hal-hal yang dibutuhkan di seluruh app: font, metadata, Toaster

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

// Font utama aplikasi
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

// Metadata muncul di tab browser dan hasil pencarian Google
export const metadata: Metadata = {
  title: "Titip.in — Jasa Titip Kantin Kampus",
  description: "Pesan makanan dari kantin kampus tanpa harus ke sana sendiri. Hubungkan penitip dan jastiper dalam satu platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full antialiased font-sans">
        {children}
        {/* Toaster dari Sonner — tempat notifikasi toast muncul */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
