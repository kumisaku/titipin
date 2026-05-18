"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "sonner"
import { GraduationCap, Store } from "lucide-react"

import { loginSchema, type LoginFormData } from "@/lib/schemas"
import { login } from "@/actions/auth"
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

// Dua pilihan peran yang bisa dipilih saat login
const ROLES = [
  {
    value: "mahasiswa",
    label: "Mahasiswa",
    description: "Titip & ambil order",
    icon: GraduationCap,
    color: "border-orange-400 bg-orange-50 text-orange-700",
    activeColor: "border-orange-500 bg-orange-500 text-white",
  },
  {
    value: "pemilik_warung",
    label: "Pemilik Warung",
    description: "Kelola menu & harga",
    icon: Store,
    color: "border-gray-300 bg-white text-gray-700",
    activeColor: "border-gray-800 bg-gray-800 text-white",
  },
]

export function LoginForm() {
  // selectedRole hanya untuk UI — redirect setelah login ditentukan dari database (profile.role)
  const [selectedRole, setSelectedRole] = useState<string>("mahasiswa")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    try {
      const result = await login(data)
      if (result?.error) toast.error(result.error)
    } catch (error: any) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Pilihan peran — hanya visual, redirect ditentukan dari role di database */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Masuk sebagai</p>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role) => {
            const Icon = role.icon
            const isActive = selectedRole === role.value
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left
                  ${isActive ? role.activeColor : role.color}
                `}
              >
                <Icon size={24} />
                <div>
                  <p className="font-semibold text-sm">{role.label}</p>
                  <p className={`text-xs ${isActive ? "opacity-80" : "text-muted-foreground"}`}>
                    {role.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Form login */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@kampus.ac.id"
                    disabled={isLoading}
                    {...field}
                  />
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
                  <Input type="password" placeholder="••••••••" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading} size="lg">
            {isLoading ? "Sedang masuk..." : `Masuk sebagai ${ROLES.find(r => r.value === selectedRole)?.label}`}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
