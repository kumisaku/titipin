// Zod Schemas — definisi validasi untuk semua form di aplikasi
// Zod akan mengecek: apakah data yang diisi user sesuai format yang benar?
// Kalau tidak sesuai, Zod otomatis buat pesan error yang bisa ditampilkan di form

import { z } from "zod"

// ============================================================
// AUTH SCHEMAS
// ============================================================

// Zod v4: pesan error ditulis sebagai { error: "..." } bukan string langsung
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email wajib diisi" })
    .email({ error: "Format email tidak valid" }),
  password: z
    .string()
    .min(1, { error: "Password wajib diisi" })
    .min(6, { error: "Password minimal 6 karakter" }),
})

export const registerSchema = z
  .object({
    role: z.enum(["mahasiswa", "pemilik_warung"], {
      error: "Pilih peran kamu",
    }),
    full_name: z
      .string()
      .min(1, { error: "Nama lengkap wajib diisi" })
      .min(2, { error: "Nama minimal 2 karakter" }),
    nim: z.string().optional(),
    phone: z.string().optional(),
    email: z
      .string()
      .min(1, { error: "Email wajib diisi" })
      .email({ error: "Format email tidak valid" }),
    password: z
      .string()
      .min(1, { error: "Password wajib diisi" })
      .min(6, { error: "Password minimal 6 karakter" }),
    confirm_password: z.string().min(1, { error: "Konfirmasi password wajib diisi" }),
  })
  // .refine() dipakai untuk validasi yang melibatkan lebih dari satu field
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"], // error muncul di field confirm_password
  })

// TypeScript types — otomatis digenerate dari schema di atas
// Kita bisa pakai ini sebagai type untuk data form
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

// ============================================================
// ORDER SCHEMAS
// ============================================================

// Schema untuk satu item dalam order
export const orderItemSchema = z.object({
  name: z.string().min(1, { error: "Nama item wajib diisi" }),
  quantity: z.number().min(1, { error: "Minimal 1" }).max(99, { error: "Maksimal 99" }),
  notes: z.string().optional(),
  estimated_price: z.number().min(0, { error: "Harga tidak boleh negatif" }),
})

// Schema untuk keseluruhan form buat order baru
export const newOrderSchema = z.object({
  kantin_id: z.string().min(1, { error: "Pilih kantin terlebih dahulu" }),
  tenant_id: z.string().min(1, { error: "Pilih tenant terlebih dahulu" }),
  // Array of items — minimal harus ada 1 item
  items: z.array(orderItemSchema).min(1, { error: "Tambahkan minimal 1 item" }),
  delivery_location: z.string().min(1, { error: "Lokasi pengantaran wajib diisi" }),
  deadline: z.string().min(1, { error: "Deadline wajib diisi" }).refine((val) => {
    // Pastikan deadline masih di hari yang sama (hari ini)
    const today = new Date().toLocaleDateString("en-CA") // format YYYY-MM-DD
    return val.startsWith(today)
  }, { message: "Batas waktu antar harus di hari yang sama (hari ini)" }),
  jastip_fee: z.number().min(0),
  // Zod v4: pakai "error" bukan "required_error"
  payment_method: z.enum(["cash", "transfer"], {
    error: "Pilih metode pembayaran",
  }),
  notes: z.string().optional(),
})

export type OrderItem = z.infer<typeof orderItemSchema>
export type NewOrderFormData = z.infer<typeof newOrderSchema>
