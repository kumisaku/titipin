# Test Cases - Titip.in

## 1. Authentication

| No | Skenario | Expected Result | Status |
|----|----------|-----------------|--------|
| 1.1 | Register dengan email dan password valid | Akun berhasil dibuat, redirect ke dashboard | ✅ Pass |
| 1.2 | Login dengan kredensial benar | Berhasil masuk ke dashboard | ✅ Pass |
| 1.3 | Login dengan password salah | Muncul pesan error | ✅ Pass |
| 1.4 | Akses halaman dashboard tanpa login | Redirect ke halaman login | ✅ Pass |

## 2. Buat Order (Penitip)

| No | Skenario | Expected Result | Status |
|----|----------|-----------------|--------|
| 2.1 | Penitip buat titipan baru dengan memilih kantin, warung, dan menu | Order berhasil dibuat dan muncul di feed jastiper | ✅ Pass |
| 2.2 | Penitip buat order tanpa memilih menu | Muncul validasi, order tidak terkirim | ✅ Pass |
| 2.3 | Penitip melihat status order yang sedang berjalan | Status order tampil real-time | ⚠️ Perlu refresh manual |

## 3. Ambil Order (Jastiper)

| No | Skenario | Expected Result | Status |
|----|----------|-----------------|--------|
| 3.1 | Jastiper melihat daftar order yang tersedia di feed | Daftar order tampil dengan benar | ⚠️ Lambat di koneksi lemah |
| 3.2 | Jastiper mengambil order | Status order berubah menjadi "diproses" | ✅ Pass |
| 3.3 | Jastiper memperbarui status ke "sedang antar" | Status order terupdate | ✅ Pass |
| 3.4 | Jastiper menyelesaikan order | Status berubah, penitip bisa konfirmasi | ✅ Pass |

## 4. Konfirmasi & Rating

| No | Skenario | Expected Result | Status |
|----|----------|-----------------|--------|
| 4.1 | Penitip mengkonfirmasi penerimaan order | Order selesai, muncul form rating | ✅ Pass |
| 4.2 | Penitip memberi rating ke jastiper | Rating tersimpan di profil jastiper | ✅ Pass |

## 5. Kelola Menu (Pemilik Warung)

| No | Skenario | Expected Result | Status |
|----|----------|-----------------|--------|
| 5.1 | Pemilik warung klaim warung | Warung terhubung ke akun pemilik | ✅ Pass |
| 5.2 | Pemilik tambah menu baru | Menu muncul saat penitip buat order | ✅ Pass |
| 5.3 | Pemilik edit harga menu | Harga terupdate di halaman order | ✅ Pass |
| 5.4 | Pemilik hapus menu | Menu tidak muncul lagi | ✅ Pass |