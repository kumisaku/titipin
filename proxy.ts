// Proxy berjalan sebelum SETIAP request ke server
// Dua tugasnya:
// 1. Refresh session Supabase agar user tidak tiba-tiba ter-logout
// 2. Redirect user yang belum login kalau mencoba akses halaman protected

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Kita perlu response object untuk bisa set cookies baru (refresh session)
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Buat Supabase client khusus untuk proxy
  // (tidak bisa pakai createClient dari server.ts karena proxy punya API berbeda)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set cookies di request dan response agar session tersinkronisasi
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // PENTING: getUser() me-refresh session kalau hampir expired
  // Jangan hapus ini!
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Daftar halaman yang butuh login (protected routes)
  const protectedPaths = ["/dashboard", "/orders", "/profile", "/tenant"]
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // Kalau belum login dan coba akses halaman protected → redirect ke /login
  if (!user && isProtectedPath) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    return NextResponse.redirect(redirectUrl)
  }

  // Kalau sudah login tapi coba akses /login atau /register → redirect ke dashboard
  // (redirect spesifik per role dilakukan di login action, di sini cukup ke /dashboard)
  if (user && (pathname === "/login" || pathname === "/register")) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
