import express from 'express';
import {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  searchByChip,
  getStats,
} from '../controllers/animals.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.get('/', getAnimals);
router.get('/:id', getAnimal);

// Rutas protegidas (admin)
router.get('/admin/stats', protect, authorize('admin'), getStats);
router.get('/chip/:chip', protect, authorize('admin'), searchByChip);
router.post('/', protect, authorize('admin'), createAnimal);
router.put('/:id', protect, authorize('admin'), updateAnimal);
router.delete('/:id', protect, authorize('admin'), deleteAnimal);

export default router;
