import type { Animal, AdoptionSubmission } from "@/types/animal"

export const mockAnimals: Animal[] = [
  {
    id: 1,
    nombre: "Max",
    tipo: "perro",
    raza: "Labrador Retriever",
    edad: 3,
    descripcion:
      "Max es un perro muy cariñoso y juguetón. Le encanta correr en el parque y jugar con niños. Es perfecto para familias activas.",
    imagen: "/happy-golden-labrador-dog.jpg",
    disponible: true,
  },
  {
    id: 2,
    nombre: "Luna",
    tipo: "gato",
    raza: "Siamés",
    edad: 2,
    descripcion:
      "Luna es una gata elegante y tranquila. Disfruta de las siestas al sol y es muy independiente. Ideal para apartamentos.",
    imagen: "/siamese-cat-blue-eyes.jpg",
    disponible: true,
  },
  {
    id: 3,
    nombre: "Rocky",
    tipo: "perro",
    raza: "Pastor Alemán",
    edad: 5,
    descripcion:
      "Rocky es un perro leal y protector. Está bien entrenado y es excelente como perro guardián. Necesita ejercicio diario.",
    imagen: "/german-shepherd.png",
    disponible: true,
  },
  {
    id: 4,
    nombre: "Mimi",
    tipo: "gato",
    raza: "Persa",
    edad: 1,
    descripcion:
      "Mimi es una gatita juguetona y curiosa. Le encanta explorar y jugar con juguetes. Perfecta para familias con niños.",
    imagen: "/persian-cat-fluffy.jpg",
    disponible: true,
  },
  {
    id: 5,
    nombre: "Buddy",
    tipo: "perro",
    raza: "Beagle",
    edad: 4,
    descripcion:
      "Buddy es un perro amigable y sociable. Le encanta conocer gente nueva y otros perros. Ideal para dueños primerizos.",
    imagen: "/beagle-dog-happy.jpg",
    disponible: true,
  },
  {
    id: 6,
    nombre: "Nala",
    tipo: "gato",
    raza: "Maine Coon",
    edad: 3,
    descripcion: "Nala es una gata grande y cariñosa. A pesar de su tamaño, es muy gentil y le encanta recibir mimos.",
    imagen: "/maine-coon-cat.png",
    disponible: true,
  },
]

// Mock storage for submissions (in a real app, this would be in a database)
const submissions: AdoptionSubmission[] = []

export const mockApi = {
  getAnimals: async (): Promise<Animal[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockAnimals
  },

  getAnimalById: async (id: number): Promise<Animal | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockAnimals.find((animal) => animal.id === id)
  },

  submitAdoption: async (submission: Omit<AdoptionSubmission, "id" | "fecha">): Promise<AdoptionSubmission> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newSubmission: AdoptionSubmission = {
      ...submission,
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
    }
    submissions.push(newSubmission)
    return newSubmission
  },

  getSubmissions: async (): Promise<AdoptionSubmission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...submissions].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  },
}
