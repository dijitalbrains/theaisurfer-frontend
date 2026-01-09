import api from './api';
import type { Project } from '../types/project.types';

export const projectService = {
  async getUserProjects(): Promise<Project[]> {
    const response = await api.get('/projects/my-projects');
    return response.data;
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const response = await api.get(`/projects/${slug}`);
    return response.data;
  },

  async getAllProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data;
  },
};
