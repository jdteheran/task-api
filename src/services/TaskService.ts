import { TaskStatus, type Task, type TaskComment, TaskPriority } from '../models/Task';
import { TaskModel } from '../models/Task.schema';
import type { TaskDocument } from '../models/Task.schema';
import { v4 as uuidv4 } from 'uuid';

export class TaskService {
  // Obtener todas las tareas
  async getAllTasks(): Promise<Task[]> {
    const tasks = await TaskModel.find();
    return tasks.map(task => this.documentToTask(task));
  }

  // Obtener una tarea por su ID
  async getTaskById(id: string): Promise<Task | null> {
    const task = await TaskModel.findOne({ id });
    return task ? this.documentToTask(task) : null;
  }

  // Crear una nueva tarea
  async createTask(title: string, description: string, priority: TaskPriority = TaskPriority.MEDIUM, projectId?: string, deadline?: Date): Promise<Task> {
    const newTask = new TaskModel({
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.BACKLOG,
      priority,
      projectId,
      deadline,
      comments: []
    });

    await newTask.save();
    return this.documentToTask(newTask);
  }

  // Actualizar una tarea existente
  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const task = await TaskModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    return task ? this.documentToTask(task) : null;
  }

  // Cambiar el estado de una tarea
  async changeTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return this.updateTask(id, { status });
  }

  // Eliminar una tarea
  async deleteTask(id: string): Promise<boolean> {
    const result = await TaskModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Filtrar tareas por estado
  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const tasks = await TaskModel.find({ status });
    return tasks.map(task => this.documentToTask(task));
  }

  // Filtrar tareas por prioridad
  async getTasksByPriority(priority: TaskPriority): Promise<Task[]> {
    const tasks = await TaskModel.find({ priority });
    return tasks.map(task => this.documentToTask(task));
  }

  // Añadir un comentario a una tarea
  async addCommentToTask(taskId: string, text: string): Promise<Task | null> {
    const task = await TaskModel.findOne({ id: taskId });
    if (!task) {
      return null;
    }

    const newComment: TaskComment = {
      id: uuidv4(),
      text,
      createdAt: new Date()
    };

    task.comments.push(newComment);
    await task.save();
    
    return this.documentToTask(task);
  }

  // Obtener comentarios de una tarea
  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    const task = await TaskModel.findOne({ id: taskId });
    if (!task) {
      return [];
    }
    return task.comments;
  }

  // Obtener tareas por proyecto
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ projectId });
    return tasks.map(task => this.documentToTask(task));
  }

  // Convertir documento de Mongoose a objeto Task
  private documentToTask(doc: TaskDocument): Task {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      status: doc.status,
      priority: doc.priority,
      projectId: doc.projectId,
      deadline: doc.deadline,
      comments: doc.comments || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}