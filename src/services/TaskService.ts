import type { Task } from '../models/Task';
import { TaskStatus } from '../models/Task';
import { v4 as uuidv4 } from 'uuid';

// Almacenamiento en memoria para las tareas
let tasks: Task[] = [];

export class TaskService {
  // Obtener todas las tareas
  getAllTasks(): Task[] {
    return tasks;
  }

  // Obtener una tarea por su ID
  getTaskById(id: string): Task | undefined {
    return tasks.find(task => task.id === id);
  }

  // Crear una nueva tarea
  createTask(title: string, description: string): Task {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.BACKLOG, // Por defecto, las tareas nuevas están en Backlog
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tasks.push(newTask);
    return newTask;
  }

  // Actualizar una tarea existente
  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return undefined;
    }

    // Actualizar la tarea
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date() // Actualizar la fecha de modificación
    };

    return tasks[taskIndex];
  }

  // Cambiar el estado de una tarea
  changeTaskStatus(id: string, status: TaskStatus): Task | undefined {
    return this.updateTask(id, { status });
  }

  // Eliminar una tarea
  deleteTask(id: string): boolean {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return tasks.length < initialLength;
  }

  // Filtrar tareas por estado
  getTasksByStatus(status: TaskStatus): Task[] {
    return tasks.filter(task => task.status === status);
  }
}