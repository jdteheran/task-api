import type { Project } from '../models/Project';
import type { Task } from '../models/Task';
import { TaskStatus } from '../models/Task';
import { TaskService } from './TaskService';
import { v4 as uuidv4 } from 'uuid';

// Almacenamiento en memoria para los proyectos
let projects: Project[] = [];

export class ProjectService {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  // Obtener todos los proyectos
  getAllProjects(): Project[] {
    return projects;
  }

  // Obtener un proyecto por su ID
  getProjectById(id: string): Project | undefined {
    return projects.find(project => project.id === id);
  }

  // Crear un nuevo proyecto
  createProject(name: string, description: string, deadline: Date): Project {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      deadline,
      taskIds: [],
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    projects.push(newProject);
    return newProject;
  }

  // Actualizar un proyecto existente
  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      return undefined;
    }

    // Actualizar el proyecto
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: new Date() // Actualizar la fecha de modificación
    };

    return projects[projectIndex];
  }

  // Eliminar un proyecto
  deleteProject(id: string): boolean {
    const initialLength = projects.length;
    projects = projects.filter(project => project.id !== id);
    return projects.length < initialLength;
  }

  // Añadir una tarea a un proyecto
  addTaskToProject(projectId: string, taskId: string): Project | undefined {
    const project = this.getProjectById(projectId);
    if (!project) {
      return undefined;
    }

    // Verificar que la tarea existe
    const task = this.taskService.getTaskById(taskId);
    if (!task) {
      return undefined;
    }

    // Verificar que la tarea no esté ya en el proyecto
    if (project.taskIds.includes(taskId)) {
      return project;
    }

    // Actualizar la tarea con el projectId
    this.taskService.updateTask(taskId, { projectId });

    // Añadir la tarea al proyecto
    project.taskIds.push(taskId);
    
    // Actualizar el progreso del proyecto
    this.updateProjectProgress(projectId);
    
    return this.updateProject(projectId, { taskIds: project.taskIds });
  }

  // Eliminar una tarea de un proyecto
  removeTaskFromProject(projectId: string, taskId: string): Project | undefined {
    const project = this.getProjectById(projectId);
    if (!project) {
      return undefined;
    }

    // Verificar que la tarea existe en el proyecto
    if (!project.taskIds.includes(taskId)) {
      return project;
    }

    // Actualizar la tarea para quitar el projectId
    this.taskService.updateTask(taskId, { projectId: undefined });

    // Eliminar la tarea del proyecto
    project.taskIds = project.taskIds.filter(id => id !== taskId);
    
    // Actualizar el progreso del proyecto
    this.updateProjectProgress(projectId);
    
    return this.updateProject(projectId, { taskIds: project.taskIds });
  }

  // Obtener todas las tareas de un proyecto
  getProjectTasks(projectId: string): Task[] {
    const project = this.getProjectById(projectId);
    if (!project) {
      return [];
    }

    return project.taskIds
      .map(taskId => this.taskService.getTaskById(taskId))
      .filter((task): task is Task => task !== undefined);
  }

  // Calcular y actualizar el progreso del proyecto
  updateProjectProgress(projectId: string): Project | undefined {
    const project = this.getProjectById(projectId);
    if (!project) {
      return undefined;
    }

    const tasks = this.getProjectTasks(projectId);
    if (tasks.length === 0) {
      return this.updateProject(projectId, { progress: 0 });
    }

    // Calcular el porcentaje de tareas completadas
    const completedTasks = tasks.filter(task => task.status === TaskStatus.FINISHED).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    return this.updateProject(projectId, { progress });
  }
}