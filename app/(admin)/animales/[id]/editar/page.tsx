"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { getAnimal, updateAnimal, type Animal } from "@/lib/admin-api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditarAnimalPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "perro" as Animal["especie"],
    raza: "",
    edadAprox: "",
    tamaño: "mediano" as Animal["tamaño"],
    estado: "listo" as Animal["estado"],
    fotoUrl: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    }

    loadAnimal()
  }, [router, params.id])

  const loadAnimal = async () => {
    try {
      const animal = await getAnimal(params.id as string)
      if (!animal) {
        toast({
          title: "Error",
          description: "Animal no encontrado",
          variant: "destructive",
        })
        router.push("/animales")
        return
      }

      setFormData({
        nombre: animal.nombre,
        especie: animal.especie,
        raza: animal.raza || "",
        edadAprox: animal.edadAprox || "",
        tamaño: animal.tamaño || "mediano",
        estado: animal.estado,
        fotoUrl: animal.fotoUrl,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el animal",
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.fotoUrl.trim()) {
      newErrors.fotoUrl = "La URL de la foto es requerida"
    } else if (!formData.fotoUrl.match(/^https?:\/\/.+/)) {
      newErrors.fotoUrl = "Debe ser una URL válida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await updateAnimal(params.id as string, formData)
      toast({
        title: "Éxito",
        description: "Animal actualizado correctamente",
      })
      router.push("/animales")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el animal",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <Link href="/animales">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Editar Animal</h1>
          <p className="text-muted-foreground mt-1">Actualiza la información del animal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Animal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  disabled={loading}
                />
                {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="especie">Especie *</Label>
                  <Select
                    value={formData.especie}
                    onValueChange={(value) => setFormData({ ...formData, especie: value as Animal["especie"] })}
                    disabled={loading}
                  >
                    <SelectTrigger id="especie">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perro">Perro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="raza">Raza</Label>
                  <Input
                    id="raza"
                    value={formData.raza}
                    onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edadAprox">Edad Aproximada</Label>
                  <Input
                    id="edadAprox"
                    placeholder="ej: 3 años"
                    value={formData.edadAprox}
                    onChange={(e) => setFormData({ ...formData, edadAprox: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tamaño">Tamaño</Label>
                  <Select
                    value={formData.tamaño}
                    onValueChange={(value) => setFormData({ ...formData, tamaño: value as Animal["tamaño"] })}
                    disabled={loading}
                  >
                    <SelectTrigger id="tamaño">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chico">Chico</SelectItem>
                      <SelectItem value="mediano">Mediano</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value as Animal["estado"] })}
                  disabled={loading}
                >
                  <SelectTrigger id="estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listo">Listo para Adopción</SelectItem>
                    <SelectItem value="en_recuperacion">En Recuperación</SelectItem>
                    <SelectItem value="adoptado">Adoptado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fotoUrl">URL de la Foto *</Label>
                <Input
                  id="fotoUrl"
                  type="url"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={formData.fotoUrl}
                  onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                  disabled={loading}
                />
                {errors.fotoUrl && <p className="text-sm text-destructive">{errors.fotoUrl}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Link href="/animales">
                  <Button type="button" variant="outline" disabled={loading}>
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
