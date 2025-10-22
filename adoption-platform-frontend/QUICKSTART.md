# 🚀 Guía de Inicio Rápido

## Paso 1: Copiar el Proyecto

Copia toda la carpeta `adoption-platform-frontend` a tu máquina local.

## Paso 2: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias (puede tomar unos minutos).

## Paso 3: Ejecutar el Proyecto

```bash
npm run dev
```

## Paso 4: Abrir en el Navegador

Abre tu navegador en: **http://localhost:3000**

## 🎯 Rutas Disponibles

### Rutas Públicas (sin login):
- **/** - Home con lista de animales
- **/login** - Iniciar sesión
- **/register** - Registrarse

### Rutas de Usuario (necesitas estar logueado):
- **/adopt/[id]** - Solicitar adopción de un animal específico
- **/submissions** - Ver tus solicitudes de adopción

### Rutas de Admin (necesitas estar logueado como admin):
- **/dashboard** - Dashboard con estadísticas
- **/animales** - Lista de animales (CRUD)
- **/animales/nuevo** - Crear nuevo animal
- **/animales/[id]/editar** - Editar animal
- **/solicitudes** - Ver todas las solicitudes
- **/buscar-chip** - Buscar animal por chip

## ⚠️ Nota Importante

Por ahora, el proyecto usa **datos mock** (datos de prueba). Las funcionalidades de login/registro NO funcionan completamente hasta que conectes el backend.

### Para probar las rutas protegidas:

Temporalmente puedes comentar el middleware o crear una cookie de prueba. 

**Opción más fácil**: Comenta temporalmente el middleware para desarrollo:

En `middleware.ts`, comenta todo el contenido y deja solo:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)'],
}
```

Esto permitirá acceder a todas las rutas sin restricción durante el desarrollo.

## 🐛 Problemas Comunes

### Error: Cannot find module...
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ya en uso
```bash
# Usa otro puerto
npm run dev -- -p 3001
```

### Error de Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
```

## 📂 Estructura que Deberías Ver

```
adoption-platform-frontend/
├── app/
├── components/
├── lib/
├── hooks/
├── contexts/
├── public/
├── package.json
├── tsconfig.json
├── middleware.ts
└── README.md
```

## ✅ Verificación

Si todo está bien, deberías ver:
1. ✅ La página principal con animales
2. ✅ Navegación funcionando
3. ✅ Puedes hacer clic en "Ver detalles"
4. ✅ Formularios de login/register visibles

## 🎓 Siguiente Paso

Una vez que funcione el frontend, podemos proceder con:
1. **Backend**: Crear el API con Node.js + Express + MongoDB
2. **Docker**: Containerizar el backend
3. **Conexión**: Conectar frontend con backend
4. **Auth**: Implementar autenticación real

---

**¿Dudas?** Avísame si algo no funciona y te ayudo a resolverlo.
