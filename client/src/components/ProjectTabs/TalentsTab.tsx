import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface TalentsTabProps {
  projectId: string;
}

export default function TalentsTab({ projectId }: TalentsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    notes: "",
  });

  const { data: talents = [] } = trpc.talent.list.useQuery({ projectId });
  const createTalentMutation = trpc.talent.create.useMutation({
    onSuccess: () => {
      setFormData({ name: "", role: "", description: "", notes: "" });
      setIsAdding(false);
    },
  });

  const updateTalentMutation = trpc.talent.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
    },
  });

  const deleteTalentMutation = trpc.talent.delete.useMutation();

  const handleAddTalent = () => {
    if (!formData.name.trim()) {
      alert("Le nom du talent est requis");
      return;
    }
    createTalentMutation.mutate({ projectId, ...formData });
  };

  const handleUpdateTalent = () => {
    if (editingId) {
      updateTalentMutation.mutate({ id: editingId, ...formData });
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un talent
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier le talent" : "Nouveau talent"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du talent *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  placeholder="Ex: Acteur principal"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le talent, ses caractéristiques..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes supplémentaires..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  onClick={editingId ? handleUpdateTalent : handleAddTalent}
                  disabled={createTalentMutation.isPending || updateTalentMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createTalentMutation.isPending || updateTalentMutation.isPending
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
        {talents.map((talent) => (
          <Card key={talent.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{talent.name}</CardTitle>
                  {talent.role && (
                    <CardDescription>{talent.role}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        name: talent.name,
                        role: talent.role || "",
                        description: talent.description || "",
                        notes: talent.notes || "",
                      });
                      setEditingId(talent.id);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTalentMutation.mutate({ id: talent.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {talent.description && (
                <div>
                  <strong className="text-slate-900">Description:</strong>
                  <p className="text-slate-600 mt-1">{talent.description}</p>
                </div>
              )}
              {talent.notes && (
                <div>
                  <strong className="text-slate-900">Notes:</strong>
                  <p className="text-slate-600 mt-1">{talent.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {talents.length === 0 && !isAdding && (
          <p className="text-slate-500 text-sm italic text-center py-8">
            Aucun talent pour le moment
          </p>
        )}
      </div>
    </div>
  );
}
