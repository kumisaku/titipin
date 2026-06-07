# Risk Analysis — Titip.in

## Matriks Risiko

| Tingkat | Kemungkinan Rendah | Kemungkinan Sedang | Kemungkinan Tinggi |
|---|---|---|---|
| **Dampak Tinggi** | 🟡 Medium | 🔴 High | 🔴 Critical |
| **Dampak Sedang** | 🟢 Low | 🟡 Medium | 🔴 High |
| **Dampak Rendah** | 🟢 Low | 🟢 Low | 🟡 Medium |

---

## Daftar Risiko

### Risiko Teknis

| ID | Risiko | Kemungkinan | Dampak | Level | Mitigasi |
|---|---|---|---|---|---|
| T-01 | **Data breach / kebocoran data user** | Rendah | Tinggi | 🟡 Medium | Row Level Security (RLS) aktif di semua tabel; Supabase mengelola enkripsi data at-rest dan in-transit (HTTPS) |
| T-02 | **SQL Injection** | Rendah | Tinggi | 🟡 Medium | Menggunakan Supabase client library yang otomatis parameterize query; tidak ada raw SQL dari input user |
| T-03 | **Server down / outage Vercel atau Supabase** | Rendah | Tinggi | 🟡 Medium | Kedua platform memiliki SLA uptime 99.9%; backup database otomatis oleh Supabase |
| T-04 | **Race condition: dua jastiper ambil order bersamaan** | Sedang | Sedang | 🟡 Medium | RLS policy hanya mengizinkan UPDATE runner_id jika masih NULL; operasi atomic di PostgreSQL |
| T-05 | **Session expired tanpa redirect** | Sedang | Rendah | 🟢 Low | Middleware (proxy.ts) me-refresh session otomatis setiap request |
| T-06 | **Breaking change dari library** | Sedang | Sedang | 🟡 Medium | Pin versi di package.json; testing sebelum upgrade dependency |
| T-07 | **XSS (Cross-Site Scripting)** | Rendah | Tinggi | 🟡 Medium | React secara default meng-escape semua output; tidak ada `dangerouslySetInnerHTML` |
| T-08 | **Unauthorized access ke order orang lain** | Rendah | Tinggi | 🟡 Medium | Double check di app layer (`isCustomer || isRunner || isWaiting`) + RLS di DB layer |

---

### Risiko Bisnis / Operasional

| ID | Risiko | Kemungkinan | Dampak | Level | Mitigasi |
|---|---|---|---|---|---|
| B-01 | **Jastiper tidak mengantar sesuai deadline** | Tinggi | Tinggi | 🔴 Critical | Batas waktu wajib hari yang sama; penitip bisa lihat nomor HP jastiper untuk konfirmasi langsung |
| B-02 | **Menu tidak update (pemilik lupa edit)** | Sedang | Sedang | 🟡 Medium | Toggle ketersediaan menu (available/unavailable) yang mudah diakses; penitip bisa tambah catatan |
| B-03 | **Jastiper membatalkan di tengah proses** | Sedang | Tinggi | 🔴 High | Status flow dibuat satu arah — setelah accepted tidak bisa balik ke waiting; kontak langsung via WhatsApp |
| B-04 | **Penyalahgunaan sistem (order palsu)** | Rendah | Sedang | 🟢 Low | Sistem rating membangun reputasi; autentikasi wajib (tidak bisa anonymous) |
| B-05 | **Informasi harga tidak akurat** | Sedang | Rendah | 🟢 Low | Label "estimasi harga" yang jelas; pemilik warung bertanggung jawab update harga |

---

### Risiko Proyek

| ID | Risiko | Kemungkinan | Dampak | Level | Mitigasi |
|---|---|---|---|---|---|
| P-01 | **Scope creep (fitur terus bertambah)** | Tinggi | Sedang | 🔴 High | Tetapkan MVP scope di awal; fitur tambahan masuk backlog, bukan sprint aktif |
| P-02 | **Anggota tim tidak aktif berkontribusi** | Sedang | Tinggi | 🔴 High | Pembagian tugas jelas per fitur; semua kontribusi lewat GitHub branch masing-masing |
| P-03 | **Konflik merge di Git** | Sedang | Rendah | 🟢 Low | Setiap anggota kerja di branch terpisah; code review sebelum merge ke main |
| P-04 | **Deadline pengumpulan terlewat** | Rendah | Tinggi | 🟡 Medium | Timeline Gantt chart diikuti ketat; buffer 1 minggu sebelum deadline untuk polishing |

---

## Risiko Keamanan — Detail

### T-01: Perlindungan Data User

**Yang sudah diimplementasikan:**
- RLS aktif di semua 6 tabel database
- Password di-hash oleh Supabase Auth (bcrypt)
- Komunikasi via HTTPS (TLS 1.3)
- Tidak ada data sensitif yang disimpan di localStorage

**Yang perlu ditambahkan di masa depan:**
- Rate limiting pada endpoint login
- Audit log untuk akses data sensitif

### T-04: Race Condition Order

**Skenario:** Dua jastiper klik "Ambil Order" secara bersamaan.

**Perlindungan:**
```sql
-- RLS policy memastikan hanya satu yang bisa update
-- PostgreSQL MVCC (Multi-Version Concurrency Control) menangani ini
UPDATE orders SET runner_id = auth.uid(), status = 'accepted'
WHERE id = $1 AND runner_id IS NULL AND status = 'waiting'
```
Jika dua request tiba bersamaan, hanya satu yang berhasil karena PostgreSQL memproses UPDATE secara serial per baris.
