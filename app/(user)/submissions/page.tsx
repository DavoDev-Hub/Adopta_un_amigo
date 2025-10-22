import { mockApi } from "@/lib/mock-data"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Phone, MapPin } from "lucide-react"

export default async function SubmissionsPage() {
  const submissions = await mockApi.getSubmissions()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Mis Solicitudes de Adopción</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Aquí puedes ver todas las solicitudes de adopción que has enviado.
          </p>

          {submissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">No has enviado ninguna solicitud de adopción todavía.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{submission.animalNombre}</CardTitle>
                        <Badge className="bg-accent text-accent-foreground">Solicitud Enviada</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(submission.fecha).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Información de Contacto</h3>
                      <div className="grid gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="font-medium text-foreground min-w-[120px]">Nombre:</span>
                          {submission.nombreCompleto}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-foreground min-w-[120px]">Email:</span>
                          {submission.email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-foreground min-w-[120px]">Teléfono:</span>
                          {submission.telefono}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-foreground min-w-[120px]">Dirección:</span>
                          {submission.direccion}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-foreground">Experiencia con Mascotas</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{submission.experiencia}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-foreground">Motivación para Adoptar</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{submission.motivacion}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
