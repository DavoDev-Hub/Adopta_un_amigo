// Mock API service for admin operations

export type Animal = {
  id: string
  nombre: string
  especie: "perro" | "gato" | "otro"
  raza?: string
  edadAprox?: string
  tamaño?: "chico" | "mediano" | "grande"
  estado: "listo" | "en_recuperacion" | "adoptado"
  fotoUrl: string
}

export type Application = {
  id: string
  petId: string
  petName: string
  // Datos personales
  fullName: string
  email: string
  phone: string
  address: string
  // Preferencias del animal
  animalType: "perro" | "gato"
  animalAge?: string
  animalSex?: string
  // Hogar y disponibilidad
  housingType: string
  hasOutdoorSpace: boolean
  householdMembers: string
  householdAges: string
  hasOtherPets: boolean
  timeAlone: string
  // Experiencia y compromiso
  previousPetExperience: string
  whyAdopt: string
  reference?: string
  referenceContact?: string
  // Metadata
  createdAt: string
  status: "recibida" | "en_revision" | "aprobada" | "rechazada"
}

// Chip-related types and data structures
export type ChipSearchResult = {
  found: boolean
  animal?: Animal & { chipCode: string; owner?: Owner }
  timestamp: string
  chipCode: string
}

export type Owner = {
  fullName: string
  email: string
  phone: string
  address: string
  adoptionDate: string
}

// Mock data
let animals: Animal[] = [
  {
    id: "1",
    nombre: "Max",
    especie: "perro",
    raza: "Labrador",
    edadAprox: "3 años",
    tamaño: "grande",
    estado: "listo",
    fotoUrl: "/labrador-dog.png",
  },
  {
    id: "2",
    nombre: "Luna",
    especie: "gato",
    raza: "Siamés",
    edadAprox: "2 años",
    tamaño: "chico",
    estado: "listo",
    fotoUrl: "/siamese-cat.png",
  },
  {
    id: "3",
    nombre: "Rocky",
    especie: "perro",
    raza: "Pastor Alemán",
    edadAprox: "5 años",
    tamaño: "grande",
    estado: "en_recuperacion",
    fotoUrl: "/majestic-german-shepherd.png",
  },
]

const applications: Application[] = [
  {
    id: "1",
    petId: "1",
    petName: "Max",
    fullName: "Juan Pérez",
    email: "juan@example.com",
    phone: "+52 155 1234 5678",
    address: "Aguascalientes, Col. Centro",
    animalType: "perro",
    animalAge: "Sin preferencia",
    animalSex: "Indiferente",
    housingType: "Casa",
    hasOutdoorSpace: true,
    householdMembers: "3 (2 adultos, 1 niño)",
    householdAges: "35 años (yo), 8 años (hijo)",
    hasOtherPets: false,
    timeAlone: "4-6 horas",
    previousPetExperience: "He tenido perros desde niño, sé cuidarlos y llevarlos al veterinario regularmente.",
    whyAdopt: "Quiero darle un hogar a un perro que lo necesite y que mi hijo aprenda sobre responsabilidad.",
    reference: "Juan López - 55 1234 5678",
    referenceContact: "55 1234 5678",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: "recibida",
  },
  {
    id: "2",
    petId: "2",
    petName: "Luna",
    fullName: "María García",
    email: "maria@example.com",
    phone: "+52 155 7890 1234",
    address: "Ciudad de México, Col. Roma",
    animalType: "gato",
    animalAge: "Adulto",
    animalSex: "Hembra",
    housingType: "Departamento",
    hasOutdoorSpace: false,
    householdMembers: "2 (2 adultos)",
    householdAges: "28 años (yo), 30 años (pareja)",
    hasOtherPets: true,
    timeAlone: "6-8 horas",
    previousPetExperience: "Tengo un gato desde hace 3 años, está bien socializado y busco compañía para él.",
    whyAdopt: "Queremos darle un hogar a otro gato y que nuestro gato actual tenga compañía.",
    reference: "Ana Martínez - 55 9876 5432",
    referenceContact: "anamartinez@email.com",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: "en_revision",
  },
  {
    id: "3",
    petId: "1",
    petName: "Max",
    fullName: "Carlos López",
    email: "carlos@example.com",
    phone: "+52 155 3456 7890",
    address: "Guadalajara, Col. Providencia",
    animalType: "perro",
    animalAge: "Adulto",
    animalSex: "Macho",
    housingType: "Casa con jardín",
    hasOutdoorSpace: true,
    householdMembers: "4 (2 adultos, 2 niños)",
    householdAges: "40 años (yo), 38 años (esposa), 10 años (hijo), 7 años (hija)",
    hasOtherPets: false,
    timeAlone: "2-4 horas",
    previousPetExperience:
      "Tuve perros toda mi vida, el último falleció hace 6 meses y estamos listos para adoptar de nuevo.",
    whyAdopt: "Queremos darle un hogar lleno de amor a un perro que lo necesite. Tenemos experiencia y espacio.",
    reference: "Pedro Sánchez - 33 1234 5678",
    referenceContact: "pedro.sanchez@email.com",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: "aprobada",
  },
]

