// Système de stockage local pour l'application
// Utilise IndexedDB pour les données complexes et localStorage pour les préférences

export interface StorageItem {
  id: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  brief?: any;
  budget?: any;
  checklist?: any;
  colorPalette?: any;
  creativeConcept?: any;
  equipment?: any;
  locations?: any;
  music?: any;
  notes?: any;
  scenes?: any;
  script?: any;
  shootingSchedule?: any;
  talents?: any;
  team?: any;
  timeline?: any;
  videoInspirations?: any;
  createdAt: Date;
  updatedAt: Date;
}

class LocalStorageManager {
  private dbName = 'GridLensDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store pour les projets
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('name', 'name', { unique: false });
          projectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Store pour les préférences utilisateur
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }

        // Store pour les fichiers temporaires
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      };
    });
  }

  // Gestion des projets
  async saveProject(project: ProjectData): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      
      const projectWithTimestamps = {
        ...project,
        updatedAt: new Date()
      };
      
      const request = store.put(projectWithTimestamps);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProject(id: string): Promise<ProjectData | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProjects(): Promise<ProjectData[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const projects = request.result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        resolve(projects);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Gestion des préférences
  async setPreference(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readwrite');
      const store = transaction.objectStore('preferences');
      const request = store.put({ key, value, updatedAt: new Date() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPreference(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Export/Import des données
  async exportData(): Promise<string> {
    const projects = await this.getAllProjects();
    const preferences = await this.getAllPreferences();
    
    return JSON.stringify({
      projects,
      preferences,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    if (data.projects) {
      for (const project of data.projects) {
        await this.saveProject(project);
      }
    }
    
    if (data.preferences) {
      for (const pref of data.preferences) {
        await this.setPreference(pref.key, pref.value);
      }
    }
  }

  private async getAllPreferences(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Nettoyage
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects', 'preferences', 'files'], 'readwrite');
      
      const clearStore = (storeName: string) => {
        return new Promise<void>((resolveStore, rejectStore) => {
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => resolveStore();
          request.onerror = () => rejectStore(request.error);
        });
      };
      
      Promise.all([
        clearStore('projects'),
        clearStore('preferences'),
        clearStore('files')
      ]).then(() => resolve()).catch(reject);
    });
  }
}

// Instance singleton
export const localStorageManager = new LocalStorageManager();

// Utilitaires pour l'export/import
export const exportToFile = (data: string, filename: string = 'gridlens-backup.json') => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFromFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      }
    };
    input.click();
  });
};
