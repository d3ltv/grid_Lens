// Hook React pour utiliser le stockage local
import { useState, useEffect, useCallback } from 'react';
import { localStorageService, ProjectData } from '../../../shared/_core/localStorageService';

export const useLocalStorage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialisation
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const allProjects = await localStorageService.getAllProjects();
        setProjects(allProjects);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur d\'initialisation');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Créer un nouveau projet
  const createProject = useCallback(async (projectData: Partial<ProjectData>) => {
    try {
      setLoading(true);
      setError(null);
      const newProject = await localStorageService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un projet
  const updateProject = useCallback(async (id: string, updates: Partial<ProjectData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await localStorageService.updateProject(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      if (currentProject?.id === id) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Mettre à jour une section de projet
  const updateProjectSection = useCallback(async (
    projectId: string, 
    section: keyof ProjectData, 
    data: any
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await localStorageService.updateProjectSection(
        projectId, 
        section, 
        data
      );
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Supprimer un projet
  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await localStorageService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Charger un projet
  const loadProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const project = await localStorageService.getProject(id);
      if (project) {
        setCurrentProject(project);
      }
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rafraîchir la liste des projets
  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allProjects = await localStorageService.getAllProjects();
      setProjects(allProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du rafraîchissement');
    } finally {
      setLoading(false);
    }
  }, []);

  // Export des données
  const exportData = useCallback(async () => {
    try {
      setError(null);
      return await localStorageService.exportAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'export');
      throw err;
    }
  }, []);

  // Import des données
  const importData = useCallback(async (jsonData: string) => {
    try {
      setLoading(true);
      setError(null);
      await localStorageService.importAllData(jsonData);
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshProjects]);

  // Obtenir les statistiques
  const getStats = useCallback(async () => {
    try {
      setError(null);
      return await localStorageService.getStorageStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des stats');
      throw err;
    }
  }, []);

  return {
    // État
    isInitialized,
    projects,
    currentProject,
    loading,
    error,
    
    // Actions
    createProject,
    updateProject,
    updateProjectSection,
    deleteProject,
    loadProject,
    refreshProjects,
    exportData,
    importData,
    getStats,
    
    // Utilitaires
    setCurrentProject,
    clearError: () => setError(null)
  };
};
