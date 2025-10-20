import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
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

  const { data: scenes = [] } = trpc.scene.list.useQuery({ projectId });
  const createSceneMutation = trpc.scene.create.useMutation({
    onSuccess: () => {
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
    },
  });

  const updateSceneMutation = trpc.scene.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
    },
  });

  const deleteSceneMutation = trpc.scene.delete.useMutation();

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

