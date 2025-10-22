import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/error';

// Importar rutas
import authRoutes from './routes/auth.routes';
import animalsRoutes from './routes/animals.routes';
import applicationsRoutes from './routes/applications.routes';

// Cargar variables de entorno
dotenv.config();

// Crear app de Express
const app: Application = express();

// Conectar a la base de datos
connectDB();

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// Logger (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalsRoutes);
app.use('/api/applications', applicationsRoutes);

// Ruta 404
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
  });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
});

// Manejar rechazos de promesas no capturadas
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ UNHANDLED REJECTION! 💥 Apagando servidor...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
