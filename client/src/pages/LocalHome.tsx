// Page d'accueil pour l'application avec stockage local
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  FolderOpen,
  Calendar,
  Users,
  TrendingUp,
  Database,
  Download,
  Upload,
  Settings,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LocalProjectDashboard } from '../components/Dashboard/LocalProjectDashboard';
import { DataManager } from '../components/DataManager';

export const LocalHome: React.FC = () => {
  const {
    projects,
    currentProject,
    createProject,
    loadProject,
    loading,
    error,
    isInitialized
  } = useLocalStorage();

  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: ''
  });
  const [showDataManager, setShowDataManager] = useState(false);

  const handleCreateProject = async () => {
    if (!newProjectData.name.trim()) return;

    try {
      const project = await createProject(newProjectData);
      setNewProjectData({ name: '', description: '' });
      setShowNewProject(false);
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
    }
  };

  const handleProjectClick = async (projectId: string) => {
    try {
      await loadProject(projectId);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initialisation du stockage local...</p>
        </div>
      </div>
    );
  }

  if (currentProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => loadProject('')}
          >
            ← Retour aux projets
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDataManager(!showDataManager)}
          >
            <Database className="h-4 w-4 mr-2" />
            Gestion des données
          </Button>
        </div>

        {showDataManager && (
          <DataManager />
        )}

        <LocalProjectDashboard projectId={currentProject.id} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">GridLens</h1>
        <p className="text-xl text-muted-foreground">
          Gestion de projets vidéo avec stockage local
        </p>
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm text-muted-foreground">
            Stockage local activé - Aucune connexion internet requise
          </span>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau Projet
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowDataManager(!showDataManager)}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Gestion des Données
        </Button>
      </div>

      {/* Gestionnaire de données */}
      {showDataManager && (
        <DataManager />
      )}

      {/* Formulaire nouveau projet */}
      {showNewProject && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Créer un Nouveau Projet</CardTitle>
            <CardDescription>
              Commencez un nouveau projet vidéo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-name">Nom du projet</Label>
              <Input
                id="project-name"
                value={newProjectData.name}
                onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                placeholder="Mon projet vidéo"
              />
            </div>
            <div>
              <Label htmlFor="project-description">Description (optionnel)</Label>
              <Textarea
                id="project-description"
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                placeholder="Description du projet..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateProject}
                disabled={loading || !newProjectData.name.trim()}
                className="flex-1"
              >
                Créer le Projet
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewProject(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des projets */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Mes Projets</h2>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun projet</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier projet pour commencer
              </p>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un Projet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {project.description && (
                        <CardDescription className="mt-1">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {project.status === 'completed' ? 'Terminé' : 
                       project.status === 'in_progress' ? 'En cours' : 'Planification'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{project.team?.length || 0} membres d'équipe</span>
                    </div>
                    {project.checklistProgress && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          {project.checklistProgress.completed}/{project.checklistProgress.total} tâches
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Informations sur le stockage local */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">Stockage Local Activé</h3>
            <p className="text-sm text-muted-foreground">
              Toutes vos données sont stockées localement dans votre navigateur. 
              Utilisez l'export/import pour sauvegarder vos projets.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
