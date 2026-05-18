// Halaman Login — route: /login
// User pilih peran dulu (mahasiswa atau pemilik warung), lalu isi form login

import Link from "next/link"
import { LoginForm } from "@/components/shared/LoginForm"

export const metadata = { title: "Masuk — Titip.in" }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-orange-600">🛵 Titip.in</h1>
          </Link>
          <p className="text-muted-foreground mt-2">Masuk ke akunmu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-orange-600 font-medium hover:underline">
            Daftar gratis
          </Link>
        </p>

      </div>
    </div>
  )
}
