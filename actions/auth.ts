"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// ============================================================
// LOGIN
// ============================================================
export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: "Email atau password salah. Silakan coba lagi." }
  }

  // Ambil role user dari tabel profiles untuk redirect ke halaman yang tepat
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  // Redirect berdasarkan role
  if (profile?.role === "pemilik_warung") {
    redirect("/tenant/manage")
  } else {
    redirect("/dashboard")
  }
}

// ============================================================
// REGISTER
// ============================================================
export async function register(formData: {
  email: string
  password: string
  full_name: string
  nim?: string
  phone?: string
  role: "mahasiswa" | "pemilik_warung"
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        nim: formData.nim || null,
        phone: formData.phone || null,
        role: formData.role,
      },
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Email ini sudah terdaftar. Silakan login." }
    }
    return { error: "Gagal membuat akun. Silakan coba lagi." }
  }

  // Redirect berdasarkan role yang dipilih
  if (formData.role === "pemilik_warung") {
    redirect("/tenant/claim")
  } else {
    redirect("/dashboard")
  }
}

// ============================================================
// LOGOUT
// ============================================================
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
