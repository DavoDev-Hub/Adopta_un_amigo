import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IApplication extends Document {
  userId: Types.ObjectId;
  animalId: Types.ObjectId;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ocupacion: string;
  tipoVivienda: 'casa' | 'apartamento' | 'otro';
  espacioExterior: boolean;
  experienciaMascotas: string;
  motivoAdopcion: string;
  status: 'recibida' | 'en revisión' | 'aprobada' | 'rechazada';
  notasAdmin?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del usuario es requerido'],
    },
    animalId: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: [true, 'El ID del animal es requerido'],
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingrese un email válido',
      ],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
    },
    direccion: {
      type: String,
      required: [true, 'La dirección es requerida'],
      trim: true,
    },
    ocupacion: {
      type: String,
      required: [true, 'La ocupación es requerida'],
      trim: true,
    },
    tipoVivienda: {
      type: String,
      required: [true, 'El tipo de vivienda es requerido'],
      enum: {
        values: ['casa', 'apartamento', 'otro'],
        message: 'El tipo de vivienda debe ser casa, apartamento u otro',
      },
    },
    espacioExterior: {
      type: Boolean,
      required: [true, 'Debe indicar si tiene espacio exterior'],
    },
    experienciaMascotas: {
      type: String,
      required: [true, 'La experiencia con mascotas es requerida'],
      trim: true,
      minlength: [10, 'Debe proporcionar al menos 10 caracteres'],
      maxlength: [500, 'No puede exceder 500 caracteres'],
    },
    motivoAdopcion: {
      type: String,
      required: [true, 'El motivo de adopción es requerido'],
      trim: true,
      minlength: [10, 'Debe proporcionar al menos 10 caracteres'],
      maxlength: [500, 'No puede exceder 500 caracteres'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['recibida', 'en revisión', 'aprobada', 'rechazada'],
        message: 'El estado debe ser recibida, en revisión, aprobada o rechazada',
      },
      default: 'recibida',
    },
    notasAdmin: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres'],
    },
  },
  {
    timestamps: true,
  }
);

// Índices
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ animalId: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

// Prevenir múltiples solicitudes del mismo usuario para el mismo animal
applicationSchema.index({ userId: 1, animalId: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
