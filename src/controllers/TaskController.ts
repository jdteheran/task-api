import { Elysia, t } from 'elysia';
import { TaskService } from '../services/TaskService';
import { TaskStatus, TaskPriority } from '../models/Task';
import { ApiResponse } from '../Utils/ApiResponse';

const taskService = new TaskService();

export const TaskController = new Elysia({ prefix: '/tasks' })
  // Obtener todas las tareas
  .get('/', async () => {
    const tasks = await taskService.getAllTasks();
    return ApiResponse.success(tasks, 'Tareas obtenidas correctamente');
  })

  // Obtener una tarea por ID
  .get('/:id', async ({ params: { id } }) => {
    const task = await taskService.getTaskById(id);
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
    async ({ body }) => {
      const { title, description, priority, projectId, deadline } = body;
      
      let deadlineDate: Date | undefined = undefined;
      if (deadline) {
        deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return new Response(JSON.stringify(ApiResponse.error('Fecha límite no válida', 400)), { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
          });
        }
      }
      
      const newTask = await taskService.createTask(title, description, priority, projectId, deadlineDate);
      return ApiResponse.success(newTask, 'Tarea creada correctamente');
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        priority: t.Optional(t.Enum(TaskPriority)),
        projectId: t.Optional(t.String()),
        deadline: t.Optional(t.String()) // Fecha en formato ISO
      })
    }
  )

  // Actualizar una tarea existente
  .put('/:id', 
    async ({ params: { id }, body }) => {
      const { title, description, priority, status, projectId, deadline } = body;
      
      let deadlineDate: Date | undefined = undefined;
      if (deadline) {
        deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return new Response(JSON.stringify(ApiResponse.error('Fecha límite no válida', 400)), { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
          });
        }
      }
      
      const updatedTask = await taskService.updateTask(id, { 
        title, 
        description, 
        priority, 
        status, 
        projectId, 
        deadline: deadlineDate 
      });
      
      if (!updatedTask) {
        return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      return ApiResponse.success(updatedTask, 'Tarea actualizada correctamente');
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        priority: t.Optional(t.Enum(TaskPriority)),
        status: t.Optional(t.Enum(TaskStatus)),
        projectId: t.Optional(t.String()),
        deadline: t.Optional(t.String())
      })
    }
  )

  // Cambiar el estado de una tarea
  .patch('/:id/status', 
    async ({ params: { id }, body }) => {
      const { status } = body;
      
      const updatedTask = await taskService.changeTaskStatus(id, status);
      
      if (!updatedTask) {
        return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      return ApiResponse.success(updatedTask, 'Estado de la tarea actualizado correctamente');
    },
    {
      body: t.Object({
        status: t.Enum(TaskStatus)
      })
    }
  )

  // Eliminar una tarea
  .delete('/:id', async ({ params: { id } }) => {
    const deleted = await taskService.deleteTask(id);
    
    if (!deleted) {
      return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    return ApiResponse.success(null, 'Tarea eliminada correctamente');
  })

  // Filtrar tareas por estado
  .get('/filter/status/:status', async ({ params: { status } }) => {
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      return new Response(JSON.stringify(ApiResponse.error('Estado no válido', 400)), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const tasks = await taskService.getTasksByStatus(status as TaskStatus);
    return ApiResponse.success(tasks, 'Tareas filtradas por estado correctamente');
  })

  // Filtrar tareas por prioridad
  .get('/filter/priority/:priority', async ({ params: { priority } }) => {
    if (!Object.values(TaskPriority).includes(priority as TaskPriority)) {
      return new Response(JSON.stringify(ApiResponse.error('Prioridad no válida', 400)), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const tasks = await taskService.getTasksByPriority(priority as TaskPriority);
    return ApiResponse.success(tasks, 'Tareas filtradas por prioridad correctamente');
  })

  // Añadir un comentario a una tarea
  .post('/:id/comments', 
    async ({ params: { id }, body }) => {
      const { text } = body;
      
      const updatedTask = await taskService.addCommentToTask(id, text);
      
      if (!updatedTask) {
        return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      return ApiResponse.success(updatedTask, 'Comentario añadido correctamente');
    },
    {
      body: t.Object({
        text: t.String()
      })
    }
  )

  // Obtener comentarios de una tarea
  .get('/:id/comments', async ({ params: { id } }) => {
    const comments = await taskService.getTaskComments(id);
    return ApiResponse.success(comments, 'Comentarios obtenidos correctamente');
  });