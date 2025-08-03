import { Elysia } from 'elysia';
import { TaskController } from '../controllers/TaskController';
import { ProjectController } from '../controllers/ProjectController';
import { authController } from '../controllers/AuthController';

export const routes = new Elysia()
  .use(TaskController)
  .use(ProjectController)
  .use(authController);