const chipDatabase: Record<string, { animal: Animal; owner: Owner }> = {
  MX123456789: {
    animal: {
      id: "1",
      nombre: "Max",
      especie: "perro",
      raza: "Labrador",
      edadAprox: "3 años",
      tamaño: "grande",
      estado: "adoptado",
      fotoUrl: "/labrador-dog.png",
    },
    owner: {
      fullName: "Juan Pérez",
      email: "juan@example.com",
      phone: "+52 155 1234 5678",
      address: "Aguascalientes, Col. Centro",
      adoptionDate: "2024-01-15",
    },
  },
  MX987654321: {
    animal: {
      id: "2",
      nombre: "Luna",
      especie: "gato",
      raza: "Siamés",
      edadAprox: "2 años",
      tamaño: "chico",
      estado: "adoptado",
      fotoUrl: "/siamese-cat.png",
    },
    owner: {
      fullName: "María García",
      email: "maria@example.com",
      phone: "+52 155 7890 1234",
      address: "Ciudad de México, Col. Roma",
      adoptionDate: "2024-02-20",
    },
  },
}

const delay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 500))

// Animals API
export async function listAnimals(): Promise<Animal[]> {
  await delay()
  return [...animals]
}

export async function getAnimal(id: string): Promise<Animal | null> {
  await delay()
  return animals.find((a) => a.id === id) || null
}

export async function createAnimal(input: Omit<Animal, "id">): Promise<Animal> {
  await delay()
  const newAnimal: Animal = {
    ...input,
    id: Date.now().toString(),
  }
  animals.push(newAnimal)
  return newAnimal
}

export async function updateAnimal(id: string, input: Omit<Animal, "id">): Promise<Animal> {
  await delay()
  const index = animals.findIndex((a) => a.id === id)
  if (index === -1) throw new Error("Animal no encontrado")

  const updated: Animal = { ...input, id }
  animals[index] = updated
  return updated
}

export async function deleteAnimal(id: string): Promise<void> {
  await delay()
  animals = animals.filter((a) => a.id !== id)
}

// Applications API
export async function listApplications(params?: { status?: Application["status"] }): Promise<Application[]> {
  await delay()
  let result = [...applications]

  if (params?.status) {
    result = result.filter((a) => a.status === params.status)
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getApplication(id: string): Promise<Application | null> {
  await delay()
  return applications.find((a) => a.id === id) || null
}

export async function updateApplicationStatus(id: string, status: Application["status"]): Promise<Application> {
  await delay()
  const index = applications.findIndex((a) => a.id === id)
  if (index === -1) throw new Error("Solicitud no encontrada")

  applications[index].status = status
  return applications[index]
}

// Stats
export async function getStats() {
  await delay()
  return {
    totalAnimals: animals.length,
    animalsReady: animals.filter((a) => a.estado === "listo").length,
    animalsRecovering: animals.filter((a) => a.estado === "en_recuperacion").length,
    animalsAdopted: animals.filter((a) => a.estado === "adoptado").length,
    totalApplications: applications.length,
    applicationsReceived: applications.filter((a) => a.status === "recibida").length,
    applicationsInReview: applications.filter((a) => a.status === "en_revision").length,
    applicationsApproved: applications.filter((a) => a.status === "aprobada").length,
    applicationsRejected: applications.filter((a) => a.status === "rechazada").length,
  }
}

// Chip search functionality
export async function searchChip(chipCode: string): Promise<ChipSearchResult> {
  await delay()

  const result = chipDatabase[chipCode]

  if (result) {
    return {
      found: true,
      animal: {
        ...result.animal,
        chipCode,
        owner: result.owner,
      },
      timestamp: new Date().toISOString(),
      chipCode,
    }
  }

  return {
    found: false,
    timestamp: new Date().toISOString(),
    chipCode,
  }
}
