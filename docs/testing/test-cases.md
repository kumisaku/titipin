# Test Cases & Hasil Pengujian — Titip.in

## 1. Unit Testing

Unit testing menguji fungsi dan komponen secara terisolasi.

### UT-01: Validasi Schema Zod — Login

| ID | Skenario | Input | Expected | Hasil |
|---|---|---|---|---|
| UT-01-01 | Email valid | `{ email: "a@b.com", password: "123456" }` | Lolos validasi | ✅ Pass |
| UT-01-02 | Email kosong | `{ email: "", password: "123456" }` | Error: "Email wajib diisi" | ✅ Pass |
| UT-01-03 | Format email salah | `{ email: "bukan-email", password: "123456" }` | Error: "Format email tidak valid" | ✅ Pass |
| UT-01-04 | Password < 6 karakter | `{ email: "a@b.com", password: "123" }` | Error: "Password minimal 6 karakter" | ✅ Pass |

### UT-02: Validasi Schema Zod — Buat Order

| ID | Skenario | Input | Expected | Hasil |
|---|---|---|---|---|
| UT-02-01 | Deadline hari ini | `deadline: "2025-06-08T14:00"` | Lolos validasi | ✅ Pass |
| UT-02-02 | Deadline besok | `deadline: "2025-06-09T09:00"` | Error: "Batas waktu antar harus di hari yang sama" | ✅ Pass |
| UT-02-03 | Items array kosong | `items: []` | Error: "Tambahkan minimal 1 item" | ✅ Pass |
| UT-02-04 | Kantin tidak dipilih | `kantin_id: ""` | Error: "Pilih kantin terlebih dahulu" | ✅ Pass |

### UT-03: Kalkulasi Total Order

| ID | Skenario | Input | Expected | Hasil |
|---|---|---|---|---|
| UT-03-01 | 1 item + fee | items: [{price: 15000, qty: 1}], fee: 5000 | total: 20000 | ✅ Pass |
| UT-03-02 | 2 item berbeda qty | [{price: 10000, qty: 2}, {price: 5000, qty: 1}], fee: 3000 | total: 28000 | ✅ Pass |
| UT-03-03 | Fee = 0 | items: [{price: 20000, qty: 1}], fee: 0 | total: 20000 | ✅ Pass |

---

## 2. Integration Testing

Integration testing menguji interaksi antara Server Actions dan Supabase database.

### IT-01: Autentikasi

| ID | Skenario | Aksi | Expected | Hasil |
|---|---|---|---|---|
| IT-01-01 | Register mahasiswa baru | POST register dengan role=mahasiswa | Akun dibuat, redirect ke /dashboard | ✅ Pass |
| IT-01-02 | Register pemilik warung | POST register dengan role=pemilik_warung | Akun dibuat, redirect ke /dashboard | ✅ Pass |
| IT-01-03 | Login email benar | POST login dengan kredensial valid | Session dibuat, redirect ke /dashboard | ✅ Pass |
| IT-01-04 | Login email salah | POST login dengan password salah | Error: "Email atau password salah" | ✅ Pass |
| IT-01-05 | Akses halaman protected tanpa login | GET /dashboard tanpa session | Redirect ke /login | ✅ Pass |
| IT-01-06 | Akses /login saat sudah login | GET /login dengan session aktif | Redirect ke /dashboard | ✅ Pass |

### IT-02: Manajemen Order

| ID | Skenario | Aksi | Expected | Hasil |
|---|---|---|---|---|
| IT-02-01 | Buat order valid | createOrder() dengan data lengkap | Order tersimpan, status=waiting | ✅ Pass |
| IT-02-02 | Jastiper ambil order | acceptOrder(orderId) | status=accepted, runner_id terisi | ✅ Pass |
| IT-02-03 | Update status pembelian | updateOrderStatus(id, "purchasing") | status=purchasing | ✅ Pass |
| IT-02-04 | Update status pengantaran | updateOrderStatus(id, "delivering") | status=delivering | ✅ Pass |
| IT-02-05 | Penitip konfirmasi terima | updateOrderStatus(id, "completed") | status=completed | ✅ Pass |
| IT-02-06 | Batalkan order | cancelOrder(orderId) oleh penitip | status=cancelled | ✅ Pass |
| IT-02-07 | Jastiper tidak bisa batalkan | cancelOrder() oleh runner | Error: tidak diizinkan | ✅ Pass |

### IT-03: Manajemen Menu

| ID | Skenario | Aksi | Expected | Hasil |
|---|---|---|---|---|
| IT-03-01 | Pemilik klaim warung | claimTenant(tenantId) | owner_id terisi | ✅ Pass |
| IT-03-02 | Tambah menu baru | addMenuItem(tenantId, name, price) | Menu tersimpan | ✅ Pass |
| IT-03-03 | Edit menu | updateMenuItem(id, name, price) | Data terupdate | ✅ Pass |
| IT-03-04 | Hapus menu | deleteMenuItem(id) | Menu terhapus | ✅ Pass |
| IT-03-05 | Non-owner coba edit menu | updateMenuItem() oleh user lain | RLS block, error | ✅ Pass |

### IT-04: Review

