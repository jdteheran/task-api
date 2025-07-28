import { Elysia } from 'elysia';
import { TaskController } from '../controllers/TaskController';
import { ProjectController } from '../controllers/ProjectController';

export const routes = new Elysia()
  .use(TaskController)
  .use(ProjectController);