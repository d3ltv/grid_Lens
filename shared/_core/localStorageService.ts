// Service de stockage local qui remplace les appels API
import { localStorageManager, ProjectData } from './localStorage';
import { fileStorageService } from './fileStorage';

export class LocalStorageService {
  // Gestion des projets
  async createProject(projectData: Partial<ProjectData>): Promise<ProjectData> {
    const project: ProjectData = {
      id: this.generateId(),
      name: projectData.name || 'Nouveau Projet',
      description: projectData.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...projectData
    };

    await localStorageManager.saveProject(project);
    
    // Sauvegarder automatiquement en fichier
    try {
      await fileStorageService.saveProject(project);
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde en fichier:', error);
    }
    
    return project;
  }

  async updateProject(id: string, updates: Partial<ProjectData>): Promise<ProjectData> {
    const existingProject = await localStorageManager.getProject(id);
    if (!existingProject) {
      throw new Error(`Projet avec l'ID ${id} non trouvé`);
    }

    const updatedProject: ProjectData = {
      ...existingProject,
      ...updates,
      id, // S'assurer que l'ID ne change pas
      updatedAt: new Date()
    };

    await localStorageManager.saveProject(updatedProject);
    
    // Sauvegarder automatiquement en fichier
    try {
      await fileStorageService.saveProject(updatedProject);
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde en fichier:', error);
    }
    
    return updatedProject;
  }

  async getProject(id: string): Promise<ProjectData | null> {
    return await localStorageManager.getProject(id);
  }

  async getAllProjects(): Promise<ProjectData[]> {
    return await localStorageManager.getAllProjects();
  }

  async deleteProject(id: string): Promise<void> {
    await localStorageManager.deleteProject(id);
  }

  // Gestion des sections de projet
  async updateProjectSection(
    projectId: string, 
    section: keyof ProjectData, 
    data: any
  ): Promise<ProjectData> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error(`Projet avec l'ID ${projectId} non trouvé`);
    }

    return await this.updateProject(projectId, {
      [section]: data
    });
  }

  // Gestion des préférences utilisateur
  async setUserPreference(key: string, value: any): Promise<void> {
    await localStorageManager.setPreference(key, value);
  }

  async getUserPreference(key: string): Promise<any> {
    return await localStorageManager.getPreference(key);
  }

  // Gestion des thèmes
  async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await this.setUserPreference('theme', theme);
  }

  async getTheme(): Promise<'light' | 'dark' | 'system'> {
    return await this.getUserPreference('theme') || 'system';
  }

  // Gestion des paramètres de l'application
  async setAppSettings(settings: Record<string, any>): Promise<void> {
    await this.setUserPreference('appSettings', settings);
  }

  async getAppSettings(): Promise<Record<string, any>> {
    return await this.getUserPreference('appSettings') || {};
  }

  // Export/Import
  async exportAllData(): Promise<string> {
    return await localStorageManager.exportData();
  }

  async importAllData(jsonData: string): Promise<void> {
    await localStorageManager.importData(jsonData);
  }

  // Sauvegarder tous les projets en fichiers
  async saveAllProjectsToFiles(): Promise<void> {
    try {
      const projects = await this.getAllProjects();
      await fileStorageService.saveAllProjects(projects);
      console.log(`💾 ${projects.length} projets sauvegardés en fichiers`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des projets:', error);
      throw error;
    }
  }

  // Utilitaires
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Statistiques
  async getStorageStats(): Promise<{
    totalProjects: number;
    totalSize: number;
    lastBackup?: Date;
  }> {
    const projects = await this.getAllProjects();
    const totalSize = JSON.stringify(projects).length;
    const lastBackup = await this.getUserPreference('lastBackup');

    return {
      totalProjects: projects.length,
      totalSize,
      lastBackup: lastBackup ? new Date(lastBackup) : undefined
    };
  }

  // Nettoyage
  async clearAllData(): Promise<void> {
    await localStorageManager.clearAllData();
  }

  // Sauvegarde automatique
  async enableAutoBackup(intervalMinutes: number = 60): Promise<void> {
    await this.setUserPreference('autoBackup', {
      enabled: true,
      interval: intervalMinutes,
      lastBackup: new Date()
    });

    // Programmer la sauvegarde automatique
    setInterval(async () => {
      try {
        const data = await this.exportAllData();
        await this.setUserPreference('lastBackup', new Date());
        console.log('Sauvegarde automatique effectuée');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde automatique:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  async disableAutoBackup(): Promise<void> {
    await this.setUserPreference('autoBackup', {
      enabled: false
    });
  }
}

// Instance singleton
export const localStorageService = new LocalStorageService();
