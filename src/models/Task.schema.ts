import mongoose, { Schema, Document } from 'mongoose';
import type { Task, TaskComment } from './Task';
import { TaskStatus, TaskPriority } from './Task';

export interface TaskCommentDocument extends Omit<TaskComment, 'id'>, Document {
  id: string; // Redefinimos id para evitar conflicto
}

const TaskCommentSchema = new Schema<TaskCommentDocument>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }
);

export interface TaskDocument extends Omit<Task, 'id'>, Document {
  id: string; // Redefinimos id para evitar conflicto
}

const TaskSchema = new Schema<TaskDocument>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: Object.values(TaskStatus),
      default: TaskStatus.BACKLOG 
    },
    priority: { 
      type: String, 
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM 
    },
    projectId: { type: String },
    deadline: { type: Date },
    comments: [TaskCommentSchema]
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);