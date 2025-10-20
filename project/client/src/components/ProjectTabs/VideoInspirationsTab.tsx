import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Plus, Trash2, Edit2, Video } from "lucide-react";

interface VideoInspirationsTabProps {
  projectId: string;
}

export default function VideoInspirationsTab({ projectId }: VideoInspirationsTabProps) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inspirations Vidéo</h2>
          <p className="text-slate-600 mt-1">Collectez les vidéos qui vous inspirent</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une vidéo
          </Button>
        )}
      </div>

      <Card className="border-dashed">
        <CardContent className="pt-12 pb-12 text-center">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm italic">
            Aucune vidéo d'inspiration pour le moment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
