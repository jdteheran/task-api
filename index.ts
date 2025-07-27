import { Elysia } from 'elysia';
import { routes } from './src/routes';
import { ErrorMiddleware } from './src/Utils/ErrorMiddleware';

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .use(ErrorMiddleware)
  .use(routes)
  .get('/', () => ({ message: 'API de Lista de Tareas' }))
  .listen(PORT);

console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);

export type App = typeof app;