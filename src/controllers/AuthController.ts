import { Elysia, t } from 'elysia';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../Utils/ApiResponse';
import type { UserRegistration, UserLogin } from '../models/User';

export const authController = new Elysia({ prefix: '/auth' })
  // Registro de usuario
  .post('/register', async ({ body, set }) => {
    try {
      const userData = body as UserRegistration;
      
      // Validación básica
      if (!userData.username || !userData.email || !userData.password) {
        set.status = 400;
        return ApiResponse.error('Todos los campos son requeridos', 400);
      }

      const result = await AuthService.register(userData);
      
      set.status = 201;
      return ApiResponse.success(result, 'Usuario registrado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
      
      if (errorMessage.includes('ya está registrado') || errorMessage.includes('ya está en uso')) {
        set.status = 409;
        return ApiResponse.error(errorMessage, 409);
      }
      
      if (errorMessage.includes('inválido') || errorMessage.includes('debe tener')) {
        set.status = 400;
        return ApiResponse.error(errorMessage, 400);
      }
      
      set.status = 500;
      return ApiResponse.error('Error interno del servidor', 500);
    }
  }, {
    body: t.Object({
      username: t.String({ minLength: 3, maxLength: 30 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 })
    })
  })
  
  // Login de usuario
  .post('/login', async ({ body, set }) => {
    try {
      const loginData = body as UserLogin;
      
      // Validación básica
      if (!loginData.email || !loginData.password) {
        set.status = 400;
        return ApiResponse.error('Email y contraseña son requeridos', 400);
      }

      const result = await AuthService.login(loginData);
      
      return ApiResponse.success(result, 'Inicio de sesión exitoso');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
      
      if (errorMessage.includes('Credenciales inválidas')) {
        set.status = 401;
        return ApiResponse.error('Credenciales inválidas', 401);
      }
      
      set.status = 500;
      return ApiResponse.error('Error interno del servidor', 500);
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 1 })
    })
  })
  
  // Obtener perfil del usuario autenticado
  .get('/profile', async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return ApiResponse.error('Token de autorización requerido', 401);
      }

      const token = authHeader.substring(7);
      const { userId } = AuthService.verifyToken(token);
      
      const user = await AuthService.getUserById(userId);
      if (!user) {
        set.status = 404;
        return ApiResponse.error('Usuario no encontrado', 404);
      }

      return ApiResponse.success(user, 'Perfil obtenido exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
      
      if (errorMessage.includes('Token inválido')) {
        set.status = 401;
        return ApiResponse.error('Token inválido', 401);
      }
      
      set.status = 500;
      return ApiResponse.error('Error interno del servidor', 500);
    }
  })
  
  // Validar token
  .post('/validate', async ({ body, set }) => {
    try {
      const { token } = body as { token: string };
      
      if (!token) {
        set.status = 400;
        return ApiResponse.error('Token es requerido', 400);
      }

      const { userId } = AuthService.verifyToken(token);
      const user = await AuthService.getUserById(userId);
      
      if (!user) {
        set.status = 404;
        return ApiResponse.error('Usuario no encontrado', 404);
      }

      return ApiResponse.success({
        valid: true,
        user
      }, 'Token válido');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
      
      if (errorMessage.includes('Token inválido')) {
        set.status = 401;
        return ApiResponse.error('Token inválido', 401);
      }
      
      set.status = 500;
      return ApiResponse.error('Error interno del servidor', 500);
    }
  }, {
    body: t.Object({
      token: t.String({ minLength: 1 })
    })
  });