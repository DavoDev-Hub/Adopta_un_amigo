import { mockApi } from "@/lib/mock-data"
import { AnimalCard } from "@/components/animal-card"
import { Navigation } from "@/components/navigation"

export default async function HomePage() {
  const animals = await mockApi.getAnimals()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">
            Encuentra a tu compañero perfecto
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Cada animal merece un hogar lleno de amor. Explora nuestros adorables amigos que están esperando conocerte y
            formar parte de tu familia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      </main>
    </div>
  )
}
