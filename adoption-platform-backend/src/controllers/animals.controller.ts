import { Request, Response } from 'express';
import { Animal } from '../models/Animal';
import { asyncHandler } from '../middleware/error';

// @desc    Get all animals
// @route   GET /api/animals
// @access  Public
export const getAnimals = asyncHandler(async (req: Request, res: Response) => {
  const { especie, estado, search } = req.query;

  // Construir query
  const query: any = {};

  if (especie) {
    query.especie = especie;
  }

  if (estado) {
    query.estado = estado;
  }

  if (search) {
    query.$text = { $search: search as string };
  }

  const animals = await Animal.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: animals.length,
    data: animals,
  });
});

// @desc    Get single animal
// @route   GET /api/animals/:id
// @access  Public
export const getAnimal = asyncHandler(async (req: Request, res: Response) => {
  const animal = await Animal.findById(req.params.id);

  if (!animal) {
    res.status(404).json({
      success: false,
      message: 'Animal no encontrado',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: animal,
  });
});

// @desc    Create animal
// @route   POST /api/animals
// @access  Private/Admin
export const createAnimal = asyncHandler(async (req: Request, res: Response) => {
  const animal = await Animal.create(req.body);

  res.status(201).json({
    success: true,
    data: animal,
  });
});

// @desc    Update animal
// @route   PUT /api/animals/:id
// @access  Private/Admin
export const updateAnimal = asyncHandler(async (req: Request, res: Response) => {
  let animal = await Animal.findById(req.params.id);

  if (!animal) {
    res.status(404).json({
      success: false,
      message: 'Animal no encontrado',
    });
    return;
  }

  animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: animal,
  });
});

// @desc    Delete animal
// @route   DELETE /api/animals/:id
// @access  Private/Admin
export const deleteAnimal = asyncHandler(async (req: Request, res: Response) => {
  const animal = await Animal.findById(req.params.id);

  if (!animal) {
    res.status(404).json({
      success: false,
      message: 'Animal no encontrado',
    });
    return;
  }

  await animal.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Animal eliminado correctamente',
  });
});

// @desc    Search animal by chip
// @route   GET /api/animals/chip/:chip
// @access  Private/Admin
export const searchByChip = asyncHandler(async (req: Request, res: Response) => {
  const animal = await Animal.findOne({ chip: req.params.chip });

  if (!animal) {
    res.status(404).json({
      success: false,
      message: 'No se encontró ningún animal con ese chip',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: animal,
  });
});

// @desc    Get animals statistics
// @route   GET /api/animals/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const totalAnimals = await Animal.countDocuments();
  const animalsReady = await Animal.countDocuments({ estado: 'listo' });
  const animalsRecovering = await Animal.countDocuments({ estado: 'en recuperación' });
  const animalsAdopted = await Animal.countDocuments({ estado: 'adoptado' });

  const speciesStats = await Animal.aggregate([
    {
      $group: {
        _id: '$especie',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalAnimals,
      animalsReady,
      animalsRecovering,
      animalsAdopted,
      speciesStats,
    },
  });
});
