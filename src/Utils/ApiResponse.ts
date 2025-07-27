export class ApiResponse {
  static success<T>(data: T, message: string = 'Operación exitosa') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message: string = 'Ha ocurrido un error', statusCode: number = 500) {
    return {
      success: false,
      message,
      statusCode
    };
  }
}