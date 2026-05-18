# Fitur Titip.in

Daftar lengkap fitur yang telah diimplementasikan beserta lokasi kodenya.

---

## Autentikasi

| Fitur | Status | File Utama |
|---|---|---|
| Registrasi mahasiswa | ✅ | `app/(public)/register/`, `actions/auth.ts` |
| Registrasi pemilik warung | ✅ | `app/(public)/register/`, `actions/auth.ts` |
| Login dengan email & password | ✅ | `app/(public)/login/`, `actions/auth.ts` |
| Redirect otomatis sesuai role setelah login | ✅ | `actions/auth.ts` |
| Logout | ✅ | `components/shared/LogoutButton.tsx` |
| Proteksi route (redirect ke /login jika belum login) | ✅ | `proxy.ts` |
| Refresh session otomatis | ✅ | `proxy.ts` |

---

## Dashboard

| Fitur | Status | File Utama |
|---|---|---|
| Dashboard mahasiswa (order aktif, tombol aksi) | ✅ | `app/(app)/dashboard/page.tsx` |
| Dashboard pemilik warung (info warung, link kelola menu) | ✅ | `app/(app)/dashboard/page.tsx` |
| Navigasi bawah layar (BottomNav) berbeda per role | ✅ | `components/shared/BottomNav.tsx` |

---

## Pembuatan Order (Penitip)

| Fitur | Status | File Utama |
|---|---|---|
| Form 4 langkah: kantin → warung → menu → detail antar | ✅ | `components/shared/NewOrderForm.tsx` |
| Pilih menu dari daftar warung (bukan ketik manual) | ✅ | `components/shared/NewOrderForm.tsx` |
| Tambah / kurangi / hapus item dari keranjang | ✅ | `components/shared/NewOrderForm.tsx` |
| Preset & input custom fee jastip | ✅ | `components/shared/NewOrderForm.tsx` |
| Batas waktu antar harus di hari yang sama | ✅ | `lib/schemas.ts`, `components/shared/NewOrderForm.tsx` |
| Ringkasan total sebelum submit | ✅ | `components/shared/NewOrderForm.tsx` |
| Pembatalan order (selama belum purchasing) | ✅ | `components/shared/OrderActions.tsx` |

---

## Feed & Pengambilan Order (Jastiper)

| Fitur | Status | File Utama |
|---|---|---|
| Daftar order yang menunggu jastiper | ✅ | `app/(app)/orders/feed/page.tsx` |
| Kartu order dengan info warung, fee, deadline | ✅ | `components/shared/OrderCard.tsx` |
| Ambil order (accepted) | ✅ | `actions/orders.ts`, `components/shared/OrderActions.tsx` |
| Update status: mulai beli → antar | ✅ | `actions/orders.ts`, `components/shared/OrderActions.tsx` |

---

## Detail & Status Order

| Fitur | Status | File Utama |
|---|---|---|
| Halaman detail order lengkap | ✅ | `app/(app)/orders/[id]/page.tsx` |
| Timeline status visual | ✅ | `components/shared/StatusTimeline.tsx` |
| Badge status berwarna | ✅ | `components/shared/StatusBadge.tsx` |
| Info penitip & jastiper dengan link WhatsApp | ✅ | `components/shared/UserCard.tsx` |
| Konfirmasi terima oleh penitip (completed) | ✅ | `components/shared/OrderActions.tsx` |

---

## Kelola Menu (Pemilik Warung)

| Fitur | Status | File Utama |
|---|---|---|
| Klaim warung yang tersedia | ✅ | `app/(app)/tenant/claim/page.tsx`, `actions/menus.ts` |
| Tambah item menu beserta harga | ✅ | `components/shared/MenuManager.tsx`, `actions/menus.ts` |
| Edit nama & harga menu | ✅ | `components/shared/MenuManager.tsx`, `actions/menus.ts` |
| Hapus item menu | ✅ | `components/shared/MenuManager.tsx`, `actions/menus.ts` |
| Toggle ketersediaan menu (available/unavailable) | ✅ | `components/shared/MenuManager.tsx`, `actions/menus.ts` |

---

## Review & Rating

| Fitur | Status | File Utama |
|---|---|---|
| Form bintang 1–5 setelah order completed | ✅ | `components/shared/ReviewForm.tsx` |
| Komentar teks opsional | ✅ | `components/shared/ReviewForm.tsx` |
| Label deskripsi per nilai bintang | ✅ | `components/shared/ReviewForm.tsx` |
| Tampilkan review yang sudah dikirim | ✅ | `app/(app)/orders/[id]/page.tsx` |
| Satu review per order (unik) | ✅ | `supabase/migrations/006_reviews.sql` |

---

## Riwayat & Profil

| Fitur | Status | File Utama |
|---|---|---|
| Riwayat order dikelompokkan: aktif / selesai / batal | ✅ | `app/(app)/orders/history/page.tsx` |
| Halaman profil dengan info akun | ✅ | `app/(app)/profile/page.tsx` |
| Statistik: total titipan, total jastip, fee diterima | ✅ | `app/(app)/profile/page.tsx` |
| Rating rata-rata jastiper | ✅ | `app/(app)/profile/page.tsx` |

---

## Fitur yang Bisa Dikembangkan (Future Work)

- [ ] Notifikasi real-time (Supabase Realtime)
- [ ] Upload foto bukti antar
- [ ] Chat antara penitip & jastiper
- [ ] Filter & search di feed order
- [ ] Sistem poin / reward untuk jastiper aktif
- [ ] PWA (Progressive Web App) untuk instalasi di HP
- [ ] Admin dashboard untuk manajemen kantin & user
