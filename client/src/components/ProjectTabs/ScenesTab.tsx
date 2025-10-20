import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { localStorageService } from "@shared/_core/localStorageService";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface ScenesTabProps {
  projectId: string;
}

export default function ScenesTab({ projectId }: ScenesTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sceneNumber: 1,
    title: "",
    description: "",
    actions: "",
    dialogue: "",
    voiceOver: "",
    duration: "",
  });

  const { data: trpcScenes = [], isError: trpcError } = trpc.scene.list.useQuery({ projectId });

  // Local scenes state - we keep this in sync with trpc when possible,
  // and fallback to localStorage if trpc isn't available or for redundancy.
  const [scenes, setScenes] = useState<any[]>([]);

  useEffect(() => {
    // Prefer trpc data when available
    if (trpcScenes && trpcScenes.length > 0) {
      setScenes(trpcScenes);
      return;
    }

    // Otherwise load from local storage
    (async () => {
      try {
        const proj = await localStorageService.getProject(projectId);
        setScenes(proj?.scenes || []);
      } catch (err) {
        console.warn('Impossible de charger les scènes depuis le stockage local', err);
        setScenes([]);
      }
    })();
  }, [trpcScenes, projectId]);

  const createSceneMutation = trpc.scene.create.useMutation({
    onSuccess: async (created) => {
      // update UI
      setScenes(prev => {
        const next = [...prev, created];
        return next;
      });

      // reset form
      setFormData({
        sceneNumber: Math.max(...(trpcScenes || scenes).map((s: any) => s.sceneNumber), 0) + 1,
        title: "",
        description: "",
        actions: "",
        dialogue: "",
        voiceOver: "",
        duration: "",
      });
      setIsAdding(false);

      // persist to local storage as fallback/sync
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.scenes || [];
        await localStorageService.updateProject(projectId, { scenes: [...existing, created] });
      } catch (err) {
        console.warn('Erreur sync local après création de scène', err);
      }
    },
    onError: async (err, variables) => {
      // If trpc fails, fallback to local-only create
      console.warn('trpc create failed, falling back to local', err);
      try {
        const newItem = { id: Date.now().toString(), ...variables } as any;
        setScenes(prev => [...prev, newItem]);
        await localStorageService.updateProject(projectId, { scenes: [...scenes, newItem] });
        setFormData({
          sceneNumber: Math.max(...scenes.map(s => s.sceneNumber), 0) + 1,
          title: "",
          description: "",
          actions: "",
          dialogue: "",
          voiceOver: "",
          duration: "",
        });
        setIsAdding(false);
      } catch (e) {
        console.error('Fallback create failed', e);
      }
    }
  });

  const updateSceneMutation = trpc.scene.update.useMutation({
    onSuccess: async (updated) => {
      if (!updated || !updated.id) {
        setEditingId(null);
        return;
      }

      setScenes(prev => prev.map(s => s.id === updated.id ? updated : s));
      setEditingId(null);
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.scenes || [];
        const next = existing.map((s: any) => s.id === updated.id ? updated : s);
        await localStorageService.updateProject(projectId, { scenes: next });
      } catch (err) {
        console.warn('Erreur sync local après update de scène', err);
      }
    },
    onError: async (err, variables) => {
      console.warn('trpc update failed, falling back to local', err);
      try {
        const updatedLocal = { id: (variables as any).id, ...(variables as any) } as any;
        setScenes(prev => prev.map(s => s.id === updatedLocal.id ? updatedLocal : s));
        await localStorageService.updateProject(projectId, { scenes: scenes.map(s => s.id === updatedLocal.id ? updatedLocal : s) });
        setEditingId(null);
      } catch (e) {
        console.error('Fallback update failed', e);
      }
    }
  });

  const deleteSceneMutation = trpc.scene.delete.useMutation({
    onSuccess: async (deleted, variables) => {
  const deletedAny = deleted as any;
  const deletedId = deletedAny?.id ?? (variables as any)?.id;
      if (!deletedId) return;
      setScenes(prev => prev.filter(s => s.id !== deletedId));
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.scenes || [];
        const next = existing.filter((s: any) => s.id !== deletedId);
        await localStorageService.updateProject(projectId, { scenes: next });
      } catch (err) {
        console.warn('Erreur sync local après suppression de scène', err);
      }
    },
    onError: async (err, variables) => {
      console.warn('trpc delete failed, falling back to local', err);
      try {
        const id = (variables as any)?.id;
        if (!id) return;
        setScenes(prev => prev.filter(s => s.id !== id));
        await localStorageService.updateProject(projectId, { scenes: scenes.filter(s => s.id !== id) });
      } catch (e) {
        console.error('Fallback delete failed', e);
      }
    }
  });

  const handleAddScene = () => {
    createSceneMutation.mutate({
      projectId,
      ...formData,
    });
  };

  const handleUpdateScene = () => {
    if (editingId) {
      updateSceneMutation.mutate({
        id: editingId,
        ...formData,
      });
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une scène
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier la scène" : "Nouvelle scène"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sceneNumber">Numéro de scène</Label>
                  <Input
                    id="sceneNumber"
                    type="number"
                    value={formData.sceneNumber}
                    onChange={(e) => setFormData({ ...formData, sceneNumber: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    placeholder="Ex: 10 secondes"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Titre de la scène</Label>
                <Input
                  id="title"
                  placeholder="Ex: Ouverture"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez ce qui se passe dans cette scène..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="actions">Actions</Label>
                <Textarea
                  id="actions"
                  placeholder="Décrivez les actions et mouvements..."
                  value={formData.actions}
                  onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dialogue">Dialogues</Label>
                <Textarea
                  id="dialogue"
                  placeholder="Écrivez les dialogues..."
                  value={formData.dialogue}
                  onChange={(e) => setFormData({ ...formData, dialogue: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="voiceOver">Voix off</Label>
                <Textarea
                  id="voiceOver"
                  placeholder="Écrivez la voix off si applicable..."
                  value={formData.voiceOver}
                  onChange={(e) => setFormData({ ...formData, voiceOver: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingId ? handleUpdateScene : handleAddScene}
                  disabled={createSceneMutation.isPending || updateSceneMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createSceneMutation.isPending || updateSceneMutation.isPending
                    ? "Sauvegarde..."
                    : editingId
                    ? "Mettre à jour"
                    : "Ajouter"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
  {scenes.map((scene) => (
          <Card key={scene.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Scène {scene.sceneNumber}: {scene.title || "(Sans titre)"}
                  </CardTitle>
                  {scene.duration && (
                    <CardDescription>{scene.duration}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        sceneNumber: scene.sceneNumber,
                        title: scene.title || "",
                        description: scene.description || "",
                        actions: scene.actions || "",
                        dialogue: scene.dialogue || "",
                        voiceOver: scene.voiceOver || "",
                        duration: scene.duration || "",
                      });
                      setEditingId(scene.id);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSceneMutation.mutate({ id: scene.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {scene.description && (
                <div>
                  <strong className="text-slate-900">Description:</strong>
                  <p className="text-slate-600 mt-1">{scene.description}</p>
                </div>
              )}
              {scene.actions && (
                <div>
                  <strong className="text-slate-900">Actions:</strong>
                  <p className="text-slate-600 mt-1">{scene.actions}</p>
                </div>
              )}
              {scene.dialogue && (
                <div>
                  <strong className="text-slate-900">Dialogues:</strong>
                  <p className="text-slate-600 mt-1 whitespace-pre-wrap">{scene.dialogue}</p>
                </div>
              )}
              {scene.voiceOver && (
                <div>
                  <strong className="text-slate-900">Voix off:</strong>
                  <p className="text-slate-600 mt-1">{scene.voiceOver}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {scenes.length === 0 && !isAdding && (
          <p className="text-slate-500 text-sm italic text-center py-8">
            Aucune scène pour le moment
          </p>
        )}
      </div>
    </div>
  );
}

