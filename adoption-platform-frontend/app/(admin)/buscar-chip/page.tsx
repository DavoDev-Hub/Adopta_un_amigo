"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, PawPrint, User, Mail, Phone, MapPin, Calendar, Plus, Clock } from "lucide-react"
import { searchChip, type ChipSearchResult } from "@/lib/admin-api"
import { useToast } from "@/hooks/use-toast"

export default function BuscarChipPage() {
  const [chipCode, setChipCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ChipSearchResult | null>(null)
  const [searchHistory, setSearchHistory] = useState<ChipSearchResult[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Load search history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chipSearchHistory")
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.error("Error loading search history:", e)
      }
    }
  }, [])

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem("chipSearchHistory", JSON.stringify(searchHistory))
    }
  }, [searchHistory])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!chipCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de chip",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const searchResult = await searchChip(chipCode.trim())
      setResult(searchResult)

      // Add to history (keep last 10 searches)
      setSearchHistory((prev) => [searchResult, ...prev.slice(0, 9)])

      if (searchResult.found) {
        toast({
          title: "Chip encontrado",
          description: `Animal: ${searchResult.animal?.nombre}`,
        })
      } else {
        toast({
          title: "Chip no encontrado",
          description: "No se encontró ningún animal con este código",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo buscar el chip",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNotifyOwner = () => {
    if (result?.animal?.owner) {
      toast({
        title: "Notificación enviada",
        description: `Se ha notificado a ${result.animal.owner.fullName}`,
      })
    }
  }

  const handleStartAdoption = () => {
    router.push("/admin/animales/nuevo")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buscar Chip</h1>
          <p className="text-muted-foreground">
            Escanea o ingresa el código de chip para buscar información del animal
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle>Código de Chip</CardTitle>
            <CardDescription>Ingresa o escanea el código del microchip del animal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Ej: MX123456789"
                value={chipCode}
                onChange={(e) => setChipCode(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado de Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              {result.found && result.animal ? (
                <div className="space-y-6">
                  {/* Animal Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <PawPrint className="h-5 w-5" />
                      Información del Animal
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre</p>
                          <p className="font-medium">{result.animal.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Especie</p>
                          <p className="font-medium capitalize">{result.animal.especie}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Raza</p>
                          <p className="font-medium">{result.animal.raza || "No especificada"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Edad Aproximada</p>
                          <p className="font-medium">{result.animal.edadAprox || "No especificada"}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Tamaño</p>
                          <p className="font-medium capitalize">{result.animal.tamaño || "No especificado"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estado</p>
                          <Badge
                            variant={
                              result.animal.estado === "adoptado"
                                ? "default"
                                : result.animal.estado === "listo"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {result.animal.estado === "adoptado"
                              ? "Adoptado"
                              : result.animal.estado === "listo"
                                ? "Listo"
                                : "En Recuperación"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Código de Chip</p>
                          <p className="font-mono font-medium">{result.chipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Owner Info */}
                  {result.animal.owner && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Información del Dueño
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Nombre completo</p>
                              <p className="font-medium">{result.animal.owner.fullName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Correo electrónico</p>
                              <p className="font-medium">{result.animal.owner.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Teléfono</p>
                              <p className="font-medium">{result.animal.owner.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Dirección</p>
                              <p className="font-medium">{result.animal.owner.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Fecha de adopción</p>
                              <p className="font-medium">{formatDate(result.animal.owner.adoptionDate)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleNotifyOwner}>
                      <Mail className="h-4 w-4 mr-2" />
                      Notificar Dueño
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Search className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No se encontró chip</h3>
                    <p className="text-muted-foreground">
                      No existe ningún animal registrado con el código:{" "}
                      <span className="font-mono">{result.chipCode}</span>
                    </p>
                  </div>
                  <Button onClick={handleStartAdoption}>
                    <Plus className="h-4 w-4 mr-2" />
                    Iniciar Proceso de Adopción
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial de Búsquedas
              </CardTitle>
              <CardDescription>Últimas búsquedas realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${item.found ? "bg-green-500" : "bg-red-500"}`}
                        title={item.found ? "Encontrado" : "No encontrado"}
                      />
                      <div>
                        <p className="font-mono text-sm font-medium">{item.chipCode}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString("es-MX")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.found && item.animal && (
                        <Badge variant="secondary" className="text-xs">
                          {item.animal.nombre}
                        </Badge>
                      )}
                      <Badge variant={item.found ? "default" : "destructive"} className="text-xs">
                        {item.found ? "Encontrado" : "No encontrado"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
