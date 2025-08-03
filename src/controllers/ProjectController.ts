import { Elysia, t } from 'elysia';
import { ProjectService } from '../services/ProjectService';
import { TaskService } from '../services/TaskService';
import { ApiResponse } from '../Utils/ApiResponse';

const taskService = new TaskService();
const projectService = new ProjectService();

type ProjectBody = {
  name: string;
  description: string;
  deadline: string;
};

type ProjectUpdateBody = {
  name?: string;
  description?: string;
  deadline?: string;
};

export const ProjectController = new Elysia({ prefix: '/projects' })
  // Obtener todos los proyectos
  .get('/', async () => {
    const projects = await projectService.getAllProjects();
    return ApiResponse.success(projects, 'Proyectos obtenidos correctamente');
  })

  // Obtener un proyecto por ID
  .get('/:id', async ({ params: { id } }: { params: { id: string } }) => {
    const project = await projectService.getProjectById(id);
    if (!project) {
      return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return ApiResponse.success(project, 'Proyecto obtenido correctamente');
  })

  // Crear un nuevo proyecto
  .post('/', async ({ body }: { body: ProjectBody }) => {
      try {
        // Validar formato de fecha
        const deadlineDate = new Date(body.deadline);
        if (isNaN(deadlineDate.getTime())) {
          return new Response(JSON.stringify(ApiResponse.error('Formato de fecha inválido', 400)), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const project = await projectService.createProject(body.name, body.description, deadlineDate);
        return ApiResponse.success(project, 'Proyecto creado correctamente');
      } catch (error) {
        return new Response(JSON.stringify(ApiResponse.error('Error al crear el proyecto', 500)), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  )

  // Actualizar un proyecto
  .put('/:id', async ({ params: { id }, body }: { params: { id: string }, body: ProjectUpdateBody }) => {
      try {
        // Verificar que el proyecto existe
        const existingProject = await projectService.getProjectById(id);
        if (!existingProject) {
          return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Validar formato de fecha si se proporciona
        let deadlineDate;
        if (body.deadline) {
          deadlineDate = new Date(body.deadline);
          if (isNaN(deadlineDate.getTime())) {
            return new Response(JSON.stringify(ApiResponse.error('Formato de fecha inválido', 400)), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        const updates = {
          ...body,
          deadline: deadlineDate
        };

        const updatedProject = await projectService.updateProject(id, updates);
        return ApiResponse.success(updatedProject, 'Proyecto actualizado correctamente');
      } catch (error) {
        return new Response(JSON.stringify(ApiResponse.error('Error al actualizar el proyecto', 500)), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  )

  // Eliminar un proyecto
  .delete('/:id', async ({ params: { id } }: { params: { id: string } }) => {
    try {
      // Verificar que el proyecto existe
      const existingProject = await projectService.getProjectById(id);
      if (!existingProject) {
        return new Response(JSON.stringify(ApiResponse.error('Proyecto no encontrado', 404)), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await projectService.deleteProject(id);
      if (result) {
        return ApiResponse.success(null, 'Proyecto eliminado correctamente');
      } else {
        return new Response(JSON.stringify(ApiResponse.error('Error al eliminar el proyecto', 500)), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify(ApiResponse.error('Error al eliminar el proyecto', 500)), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  })

  // Añadir una tarea a un proyecto
  .post('/:id/tasks/:taskId', async ({ params: { id, taskId } }: { params: { id: string, taskId: string } }) => {
    try {
      const updatedProject = await projectService.addTaskToProject(id, taskId);
      if (!updatedProject) {
        return new Response(JSON.stringify(ApiResponse.error('Proyecto o tarea no encontrados', 404)), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return ApiResponse.success(updatedProject, 'Tarea añadida al proyecto correctamente');
    } catch (error) {
      return new Response(JSON.stringify(ApiResponse.error('Error al añadir la tarea al proyecto', 500)), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  })

  // Eliminar una tarea de un proyecto
  .delete('/:id/tasks/:taskId', async ({ params: { id, taskId } }: { params: { id: string, taskId: string } }) => {
    try {
      const updatedProject = await projectService.removeTaskFromProject(id, taskId);
      if (!updatedProject) {
        return new Response(JSON.stringify(ApiResponse.error('Proyecto o tarea no encontrados', 404)), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return ApiResponse.success(updatedProject, 'Tarea eliminada del proyecto correctamente');
    } catch (error) {
      return new Response(JSON.stringify(ApiResponse.error('Error al eliminar la tarea del proyecto', 500)), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });