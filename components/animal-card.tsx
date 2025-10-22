import Link from "next/link"
import Image from "next/image"
import type { Animal } from "@/types/animal"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface AnimalCardProps {
  animal: Animal
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <Image src={animal.imagen || "/placeholder.svg"} alt={animal.nombre} fill className="object-cover" />
        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
          {animal.tipo.charAt(0).toUpperCase() + animal.tipo.slice(1)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-xl mb-2 text-foreground">{animal.nombre}</h3>
        <div className="flex gap-2 mb-3 text-sm text-muted-foreground">
          <span>{animal.raza}</span>
          <span>•</span>
          <span>
            {animal.edad} {animal.edad === 1 ? "año" : "años"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{animal.descripcion}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" size="lg">
          <Link href={`/adopt/${animal.id}`} className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Adoptar a {animal.nombre}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
