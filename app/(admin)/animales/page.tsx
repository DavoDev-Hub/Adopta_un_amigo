"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { listAnimals, deleteAnimal, type Animal } from "@/lib/admin-api"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AnimalesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadAnimals()
  }, [])

  const loadAnimals = async () => {
    try {
      const data = await listAnimals()
      setAnimals(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los animales",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteAnimal(deleteId)
      toast({
        title: "Éxito",
        description: "Animal eliminado correctamente",
      })
      loadAnimals()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el animal",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const getEstadoBadge = (estado: Animal["estado"]) => {
    const variants = {
      listo: "default",
      en_recuperacion: "secondary",
      adoptado: "outline",
    } as const

    const labels = {
      listo: "Listo",
      en_recuperacion: "En Recuperación",
      adoptado: "Adoptado",
    }

    return <Badge variant={variants[estado]}>{labels[estado]}</Badge>
  }

  if (loading) {
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Animales</h1>
            <p className="text-muted-foreground mt-1">Gestiona los animales disponibles para adopción</p>
          </div>
          <Link href="/admin/animales/nuevo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Animal
            </Button>
          </Link>
        </div>

        {animals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No hay animales registrados</p>
              <Link href="/admin/animales/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primer animal
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {animals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={animal.fotoUrl || "/placeholder.svg"}
                    alt={animal.nombre}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{animal.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{animal.raza || animal.especie}</p>
                    </div>
                    {getEstadoBadge(animal.estado)}
                  </div>

                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {animal.edadAprox && <span>• {animal.edadAprox}</span>}
                    {animal.tamaño && <span>• {animal.tamaño}</span>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/animales/${animal.id}/editar`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(animal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El animal será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
