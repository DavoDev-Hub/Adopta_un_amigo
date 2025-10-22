import { Request, Response } from 'express';
import { User } from '../models/User';
import { sendTokenResponse } from '../utils/jwt';
import { asyncHandler } from '../middleware/error';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validar campos
  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Por favor proporcione nombre, email y contraseña',
    });
    return;
  }

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({
      success: false,
      message: 'El email ya está registrado',
    });
    return;
  }

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password,
    role: 'user', // Por defecto siempre user
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Por favor proporcione email y contraseña',
    });
    return;
  }

  // Buscar usuario (incluir password que está select: false)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas',
    });
    return;
  }

  // Verificar password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas',
    });
    return;
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
});
