// Landing Page — route: /
// Halaman pertama yang dilihat pengunjung, menjelaskan apa itu Titip.in

import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-md mx-auto w-full">

        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl bg-orange-500 flex items-center justify-center text-4xl shadow-lg mb-6">
          🛵
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Titip.<span className="text-orange-500">in</span>
        </h1>
        <p className="text-lg text-gray-500 mt-3 leading-relaxed">
          Pesan makanan kantin kampus lewat jastip mahasiswa lain.
          <br />Cepat, mudah, dan hemat tenaga.
        </p>

        {/* CTA */}
        <div className="flex flex-col gap-3 w-full mt-10">
          <Link href="/register">
            <div className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-3.5 rounded-2xl transition-colors text-center">
              Daftar Sekarang
            </div>
          </Link>
          <Link href="/login">
            <div className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-base py-3.5 rounded-2xl transition-colors text-center">
              Sudah punya akun? Masuk
            </div>
          </Link>
        </div>
      </main>

      {/* FITUR */}
      <section className="bg-orange-50 px-6 py-12">
        <div className="max-w-md mx-auto space-y-5">
          <h2 className="text-xl font-bold text-center text-gray-800">Kenapa Titip.in?</h2>

          {[
            {
              icon: "📋",
              title: "Titip Pesanan",
              desc: "Buat pesanan dari warung favoritmu, tentukan deadline & lokasi antar.",
            },
            {
              icon: "🏃",
              title: "Dapat Fee Jastip",
              desc: "Lagi ke kantin? Ambil order teman dan dapat fee tambahan.",
            },
            {
              icon: "⭐",
              title: "Rating & Review",
              desc: "Sistem bintang memastikan jastiper terpercaya selalu diutamakan.",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm">
              <div className="text-3xl shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="px-6 py-12">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-xl font-bold text-center text-gray-800">Cara Kerja</h2>

          <div className="space-y-4">
            {[
              { step: "1", label: "Daftar sebagai Mahasiswa atau Pemilik Warung" },
              { step: "2", label: "Buat titipan — pilih kantin, menu, lokasi antar" },
              { step: "3", label: "Jastiper ambil ordermu dan belikan ke kantin" },
              { step: "4", label: "Terima makanan & beri rating jastiper" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <p className="text-gray-700 text-sm">{item.label}</p>
              </div>
            ))}
          </div>

          <Link href="/register">
            <div className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-3.5 rounded-2xl transition-colors text-center mt-4">
              Mulai Sekarang →
            </div>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-6 py-6 text-center text-xs text-gray-400">
        © 2025 Titip.in — Dibuat dengan ❤️ untuk kampus
      </footer>
    </div>
  )
}
