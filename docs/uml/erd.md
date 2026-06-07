# Entity Relationship Diagram — Titip.in

```mermaid
erDiagram
    PROFILES {
        uuid id PK
        text full_name
        text nim
        text phone
        text role
        timestamptz created_at
    }

    KANTINS {
        uuid id PK
        text name
        text location_building
        timestamptz created_at
    }

    TENANTS {
        uuid id PK
        uuid kantin_id FK
        uuid owner_id FK
        text name
        text food_type
        timestamptz created_at
    }

    MENUS {
        uuid id PK
        uuid tenant_id FK
        text name
        integer price
        boolean is_available
        timestamptz created_at
    }

    ORDERS {
        uuid id PK
        uuid customer_id FK
        uuid runner_id FK
        uuid tenant_id FK
        jsonb items
        text delivery_location
        timestamptz deadline
        integer jastip_fee
        integer total_estimate
        text payment_method
        text notes
        text status
        timestamptz created_at
    }

    REVIEWS {
        uuid id PK
        uuid order_id FK
        uuid reviewer_id FK
        uuid reviewee_id FK
        smallint rating
        text comment
        timestamptz created_at
    }

    PROFILES ||--o{ TENANTS : "memiliki (owner)"
    PROFILES ||--o{ ORDERS : "membuat (customer)"
    PROFILES ||--o{ ORDERS : "mengambil (runner)"
    PROFILES ||--o{ REVIEWS : "menulis (reviewer)"
    PROFILES ||--o{ REVIEWS : "dinilai (reviewee)"
    KANTINS ||--o{ TENANTS : "memiliki"
    TENANTS ||--o{ MENUS : "memiliki"
    TENANTS ||--o{ ORDERS : "menjadi tujuan"
    ORDERS ||--|| REVIEWS : "mendapat"
```

## Keterangan Relasi

| Relasi | Tipe | Keterangan |
|---|---|---|
| PROFILES → TENANTS | One-to-One | Satu pemilik hanya bisa klaim satu warung |
| PROFILES → ORDERS (customer) | One-to-Many | Satu mahasiswa bisa buat banyak order |
| PROFILES → ORDERS (runner) | One-to-Many | Satu mahasiswa bisa ambil banyak order |
| KANTINS → TENANTS | One-to-Many | Satu kantin memiliki banyak warung/tenant |
| TENANTS → MENUS | One-to-Many | Satu warung memiliki banyak item menu |
| TENANTS → ORDERS | One-to-Many | Satu warung bisa punya banyak order |
| ORDERS → REVIEWS | One-to-One | Satu order hanya bisa diulas sekali |

## Status Order (State Machine)

```mermaid
stateDiagram-v2
    [*] --> waiting : Penitip buat order
    waiting --> accepted : Jastiper ambil order
    waiting --> cancelled : Penitip batalkan
    accepted --> purchasing : Jastiper mulai beli
    accepted --> cancelled : Penitip batalkan
    purchasing --> delivering : Jastiper selesai beli
    delivering --> completed : Penitip konfirmasi terima
    completed --> [*]
    cancelled --> [*]
```
