// Dashboard de projet adapté pour le stockage local
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  Edit,
  Save,
  X,
  Plus,
} from "lucide-react";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ProjectData } from '../../../../shared/_core/localStorage';

interface LocalProjectDashboardProps {
  projectId: string;
}

export const LocalProjectDashboard: React.FC<LocalProjectDashboardProps> = ({ projectId }) => {
  const { currentProject, updateProject, loading, error } = useLocalStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ProjectData>>({});

  useEffect(() => {
    if (currentProject && currentProject.id === projectId) {
      setEditData(currentProject);
    }
  }, [currentProject, projectId]);

  const handleSave = async () => {
    try {
      await updateProject(projectId, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    setEditData(currentProject || {});
    setIsEditing(false);
  };

  if (!currentProject || currentProject.id !== projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Projet non trouvé</p>
        </div>
      </div>
    );
  }

  const progress = currentProject.checklistProgress || { completed: 0, total: 0 };
  const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* En-tête du projet */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Nom du projet"
                  />
                  <Textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Description du projet"
                    rows={2}
                  />
                </div>
              ) : (
                <div>
                  <CardTitle className="text-2xl">{currentProject.name}</CardTitle>
                  {currentProject.description && (
                    <CardDescription className="mt-2">{currentProject.description}</CardDescription>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques du projet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progress.completed} sur {progress.total} tâches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject.budget?.total ? `€${currentProject.budget.total.toLocaleString()}` : 'Non défini'}
            </div>
            {currentProject.budget?.spent && (
              <p className="text-xs text-muted-foreground">
                Dépensé: €{currentProject.budget.spent.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject.team?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Membres de l'équipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject.status === 'completed' ? 'Terminé' : 
               currentProject.status === 'in_progress' ? 'En cours' : 'Planification'}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(currentProject.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sections du projet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentProject.checklist?.items ? (
              <div className="space-y-2">
                {currentProject.checklist.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="rounded"
                    />
                    <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune tâche définie</p>
            )}
          </CardContent>
        </Card>

        {/* Équipe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentProject.team?.length ? (
              <div className="space-y-2">
                {currentProject.team.map((member: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun membre d'équipe défini</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations de création */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Informations du Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Créé le</Label>
              <p>{new Date(currentProject.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Dernière modification</Label>
              <p>{new Date(currentProject.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
