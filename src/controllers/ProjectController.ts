import { Elysia, t } from 'elysia';
import { ProjectService } from '../services/ProjectService';
import { TaskService } from '../services/TaskService';
import { ApiResponse } from '../Utils/ApiResponse';

const taskService = new TaskService();
const projectService = new ProjectService(taskService);

export const ProjectController = new Elysia({ prefix: '/projects' })
  // Obtener todos los proyectos
  .get('/', () => {
    const projects = projectService.getAllProjects();
    return ApiResponse.success(projects, 'Proyectos obtenidos correctamente');
  })

  // Obtener un proyecto por ID
  .get('/:id', ({ params: { id } }) => {
    const project = projectService.getProjectById(id);
    if (!project) {
      return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    return ApiResponse.success(project, 'Proyecto obtenido correctamente');
  })

  // Crear un nuevo proyecto
  .post('/', 
    ({ body }) => {
      const { name, description, deadline } = body;
      const deadlineDate = new Date(deadline);
      
      // Validar que la fecha límite sea válida
      if (isNaN(deadlineDate.getTime())) {
        return new Response(JSON.stringify(ApiResponse.error('Fecha límite no válida', 400)), { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      const newProject = projectService.createProject(name, description, deadlineDate);
      return ApiResponse.success(newProject, 'Proyecto creado correctamente');
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
        deadline: t.String() // Fecha en formato ISO
      })
    }
  )

  // Actualizar un proyecto
  .put('/:id', 
    ({ params: { id }, body }) => {
      const { name, description, deadline } = body;
      
      let updates: any = {};
      
      if (name) updates.name = name;
      if (description) updates.description = description;
      
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
      
      const project = projectService.updateProject(id, updates);
      if (!project) {
        return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      return ApiResponse.success(project, 'Proyecto actualizado correctamente');
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        deadline: t.Optional(t.String()) // Fecha en formato ISO
      })
    }
  )

  // Eliminar un proyecto
  .delete('/:id', ({ params: { id } }) => {
    const deleted = projectService.deleteProject(id);
    if (!deleted) {
      return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    return ApiResponse.success(null, 'Proyecto eliminado correctamente');
  })

  // Obtener todas las tareas de un proyecto
  .get('/:id/tasks', ({ params: { id } }) => {
    const project = projectService.getProjectById(id);
    if (!project) {
      return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const tasks = projectService.getProjectTasks(id);
    return ApiResponse.success(tasks, 'Tareas del proyecto obtenidas correctamente');
  })

  // Añadir una tarea a un proyecto
  .post('/:id/tasks/:taskId', 
    ({ params: { id, taskId } }) => {
      const project = projectService.addTaskToProject(id, taskId);
      if (!project) {
        return new Response(JSON.stringify(ApiResponse.error('Proyecto o tarea no encontrados', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      return ApiResponse.success(project, 'Tarea añadida al proyecto correctamente');
    }
  )

  // Eliminar una tarea de un proyecto
  .delete('/:id/tasks/:taskId', 
    ({ params: { id, taskId } }) => {
      const project = projectService.removeTaskFromProject(id, taskId);
      if (!project) {
        return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      return ApiResponse.success(project, 'Tarea eliminada del proyecto correctamente');
    }
  );