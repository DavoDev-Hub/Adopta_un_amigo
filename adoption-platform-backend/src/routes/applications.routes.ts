import express from 'express';
import {
  createApplication,
  getApplications,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  getApplicationStats,
} from '../controllers/applications.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Rutas protegidas (usuario autenticado)
router.post('/', protect, createApplication);
router.get('/my', protect, getMyApplications);
router.get('/:id', protect, getApplication);

// Rutas protegidas (admin)
router.get('/', protect, authorize('admin'), getApplications);
router.get('/admin/stats', protect, authorize('admin'), getApplicationStats);
router.put('/:id', protect, authorize('admin'), updateApplicationStatus);

export default router;
