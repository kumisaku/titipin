"use client"

// Komponen untuk pemilik warung mengelola menu
// Fitur: tambah menu, toggle tersedia/tidak, hapus

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Eye, EyeOff, Pencil, Check, X } from "lucide-react"
import { addMenuItem, updateMenuItem, deleteMenuItem } from "@/actions/menus"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: number
  is_available: boolean
}

type Props = {
  tenantId: string
  tenantName: string
  initialMenus: MenuItem[]
}

export function MenuManager({ tenantId, tenantName, initialMenus }: Props) {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // State untuk form tambah menu baru
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "" })

  // State untuk form edit menu yang ada
  const [editData, setEditData] = useState({ name: "", description: "", price: "" })

  async function handleAdd() {
    if (!newItem.name || !newItem.price) {
      toast.error("Nama dan harga wajib diisi")
      return
    }
    setIsLoading(true)
    const result = await addMenuItem({
      tenant_id: tenantId,
      name: newItem.name,
      description: newItem.description || undefined,
      price: Number(newItem.price),
    })
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    // Update tampilan tanpa reload halaman (optimistic update)
    setMenus((prev) => [
      ...prev,
      {
        id: Date.now().toString(), // sementara, akan di-replace saat revalidate
        name: newItem.name,
        description: newItem.description || null,
        price: Number(newItem.price),
        is_available: true,
      },
    ])
    setNewItem({ name: "", description: "", price: "" })
    setIsAdding(false)
    toast.success("Menu berhasil ditambahkan!")
  }

  async function handleToggleAvailable(menu: MenuItem) {
    const result = await updateMenuItem(menu.id, { is_available: !menu.is_available })
    if (result?.error) {
      toast.error(result.error)
      return
    }
    setMenus((prev) =>
      prev.map((m) => m.id === menu.id ? { ...m, is_available: !m.is_available } : m)
    )
  }

  async function handleDelete(menuId: string) {
    if (!confirm("Yakin ingin menghapus menu ini?")) return
    const result = await deleteMenuItem(menuId)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    setMenus((prev) => prev.filter((m) => m.id !== menuId))
    toast.success("Menu dihapus")
  }

  function startEdit(menu: MenuItem) {
    setEditingId(menu.id)
    setEditData({ name: menu.name, description: menu.description || "", price: String(menu.price) })
  }

  async function handleSaveEdit(menuId: string) {
    if (!editData.name || !editData.price) {
      toast.error("Nama dan harga wajib diisi")
      return
    }
    const result = await updateMenuItem(menuId, {
      name: editData.name,
      description: editData.description || undefined,
      price: Number(editData.price),
    })
    if (result?.error) {
      toast.error(result.error)
      return
    }
    setMenus((prev) =>
      prev.map((m) => m.id === menuId
        ? { ...m, name: editData.name, description: editData.description || null, price: Number(editData.price) }
        : m
      )
    )
    setEditingId(null)
    toast.success("Menu diperbarui!")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Menu {tenantName}</h2>
        <Button onClick={() => setIsAdding(true)} size="sm" disabled={isAdding}>
          <Plus className="mr-1" /> Tambah Menu
        </Button>
      </div>

      {/* Form tambah menu baru */}
      {isAdding && (
        <div className="border-2 border-dashed border-orange-300 rounded-xl p-4 space-y-3 bg-orange-50">
          <p className="text-sm font-medium text-orange-700">Menu Baru</p>
          <Input
            placeholder="Nama menu (contoh: Nasi Goreng Spesial)"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            placeholder="Deskripsi (opsional)"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Harga (Rp)"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={isLoading} size="sm">
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Daftar menu */}
      {menus.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">🍽️</p>
          <p>Belum ada menu. Klik "Tambah Menu" untuk mulai.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className={`border rounded-xl p-4 ${!menu.is_available ? "opacity-50 bg-gray-50" : "bg-white"}`}
            >
              {editingId === menu.id ? (
                // Mode edit
                <div className="space-y-2">
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Nama menu"
                  />
                  <Input
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Deskripsi"
                  />
                  <Input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    placeholder="Harga"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(menu.id)}>
                      <Check className="mr-1" /> Simpan
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="mr-1" /> Batal
                    </Button>
                  </div>
                </div>
              ) : (
                // Mode tampil
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{menu.name}</p>
                      {!menu.is_available && (
                        <Badge variant="secondary" className="shrink-0">Habis</Badge>
                      )}
                    </div>
                    {menu.description && (
                      <p className="text-sm text-muted-foreground truncate">{menu.description}</p>
                    )}
                    <p className="text-sm font-semibold text-orange-600 mt-1">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Toggle tersedia */}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleToggleAvailable(menu)}
                      title={menu.is_available ? "Set Habis" : "Set Tersedia"}
                    >
                      {menu.is_available ? <Eye /> : <EyeOff />}
                    </Button>

                    {/* Edit */}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => startEdit(menu)}
                    >
                      <Pencil />
                    </Button>

                    {/* Hapus */}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(menu.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
