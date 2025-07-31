import { Elysia } from 'elysia';
import { routes } from './src/routes';
import { ErrorMiddleware } from './src/Utils/ErrorMiddleware';
import { connectDB } from './src/db/connection';

const PORT = process.env.PORT || 3000;

// Tipo de la aplicación para uso en otros archivos
export type App = typeof Elysia;

// Conectar a MongoDB antes de iniciar el servidor
connectDB().then(() => {
  const app = new Elysia()
    .use(ErrorMiddleware)
    .use(routes)
    .get('/', () => ({ message: 'API de Lista de Tareas' }))
    .listen(PORT);

  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
}).catch(err => {
  console.error('❌ Error al iniciar la aplicación:', err);
  process.exit(1);
});