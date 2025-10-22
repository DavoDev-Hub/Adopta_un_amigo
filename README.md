# 🐾 Plataforma de Adopción - Proyecto Completo con Docker

Sistema completo de adopción de animales con frontend (Next.js), backend (Node.js + Express) y base de datos (MongoDB), todo dockerizado.

## 📦 Estructura del Proyecto

```
.
├── adoption-platform-frontend/    # Frontend Next.js
├── adoption-platform-backend/     # Backend Node.js + Express
└── docker-compose.yml             # Orquestación de servicios
```

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

**Requisitos:**
- Docker Desktop instalado
- Docker Compose

**Pasos:**

1. **Clonar/Descomprimir el proyecto**

2. **Crear archivo .env en el backend**
```bash
cd adoption-platform-backend
cp .env.example .env
```

Edita `.env` y cambia el `JWT_SECRET`:
```env
JWT_SECRET=tu-secreto-super-seguro-aqui
```

3. **Levantar todos los servicios**
```bash
# Volver a la raíz del proyecto
cd ..

# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

4. **Acceder a la aplicación**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mongo Express** (dev): http://localhost:8081 (usuario: admin, password: admin123)

5. **Verificar que todo funciona**
```bash
# Health check del backend
curl http://localhost:5000/health
```

### Opción 2: Desarrollo Local (Sin Docker)

**Requisitos:**
- Node.js 18+
- MongoDB instalado localmente

**Backend:**
```bash
cd adoption-platform-backend
cp .env.example .env
npm install
npm run dev
```

**Frontend:**
```bash
cd adoption-platform-frontend
npm install
npm run dev
```

## 📚 Endpoints del API

### Autenticación
```
POST   /api/auth/register    - Registrar usuario
POST   /api/auth/login       - Iniciar sesión
GET    /api/auth/me          - Obtener usuario actual
POST   /api/auth/logout      - Cerrar sesión
```

### Animales
```
GET    /api/animals                  - Listar animales
GET    /api/animals/:id              - Ver un animal
POST   /api/animals                  - Crear animal (Admin)
PUT    /api/animals/:id              - Actualizar animal (Admin)
DELETE /api/animals/:id              - Eliminar animal (Admin)
GET    /api/animals/chip/:chip       - Buscar por chip (Admin)
GET    /api/animals/admin/stats      - Estadísticas (Admin)
```

### Solicitudes
```
POST   /api/applications             - Crear solicitud (Usuario)
GET    /api/applications/my          - Mis solicitudes (Usuario)
GET    /api/applications/:id         - Ver solicitud
GET    /api/applications             - Todas las solicitudes (Admin)
PUT    /api/applications/:id         - Actualizar estado (Admin)
GET    /api/applications/admin/stats - Estadísticas (Admin)
```

## 🔐 Autenticación

El sistema usa JWT con cookies HttpOnly para autenticación segura.

**Headers para peticiones autenticadas:**
```
Authorization: Bearer <token>
```

O usar cookies automáticamente.

## 👥 Usuarios de Prueba

Después de levantar el proyecto, puedes crear usuarios:

**Usuario normal:**
- Registrarse en `/register`
- Rol: `user` (por defecto)

**Admin:**
- Crear manualmente en MongoDB o registrarse y cambiar el rol en la BD

## 🐳 Comandos Docker Útiles

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f [servicio]

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes (⚠️ borra datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose build

# Levantar solo ciertos servicios
docker-compose up -d backend mongodb

# Entrar a un contenedor
docker exec -it adoption-backend sh
docker exec -it adoption-mongodb mongosh

# Ver servicios corriendo
docker-compose ps

# Levantar con Mongo Express (dev)
docker-compose --profile dev up -d
```

## 📊 MongoDB

**Acceso directo:**
```bash
# Desde tu máquina
mongosh mongodb://localhost:27017/adoption-platform

# Desde el contenedor
docker exec -it adoption-mongodb mongosh adoption-platform
```

**Colecciones:**
- `users` - Usuarios del sistema
- `animals` - Animales disponibles
- `applications` - Solicitudes de adopción

## 🔧 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development|production
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/adoption-platform
JWT_SECRET=tu-secreto-aqui
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📝 Desarrollo

### Hot Reload en Desarrollo

Para desarrollo con hot reload, usa los comandos locales en lugar de Docker:

```bash
# Terminal 1 - Backend
cd adoption-platform-backend
npm run dev

# Terminal 2 - Frontend  
cd adoption-platform-frontend
npm run dev

# MongoDB con Docker
docker-compose up -d mongodb
```

### Linter y Formato

```bash
# Backend
cd adoption-platform-backend
npm run lint

# Frontend
cd adoption-platform-frontend
npm run lint
```

## 🧪 Testing

```bash
# Backend (pendiente)
cd adoption-platform-backend
npm test

# Frontend (pendiente)
cd adoption-platform-frontend
npm test
```

## 🚢 Deploy en Producción

### Variables de Entorno Importantes

1. **Cambiar `JWT_SECRET`** a algo seguro
2. **Configurar `CORS_ORIGIN`** con tu dominio real
3. **`NODE_ENV=production`** en ambos servicios
4. **MongoDB** usar MongoDB Atlas o servidor dedicado

### Recomendaciones

- Usar Docker Swarm o Kubernetes para orquestación
- Implementar SSL/TLS (HTTPS)
- Configurar backups automáticos de MongoDB
- Implementar rate limiting
- Agregar monitoring (Prometheus, Grafana)
- Usar nginx como reverse proxy

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ JWT con HttpOnly cookies
- ✅ Helmet.js para headers de seguridad
- ✅ CORS configurado
- ✅ Validación de inputs
- ✅ Rate limiting (pendiente)

## 📖 Documentación Adicional

- [Frontend README](./adoption-platform-frontend/README.md)
- [Backend API Docs](./adoption-platform-backend/README.md)

## 🐛 Troubleshooting

### Puerto ya en uso
```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "3001:3000"  # Frontend
  - "5001:5000"  # Backend
```

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
docker-compose ps mongodb

# Ver logs
docker-compose logs mongodb

# Reiniciar servicio
docker-compose restart mongodb
```

### Frontend no se conecta al backend
- Verificar `NEXT_PUBLIC_API_URL` en el frontend
- Verificar `CORS_ORIGIN` en el backend
- Comprobar que el backend esté corriendo en el puerto correcto

### Limpiar todo y empezar de nuevo
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📞 Soporte

¿Problemas? Verifica:
1. Docker Desktop está corriendo
2. Puertos 3000, 5000, 27017 están libres
3. Variables de entorno configuradas
4. Logs de los servicios: `docker-compose logs -f`

## 📄 Licencia

MIT

---

**¡Disfruta desarrollando!** 🚀🐾
