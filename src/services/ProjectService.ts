import type { Project } from '../models/Project';
import { ProjectModel } from '../models/Project.schema';
import type { ProjectDocument } from '../models/Project.schema';
import { v4 as uuidv4 } from 'uuid';

export class ProjectService {
  // Obtener todos los proyectos
  async getAllProjects(): Promise<Project[]> {
    const projects = await ProjectModel.find();
    return projects.map(project => this.documentToProject(project));
  }

  // Obtener un proyecto por su ID
  async getProjectById(id: string): Promise<Project | null> {
    const project = await ProjectModel.findOne({ id });
    return project ? this.documentToProject(project) : null;
  }

  // Crear un nuevo proyecto
  async createProject(name: string, description: string, deadline: Date): Promise<Project> {
    const newProject = new ProjectModel({
      id: uuidv4(),
      name,
      description,
      deadline,
      taskIds: [],
      progress: 0
    });

    await newProject.save();
    return this.documentToProject(newProject);
  }

  // Actualizar un proyecto existente
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const project = await ProjectModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    return project ? this.documentToProject(project) : null;
  }

  // Eliminar un proyecto
  async deleteProject(id: string): Promise<boolean> {
    const result = await ProjectModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Añadir una tarea a un proyecto
  async addTaskToProject(projectId: string, taskId: string): Promise<Project | null> {
    const project = await ProjectModel.findOne({ id: projectId });
    if (!project) {
      return null;
    }

    if (!project.taskIds.includes(taskId)) {
      project.taskIds.push(taskId);
      await project.save();
    }
    
    return this.documentToProject(project);
  }

  // Eliminar una tarea de un proyecto
  async removeTaskFromProject(projectId: string, taskId: string): Promise<Project | null> {
    const project = await ProjectModel.findOne({ id: projectId });
    if (!project) {
      return null;
    }

    project.taskIds = project.taskIds.filter(id => id !== taskId);
    await project.save();
    
    return this.documentToProject(project);
  }

  // Obtener todas las tareas de un proyecto
  async getProjectTasks(projectId: string): Promise<string[]> {
    const project = await ProjectModel.findOne({ id: projectId });
    return project ? project.taskIds : [];
  }

  // Actualizar el progreso de un proyecto
  async updateProjectProgress(projectId: string, progress: number): Promise<Project | null> {
    return this.updateProject(projectId, { progress });
  }

  // Convertir documento de Mongoose a objeto Project
  private documentToProject(doc: ProjectDocument): Project {
    return {
      id: doc.id,
      name: doc.name,
      description: doc.description,
      deadline: doc.deadline,
      taskIds: doc.taskIds,
      progress: doc.progress,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}