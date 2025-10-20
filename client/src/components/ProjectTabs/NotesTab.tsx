import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { localStorageService } from "@shared/_core/localStorageService";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface NotesTabProps {
  projectId: string;
}

export default function NotesTab({ projectId }: NotesTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const { data: trpcNotes = [] } = trpc.projectNote.list.useQuery({ projectId });

  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (trpcNotes && trpcNotes.length > 0) {
      setNotes(trpcNotes);
      return;
    }

    (async () => {
      try {
        const proj = await localStorageService.getProject(projectId);
        setNotes(proj?.notes || []);
      } catch (err) {
        console.warn('Erreur chargement notes locales', err);
        setNotes([]);
      }
    })();
  }, [trpcNotes, projectId]);

  const createNoteMutation = trpc.projectNote.create.useMutation({
    onSuccess: async (created) => {
      setNotes(prev => [...prev, created]);
      setFormData({ title: "", content: "", category: "" });
      setIsAdding(false);
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.notes || [];
        await localStorageService.updateProject(projectId, { notes: [...existing, created] });
      } catch (err) {
        console.warn('Erreur sync local après création de note', err);
      }
    },
    onError: async (err, variables) => {
      console.warn('trpc create note failed, falling back to local', err);
      try {
        const newItem = { id: Date.now().toString(), ...(variables as any) };
        setNotes(prev => [...prev, newItem]);
        await localStorageService.updateProject(projectId, { notes: [...notes, newItem] });
        setFormData({ title: "", content: "", category: "" });
        setIsAdding(false);
      } catch (e) {
        console.error('Fallback create note failed', e);
      }
    }
  });

  const updateNoteMutation = trpc.projectNote.update.useMutation({
    onSuccess: async (updated) => {
      if (!updated || !updated.id) return;
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
      setEditingId(null);
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.notes || [];
        const next = existing.map((n: any) => n.id === updated.id ? updated : n);
        await localStorageService.updateProject(projectId, { notes: next });
      } catch (err) {
        console.warn('Erreur sync local après update note', err);
      }
    },
    onError: async (err, variables) => {
      console.warn('trpc update note failed, falling back to local', err);
      try {
        const updatedLocal = { id: (variables as any).id, ...(variables as any) } as any;
        setNotes(prev => prev.map(n => n.id === updatedLocal.id ? updatedLocal : n));
        await localStorageService.updateProject(projectId, { notes: notes.map(n => n.id === updatedLocal.id ? updatedLocal : n) });
        setEditingId(null);
      } catch (e) {
        console.error('Fallback update note failed', e);
      }
    }
  });

  const deleteNoteMutation = trpc.projectNote.delete.useMutation({
    onSuccess: async (deleted, variables) => {
      const deletedId = (deleted as any)?.id ?? (variables as any)?.id;
      if (!deletedId) return;
      setNotes(prev => prev.filter(n => n.id !== deletedId));
      try {
        const proj = await localStorageService.getProject(projectId);
        const existing = proj?.notes || [];
        const next = existing.filter((n: any) => n.id !== deletedId);
        await localStorageService.updateProject(projectId, { notes: next });
      } catch (err) {
        console.warn('Erreur sync local après suppression note', err);
      }
    },
    onError: async (err, variables) => {
      console.warn('trpc delete note failed, fallback local', err);
      try {
        const id = (variables as any)?.id;
        if (!id) return;
        setNotes(prev => prev.filter(n => n.id !== id));
        await localStorageService.updateProject(projectId, { notes: notes.filter(n => n.id !== id) });
      } catch (e) {
        console.error('Fallback delete note failed', e);
      }
    }
  });

  const handleAddNote = () => {
    if (!formData.content.trim()) {
      alert("Le contenu de la note est requis");
      return;
    }
    createNoteMutation.mutate({ projectId, ...formData });
  };

  const handleUpdateNote = () => {
    if (editingId) {
      updateNoteMutation.mutate({ id: editingId, ...formData });
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une note
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier la note" : "Nouvelle note"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre (optionnel)</Label>
                <Input
                  id="title"
                  placeholder="Ex: Idée importante"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  placeholder="Ex: Idée, Problème, Rappel"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  placeholder="Écrivez votre note..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
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
                  onClick={editingId ? handleUpdateNote : handleAddNote}
                  disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createNoteMutation.isPending || updateNoteMutation.isPending
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
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  {note.title && <CardTitle className="text-lg">{note.title}</CardTitle>}
                  {note.category && (
                    <CardDescription>{note.category}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        title: note.title || "",
                        content: note.content || "",
                        category: note.category || "",
                      });
                      setEditingId(note.id);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNoteMutation.mutate({ id: note.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>
            </CardContent>
          </Card>
        ))}
        {notes.length === 0 && !isAdding && (
          <p className="text-slate-500 text-sm italic text-center py-8">
            Aucune note pour le moment
          </p>
        )}
      </div>
    </div>
  );
}
