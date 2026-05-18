"use client"

// Form Buat Titipan Baru — 4 langkah
// Step 3 sekarang pilih dari menu warung, bukan ketik manual

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

import { newOrderSchema, type NewOrderFormData } from "@/lib/schemas"
import { createOrder } from "@/actions/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Kantin = { id: string; name: string; location_building: string }
type Tenant = { id: string; kantin_id: string; name: string; food_type: string | null }
type Menu = { id: string; tenant_id: string; name: string; price: number; is_available: boolean }

type Props = {
  kantins: Kantin[]
  tenants: Tenant[]
  menus: Menu[]
}

const STEPS = ["Pilih Kantin", "Pilih Tenant", "Pilih Menu", "Detail Antar"]
const FEE_PRESETS = [3000, 5000, 10000]

export function NewOrderForm({ kantins, tenants, menus }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<NewOrderFormData>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      kantin_id: "",
      tenant_id: "",
      items: [],
      delivery_location: "",
      deadline: "",
      jastip_fee: 5000,
      payment_method: "cash",
      notes: "",
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const selectedKantinId = form.watch("kantin_id")
  const selectedTenantId = form.watch("tenant_id")

  const filteredTenants = tenants.filter((t) => t.kantin_id === selectedKantinId)
  // Menu yang tersedia untuk tenant yang dipilih
  const tenantMenus = menus.filter((m) => m.tenant_id === selectedTenantId && m.is_available)

  // Tambah item dari menu ke daftar pesanan
  function addFromMenu(menu: Menu) {
    // Cek apakah menu ini sudah ada di daftar
    const existingIndex = fields.findIndex(
      (f) => (f as any).menu_id === menu.id
    )
    if (existingIndex >= 0) {
      // Kalau sudah ada, tambah qty-nya saja
      const current = fields[existingIndex]
      update(existingIndex, { ...current, quantity: current.quantity + 1 })
    } else {
      // Kalau belum ada, tambah item baru
      append({
        name: menu.name,
        quantity: 1,
        notes: "",
        estimated_price: menu.price,
        // @ts-ignore — kita simpan menu_id untuk tracking, tapi tidak ada di schema
        menu_id: menu.id,
      })
    }
  }

  async function handleNext() {
    const fieldsPerStep = [
      ["kantin_id"],
      ["tenant_id"],
      ["items"],
      ["delivery_location", "deadline", "jastip_fee", "payment_method"],
    ]
    const isValid = await form.trigger(fieldsPerStep[currentStep] as any)
    if (isValid) {
      // Validasi tambahan: harus ada minimal 1 item di step 3
      if (currentStep === 2 && fields.length === 0) {
        toast.error("Pilih minimal 1 menu")
        return
      }
      setCurrentStep((prev) => prev + 1)
    }
  }

  function handleBack() {
    setCurrentStep((prev) => prev - 1)
  }

  async function onSubmit(data: NewOrderFormData) {
    setIsLoading(true)
    try {
      const result = await createOrder(data)
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
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={index} className="flex items-center gap-2 flex-1">
            <div className={`
              flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0
              ${index < currentStep ? "bg-orange-500 text-white" : ""}
              ${index === currentStep ? "bg-orange-600 text-white ring-4 ring-orange-100" : ""}
              ${index > currentStep ? "bg-gray-100 text-gray-400" : ""}
            `}>
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className={`text-xs hidden sm:block ${index === currentStep ? "font-medium text-orange-600" : "text-gray-400"}`}>
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <div className={`h-px flex-1 ${index < currentStep ? "bg-orange-300" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* LANGKAH 1: Pilih Kantin */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pilih Kantin</h2>
              <FormField
                control={form.control}
                name="kantin_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kantin</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue("tenant_id", "")
                        form.setValue("items", [])
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kantin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kantins.map((kantin) => (
                          <SelectItem key={kantin.id} value={kantin.id}>
                            <span className="font-medium">{kantin.name}</span>
                            <span className="text-muted-foreground ml-2 text-sm">— {kantin.location_building}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* LANGKAH 2: Pilih Tenant */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pilih Warung</h2>
              <FormField
                control={form.control}
                name="tenant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warung</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue("items", [])
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih warung..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredTenants.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            Tidak ada warung di kantin ini
                          </div>
                        ) : (
                          filteredTenants.map((tenant) => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              <span className="font-medium">{tenant.name}</span>
                              {tenant.food_type && (
                                <span className="text-muted-foreground ml-2 text-sm">— {tenant.food_type}</span>
                              )}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* LANGKAH 3: Pilih Menu */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pilih Menu</h2>

              {tenantMenus.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border rounded-xl">
                  <p className="text-3xl mb-2">🍽️</p>
                  <p className="font-medium">Warung ini belum punya menu</p>
                  <p className="text-sm mt-1">Pemilik warung belum menambahkan menu.</p>
                </div>
              ) : (
                <>
                  {/* Daftar menu yang bisa dipilih */}
                  <div className="grid gap-2">
                    {tenantMenus.map((menu) => {
                      const inCart = fields.find((f: any) => f.menu_id === menu.id)
                      return (
                        <div
                          key={menu.id}
                          className={`border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors
                            ${inCart ? "border-orange-400 bg-orange-50" : "bg-white hover:bg-gray-50"}`}
                        >
                          <div>
                            <p className="font-medium text-sm">{menu.name}</p>
                            <p className="text-orange-600 font-semibold text-sm">
                              Rp {menu.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={inCart ? "default" : "outline"}
                            onClick={() => addFromMenu(menu)}
                          >
                            <Plus className="mr-1" />
                            {inCart ? `${inCart.quantity}x` : "Tambah"}
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pesanan yang sudah dipilih */}
                  {fields.length > 0 && (
                    <div className="border-t pt-4 space-y-3">
                      <p className="text-sm font-semibold">Pesanan Kamu ({fields.length} item)</p>
                      {fields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 rounded-xl p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{field.name}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => remove(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                onClick={() => {
                                  if (field.quantity > 1) {
                                    update(index, { ...field, quantity: field.quantity - 1 })
                                  } else {
                                    remove(index)
                                  }
                                }}
                              >−</Button>
                              <span className="w-6 text-center text-sm font-semibold">{field.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                onClick={() => update(index, { ...field, quantity: field.quantity + 1 })}
                              >+</Button>
                            </div>
                            <p className="text-sm text-orange-600 font-medium">
                              Rp {(field.estimated_price * field.quantity).toLocaleString("id-ID")}
                            </p>
                          </div>
                          <Input
                            placeholder="Catatan (misal: tidak pedas)"
                            value={field.notes ?? ""}
                            onChange={(e) => update(index, { ...field, notes: e.target.value })}
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* LANGKAH 4: Detail Pengantaran */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Detail Pengantaran</h2>

              <FormField
                control={form.control}
                name="delivery_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi Pengantaran</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Ruang 301 Gedung B, meja pojok kiri" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => {
                  // Batas: mulai sekarang sampai akhir hari ini (23:59)
                  const now = new Date()
                  const pad = (n: number) => String(n).padStart(2, "0")
                  const minVal = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
                  const maxVal = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T23:59`
                  return (
                    <FormItem>
                      <FormLabel>Batas Waktu Antar <span className="text-xs text-muted-foreground">(harus hari ini)</span></FormLabel>
                      <FormControl>
                        <Input type="datetime-local" min={minVal} max={maxVal} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="jastip_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee Jastip (Rp)</FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {FEE_PRESETS.map((fee) => (
                        <Button
                          key={fee}
                          type="button"
                          variant={field.value === fee ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange(fee)}
                        >
                          Rp {fee.toLocaleString("id-ID")}
                        </Button>
                      ))}
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Atau ketik nominal lain..."
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metode Pembayaran</FormLabel>
                    <div className="flex gap-3">
                      {[
                        { value: "cash", label: "💵 Tunai" },
                        { value: "transfer", label: "📱 Transfer" },
                      ].map((opt) => (
                        <Button
                          key={opt.value}
                          type="button"
                          variant={field.value === opt.value ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => field.onChange(opt.value)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan Tambahan <span className="text-muted-foreground">(opsional)</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Informasi tambahan untuk jastiper..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ringkasan biaya */}
              <div className="bg-orange-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-orange-800">Ringkasan Pesanan</p>
                {form.watch("items").map((item, i) => (
                  <div key={i} className="flex justify-between text-orange-700">
                    <span>{item.name} ×{item.quantity}</span>
                    <span>Rp {(item.estimated_price * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
                <div className="flex justify-between text-orange-700">
                  <span>Fee Jastip</span>
                  <span>Rp {form.watch("jastip_fee").toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-bold text-orange-900 border-t border-orange-200 pt-2">
                  <span>Total</span>
                  <span>
                    Rp {(
                      form.watch("items").reduce((s, i) => s + i.estimated_price * i.quantity, 0) +
                      form.watch("jastip_fee")
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigasi */}
          <div className="flex gap-3 pt-2">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="mr-1" /> Kembali
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={handleNext} className="flex-1">
                Lanjut <ChevronRight className="ml-1" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                {isLoading ? "Membuat titipan..." : "🛵 Buat Titipan"}
              </Button>
            )}
          </div>

        </form>
      </Form>
    </div>
  )
}
