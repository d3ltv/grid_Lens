import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
} from "lucide-react";

interface ProjectDashboardProps {
  projectId: string;
  projectTitle: string;
  clientName?: string;
  progress?: number;
  budget?: {
    total: number;
    spent: number;
    currency: string;
  };
  team?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  upcomingDeadlines?: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
  }>;
  checklistProgress?: {
    completed: number;
    total: number;
  };
  status?: "planning" | "in_progress" | "completed";
}

export default function ProjectDashboard({
  projectId,
  projectTitle,
  clientName,
  progress = 0,
  budget,
  team = [],
  upcomingDeadlines = [],
  checklistProgress = { completed: 0, total: 0 },
  status = "planning",
}: ProjectDashboardProps) {
  const budgetPercentage = budget ? (budget.spent / budget.total) * 100 : 0;
  const checklistPercentage = checklistProgress.total > 0 ? (checklistProgress.completed / checklistProgress.total) * 100 : 0;

  const statusConfig = {
    planning: { label: "Planification", color: "text-slate-600", bgColor: "bg-slate-100" },
    in_progress: { label: "En cours", color: "text-orange-600", bgColor: "bg-orange-100" },
    completed: { label: "Complété", color: "text-green-600", bgColor: "bg-green-100" },
  };

  const config = statusConfig[status];

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{projectTitle}</h1>
          {clientName && <p className="text-slate-600 mt-1">{clientName}</p>}
        </div>
        <div className={`px-4 py-2 rounded-lg font-medium text-sm ${config.bgColor} ${config.color}`}>
          {config.label}
        </div>
      </div>

      {/* Main Stats Grid - Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Card */}
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Avancement Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-slate-900">{progress}%</span>
                <span className="text-sm text-slate-600">Complété</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Checklist Card */}
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-900">
                {checklistProgress.completed}/{checklistProgress.total}
              </div>
              <Progress value={checklistPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Budget Card */}
        {budget && (
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-900">
                  {budgetPercentage.toFixed(0)}%
                </div>
                <Progress value={budgetPercentage} className="h-2" />
                <p className="text-xs text-slate-600 mt-2">
                  {budget.spent.toLocaleString()} / {budget.total.toLocaleString()} {budget.currency}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Card */}
        {team.length > 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{team.length}</div>
              <p className="text-xs text-slate-600 mt-2">Membres</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Prochaines Deadlines
            </CardTitle>
            <CardDescription>Tâches à venir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 5).map((deadline) => {
                const daysUntil = Math.ceil(
                  (new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const priorityConfig = {
                  high: { color: "text-red-600", bg: "bg-red-100" },
                  medium: { color: "text-orange-600", bg: "bg-orange-100" },
                  low: { color: "text-green-600", bg: "bg-green-100" },
                };
                const pConfig = priorityConfig[deadline.priority];

                return (
                  <div key={deadline.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-50">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{deadline.title}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {daysUntil > 0 ? `Dans ${daysUntil} jour(s)` : "Aujourd'hui"}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-md text-xs font-medium ${pConfig.bg} ${pConfig.color}`}>
                      {deadline.priority === "high" && "Urgent"}
                      {deadline.priority === "medium" && "Normal"}
                      {deadline.priority === "low" && "Faible"}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      {team.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Équipe du Projet
            </CardTitle>
            <CardDescription>{team.length} membre(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {team.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors">
              <p className="font-medium text-slate-900">Télécharger PDF</p>
              <p className="text-sm text-slate-600">Générer le document</p>
            </button>
            <button className="p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors">
              <p className="font-medium text-slate-900">Partager</p>
              <p className="text-sm text-slate-600">Envoyer à l'équipe</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

