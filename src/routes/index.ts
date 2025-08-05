import { Elysia } from "elysia";
import { TaskController } from "../controllers/TaskController";
import { ProjectController } from "../controllers/ProjectController";
import { authController } from "../controllers/AuthController";
import { authGuard } from "../middleware/auth";

export const routes = new Elysia()
  // Rutas públicas (sin autenticación)
  .use(authController)
  // Rutas protegidas (requieren autenticación JWT)
  .guard(authGuard, (app) =>
    app.group("/api", (protectedApp) =>
      protectedApp.use(TaskController).use(ProjectController)
    )
  );
