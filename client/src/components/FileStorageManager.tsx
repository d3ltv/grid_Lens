// Composant pour gérer la sauvegarde des projets en fichiers
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Download, 
  FolderOpen, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useLocalProjects } from '../hooks/useLocalProjects';
import { localStorageService } from '../../../shared/_core/localStorageService';

export const FileStorageManager: React.FC = () => {
  const { projects, loading, error } = useLocalProjects();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveAllProjects = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      
      // Sauvegarder tous les projets en fichiers
      await localStorageService.saveAllProjectsToFiles();
      
      showMessage('success', `✅ ${projects.length} projets sauvegardés dans le dossier ./saved-projects/`);
    } catch (error) {
      showMessage('error', '❌ Erreur lors de la sauvegarde des projets');
      console.error('Erreur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadAllProjects = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      
      // Exporter tous les projets en un seul fichier
      const data = await localStorageService.exportAllData();
      const filename = `gridlens-projects-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      // Télécharger le fichier
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showMessage('success', '📁 Fichier de sauvegarde téléchargé !');
    } catch (error) {
      showMessage('error', '❌ Erreur lors du téléchargement');
      console.error('Erreur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadIndividualProjects = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      
      // Télécharger chaque projet individuellement
      for (const project of projects) {
        const data = JSON.stringify(project, null, 2);
        const filename = `project_${project.id}_${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Petite pause entre les téléchargements
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      showMessage('success', `📁 ${projects.length} fichiers de projets téléchargés !`);
    } catch (error) {
      showMessage('error', '❌ Erreur lors du téléchargement des projets');
      console.error('Erreur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Sauvegarde des Projets
          </CardTitle>
          <CardDescription>
            Sauvegardez vos projets en fichiers pour les conserver même après l'arrêt du serveur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Projets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {projects.length > 0 ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">
                {projects.length > 0 ? 'Prêt à sauvegarder' : 'Aucun projet'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {isSaving ? '⏳' : '✓'}
              </div>
              <div className="text-sm text-muted-foreground">
                {isSaving ? 'Sauvegarde...' : 'Disponible'}
              </div>
            </div>
          </div>

          {/* Actions de sauvegarde */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleSaveAllProjects}
              disabled={loading || isSaving || projects.length === 0}
              className="w-full"
              variant="default"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Sauvegarder en Dossier Local
            </Button>

            <Button
              onClick={handleDownloadAllProjects}
              disabled={loading || isSaving || projects.length === 0}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger Sauvegarde Complète
            </Button>

            <Button
              onClick={handleDownloadIndividualProjects}
              disabled={loading || isSaving || projects.length === 0}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger Projets Individuels
            </Button>

            <Button
              onClick={() => window.location.reload()}
              disabled={loading || isSaving}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>

          {/* Informations */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Sauvegarde en Dossier Local :</strong> Crée un dossier <code>./saved-projects/</code> 
              dans votre projet avec tous les fichiers JSON.
            </p>
            <p>
              <strong>Téléchargement :</strong> Télécharge les fichiers directement dans votre dossier de téléchargements.
            </p>
            <p>
              <strong>Format :</strong> Tous les projets sont sauvegardés au format JSON lisible.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📋 Instructions :</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Cliquez sur "Sauvegarder en Dossier Local" pour créer le dossier <code>./saved-projects/</code></li>
              <li>Vos projets seront sauvegardés automatiquement à chaque modification</li>
              <li>Les fichiers restent même après l'arrêt de <code>pnpm dev</code></li>
              <li>Vous pouvez importer ces fichiers plus tard si nécessaire</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
