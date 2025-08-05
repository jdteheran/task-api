import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../Utils/ApiResponse';

// Guard de autenticación para usar en grupos de rutas
export const authGuard = {
  beforeHandle: async ({ headers, set }: { headers: any, set: any }) => {
    try {
      // Extraer el token del header Authorization
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return ApiResponse.error('Token de autorización requerido', 401);
      }

      const token = authHeader.substring(7);
      
      // Verificar el token JWT
      const { userId } = AuthService.verifyToken(token);
      
      // Obtener el usuario de la base de datos
      const user = await AuthService.getUserById(userId);
      if (!user) {
        set.status = 404;
        return ApiResponse.error('Usuario no encontrado', 404);
      }

      // No retornar nada para permitir que la ruta continúe
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
      
      if (errorMessage.includes('Token inválido') || errorMessage.includes('jwt')) {
        set.status = 401;
        return ApiResponse.error('Token inválido', 401);
      }
      
      set.status = 500;
      return ApiResponse.error('Error interno del servidor', 500);
    }
  }
};