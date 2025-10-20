import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { FileText } from "lucide-react";

interface BriefTabProps {
  projectId: string;
}

export default function BriefTab({ projectId }: BriefTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    projectObjective: "",
    targetAudience: "",
    estimatedDuration: "",
    diffusionFormat: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Brief & Appel d'Offres</h2>
          <p className="text-slate-600 mt-1">Informations principales du projet</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
            Modifier
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="border-blue-200/60 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Modifier le Brief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du Projet</Label>
                <Input
                  id="title"
                  placeholder="Titre du projet"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="clientName">Nom du Client</Label>
                <Input
                  id="clientName"
                  placeholder="Nom du client"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="projectObjective">Objectif du Projet</Label>
                <Textarea
                  id="projectObjective"
                  placeholder="Objectif principal du projet"
                  value={formData.projectObjective}
                  onChange={(e) => setFormData({ ...formData, projectObjective: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="targetAudience">Audience Cible</Label>
                <Input
                  id="targetAudience"
                  placeholder="Audience cible"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedDuration">Durée Estimée</Label>
                  <Input
                    id="estimatedDuration"
                    placeholder="Ex: 2 minutes"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="diffusionFormat">Format de Diffusion</Label>
                  <Input
                    id="diffusionFormat"
                    placeholder="Ex: YouTube, Instagram"
                    value={formData.diffusionFormat}
                    onChange={(e) => setFormData({ ...formData, diffusionFormat: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200/60 bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Titre</p>
              <p className="text-slate-900">{formData.title || "Non défini"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Client</p>
              <p className="text-slate-900">{formData.clientName || "Non défini"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Objectif</p>
              <p className="text-slate-900">{formData.projectObjective || "Non défini"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Audience Cible</p>
              <p className="text-slate-900">{formData.targetAudience || "Non défini"}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Durée</p>
                <p className="text-slate-900">{formData.estimatedDuration || "Non défini"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Format</p>
                <p className="text-slate-900">{formData.diffusionFormat || "Non défini"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
