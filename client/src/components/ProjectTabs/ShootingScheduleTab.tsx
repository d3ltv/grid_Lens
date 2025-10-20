import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Calendar } from "lucide-react";

interface ShootingScheduleTabProps {
  projectId: string;
}

export default function ShootingScheduleTab({ projectId }: ShootingScheduleTabProps) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plan de Tournage</h2>
          <p className="text-slate-600 mt-1">Organisez votre calendrier de tournage</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une date
          </Button>
        )}
      </div>

      <Card className="border-dashed">
        <CardContent className="pt-12 pb-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm italic">
            Aucune date de tournage pour le moment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
