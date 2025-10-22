export type AnimalType = "perro" | "gato" | "otro"

export interface Animal {
  id: number
  nombre: string
  tipo: AnimalType
  raza: string
  edad: number
  descripcion: string
  imagen: string
  disponible: boolean
}

export interface AdoptionSubmission {
  id: string
  animalId: number
  animalNombre: string
  nombreCompleto: string
  email: string
  telefono: string
  direccion: string
  // Preferencias del animal
  preferenciaAnimal: "perro" | "gato"
  preferenciaEdad: string
  preferenciaSexo?: string
  // Hogar y disponibilidad
  tipoVivienda: string
  tienePatioExterior: boolean
  personasEnHogar: string
  edadesRelaciones: string
  tieneMascotas: boolean
  otrasMascotasDescripcion?: string
  tiempoDisponible: string
  // Experiencia y compromiso
  experienciaMascotas: string
  motivacion: string
  referenciaNombre?: string
  referenciaContacto?: string
  // Confirmaciones
  confirmaInformacion: boolean
  fecha: string
}
