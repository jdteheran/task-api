export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: Date;
  taskIds: string[];
  createdAt: Date;
  updatedAt: Date;
  progress: number; // Porcentaje de tareas completadas (0-100)
}