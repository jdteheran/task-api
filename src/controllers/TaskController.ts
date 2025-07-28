import { Elysia, t } from 'elysia';
import { TaskService } from '../services/TaskService';
import { TaskStatus, TaskPriority } from '../models/Task';
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
      
      const newTask = taskService.createTask(title, description, priority, projectId, deadlineDate);
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

  // Actualizar una tarea
  .put('/:id', 
    ({ params: { id }, body }) => {
      const { title, description, priority, deadline } = body;
      
      let updates: any = {};
      
      if (title) updates.title = title;
      if (description) updates.description = description;
      if (priority) updates.priority = priority;
      
      if (deadline) {
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return new Response(JSON.stringify(ApiResponse.error('Fecha límite no válida', 400)), { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
          });
        }
        updates.deadline = deadlineDate;
      }
      
      const task = taskService.updateTask(id, updates);
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
        description: t.Optional(t.String()),
        priority: t.Optional(t.Enum(TaskPriority)),
        deadline: t.Optional(t.String()) // Fecha en formato ISO
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
  .get('/filter/status/:status', ({ params: { status } }) => {
    // Validar que el estado sea válido
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      return new Response(JSON.stringify(ApiResponse.error('Estado no válido', 400)), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const tasks = taskService.getTasksByStatus(status as TaskStatus);
    return ApiResponse.success(tasks, `Tareas con estado ${status} obtenidas correctamente`);
  })
  
  // Filtrar tareas por prioridad
  .get('/filter/priority/:priority', ({ params: { priority } }) => {
    // Validar que la prioridad sea válida
    if (!Object.values(TaskPriority).includes(priority as TaskPriority)) {
      return new Response(JSON.stringify(ApiResponse.error('Prioridad no válida', 400)), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const tasks = taskService.getTasksByPriority(priority as TaskPriority);
    return ApiResponse.success(tasks, `Tareas con prioridad ${priority} obtenidas correctamente`);
  })
  
  // Obtener tareas próximas a vencer
  .get('/upcoming/:days?', ({ params: { days } }) => {
    const daysNumber = days ? parseInt(days) : 7;
    if (isNaN(daysNumber) || daysNumber <= 0) {
      return new Response(JSON.stringify(ApiResponse.error('Número de días no válido', 400)), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const tasks = taskService.getUpcomingTasks(daysNumber);
    return ApiResponse.success(tasks, `Tareas próximas a vencer en los próximos ${daysNumber} días`);
  })
  
  // Obtener tareas vencidas
  .get('/overdue', () => {
    const tasks = taskService.getOverdueTasks();
    return ApiResponse.success(tasks, 'Tareas vencidas obtenidas correctamente');
  })
  
  // Añadir un comentario a una tarea
  .post('/:id/comments', 
    ({ params: { id }, body }) => {
      const { text } = body;
      const task = taskService.addCommentToTask(id, text);
      if (!task) {
        return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      return ApiResponse.success(task, 'Comentario añadido correctamente');
    },
    {
      body: t.Object({
        text: t.String()
      })
    }
  )
  
  // Obtener comentarios de una tarea
  .get('/:id/comments', ({ params: { id } }) => {
    const task = taskService.getTaskById(id);
    if (!task) {
      return new Response(JSON.stringify(ApiResponse.error('Tarea no encontrada', 404)), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const comments = taskService.getTaskComments(id);
    return ApiResponse.success(comments, 'Comentarios obtenidos correctamente');
  });