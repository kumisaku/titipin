// Halaman Register — route: /register

import Link from "next/link"
import { RegisterForm } from "@/components/shared/RegisterForm"

export const metadata = { title: "Daftar — Titip.in" }

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-orange-600">🛵 Titip.in</h1>
          </Link>
          <p className="text-muted-foreground mt-2">Buat akun baru, gratis!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-xl font-semibold mb-6">Buat akun</h2>
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-orange-600 font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>

      </div>
    </div>
  )
}
