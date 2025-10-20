// Hook pour gérer les projets avec stockage local (remplace tRPC)
import { useState, useEffect, useCallback } from 'react';
import { localStorageService, ProjectData } from '../../../shared/_core/localStorageService';

export interface Project {
  id: string;
  title: string;
  clientName?: string;
  projectObjective?: string;
  targetAudience?: string;
  estimatedDuration?: string;
  diffusionFormat?: string;
  status?: 'planning' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export const useLocalProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les projets
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const localProjects = await localStorageService.getAllProjects();
      
      // Convertir les projets locaux en format Project
      const convertedProjects: Project[] = localProjects.map(p => ({
        id: p.id,
        title: p.name,
        clientName: p.description,
        projectObjective: p.brief?.objective,
        targetAudience: p.brief?.targetAudience,
        estimatedDuration: p.brief?.duration,
        diffusionFormat: p.brief?.format,
        status: p.status || 'planning',
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
      
      setProjects(convertedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un projet
  const createProject = useCallback(async (data: {
    title: string;
    clientName?: string;
    projectObjective?: string;
    targetAudience?: string;
    estimatedDuration?: string;
    diffusionFormat?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const projectData: Partial<ProjectData> = {
        name: data.title,
        description: data.clientName,
        brief: {
          objective: data.projectObjective,
          targetAudience: data.targetAudience,
          duration: data.estimatedDuration,
          format: data.diffusionFormat
        },
        status: 'planning'
      };
      
      const newProject = await localStorageService.createProject(projectData);
      
      // Convertir et ajouter à la liste
      const convertedProject: Project = {
        id: newProject.id,
        title: newProject.name,
        clientName: newProject.description,
        projectObjective: newProject.brief?.objective,
        targetAudience: newProject.brief?.targetAudience,
        estimatedDuration: newProject.brief?.duration,
        diffusionFormat: newProject.brief?.format,
        status: newProject.status || 'planning',
        createdAt: new Date(newProject.createdAt),
        updatedAt: new Date(newProject.updatedAt)
      };
      
      setProjects(prev => [convertedProject, ...prev]);
      return convertedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un projet
  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updates: Partial<ProjectData> = {
        name: data.title,
        description: data.clientName,
        brief: {
          objective: data.projectObjective,
          targetAudience: data.targetAudience,
          duration: data.estimatedDuration,
          format: data.diffusionFormat
        },
        status: data.status
      };
      
      const updatedProject = await localStorageService.updateProject(id, updates);
      
      // Convertir et mettre à jour dans la liste
      const convertedProject: Project = {
        id: updatedProject.id,
        title: updatedProject.name,
        clientName: updatedProject.description,
        projectObjective: updatedProject.brief?.objective,
        targetAudience: updatedProject.brief?.targetAudience,
        estimatedDuration: updatedProject.brief?.duration,
        diffusionFormat: updatedProject.brief?.format,
        status: updatedProject.status || 'planning',
        createdAt: new Date(updatedProject.createdAt),
        updatedAt: new Date(updatedProject.updatedAt)
      };
      
      setProjects(prev => prev.map(p => p.id === id ? convertedProject : p));
      return convertedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un projet
  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await localStorageService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtenir un projet par ID
  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    try {
      const localProject = await localStorageService.getProject(id);
      if (!localProject) return null;
      
      return {
        id: localProject.id,
        title: localProject.name,
        clientName: localProject.description,
        projectObjective: localProject.brief?.objective,
        targetAudience: localProject.brief?.targetAudience,
        estimatedDuration: localProject.brief?.duration,
        diffusionFormat: localProject.brief?.format,
        status: localProject.status || 'planning',
        createdAt: new Date(localProject.createdAt),
        updatedAt: new Date(localProject.updatedAt)
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération');
      return null;
    }
  }, []);

  // Charger les projets au montage
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    refetch: loadProjects
  };
};
