import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Edit2, DollarSign } from "lucide-react";

interface BudgetTabProps {
  projectId: string;
}

export default function BudgetTab({ projectId }: BudgetTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    notes: "",
  });

  const handleAddBudgetItem = () => {
    if (!formData.category.trim() || !formData.amount.trim()) {
      alert("La catégorie et le montant sont requis");
      return;
    }
    setIsAdding(false);
    setFormData({ category: "", amount: "", notes: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Budget du Projet</h2>
          <p className="text-slate-600 mt-1">Gérez le budget de votre production</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une ligne
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card className="border-blue-200/60 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              {editingId ? "Modifier la ligne" : "Nouvelle ligne budgétaire"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Input
                  id="category"
                  placeholder="Ex: Équipement, Talents, Locations"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount">Montant *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Détails supplémentaires..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ category: "", amount: "", notes: "" });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleAddBudgetItem}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingId ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardContent className="pt-12 pb-12 text-center">
          <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm italic">
            Aucune ligne budgétaire pour le moment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
