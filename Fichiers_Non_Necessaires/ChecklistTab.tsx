import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface ChecklistTabProps {
  projectId: string;
}

export default function ChecklistTab({ projectId }: ChecklistTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    notes: "",
    isChecked: false,
  });

  const utils = trpc.useUtils();

  const { data: checklistItems = [] } = trpc.checklistItem.list.useQuery({ projectId });

  const createChecklistItemMutation = trpc.checklistItem.create.useMutation({
    onSuccess: () => {
      utils.checklistItem.list.invalidate({ projectId });
      setFormData({
        itemName: "",
        category: "",
        notes: "",
        isChecked: false,
      });
      setIsAdding(false);
    },
  });

  const updateChecklistItemMutation = trpc.checklistItem.update.useMutation({
    onSuccess: () => {
      utils.checklistItem.list.invalidate({ projectId });
      setEditingId(null);
    },
  });

  const deleteChecklistItemMutation = trpc.checklistItem.delete.useMutation({
    onSuccess: () => {
      utils.checklistItem.list.invalidate({ projectId });
    },
  });

  const handleAddChecklistItem = () => {
    createChecklistItemMutation.mutate({
      projectId,
      title: formData.itemName,
      category: formData.category,
      notes: formData.notes,
      isChecked: formData.isChecked,
    });
  };

  const handleUpdateChecklistItem = () => {
    if (editingId) {
      updateChecklistItemMutation.mutate({
        id: editingId,
        title: formData.itemName,
        category: formData.category,
        notes: formData.notes,
        isChecked: formData.isChecked,
      });
    }
  };

  const handleToggleCheck = (id: string, currentStatus: boolean) => {
    updateChecklistItemMutation.mutate({
      id,
      isChecked: !currentStatus,
    });
  };

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un élément à la checklist
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier l'élément" : "Nouvel élément"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Nom de l'élément</Label>
                <Input
                  id="itemName"
                  placeholder="Ex: Réserver le matériel"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  placeholder="Ex: Pré-production, Tournage, Post-production"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Détails ou informations supplémentaires..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isChecked"
                  checked={formData.isChecked}
                  onCheckedChange={(checked) => setFormData({ ...formData, isChecked: checked as boolean })}
                />
                <label
                  htmlFor="isChecked"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Terminé
                </label>
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
                  onClick={editingId ? handleUpdateChecklistItem : handleAddChecklistItem}
                  disabled={createChecklistItemMutation.isPending || updateChecklistItemMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createChecklistItemMutation.isPending || updateChecklistItemMutation.isPending
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
        {checklistItems.length === 0 && !isAdding && (
          <p className="text-slate-500 text-sm italic text-center py-8">
            Aucun élément dans la checklist pour le moment
          </p>
        )}
        {checklistItems.map((item) => (
          <Card key={item.id} className={item.isChecked ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.isChecked}
                      onCheckedChange={() => handleToggleCheck(item.id, item.isChecked)}
                    />
                    <CardTitle className={`text-lg ${item.isChecked ? "line-through" : ""}`}>
                      {item.itemName}
                    </CardTitle>
                  </div>
                  {item.category && (
                    <p className="text-sm text-slate-500 mt-1">Catégorie: {item.category}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        itemName: item.itemName || "",
                        category: item.category || "",
                        notes: item.notes || "",
                        isChecked: item.isChecked || false,
                      });
                      setEditingId(item.id);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteChecklistItemMutation.mutate({ id: item.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {item.notes && (
                <div>
                  <strong className="text-slate-900">Notes:</strong>
                  <p className="text-slate-600 mt-1">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

