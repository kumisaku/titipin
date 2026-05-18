# Database Schema — Titip.in

Semua tabel berada di database PostgreSQL yang dikelola Supabase.

---

## Tabel: `profiles`

Dibuat otomatis saat user baru mendaftar lewat trigger Supabase Auth.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Sama dengan `auth.users.id` |
| `full_name` | TEXT | Nama lengkap |
| `nim` | TEXT | Nomor Induk Mahasiswa (opsional) |
| `phone` | TEXT | Nomor HP (opsional) |
| `role` | TEXT | `mahasiswa` atau `pemilik_warung` (default: `mahasiswa`) |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

---

## Tabel: `kantins`

Data kantin di kampus. Diisi lewat seed data.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | |
| `name` | TEXT | Nama kantin (misal: "Kantin Pusat") |
| `location_building` | TEXT | Nama gedung / lokasi |
| `created_at` | TIMESTAMPTZ | |

---

## Tabel: `tenants`

Warung/stand di dalam kantin. Satu kantin bisa punya banyak tenant.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | |
| `kantin_id` | UUID (FK → kantins) | Kantin tempat tenant ini berada |
| `owner_id` | UUID (FK → profiles) | Pemilik warung (nullable, diisi saat klaim) |
| `name` | TEXT | Nama warung (misal: "Warung Bu Sari") |
| `food_type` | TEXT | Kategori makanan (opsional) |
| `created_at` | TIMESTAMPTZ | |

---

## Tabel: `menus`

Item menu dari setiap warung. Dibuat oleh pemilik warung.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | |
| `tenant_id` | UUID (FK → tenants) | Warung pemilik menu ini |
| `name` | TEXT | Nama menu |
| `price` | INTEGER | Harga dalam Rupiah |
| `is_available` | BOOLEAN | Apakah menu sedang tersedia (default: true) |
| `created_at` | TIMESTAMPTZ | |

---

## Tabel: `orders`

Order / titipan yang dibuat oleh penitip.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | |
| `customer_id` | UUID (FK → profiles) | Penitip (pembuat order) |
| `runner_id` | UUID (FK → profiles) | Jastiper yang mengambil order (nullable) |
| `tenant_id` | UUID (FK → tenants) | Warung tujuan |
| `items` | JSONB | Array item pesanan `[{name, quantity, notes, estimated_price}]` |
| `delivery_location` | TEXT | Lokasi pengantaran |
| `deadline` | TIMESTAMPTZ | Batas waktu antar (harus hari yang sama) |
| `jastip_fee` | INTEGER | Fee untuk jastiper (Rupiah) |
| `total_estimate` | INTEGER | Estimasi total (subtotal + jastip_fee) |
| `payment_method` | TEXT | `cash` atau `transfer` |
| `notes` | TEXT | Catatan tambahan (opsional) |
| `status` | TEXT | Lihat alur status di bawah |
| `created_at` | TIMESTAMPTZ | |

### Alur Status Order

```
waiting → accepted → purchasing → delivering → completed
                ↘                           ↗
                          cancelled
```

| Status | Arti |
|---|---|
| `waiting` | Menunggu jastiper |
| `accepted` | Jastiper sudah ambil, akan ke kantin |
| `purchasing` | Jastiper sedang membeli |
| `delivering` | Jastiper sedang mengantarkan |
| `completed` | Penitip sudah konfirmasi terima |
| `cancelled` | Dibatalkan oleh penitip |

---

## Tabel: `reviews`

Rating yang diberikan penitip ke jastiper setelah order selesai.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | |
| `order_id` | UUID (FK → orders, UNIQUE) | Satu order hanya satu review |
| `reviewer_id` | UUID (FK → profiles) | Penitip yang memberi review |
| `reviewee_id` | UUID (FK → profiles) | Jastiper yang dinilai |
| `rating` | SMALLINT | 1–5 bintang |
| `comment` | TEXT | Komentar teks (opsional) |
| `created_at` | TIMESTAMPTZ | |

---

## Row Level Security (RLS)

Semua tabel menggunakan RLS. Ringkasan kebijakan:

| Tabel | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | User sendiri | — (trigger) | User sendiri | — |
| `kantins` | Semua auth | — | — | — |
| `tenants` | Semua auth | — | Owner sendiri | — |
| `menus` | Semua auth | Owner tenant | Owner tenant | Owner tenant |
| `orders` | Customer, runner, atau status=waiting | Customer (buat) | Customer/runner (sesuai aturan) | — |
| `reviews` | Semua auth | Reviewer sendiri | — | — |
