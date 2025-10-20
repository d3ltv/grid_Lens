import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface EquipmentTabProps {
  projectId: string;
}

export default function EquipmentTab({ projectId }: EquipmentTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    notes: "",
  });

  const { data: equipment = [] } = trpc.equipment.list.useQuery({ projectId });
  const createEquipmentMutation = trpc.equipment.create.useMutation({
    onSuccess: () => {
      setFormData({ name: "", category: "", description: "", notes: "" });
      setIsAdding(false);
    },
  });

  const updateEquipmentMutation = trpc.equipment.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
    },
  });

  const deleteEquipmentMutation = trpc.equipment.delete.useMutation();

  const handleAddEquipment = () => {
    if (!formData.name.trim()) {
      alert("Le nom de l'équipement est requis");
      return;
    }
    createEquipmentMutation.mutate({ projectId, ...formData });
  };

  const handleUpdateEquipment = () => {
    if (editingId) {
      updateEquipmentMutation.mutate({ id: editingId, ...formData });
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un équipement
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier l'équipement" : "Nouvel équipement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de l'équipement *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Caméra RED"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  placeholder="Ex: Caméra, Objectif, Lumière"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez l'équipement..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes supplémentaires (location, coût, etc.)"
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
                  onClick={editingId ? handleUpdateEquipment : handleAddEquipment}
                  disabled={createEquipmentMutation.isPending || updateEquipmentMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createEquipmentMutation.isPending || updateEquipmentMutation.isPending
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
        {equipment.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {item.category && (
                    <CardDescription>{item.category}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        name: item.name,
                        category: item.category || "",
                        description: item.description || "",
                        notes: item.notes || "",
                      });
                      setEditingId(item.id);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEquipmentMutation.mutate({ id: item.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {item.description && (
                <div>
                  <strong className="text-slate-900">Description:</strong>
                  <p className="text-slate-600 mt-1">{item.description}</p>
                </div>
              )}
              {item.notes && (
                <div>
                  <strong className="text-slate-900">Notes:</strong>
                  <p className="text-slate-600 mt-1">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {equipment.length === 0 && !isAdding && (
          <p className="text-slate-500 text-sm italic text-center py-8">
            Aucun équipement pour le moment
          </p>
        )}
      </div>
    </div>
  );
}
