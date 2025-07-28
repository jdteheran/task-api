export enum TaskStatus {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface TaskComment {
  id: string;
  text: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string; // ID del proyecto al que pertenece (opcional)
  deadline?: Date; // Fecha límite opcional
  comments: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
}
