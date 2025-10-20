import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Palette } from "lucide-react";

interface ColorPaletteTabProps {
  projectId: string;
}

export default function ColorPaletteTab({ projectId }: ColorPaletteTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [colors, setColors] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Palette de Couleurs</h2>
          <p className="text-slate-600 mt-1">Définissez la palette de couleurs de votre projet</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une couleur
          </Button>
        )}
      </div>

      {colors.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Palette className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm italic">
              Aucune couleur pour le moment
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colors.map((color, index) => (
            <Card key={index} className="border-slate-200/60 bg-white/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="font-mono text-sm text-slate-900">{color}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
