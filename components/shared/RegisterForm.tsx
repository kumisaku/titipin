"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "sonner"
import { GraduationCap, Store } from "lucide-react"

import { registerSchema, type RegisterFormData } from "@/lib/schemas"
import { register } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const ROLES = [
  {
    value: "mahasiswa" as const,
    label: "Mahasiswa",
    description: "Titip & ambil order",
    icon: GraduationCap,
  },
  {
    value: "pemilik_warung" as const,
    label: "Pemilik Warung",
    description: "Kelola menu & harga",
    icon: Store,
  },
]

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "mahasiswa",
      full_name: "",
      nim: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  const selectedRole = form.watch("role")

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    try {
      const result = await register(data)
      if (result?.error) toast.error(result.error)
    } catch (error: any) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Pilihan peran — disimpan ke database */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daftar sebagai</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => {
                  const Icon = role.icon
                  const isActive = field.value === role.value
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => field.onChange(role.value)}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                        ${isActive
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                        }
                      `}
                    >
                      <Icon size={20} className={isActive ? "text-orange-600" : "text-gray-400"} />
                      <div>
                        <p className={`font-semibold text-sm ${isActive ? "text-orange-700" : "text-gray-700"}`}>
                          {role.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Budi Santoso" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NIM dan Phone — hanya tampil untuk mahasiswa */}
        {selectedRole === "mahasiswa" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIM <span className="text-muted-foreground">(opsional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="2021001234" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. HP <span className="text-muted-foreground">(opsional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="08123456789" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Hanya tampilkan No. HP untuk pemilik warung */}
        {selectedRole === "pemilik_warung" && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP (WhatsApp) <span className="text-muted-foreground">(opsional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="08123456789" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@kampus.ac.id" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Minimal 6 karakter" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Ulangi password" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading
            ? "Membuat akun..."
            : `Daftar sebagai ${ROLES.find(r => r.value === selectedRole)?.label}`
          }
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>
      </form>
    </Form>
  )
}
