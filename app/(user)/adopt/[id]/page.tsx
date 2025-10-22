import { notFound } from "next/navigation"
import { mockApi } from "@/lib/mock-data"
import { Navigation } from "@/components/navigation"
import { AdoptionForm } from "@/components/adoption-form"
import { ProtectedRoute } from "@/components/protected-route"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface AdoptPageProps {
  params: Promise<{ id: string }>
}

export default async function AdoptPage({ params }: AdoptPageProps) {
  const { id } = await params
  const animal = await mockApi.getAnimalById(Number.parseInt(id))

  if (!animal) {
    notFound()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={animal.imagen || "/placeholder.svg"}
                      alt={animal.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <Badge className="w-fit mb-3 bg-accent text-accent-foreground">
                      {animal.tipo.charAt(0).toUpperCase() + animal.tipo.slice(1)}
                    </Badge>
                    <h1 className="text-4xl font-bold mb-4 text-foreground">{animal.nombre}</h1>
                    <div className="flex gap-3 mb-6 text-muted-foreground">
                      <span className="font-medium">{animal.raza}</span>
                      <span>•</span>
                      <span>
                        {animal.edad} {animal.edad === 1 ? "año" : "años"}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{animal.descripcion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Solicitud de Adopción</h2>
                <AdoptionForm animal={animal} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
