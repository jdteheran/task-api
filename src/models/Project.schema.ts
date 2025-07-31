import mongoose, { Schema, Document } from 'mongoose';
import type { Project } from './Project';

export interface ProjectDocument extends Omit<Project, 'id'>, Document {
  id: string; // Redefinimos id para evitar conflicto
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    taskIds: [{ type: String }],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<ProjectDocument>('Project', ProjectSchema);