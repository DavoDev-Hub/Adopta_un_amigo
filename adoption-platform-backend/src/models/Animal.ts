import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
  nombre: string;
  especie: 'perro' | 'gato' | 'otro';
  raza: string;
  edad: number;
  sexo: 'macho' | 'hembra';
  tamaño: 'pequeño' | 'mediano' | 'grande';
  color: string;
  descripcion: string;
  estado: 'listo' | 'en recuperación' | 'adoptado';
  fotoUrl: string;
  chip?: string;
  esterilizado: boolean;
  vacunado: boolean;
  desparasitado: boolean;
  necesidadesEspeciales?: string;
  createdAt: Date;
  updatedAt: Date;
}

const animalSchema = new Schema<IAnimal>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    especie: {
      type: String,
      required: [true, 'La especie es requerida'],
      enum: {
        values: ['perro', 'gato', 'otro'],
        message: 'La especie debe ser perro, gato u otro',
      },
    },
    raza: {
      type: String,
      required: [true, 'La raza es requerida'],
      trim: true,
    },
    edad: {
      type: Number,
      required: [true, 'La edad es requerida'],
      min: [0, 'La edad no puede ser negativa'],
      max: [30, 'La edad no puede exceder 30 años'],
    },
    sexo: {
      type: String,
      required: [true, 'El sexo es requerido'],
      enum: {
        values: ['macho', 'hembra'],
        message: 'El sexo debe ser macho o hembra',
      },
    },
    tamaño: {
      type: String,
      required: [true, 'El tamaño es requerido'],
      enum: {
        values: ['pequeño', 'mediano', 'grande'],
        message: 'El tamaño debe ser pequeño, mediano o grande',
      },
    },
    color: {
      type: String,
      required: [true, 'El color es requerido'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    },
    estado: {
      type: String,
      required: true,
      enum: {
        values: ['listo', 'en recuperación', 'adoptado'],
        message: 'El estado debe ser listo, en recuperación o adoptado',
      },
      default: 'listo',
    },
    fotoUrl: {
      type: String,
      required: [true, 'La foto es requerida'],
      trim: true,
    },
    chip: {
      type: String,
      trim: true,
      sparse: true, // Permite valores null/undefined pero único si existe
      unique: true,
    },
    esterilizado: {
      type: Boolean,
      default: false,
    },
    vacunado: {
      type: Boolean,
      default: false,
    },
    desparasitado: {
      type: Boolean,
      default: false,
    },
    necesidadesEspeciales: {
      type: String,
      trim: true,
      maxlength: [500, 'Las necesidades especiales no pueden exceder 500 caracteres'],
    },
  },
  {
    timestamps: true,
  }
);

// Índices
animalSchema.index({ especie: 1, estado: 1 });
animalSchema.index({ chip: 1 });
animalSchema.index({ nombre: 'text', descripcion: 'text' }); // Text search

export const Animal = mongoose.model<IAnimal>('Animal', animalSchema);
