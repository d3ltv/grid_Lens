// Service de sauvegarde des projets en fichiers locaux
import { ProjectData } from './localStorage';

export interface FileStorageConfig {
  projectsDir: string;
  autoSave: boolean;
  backupInterval: number; // en minutes
}

class FileStorageService {
  private config: FileStorageConfig;
  private backupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<FileStorageConfig> = {}) {
    this.config = {
      projectsDir: config.projectsDir || './saved-projects',
      autoSave: config.autoSave ?? true,
      backupInterval: config.backupInterval || 5, // 5 minutes par défaut
    };
  }

  // Initialiser le service
  async init(): Promise<void> {
    if (typeof window === 'undefined') {
      // Côté serveur Node.js
      const fs = await import('fs');
      const path = await import('path');
      
      const projectsPath = path.resolve(this.config.projectsDir);
      
      // Créer le dossier s'il n'existe pas
      if (!fs.existsSync(projectsPath)) {
        fs.mkdirSync(projectsPath, { recursive: true });
        console.log(`📁 Dossier de projets créé: ${projectsPath}`);
      }
    }

    if (this.config.autoSave) {
      this.startAutoBackup();
    }
  }

  // Sauvegarder un projet individuel
  async saveProject(project: ProjectData): Promise<string> {
    const filename = `project_${project.id}_${this.sanitizeFilename(project.name)}.json`;
    const filepath = await this.getFilePath(filename);
    
    const projectData = {
      ...project,
      savedAt: new Date().toISOString(),
      version: '1.0'
    };

    if (typeof window === 'undefined') {
      // Côté serveur Node.js
      const fs = await import('fs');
      const path = await import('path');
      
      const fullPath = path.resolve(filepath);
      fs.writeFileSync(fullPath, JSON.stringify(projectData, null, 2), 'utf8');
      console.log(`💾 Projet sauvegardé: ${fullPath}`);
    } else {
      // Côté navigateur - télécharger le fichier
      this.downloadFile(JSON.stringify(projectData, null, 2), filename);
    }

    return filepath;
  }

  // Sauvegarder tous les projets
  async saveAllProjects(projects: ProjectData[]): Promise<string> {
    const filename = `all_projects_backup_${new Date().toISOString().split('T')[0]}.json`;
    const filepath = await this.getFilePath(filename);
    
    const backupData = {
      projects,
      exportedAt: new Date().toISOString(),
      totalProjects: projects.length,
      version: '1.0'
    };

    if (typeof window === 'undefined') {
      // Côté serveur Node.js
      const fs = await import('fs');
      const path = await import('path');
      
      const fullPath = path.resolve(filepath);
      fs.writeFileSync(fullPath, JSON.stringify(backupData, null, 2), 'utf8');
      console.log(`💾 Sauvegarde complète: ${fullPath}`);
    } else {
      // Côté navigateur - télécharger le fichier
      this.downloadFile(JSON.stringify(backupData, null, 2), filename);
    }

    return filepath;
  }

  // Charger un projet depuis un fichier
  async loadProject(filepath: string): Promise<ProjectData | null> {
    try {
      if (typeof window === 'undefined') {
        // Côté serveur Node.js
        const fs = await import('fs');
        const path = await import('path');
        
        const fullPath = path.resolve(filepath);
        if (!fs.existsSync(fullPath)) {
          return null;
        }
        
        const content = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(content);
        
        // Vérifier si c'est un projet individuel ou une sauvegarde complète
        if (data.projects && Array.isArray(data.projects)) {
          // Sauvegarde complète - retourner le premier projet pour l'instant
          return data.projects[0] || null;
        }
        
        return data;
      } else {
        // Côté navigateur - utiliser l'API File
        return null; // À implémenter si nécessaire
      }
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      return null;
    }
  }

  // Charger tous les projets depuis le dossier
  async loadAllProjects(): Promise<ProjectData[]> {
    try {
      if (typeof window === 'undefined') {
        // Côté serveur Node.js
        const fs = await import('fs');
        const path = await import('path');
        
        const projectsPath = path.resolve(this.config.projectsDir);
        
        if (!fs.existsSync(projectsPath)) {
          return [];
        }
        
        const files = fs.readdirSync(projectsPath);
        const projects: ProjectData[] = [];
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filepath = path.join(projectsPath, file);
            const project = await this.loadProject(filepath);
            if (project) {
              projects.push(project);
            }
          }
        }
        
        return projects.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        // Côté navigateur - retourner les projets du localStorage
        return [];
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      return [];
    }
  }

  // Démarrer la sauvegarde automatique
  private startAutoBackup(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }

    this.backupTimer = setInterval(async () => {
      try {
        // Cette fonction sera appelée par le service de stockage local
        console.log('🔄 Sauvegarde automatique...');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde automatique:', error);
      }
    }, this.config.backupInterval * 60 * 1000);
  }

  // Arrêter la sauvegarde automatique
  stopAutoBackup(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
  }

  // Obtenir le chemin complet du fichier
  private async getFilePath(filename: string): Promise<string> {
    if (typeof window === 'undefined') {
      const path = await import('path');
      return path.join(this.config.projectsDir, filename);
    } else {
      return filename; // Côté navigateur, juste le nom du fichier
    }
  }

  // Nettoyer le nom de fichier
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
      .substring(0, 50); // Limiter la longueur
  }

  // Télécharger un fichier (côté navigateur)
  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Obtenir les statistiques de sauvegarde
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    lastBackup?: Date;
  }> {
    try {
      if (typeof window === 'undefined') {
        const fs = await import('fs');
        const path = await import('path');
        
        const projectsPath = path.resolve(this.config.projectsDir);
        
        if (!fs.existsSync(projectsPath)) {
          return { totalFiles: 0, totalSize: 0 };
        }
        
        const files = fs.readdirSync(projectsPath);
        let totalSize = 0;
        let lastBackup: Date | undefined;
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filepath = path.join(projectsPath, file);
            const stats = fs.statSync(filepath);
            totalSize += stats.size;
            
            if (!lastBackup || stats.mtime > lastBackup) {
              lastBackup = stats.mtime;
            }
          }
        }
        
        return {
          totalFiles: files.filter(f => f.endsWith('.json')).length,
          totalSize,
          lastBackup
        };
      } else {
        return { totalFiles: 0, totalSize: 0 };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { totalFiles: 0, totalSize: 0 };
    }
  }
}

// Instance singleton
export const fileStorageService = new FileStorageService({
  projectsDir: './saved-projects',
  autoSave: true,
  backupInterval: 5 // 5 minutes
});

// Initialiser le service
fileStorageService.init().catch(console.error);
