import { Elysia, t } from 'elysia';
import { TaskService } from '../services/TaskService';
import { TaskStatus } from '../models/Task';
import { ApiResponse } from '../Utils/ApiResponse';

const taskService = new TaskService();

export const TaskController = new Elysia({ prefix: '/tasks' })
  // Obtener todas las tareas
  .get('/', () => {
    const tasks = taskService.getAllTasks();
    return ApiResponse.success(tasks, 'Tareas obtenidas correctamente');
  })

  // Obtener una tarea por ID
  .get('/:id', ({ params: { id } }) => {
    const task = taskService.getTaskById(id);
    if (!task) {
      return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    return ApiResponse.success(task, 'Tarea obtenida correctamente');
  })

  // Crear una nueva tarea
  .post('/', 
    ({ body }) => {
      const { title, description } = body;
      const newTask = taskService.createTask(title, description);
      return ApiResponse.success(newTask, 'Tarea creada correctamente');
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String()
      })
    }
  )

  // Actualizar una tarea
  .put('/:id', 
    ({ params: { id }, body }) => {
      const task = taskService.updateTask(id, body);
      if (!task) {
        return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      return ApiResponse.success(task, 'Tarea actualizada correctamente');
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String())
      })
    }
  )

  // Cambiar el estado de una tarea
  .patch('/:id/status', 
    ({ params: { id }, body }) => {
      const { status } = body;
      
      // Validar que el estado sea válido
      if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
        return new Response(JSON.stringify(ApiResponse.error('Estado no válido', 400)), { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      const task = taskService.changeTaskStatus(id, status as TaskStatus);
      if (!task) {
        return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      return ApiResponse.success(task, 'Estado de la tarea actualizado correctamente');
    },
    {
      body: t.Object({
        status: t.Enum(TaskStatus)
      })
    }
  )

  // Eliminar una tarea
  .delete('/:id', ({ params: { id } }) => {
    const deleted = taskService.deleteTask(id);
    if (!deleted) {
      return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    return ApiResponse.success(null, 'Tarea eliminada correctamente');
  })

  // Filtrar tareas por estado
  .get('/filter/:status', ({ params: { status } }) => {
    // Validar que el estado sea válido
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      return new Response(JSON.stringify(ApiResponse.error('Estado no válido', 400)), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const tasks = taskService.getTasksByStatus(status as TaskStatus);
    return ApiResponse.success(tasks, `Tareas con estado ${status} obtenidas correctamente`);
  });