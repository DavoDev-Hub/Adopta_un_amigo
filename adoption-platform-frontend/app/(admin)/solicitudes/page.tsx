"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { listApplications, updateApplicationStatus, type Application } from "@/lib/admin-api"
import { useToast } from "@/hooks/use-toast"
import { Eye } from "lucide-react"

export default function SolicitudesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Application["status"] | "todas">("todas")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [filter])

  const loadApplications = async () => {
    try {
      const params = filter !== "todas" ? { status: filter } : undefined
      const data = await listApplications(params)
      setApplications(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: Application["status"]) => {
    try {
      await updateApplicationStatus(id, status)
      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente",
      })
      loadApplications()
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app)
    setDialogOpen(true)
  }

  const getStatusBadge = (status: Application["status"]) => {
    const config = {
      recibida: { label: "Recibida", variant: "secondary" as const },
      en_revision: { label: "En Revisión", variant: "default" as const },
      aprobada: { label: "Aprobada", variant: "default" as const },
      rechazada: { label: "Rechazada", variant: "destructive" as const },
    }

    const { label, variant } = config[status]
    return <Badge variant={variant}>{label}</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
            <h1 className="text-3xl font-bold text-foreground">Solicitudes de Adopción</h1>
            <p className="text-muted-foreground mt-1">Gestiona las solicitudes de adopción</p>
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="recibida">Recibidas</SelectItem>
              <SelectItem value="en_revision">En Revisión</SelectItem>
              <SelectItem value="aprobada">Aprobadas</SelectItem>
              <SelectItem value="rechazada">Rechazadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No hay solicitudes para mostrar</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{app.fullName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Solicitud para: <span className="font-medium text-foreground">{app.petName}</span>
                          </p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="text-foreground">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Teléfono:</span>
                          <span className="text-foreground">{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Fecha:</span>
                          <span className="text-foreground">{formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button variant="outline" onClick={() => handleViewDetails(app)} className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground">Cambiar estado:</span>
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app.id, value as Application["status"])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recibida">Recibida</SelectItem>
                          <SelectItem value="en_revision">En Revisión</SelectItem>
                          <SelectItem value="aprobada">Aprobada</SelectItem>
                          <SelectItem value="rechazada">Rechazada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Solicitud de Adopción</DialogTitle>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-6 py-4">
                {/* Header with status */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">Animal solicitado</p>
                    <p className="text-lg font-semibold">{selectedApp.petName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(selectedApp.status)}
                    <p className="text-xs text-muted-foreground">{formatDate(selectedApp.createdAt)}</p>
                  </div>
                </div>

                {/* Datos personales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Datos personales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nombre completo</p>
                        <p className="text-foreground">{selectedApp.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Correo electrónico</p>
                        <p className="text-foreground">{selectedApp.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Teléfono / WhatsApp</p>
                        <p className="text-foreground">{selectedApp.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Dirección (ciudad, colonia)</p>
                        <p className="text-foreground">{selectedApp.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preferencias del animal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preferencias del animal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tipo de animal</p>
                        <p className="text-foreground capitalize">{selectedApp.animalType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Edad del animal (opcional)</p>
                        <p className="text-foreground">{selectedApp.animalAge || "Sin preferencia"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sexo del animal (opcional)</p>
                        <p className="text-foreground">{selectedApp.animalSex || "Indiferente"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hogar y disponibilidad */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hogar y disponibilidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tipo de vivienda</p>
                        <p className="text-foreground">{selectedApp.housingType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">¿Tienes patio o espacio exterior?</p>
                        <p className="text-foreground">{selectedApp.hasOutdoorSpace ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Personas en el hogar (edad y relación)
                        </p>
                        <p className="text-foreground">{selectedApp.householdMembers}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Edades y relaciones</p>
                        <p className="text-foreground">{selectedApp.householdAges}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">¿Tienes otras mascotas?</p>
                        <p className="text-foreground">{selectedApp.hasOtherPets ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          ¿Cuánto tiempo pasas solo el animal en tu día?
                        </p>
                        <p className="text-foreground">{selectedApp.timeAlone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Experiencia y compromiso */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Experiencia y compromiso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        ¿Has tenido mascotas antes? Describe brevemente
                      </p>
                      <p className="text-foreground whitespace-pre-wrap">{selectedApp.previousPetExperience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">¿Por qué quieres adoptar?</p>
                      <p className="text-foreground whitespace-pre-wrap">{selectedApp.whyAdopt}</p>
                    </div>
                    {selectedApp.reference && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Referencia (nombre y teléfono) (opcional)
                          </p>
                          <p className="text-foreground">{selectedApp.reference}</p>
                        </div>
                        {selectedApp.referenceContact && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Contacto de referencia (opcional)
                            </p>
                            <p className="text-foreground">{selectedApp.referenceContact}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status change section */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">Cambiar estado de la solicitud:</span>
                      <Select
                        value={selectedApp.status}
                        onValueChange={(value) => handleStatusChange(selectedApp.id, value as Application["status"])}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recibida">Recibida</SelectItem>
                          <SelectItem value="en_revision">En Revisión</SelectItem>
                          <SelectItem value="aprobada">Aprobada</SelectItem>
                          <SelectItem value="rechazada">Rechazada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground italic">
                  Nota: Este formulario es el primer filtro. Posteriormente se hará visita domiciliaria y entrevista.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
