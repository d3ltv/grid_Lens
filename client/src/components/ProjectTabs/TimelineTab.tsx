import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface TimelineTabProps {
  projectId: string;
}

export default function TimelineTab({ projectId }: TimelineTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const { data: timeline = [] } = trpc.timeline.list.useQuery({ projectId });
  const createTimelineMutation = trpc.timeline.create.useMutation({
    onSuccess: () => {
      setFormData({ phaseName: "", description: "", startDate: "", endDate: "" });
      setIsAdding(false);
    },
  });

  const updateTimelineMutation = trpc.timeline.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
    },
  });

  const deleteTimelineMutation = trpc.timeline.delete.useMutation();

  const handleAddPhase = () => {
    if (!formData.phaseName.trim()) {
      alert("Le nom de la phase est requis");
      return;
    }
    createTimelineMutation.mutate({
      projectId,
      phaseName: formData.phaseName,
      description: formData.description,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    });
  };

  const handleUpdatePhase = () => {
    if (editingId) {
      updateTimelineMutation.mutate({
        id: editingId,
        phaseName: formData.phaseName,
        description: formData.description,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une phase
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier la phase" : "Nouvelle phase"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phaseName">Nom de la phase *</Label>
                <Input
                  id="phaseName"
                  placeholder="Ex: Tournage"
                  value={formData.phaseName}
                  onChange={(e) => setFormData({ ...formData, phaseName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez cette phase..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
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
                  onClick={editingId ? handleUpdatePhase : handleAddPhase}
                  disabled={createTimelineMutation.isPending || updateTimelineMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createTimelineMutation.isPending || updateTimelineMutation.isPending
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
        {timeline.map((entry) => (
          <Card key={entry.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{entry.phaseName}</CardTitle>
                  {entry.startDate && entry.endDate && (
                    <CardDescription>
                      {new Date(entry.startDate).toLocaleDateString("fr-FR")} - {new Date(entry.endDate).toLocaleDateString("fr-FR")}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        phaseName: entry.phaseName,
                        description: entry.description || "",
                        startDate: entry.startDate ? new Date(entry.startDate).toISOString().split('T')[0] : "",
                        endDate: entry.endDate ? new Date(entry.endDate).toISOString().split('T')[0] : "",
                      });
                      setEditingId(entry.id);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTimelineMutation.mutate({ id: entry.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {entry.description && (
              <CardContent>
                <p className="text-sm text-slate-600">{entry.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
        {timeline.length === 0 && !isAdding && (
          <p className="text-slate-500 text-sm italic text-center py-8">
            Aucune phase pour le moment
          </p>
        )}
      </div>
    </div>
  );
}
