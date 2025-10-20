// Composant pour gérer l'export/import des données
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Download, Upload, Database, Trash2, RefreshCw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { exportToFile, importFromFile } from '../../../shared/_core/localStorage';

export const DataManager: React.FC = () => {
  const { exportData, importData, getStats, clearAllData, refreshProjects } = useLocalStorage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState<{
    totalProjects: number;
    totalSize: number;
    lastBackup?: Date;
  } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const data = await exportData();
      const filename = `gridlens-backup-${new Date().toISOString().split('T')[0]}.json`;
      exportToFile(data, filename);
      showMessage('success', 'Données exportées avec succès !');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export des données');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      const data = await importFromFile();
      await importData(data);
      showMessage('success', 'Données importées avec succès !');
      await loadStats();
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'import des données');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      try {
        setLoading(true);
        await clearAllData();
        showMessage('success', 'Toutes les données ont été supprimées');
        await loadStats();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression des données');
      } finally {
        setLoading(false);
      }
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestion des Données Locales
          </CardTitle>
          <CardDescription>
            Gérez vos projets et sauvegardes localement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Projets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
                <div className="text-sm text-muted-foreground">Taille des données</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {stats.lastBackup ? '✓' : '✗'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.lastBackup ? 'Sauvegardé' : 'Jamais sauvegardé'}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExport}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter les Données
            </Button>

            <Button
              onClick={handleImport}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer les Données
            </Button>

            <Button
              onClick={loadStats}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser les Stats
            </Button>

            <Button
              onClick={handleClearAll}
              disabled={loading}
              className="w-full"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer Tout
            </Button>
          </div>

          {/* Informations */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Export :</strong> Sauvegarde tous vos projets et préférences dans un fichier JSON.
            </p>
            <p>
              <strong>Import :</strong> Restaure vos données à partir d'un fichier de sauvegarde.
            </p>
            <p>
              <strong>Stockage local :</strong> Toutes vos données sont stockées localement dans votre navigateur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
