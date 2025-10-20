import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface CreativeConceptTabProps {
  projectId: string;
}

export default function CreativeConceptTab({ projectId }: CreativeConceptTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    synopsis: "",
    keyMessage: "",
    tone: "",
    style: "",
    musicType: "",
    musicDescription: "",
  });
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [concept, setConcept] = useState<any>(null);

  const { data: moodboardImages = [] } = trpc.moodboardImage.list.useQuery({ projectId });

  const getOrCreateConceptMutation = trpc.creativeConcept.getOrCreate.useMutation();

  const updateConceptMutation = trpc.creativeConcept.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const uploadImageMutation = trpc.moodboardImage.upload.useMutation({
    onSuccess: () => {
      setFileInput(null);
    },
  });

  const deleteImageMutation = trpc.moodboardImage.delete.useMutation();

  const handleEditClick = async () => {
    const result = await getOrCreateConceptMutation.mutateAsync({ projectId });
    if (result) {
      setConcept(result);
      setFormData({
        synopsis: result.synopsis || "",
        keyMessage: result.keyMessage || "",
        tone: result.tone || "",
        style: result.style || "",
        musicType: result.musicType || "",
        musicDescription: result.musicDescription || "",
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    updateConceptMutation.mutate({
      projectId,
      ...formData,
    });
  };

  const handleUploadImage = async () => {
    if (!fileInput) return;

    const buffer = await fileInput.arrayBuffer();
    uploadImageMutation.mutate({
      projectId,
      fileBuffer: Buffer.from(buffer),
      fileName: fileInput.name,
    });
  };

  return (
    <div className="space-y-6">
      {/* Concept Section */}
      <Card>
        <CardHeader>
          <CardTitle>Direction Créative</CardTitle>
          <CardDescription>Définissez le concept et la direction artistique de votre vidéo</CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              {concept && (
                <>
                  {concept.synopsis && (
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Synopsis</h4>
                      <p className="text-slate-600 text-sm mt-1">{concept.synopsis}</p>
                    </div>
                  )}
                  {concept.keyMessage && (
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Message Clé</h4>
                      <p className="text-slate-600 text-sm mt-1">{concept.keyMessage}</p>
                    </div>
                  )}
                  {concept.tone && (
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Ton</h4>
                      <p className="text-slate-600 text-sm mt-1">{concept.tone}</p>
                    </div>
                  )}
                  {concept.style && (
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Style</h4>
                      <p className="text-slate-600 text-sm mt-1">{concept.style}</p>
                    </div>
                  )}
                  {concept.musicType && (
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Type de Musique</h4>
                      <p className="text-slate-600 text-sm mt-1">{concept.musicType}</p>
                    </div>
                  )}
                  {concept.musicDescription && (
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Description Musicale</h4>
                      <p className="text-slate-600 text-sm mt-1">{concept.musicDescription}</p>
                    </div>
                  )}
                </>
              )}
              {!concept || (!concept.synopsis && !concept.keyMessage) && (
                <p className="text-slate-500 text-sm italic">Aucune information de concept pour le moment</p>
              )}
              <Button onClick={handleEditClick} className="mt-4">
                {concept ? "Modifier" : "Ajouter"} le concept
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Décrivez le concept général de la vidéo..."
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="keyMessage">Message Clé</Label>
                <Textarea
                  id="keyMessage"
                  placeholder="Quel est le message principal à transmettre ?"
                  value={formData.keyMessage}
                  onChange={(e) => setFormData({ ...formData, keyMessage: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Ton</Label>
                  <Input
                    id="tone"
                    placeholder="Ex: Dynamique, Émotionnel, Informatif"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Input
                    id="style"
                    placeholder="Ex: Cinématique, Documentaire, Animation"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="musicType">Type de Musique</Label>
                <Input
                  id="musicType"
                  placeholder="Ex: Électronique, Orchestrale, Jazz"
                  value={formData.musicType}
                  onChange={(e) => setFormData({ ...formData, musicType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="musicDescription">Description Musicale</Label>
                <Textarea
                  id="musicDescription"
                  placeholder="Décrivez l'ambiance musicale souhaitée..."
                  value={formData.musicDescription}
                  onChange={(e) => setFormData({ ...formData, musicDescription: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateConceptMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateConceptMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Board Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Board</CardTitle>
          <CardDescription>Ajoutez des images de référence pour l'ambiance visuelle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="moodboard-upload"
                accept="image/*"
                onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="moodboard-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <ImageIcon className="w-8 h-8 text-slate-400" />
                <span className="text-sm text-slate-600">
                  {fileInput ? fileInput.name : "Cliquez pour sélectionner une image"}
                </span>
              </label>
              {fileInput && (
                <Button
                  onClick={handleUploadImage}
                  disabled={uploadImageMutation.isPending}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  {uploadImageMutation.isPending ? "Téléchargement..." : "Télécharger"}
                </Button>
              )}
            </div>

            {/* Images Grid */}
            {moodboardImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {moodboardImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={image.description || "Mood board"}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteImageMutation.mutate({ id: image.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {image.description && (
                      <p className="text-xs text-slate-600 mt-1 truncate">{image.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic text-center py-8">
                Aucune image de mood board pour le moment
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