| ID | Skenario | Aksi | Expected | Hasil |
|---|---|---|---|---|
| IT-04-01 | Penitip submit review setelah completed | submitReview(orderId, 5, "Bagus!") | Review tersimpan | ✅ Pass |
| IT-04-02 | Submit review dua kali | submitReview() kedua kali | Error: "Sudah pernah review" | ✅ Pass |
| IT-04-03 | Jastiper coba review | submitReview() oleh runner | Error: "Hanya penitip yang bisa review" | ✅ Pass |
| IT-04-04 | Review sebelum order selesai | submitReview() saat status=delivering | Error: "Order belum selesai" | ✅ Pass |

---

## 3. System Testing (End-to-End)

System testing menguji alur lengkap dari perspektif pengguna.

### ST-01: Alur Lengkap sebagai Penitip

| Langkah | Aksi | Expected | Hasil |
|---|---|---|---|
| 1 | Buka landing page | Halaman berisi hero, fitur, cara kerja | ✅ Pass |
| 2 | Klik "Daftar Sekarang" | Redirect ke /register | ✅ Pass |
| 3 | Daftar sebagai Mahasiswa | Akun dibuat, masuk dashboard | ✅ Pass |
| 4 | Klik "Buat Titipan" | Form 4 langkah muncul | ✅ Pass |
| 5 | Pilih kantin → warung → menu → detail | Navigasi antar step berhasil | ✅ Pass |
| 6 | Submit order | Order dibuat, redirect ke detail | ✅ Pass |
| 7 | Tunggu jastiper ambil (simulasi) | Status berubah ke accepted | ✅ Pass |
| 8 | Status berubah menjadi delivering | Tombol "Sudah Saya Terima" muncul | ✅ Pass |
| 9 | Klik konfirmasi terima | Status completed, form review muncul | ✅ Pass |
| 10 | Submit review bintang 5 | Review tersimpan, muncul di halaman | ✅ Pass |
| 11 | Cek tab Riwayat | Order muncul di bagian "Selesai" | ✅ Pass |
| 12 | Cek tab Profil | Statistik terupdate (1 titipan selesai) | ✅ Pass |

### ST-02: Alur Lengkap sebagai Jastiper

| Langkah | Aksi | Expected | Hasil |
|---|---|---|---|
| 1 | Login sebagai mahasiswa berbeda | Dashboard mahasiswa muncul | ✅ Pass |
| 2 | Buka tab "Cari Order" | Daftar order waiting tampil | ✅ Pass |
| 3 | Klik order | Detail order muncul, tombol "Ambil Order" | ✅ Pass |
| 4 | Klik "Ambil Order" | Status accepted, tombol berubah | ✅ Pass |
| 5 | Klik "Mulai Pesan ke Kantin" | Status purchasing | ✅ Pass |
| 6 | Klik "Sudah Dapat, Antar Sekarang" | Status delivering | ✅ Pass |
| 7 | Tunggu penitip konfirmasi | Status completed | ✅ Pass |
| 8 | Cek profil | Fee jastip dan statistik terupdate | ✅ Pass |

### ST-03: Alur Pemilik Warung

| Langkah | Aksi | Expected | Hasil |
|---|---|---|---|
| 1 | Daftar sebagai Pemilik Warung | Dashboard pemilik muncul | ✅ Pass |
| 2 | Klik "Klaim Warung Sekarang" | Daftar warung belum diklaim | ✅ Pass |
| 3 | Klaim satu warung | Redirect ke /tenant/manage | ✅ Pass |
| 4 | Tambah 3 item menu | Menu tersimpan dan tampil | ✅ Pass |
| 5 | Edit harga menu | Harga terupdate | ✅ Pass |
| 6 | Toggle off satu menu | Menu tidak muncul saat order dibuat | ✅ Pass |

---

## 4. User Acceptance Testing (UAT)

UAT dilakukan dengan melibatkan 3 mahasiswa kampus sebagai pengguna nyata.

### Kriteria Penerimaan

| ID | Kriteria | Target | Hasil |
|---|---|---|---|
| UAT-01 | Pengguna bisa mendaftar tanpa bantuan | 3/3 berhasil | ✅ 3/3 |
| UAT-02 | Pengguna bisa membuat order dalam < 3 menit | ≥ 2/3 | ✅ 3/3 |
| UAT-03 | Alur status order mudah dipahami | ≥ 2/3 mengerti tanpa penjelasan | ✅ 2/3 |
| UAT-04 | Navigasi antar halaman intuitif | ≥ 2/3 tidak tersesat | ✅ 3/3 |
| UAT-05 | Tidak ada error fatal selama pengujian | 0 crash | ✅ 0 crash |

### Feedback UAT

| Pengguna | Feedback Positif | Saran Perbaikan |
|---|---|---|
| Pengguna 1 | "Form pilih menu sangat mudah" | "Tambahkan foto menu kalau bisa" |
| Pengguna 2 | "Notifikasi status sangat membantu" | "Notifikasi push kalau bisa" |
| Pengguna 3 | "Landing page jelas menjelaskan cara kerja" | "Tambahkan filter warung berdasar jenis makanan" |

---

## Ringkasan Hasil Testing

| Jenis Testing | Total Test Case | Pass | Fail | Pass Rate |
|---|---|---|---|---|
| Unit Testing | 10 | 10 | 0 | 100% |
| Integration Testing | 18 | 18 | 0 | 100% |
| System Testing | 21 | 21 | 0 | 100% |
| UAT | 5 | 5 | 0 | 100% |
| **Total** | **54** | **54** | **0** | **100%** |
