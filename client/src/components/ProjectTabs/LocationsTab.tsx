import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Edit2, MapPin, Phone, MapPinIcon } from "lucide-react";

interface LocationsTabProps {
  projectId: string;
}

interface Location {
  id: string;
  name: string;
  address?: string;
  description?: string;
  notes?: string;
}

export default function LocationsTabImproved({ projectId }: LocationsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    notes: "",
  });

  const { data: locations = [] } = trpc.location.list.useQuery({ projectId });
  const createLocationMutation = trpc.location.create.useMutation({
    onSuccess: () => {
      setFormData({ name: "", address: "", description: "", notes: "" });
      setIsAdding(false);
    },
  });

  const updateLocationMutation = trpc.location.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
      setFormData({ name: "", address: "", description: "", notes: "" });
    },
  });

  const deleteLocationMutation = trpc.location.delete.useMutation();

  const handleAddLocation = () => {
    if (!formData.name.trim()) {
      alert("Le nom du lieu est requis");
      return;
    }
    createLocationMutation.mutate({ projectId, ...formData });
  };

  const handleUpdateLocation = () => {
    if (editingId) {
      updateLocationMutation.mutate({ id: editingId, ...formData });
    }
  };

  const handleEditClick = (location: Location) => {
    setFormData({
      name: location.name,
      address: location.address || "",
      description: location.description || "",
      notes: location.notes || "",
    });
    setEditingId(location.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lieux de Tournage</h2>
          <p className="text-slate-600 mt-1">Gérez les emplacements de votre projet</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ajouter un lieu</span>
          </Button>
        )}
      </div>

      {/* Formulaire d'ajout/édition */}
      {(isAdding || editingId) && (
        <Card className="border-blue-200/60 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {editingId ? "Modifier le lieu" : "Nouveau lieu"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du lieu *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Studio de cinéma, Parc, Rue principale"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  placeholder="Adresse complète du lieu..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le lieu, son ambiance, ses caractéristiques, l'éclairage naturel, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes Pratiques</Label>
                <Textarea
                  id="notes"
                  placeholder="Accès, parking, permis requis, horaires d'ouverture, contacts, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ name: "", address: "", description: "", notes: "" });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingId ? handleUpdateLocation : handleAddLocation}
                  disabled={createLocationMutation.isPending || updateLocationMutation.isPending || !formData.name.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createLocationMutation.isPending || updateLocationMutation.isPending
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

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.length === 0 && !isAdding ? (
          <Card className="border-dashed md:col-span-2">
            <CardContent className="pt-12 pb-12 text-center">
              <MapPinIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-sm italic">
                Aucun lieu pour le moment
              </p>
              {!isAdding && !editingId && (
                <Button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter le premier lieu
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          locations.map((location) => (
            <Card
              key={location.id}
              className="bg-white/60 backdrop-blur-sm border-slate-200/60 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <CardTitle className="text-lg line-clamp-2">
                          {location.name}
                        </CardTitle>
                        {location.address && (
                          <CardDescription className="mt-1 line-clamp-2">
                            {location.address}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(location)}
                      className="hover:bg-blue-100"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLocationMutation.mutate({ id: location.id })}
                      className="hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                {location.description && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Description
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {location.description}
                    </p>
                  </div>
                )}

                {location.notes && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Notes Pratiques
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {location.notes}
                    </p>
                  </div>
                )}

                {!location.description && !location.notes && (
                  <p className="text-sm text-slate-500 italic py-4">
                    Aucune description pour ce lieu
                  </p>
                )}
              </CardContent>

              {/* Quick Actions Footer */}
              <div className="pt-3 border-t border-slate-200 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    const text = `${location.name}\n${location.address || ""}\n${location.description || ""}`;
                    navigator.clipboard.writeText(text);
                  }}
                >
                  Copier
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

