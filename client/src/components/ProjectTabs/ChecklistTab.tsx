import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useState, useMemo, useEffect } from "react";
import { localStorageService } from "@shared/_core/localStorageService";
import { Plus, Trash2, Edit2, CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";

interface ChecklistTabProps {
  projectId: string;
}

interface ChecklistItem {
  id: string;
  itemName: string;
  category: string;
  notes?: string;
  isChecked: boolean;
}

export default function ChecklistTabImproved({ projectId }: ChecklistTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    notes: "",
    isChecked: false,
  });

  const utils = trpc.useUtils();
  const trpcAny = trpc as any;
  const utilsAny = utils as any;

  const { data: trpcChecklistItems = [] } = trpcAny.checklistItem.list.useQuery({ projectId });

  const [checklistItems, setChecklistItems] = useState<any[]>([]);

  useEffect(() => {
    if (trpcChecklistItems && trpcChecklistItems.length > 0) {
      setChecklistItems(trpcChecklistItems);
      return;
    }

    (async () => {
      try {
        const proj = await localStorageService.getProject(projectId);
        setChecklistItems(proj?.checklist || []);
      } catch (err) {
        console.warn('Erreur chargement checklist locales', err);
        setChecklistItems([]);
      }
    })();
  }, [trpcChecklistItems, projectId]);

  const createChecklistItemMutation = trpcAny.checklistItem.create.useMutation({
    onSuccess: async (created: any) => {
      utilsAny.checklistItem.list.invalidate({ projectId });
      setChecklistItems(prev => [...prev, created]);
      setFormData({
        itemName: "",
        category: "",
        notes: "",
        isChecked: false,
      });
      setIsAdding(false);
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.checklist || [];
        await localStorageService.updateProject(projectId, { checklist: [...existing, created] });
      } catch (err) {
        console.warn('Erreur sync local après création checklist item', err);
      }
    },
  onError: async (err: any, variables: any) => {
      console.warn('trpc create checklist failed, falling back to local', err);
      try {
        const newItem = { id: Date.now().toString(), ...(variables as any) };
        setChecklistItems(prev => [...prev, newItem]);
        await localStorageService.updateProject(projectId, { checklist: [...checklistItems, newItem] });
        setFormData({ itemName: "", category: "", notes: "", isChecked: false });
        setIsAdding(false);
      } catch (e) {
        console.error('Fallback create checklist failed', e);
      }
    }
  });

  const updateChecklistItemMutation = trpcAny.checklistItem.update.useMutation({
    onSuccess: async (updated: any) => {
      utilsAny.checklistItem.list.invalidate({ projectId });
      if (!updated || !updated.id) return;
      setChecklistItems(prev => prev.map(i => i.id === updated.id ? updated : i));
      setEditingId(null);
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.checklist || [];
        const next = existing.map((i: any) => i.id === updated.id ? updated : i);
        await localStorageService.updateProject(projectId, { checklist: next });
      } catch (err) {
        console.warn('Erreur sync local après update checklist item', err);
      }
    },
  onError: async (err: any, variables: any) => {
      console.warn('trpc update checklist failed, falling back to local', err);
      try {
        const updatedLocal = { id: (variables as any).id, ...(variables as any) } as any;
        setChecklistItems(prev => prev.map(i => i.id === updatedLocal.id ? updatedLocal : i));
        await localStorageService.updateProject(projectId, { checklist: checklistItems.map(i => i.id === updatedLocal.id ? updatedLocal : i) });
        setEditingId(null);
      } catch (e) {
        console.error('Fallback update checklist failed', e);
      }
    }
  });

  const deleteChecklistItemMutation = trpcAny.checklistItem.delete.useMutation({
    onSuccess: async (deleted: any, variables: any) => {
      const deletedId = (deleted as any)?.id ?? (variables as any)?.id;
      if (!deletedId) return;
      utilsAny.checklistItem.list.invalidate({ projectId });
      setChecklistItems(prev => prev.filter(i => i.id !== deletedId));
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.checklist || [];
        const next = existing.filter((i: any) => i.id !== deletedId);
        await localStorageService.updateProject(projectId, { checklist: next });
      } catch (err) {
        console.warn('Erreur sync local après suppression checklist item', err);
      }
    },
  onError: async (err: any, variables: any) => {
      console.warn('trpc delete checklist failed, fallback local', err);
      try {
        const id = (variables as any)?.id;
        if (!id) return;
        setChecklistItems(prev => prev.filter(i => i.id !== id));
        await localStorageService.updateProject(projectId, { checklist: checklistItems.filter(i => i.id !== id) });
      } catch (e) {
        console.error('Fallback delete checklist failed', e);
      }
    }
  });

  // Grouper les éléments par catégorie
  const groupedItems = useMemo(() => {
    const groups: Record<string, ChecklistItem[]> = {};
    checklistItems.forEach((item) => {
      const category = item.category || "Sans catégorie";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [checklistItems]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = checklistItems.length;
    const completed = checklistItems.filter((item) => item.isChecked).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [checklistItems]);

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

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Checklist du Projet</h2>
            <p className="text-slate-600 mt-1">Suivez la progression de vos tâches</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ajouter</span>
            </Button>
          )}
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Progression Globale</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.percentage}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">
                    {stats.completed} / {stats.total} tâches
                  </p>
                </div>
              </div>
              <Progress value={stats.percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire d'ajout/édition */}
      {(isAdding || editingId) && (
        <Card className="border-blue-200/60 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? "Modifier l'élément" : "Nouvel élément"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Nom de l'élément *</Label>
                <Input
                  id="itemName"
                  placeholder="Ex: Réserver le matériel"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  placeholder="Ex: Pré-production, Tournage, Post-production"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Détails ou informations supplémentaires..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1"
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
                  Marquer comme terminé
                </label>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({
                      itemName: "",
                      category: "",
                      notes: "",
                      isChecked: false,
                    });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingId ? handleUpdateChecklistItem : handleAddChecklistItem}
                  disabled={createChecklistItemMutation.isPending || updateChecklistItemMutation.isPending || !formData.itemName.trim()}
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

      {/* Checklist Items Grouped by Category */}
      <div className="space-y-4">
        {checklistItems.length === 0 && !isAdding ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Circle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-sm italic">
                Aucun élément dans la checklist pour le moment
              </p>
              {!isAdding && !editingId && (
                <Button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer le premier élément
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => {
            const categoryCompleted = items.filter((item) => item.isChecked).length;
            const categoryPercentage = items.length > 0 ? Math.round((categoryCompleted / items.length) * 100) : 0;
            const isExpanded = expandedCategories[category] !== false; // Expanded by default

            return (
              <div key={category} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-900">{category}</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {categoryCompleted} / {items.length} complétés
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{categoryPercentage}%</p>
                    </div>
                  </div>
                </button>

                {/* Category Progress Bar */}
                <div className="px-4">
                  <Progress value={categoryPercentage} className="h-2" />
                </div>

                {/* Items */}
                {isExpanded && (
                  <div className="space-y-2 pl-4">
                    {items.map((item) => (
                      <Card
                        key={item.id}
                        className={`transition-all duration-200 ${
                          item.isChecked
                            ? "bg-slate-50/50 border-slate-200/40 opacity-75"
                            : "bg-white/60 backdrop-blur-sm border-slate-200/60 hover:border-slate-300"
                        }`}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={`item-${item.id}`}
                              checked={item.isChecked}
                              onCheckedChange={() => handleToggleCheck(item.id, item.isChecked)}
                              className="mt-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium transition-all ${
                                  item.isChecked
                                    ? "line-through text-slate-500"
                                    : "text-slate-900"
                                }`}
                              >
                                {item.itemName}
                              </p>
                              {item.notes && (
                                <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
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
                                className="hover:bg-blue-100"
                              >
                                <Edit2 className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteChecklistItemMutation.mutate({ id: item.id })}
                                className="hover:bg-red-100"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}



