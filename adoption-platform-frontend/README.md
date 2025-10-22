# 🐾 Plataforma de Adopción - Frontend Unificado

Frontend unificado que combina los paneles de **Usuario** y **Administrador** para la plataforma de adopción de animales.

## 📁 Estructura del Proyecto

```
adoption-platform-frontend/
├── app/
│   ├── (public)/          # Rutas públicas (sin autenticación)
│   │   ├── page.tsx       # Home - lista de animales
│   │   ├── login/         # Login de usuarios
│   │   └── register/      # Registro de usuarios
│   │
│   ├── (user)/            # Rutas de usuario (requieren auth)
│   │   ├── adopt/[id]/    # Formulario de adopción
│   │   └── submissions/   # Mis solicitudes
│   │
│   └── (admin)/           # Rutas de admin (requieren auth + role admin)
│       ├── dashboard/     # Dashboard con estadísticas
│       ├── animales/      # CRUD de animales
│       ├── solicitudes/   # Gestión de solicitudes
│       └── buscar-chip/   # Búsqueda por chip
│
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── admin/             # Componentes específicos de admin
│   ├── animal-card.tsx    # Card de animal
│   ├── navigation.tsx     # Navegación principal
│   └── ...
│
├── lib/
│   ├── mock-data.ts       # Datos mock del usuario
│   ├── admin-api.ts       # API mock del admin
│   ├── auth.ts            # Utilidades de auth
│   └── utils.ts           # Utilidades generales
│
├── hooks/                 # Custom hooks
├── contexts/              # React contexts (Auth, etc.)
├── types/                 # TypeScript types
└── public/                # Archivos estáticos (imágenes)
```

## 🎯 Características

### Rutas Públicas
- ✅ Home con lista de animales disponibles
- ✅ Login y registro de usuarios

### Rutas de Usuario (Autenticado)
- ✅ Ver detalles de animales
- ✅ Formulario de solicitud de adopción
- ✅ Ver mis solicitudes enviadas

### Rutas de Admin (Autenticado + Role Admin)
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de animales
- ✅ Gestión de solicitudes de adopción
- ✅ Búsqueda de animales por chip

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
# o
pnpm install
# o
yarn install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` si necesitas cambiar la URL del API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔐 Autenticación y Rutas Protegidas

El proyecto usa **Next.js Middleware** para proteger rutas:

- **Rutas públicas** (`/`, `/login`, `/register`): Acceso sin autenticación
- **Rutas de usuario** (`/adopt/*`, `/submissions`): Requieren autenticación
- **Rutas de admin** (`/dashboard`, `/animales`, etc.): Requieren autenticación + rol admin

### Middleware (`middleware.ts`)

El middleware verifica:
1. Si la ruta requiere autenticación
2. Si existe un token en las cookies
3. Si la ruta es de admin, verifica el rol (cuando conectes el backend)

## 📊 Datos Mock

Actualmente el proyecto usa datos mock para desarrollo:

- **Usuario**: `lib/mock-data.ts`
- **Admin**: `lib/admin-api.ts`

Cuando conectes el backend, reemplazarás estos archivos con llamadas API reales.

## 🎨 Estilos y Componentes

- **Framework CSS**: Tailwind CSS v4
- **Componentes UI**: shadcn/ui con Radix UI
- **Iconos**: Lucide React
- **Fuentes**: Geist Sans y Geist Mono

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar build
npm run start

# Linter
npm run lint
```

## 🔄 Próximos Pasos

### Fase 1: Conectar con Backend
1. Crear servicios API en `lib/api.ts`
2. Reemplazar `mock-data.ts` con llamadas reales
3. Implementar autenticación JWT real
4. Actualizar middleware para verificar roles

### Fase 2: Mejorar UX
1. Agregar loading states
2. Implementar manejo de errores
3. Agregar notificaciones (toast)
4. Mejorar validaciones de formularios

### Fase 3: Features Adicionales
1. Upload de imágenes de animales
2. Filtros y búsqueda de animales
3. Perfil de usuario editable
4. Sistema de notificaciones

## 🏗️ Arquitectura de Route Groups

Los **route groups** (carpetas con paréntesis) te permiten organizar rutas sin afectar la URL:

```
app/
├── (public)/page.tsx      → /
├── (user)/adopt/[id]/     → /adopt/[id]
└── (admin)/dashboard/     → /dashboard
```

Ventajas:
- ✅ Organización lógica del código
- ✅ Layouts específicos por grupo
- ✅ Middleware selectivo
- ✅ URLs limpias

## 🤝 Integración con Backend

Cuando tengas el backend listo:

1. **Actualizar API client** (`lib/api.ts`):
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

2. **Reemplazar mocks**:
```typescript
// Antes
import { mockApi } from '@/lib/mock-data'
const animals = await mockApi.getAnimals()

// Después
import api from '@/lib/api'
const { data } = await api.get('/animals')
```

3. **Actualizar auth context** para guardar tokens y user data

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)

## 📝 Notas

- El proyecto está configurado con TypeScript strict mode
- Se usa App Router de Next.js 15
- Las imágenes están en `/public` y se optimizan automáticamente
- Los componentes UI son de shadcn/ui (customizables)

---

**¿Listo para el siguiente paso?** 🚀

Cuando quieras, podemos empezar con el backend siguiendo el plan de implementación.
