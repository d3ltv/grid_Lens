import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FileText } from "lucide-react";

interface ScriptTabProps {
  projectId: string;
}

export default function ScriptTab({ projectId }: ScriptTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [scriptContent, setScriptContent] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Script</h2>
          <p className="text-slate-600 mt-1">Écrivez et gérez le script de votre vidéo</p>
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
              Éditer le Script
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Écrivez votre script ici..."
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="mt-1 min-h-96"
              />
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
          <CardContent className="pt-6">
            {scriptContent ? (
              <p className="text-slate-700 whitespace-pre-wrap">{scriptContent}</p>
            ) : (
              <p className="text-slate-500 italic text-center py-8">Aucun script pour le moment</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
