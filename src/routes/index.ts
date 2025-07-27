import { Elysia } from 'elysia';
import { TaskController } from '../controllers/TaskController';

export const routes = new Elysia()
  .use(TaskController);