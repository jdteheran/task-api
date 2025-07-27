import { Elysia } from 'elysia';
import { ApiResponse } from './ApiResponse';

export const ErrorMiddleware = new Elysia()
  .onError(({ code, error, set }) => {
    let statusCode = 500;
    let message = 'Error interno del servidor';

    switch (code) {
      case 'NOT_FOUND':
        statusCode = 404;
        message = 'Recurso no encontrado';
        break;
      case 'VALIDATION':
        statusCode = 400;
        message = `Error de validación: ${error instanceof Error ? error.message : 'Datos inválidos'}`;
        break;
      case 'PARSE':
        statusCode = 400;
        message = 'Error al procesar la solicitud';
        break;
      default:
        console.error(`Error no manejado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        if (error instanceof Error && error.stack) {
          console.error(error.stack);
        }
    }

    set.status = statusCode;
    return ApiResponse.error(message, statusCode);
  });