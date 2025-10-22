import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { Animal } from '../models/Animal';
import { asyncHandler } from '../middleware/error';

// @desc    Create application
// @route   POST /api/applications
// @access  Private
export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  const { animalId, ...applicationData } = req.body;

  // Verificar que el animal existe y está disponible
  const animal = await Animal.findById(animalId);

  if (!animal) {
    res.status(404).json({
      success: false,
      message: 'Animal no encontrado',
    });
    return;
  }

  if (animal.estado === 'adoptado') {
    res.status(400).json({
      success: false,
      message: 'Este animal ya ha sido adoptado',
    });
    return;
  }

  // Verificar si ya existe una solicitud del mismo usuario para el mismo animal
  const existingApplication = await Application.findOne({
    userId: req.user.id,
    animalId,
  });

  if (existingApplication) {
    res.status(400).json({
      success: false,
      message: 'Ya has enviado una solicitud para este animal',
    });
    return;
  }

  // Crear solicitud
  const application = await Application.create({
    userId: req.user.id,
    animalId,
    ...applicationData,
  });

  // Populate animal y user
  await application.populate('animalId', 'nombre especie raza fotoUrl');
  await application.populate('userId', 'name email');

  res.status(201).json({
    success: true,
    data: application,
  });
});

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
export const getApplications = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  const query: any = {};

  if (status) {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('userId', 'name email')
    .populate('animalId', 'nombre especie raza fotoUrl estado')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private
export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications = await Application.find({ userId: req.user.id })
    .populate('animalId', 'nombre especie raza fotoUrl estado')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const application = await Application.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('animalId', 'nombre especie raza fotoUrl estado');

  if (!application) {
    res.status(404).json({
      success: false,
      message: 'Solicitud no encontrada',
    });
    return;
  }

  // Verificar que el usuario sea el dueño o admin
  if (
    application.userId._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    res.status(403).json({
      success: false,
      message: 'No autorizado para ver esta solicitud',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: application,
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Admin
export const updateApplicationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, notasAdmin } = req.body;

    let application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada',
      });
      return;
    }

    // Actualizar solicitud
    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notasAdmin },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email')
      .populate('animalId', 'nombre especie raza fotoUrl estado');

    // Si se aprueba, marcar animal como adoptado
    if (status === 'aprobada') {
      await Animal.findByIdAndUpdate(application!.animalId, {
        estado: 'adoptado',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  }
);

// @desc    Get applications statistics
// @route   GET /api/applications/stats
// @access  Private/Admin
export const getApplicationStats = asyncHandler(
  async (req: Request, res: Response) => {
    const totalApplications = await Application.countDocuments();
    const applicationsReceived = await Application.countDocuments({
      status: 'recibida',
    });
    const applicationsInReview = await Application.countDocuments({
      status: 'en revisión',
    });
    const applicationsApproved = await Application.countDocuments({
      status: 'aprobada',
    });
    const applicationsRejected = await Application.countDocuments({
      status: 'rechazada',
    });

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        applicationsReceived,
        applicationsInReview,
        applicationsApproved,
        applicationsRejected,
      },
    });
  }
);
