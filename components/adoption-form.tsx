"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Animal } from "@/types/animal"
import { mockApi } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface AdoptionFormProps {
  animal: Animal
}

interface FormErrors {
  nombreCompleto?: string
  email?: string
  telefono?: string
  direccion?: string
  tipoVivienda?: string
  personasEnHogar?: string
  edadesRelaciones?: string
  tiempoDisponible?: string
  experienciaMascotas?: string
  motivacion?: string
  confirmaInformacion?: string
}

export function AdoptionForm({ animal }: AdoptionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    telefono: "",
    direccion: "",
    preferenciaAnimal: animal.tipo === "perro" ? "perro" : "gato",
    preferenciaEdad: "",
    preferenciaSexo: "",
    tipoVivienda: "",
    tienePatioExterior: false,
    personasEnHogar: "",
    edadesRelaciones: "",
    tieneMascotas: false,
    otrasMascotasDescripcion: "",
    tiempoDisponible: "",
    experienciaMascotas: "",
    motivacion: "",
    referenciaNombre: "",
    referenciaContacto: "",
    confirmaInformacion: false,
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Nombre completo: mínimo 3 caracteres
    if (formData.nombreCompleto.trim().length < 3) {
      newErrors.nombreCompleto = "El nombre debe tener al menos 3 caracteres"
    }

    // Email: formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un email válido"
    }

    // Teléfono: solo números, mínimo 10 dígitos
    const phoneRegex = /^\d{10,}$/
    if (!phoneRegex.test(formData.telefono.replace(/\s/g, ""))) {
      newErrors.telefono = "El teléfono debe tener al menos 10 dígitos"
    }

    // Dirección: mínimo 10 caracteres
    if (formData.direccion.trim().length < 10) {
      newErrors.direccion = "La dirección debe tener al menos 10 caracteres"
    }

    if (!formData.tipoVivienda) {
      newErrors.tipoVivienda = "Selecciona el tipo de vivienda"
    }

    if (formData.personasEnHogar.trim().length === 0) {
      newErrors.personasEnHogar = "Indica el número de personas en el hogar"
    }

    if (formData.edadesRelaciones.trim().length < 5) {
      newErrors.edadesRelaciones = "Describe las edades y relaciones"
    }

    if (!formData.tiempoDisponible) {
      newErrors.tiempoDisponible = "Selecciona cuánto tiempo tienes disponible"
    }

    // Experiencia: mínimo 20 caracteres
    if (formData.experienciaMascotas.trim().length < 20) {
      newErrors.experienciaMascotas = "Describe tu experiencia con al menos 20 caracteres"
    }

    // Motivación: mínimo 30 caracteres
    if (formData.motivacion.trim().length < 30) {
      newErrors.motivacion = "Describe tu motivación con al menos 30 caracteres"
    }

    if (!formData.confirmaInformacion) {
      newErrors.confirmaInformacion = "Debes confirmar que la información es verdadera"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de enviar",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await mockApi.submitAdoption({
        animalId: animal.id,
        animalNombre: animal.nombre,
        ...formData,
      })

      toast({
        title: "¡Solicitud enviada!",
        description: `Tu solicitud para adoptar a ${animal.nombre} ha sido enviada exitosamente.`,
      })

      router.push("/submissions")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu solicitud. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleReset = () => {
    setFormData({
      nombreCompleto: "",
      email: "",
      telefono: "",
      direccion: "",
      preferenciaAnimal: animal.tipo === "perro" ? "perro" : "gato",
      preferenciaEdad: "",
      preferenciaSexo: "",
      tipoVivienda: "",
      tienePatioExterior: false,
      personasEnHogar: "",
      edadesRelaciones: "",
      tieneMascotas: false,
      otrasMascotasDescripcion: "",
      tiempoDisponible: "",
      experienciaMascotas: "",
      motivacion: "",
      referenciaNombre: "",
      referenciaContacto: "",
      confirmaInformacion: false,
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Datos personales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Datos personales</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto">
              Nombre completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              placeholder="Ej: María Pérez"
              aria-invalid={!!errors.nombreCompleto}
              aria-describedby={errors.nombreCompleto ? "nombreCompleto-error" : undefined}
            />
            {errors.nombreCompleto && (
              <p id="nombreCompleto-error" className="text-sm text-destructive">
                {errors.nombreCompleto}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Correo electrónico <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@gmail.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="telefono">
              Teléfono / WhatsApp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: +52 155 1234 5678"
              aria-invalid={!!errors.telefono}
              aria-describedby={errors.telefono ? "telefono-error" : undefined}
            />
            {errors.telefono && (
              <p id="telefono-error" className="text-sm text-destructive">
                {errors.telefono}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">
              Dirección (ciudad, colonia) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej: Aguascalientes, Col. Centro"
              aria-invalid={!!errors.direccion}
              aria-describedby={errors.direccion ? "direccion-error" : undefined}
            />
            {errors.direccion && (
              <p id="direccion-error" className="text-sm text-destructive">
                {errors.direccion}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preferencias del animal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Preferencias del animal</h3>

        <div className="space-y-3">
          <Label>Tipo de animal</Label>
          <RadioGroup
            value={formData.preferenciaAnimal}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, preferenciaAnimal: value as "perro" | "gato" }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="perro" id="perro" />
              <Label htmlFor="perro" className="font-normal cursor-pointer">
                Perro
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gato" id="gato" />
              <Label htmlFor="gato" className="font-normal cursor-pointer">
                Gato
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="preferenciaEdad">Edad del animal (opcional)</Label>
            <Select
              value={formData.preferenciaEdad}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, preferenciaEdad: value }))}
            >
              <SelectTrigger id="preferenciaEdad">
                <SelectValue placeholder="Sin preferencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sin-preferencia">Sin preferencia</SelectItem>
                <SelectItem value="cachorro">Cachorro (0-1 año)</SelectItem>
                <SelectItem value="joven">Joven (1-3 años)</SelectItem>
                <SelectItem value="adulto">Adulto (3-7 años)</SelectItem>
                <SelectItem value="senior">Senior (7+ años)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferenciaSexo">Sexo del animal (opcional)</Label>
            <Select
              value={formData.preferenciaSexo}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, preferenciaSexo: value }))}
            >
              <SelectTrigger id="preferenciaSexo">
                <SelectValue placeholder="Indiferente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indiferente">Indiferente</SelectItem>
                <SelectItem value="macho">Macho</SelectItem>
                <SelectItem value="hembra">Hembra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Hogar y disponibilidad */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Hogar y disponibilidad</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tipoVivienda">
              Tipo de vivienda <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.tipoVivienda}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, tipoVivienda: value }))
                if (errors.tipoVivienda) {
                  setErrors((prev) => ({ ...prev, tipoVivienda: undefined }))
                }
              }}
            >
              <SelectTrigger id="tipoVivienda" aria-invalid={!!errors.tipoVivienda}>
                <SelectValue placeholder="-- Selecciona --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa-propia">Casa propia</SelectItem>
                <SelectItem value="casa-rentada">Casa rentada</SelectItem>
                <SelectItem value="departamento-propio">Departamento propio</SelectItem>
                <SelectItem value="departamento-rentado">Departamento rentado</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoVivienda && <p className="text-sm text-destructive">{errors.tipoVivienda}</p>}
          </div>

          <div className="space-y-3">
            <Label>¿Tienes patio o espacio exterior?</Label>
            <RadioGroup
              value={formData.tienePatioExterior ? "si" : "no"}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, tienePatioExterior: value === "si" }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="patio-si" />
                <Label htmlFor="patio-si" className="font-normal cursor-pointer">
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="patio-no" />
                <Label htmlFor="patio-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="personasEnHogar">
              Personas en el hogar (edad y relación) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="personasEnHogar"
              name="personasEnHogar"
              value={formData.personasEnHogar}
              onChange={handleChange}
              placeholder="Ej: 3 (2 adultos, 1 niño)"
              aria-invalid={!!errors.personasEnHogar}
            />
            {errors.personasEnHogar && <p className="text-sm text-destructive">{errors.personasEnHogar}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edadesRelaciones">
              Edades y relaciones <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edadesRelaciones"
              name="edadesRelaciones"
              value={formData.edadesRelaciones}
              onChange={handleChange}
              placeholder="Ej: 35 años (yo), 8 años (hijo)"
              aria-invalid={!!errors.edadesRelaciones}
            />
            {errors.edadesRelaciones && <p className="text-sm text-destructive">{errors.edadesRelaciones}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <Label>¿Tienes otras mascotas?</Label>
          <RadioGroup
            value={formData.tieneMascotas ? "si" : "no"}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, tieneMascotas: value === "si" }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="si" id="mascotas-si" />
              <Label htmlFor="mascotas-si" className="font-normal cursor-pointer">
                Sí
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="mascotas-no" />
              <Label htmlFor="mascotas-no" className="font-normal cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.tieneMascotas && (
          <div className="space-y-2">
            <Label htmlFor="otrasMascotasDescripcion">Describe tus otras mascotas</Label>
            <Input
              id="otrasMascotasDescripcion"
              name="otrasMascotasDescripcion"
              value={formData.otrasMascotasDescripcion}
              onChange={handleChange}
              placeholder="Ej: 1 gato, vacunado"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tiempoDisponible">
            ¿Cuánto tiempo pasas solo el animal en tu día? <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.tiempoDisponible}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, tiempoDisponible: value }))
              if (errors.tiempoDisponible) {
                setErrors((prev) => ({ ...prev, tiempoDisponible: undefined }))
              }
            }}
          >
            <SelectTrigger id="tiempoDisponible" aria-invalid={!!errors.tiempoDisponible}>
              <SelectValue placeholder="-- Selecciona --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0-2 horas</SelectItem>
              <SelectItem value="2-4">2-4 horas</SelectItem>
              <SelectItem value="4-6">4-6 horas</SelectItem>
              <SelectItem value="6-8">6-8 horas</SelectItem>
              <SelectItem value="8+">Más de 8 horas</SelectItem>
            </SelectContent>
          </Select>
          {errors.tiempoDisponible && <p className="text-sm text-destructive">{errors.tiempoDisponible}</p>}
        </div>
      </div>

      {/* Experiencia y compromiso */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Experiencia y compromiso</h3>

        <div className="space-y-2">
          <Label htmlFor="experienciaMascotas">
            ¿Has tenido mascotas antes? Describe brevemente <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="experienciaMascotas"
            name="experienciaMascotas"
            value={formData.experienciaMascotas}
            onChange={handleChange}
            placeholder="Ej: He tenido perros desde niño, sé cuidarlos y llevarlos al veterinario..."
            rows={4}
            aria-invalid={!!errors.experienciaMascotas}
            aria-describedby={errors.experienciaMascotas ? "experienciaMascotas-error" : undefined}
          />
          {errors.experienciaMascotas && (
            <p id="experienciaMascotas-error" className="text-sm text-destructive">
              {errors.experienciaMascotas}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivacion">
            ¿Por qué quieres adoptar? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="motivacion"
            name="motivacion"
            value={formData.motivacion}
            onChange={handleChange}
            placeholder="Explica tus razones que quieres darle un hogar..."
            rows={4}
            aria-invalid={!!errors.motivacion}
            aria-describedby={errors.motivacion ? "motivacion-error" : undefined}
          />
          {errors.motivacion && (
            <p id="motivacion-error" className="text-sm text-destructive">
              {errors.motivacion}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="referenciaNombre">Referencia (nombre y teléfono) (opcional)</Label>
            <Input
              id="referenciaNombre"
              name="referenciaNombre"
              value={formData.referenciaNombre}
              onChange={handleChange}
              placeholder="Ej: Juan López - 55 1234 5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenciaContacto">Contacto de referencia (opcional)</Label>
            <Input
              id="referenciaContacto"
              name="referenciaContacto"
              value={formData.referenciaContacto}
              onChange={handleChange}
              placeholder="Teléfono o email"
            />
          </div>
        </div>
      </div>

      {/* Confirmaciones y documentos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Confirmaciones y documentos</h3>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="confirmaInformacion"
            checked={formData.confirmaInformacion}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({ ...prev, confirmaInformacion: checked as boolean }))
              if (errors.confirmaInformacion) {
                setErrors((prev) => ({ ...prev, confirmaInformacion: undefined }))
              }
            }}
            aria-invalid={!!errors.confirmaInformacion}
          />
          <Label htmlFor="confirmaInformacion" className="text-sm font-normal leading-relaxed cursor-pointer">
            Confirmo que la información es verdadera y que puedo recibir al animal en mi domicilio{" "}
            <span className="text-destructive">*</span>
          </Label>
        </div>
        {errors.confirmaInformacion && <p className="text-sm text-destructive">{errors.confirmaInformacion}</p>}

        <p className="text-sm text-muted-foreground">
          Nota: Este formulario es el primer filtro. Posteriormente se hará visita domiciliaria y entrevista.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar solicitud"
          )}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={handleReset}>
          Limpiar
        </Button>
      </div>
    </form>
  )
}
