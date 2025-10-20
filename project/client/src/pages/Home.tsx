import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, Film, LogOut, Search, Filter, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

export default function HomeImproved() {
  // Désactiver l'authentification pour usage interne
  const user = { id: "demo-user", name: "Utilisateur", email: "demo@preprod.local" };
  const loading = false;
  const isAuthenticated = true;
  const logout = () => {};
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "planning" | "in_progress" | "completed">("all");
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    projectObjective: "",
    targetAudience: "",
    estimatedDuration: "",
    diffusionFormat: "",
  });

  const { data: projects = [], isLoading: projectsLoading } = trpc.project.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createProjectMutation = trpc.project.create.useMutation({
    onSuccess: (newProject) => {
      setFormData({
        title: "",
        clientName: "",
        projectObjective: "",
        targetAudience: "",
        estimatedDuration: "",
        diffusionFormat: "",
      });
      setIsDialogOpen(false);
      setLocation(`/project/${newProject.id}`);
    },
  });

  const handleCreateProject = async () => {
    if (!formData.title.trim()) {
      alert("Le titre du projet est requis");
      return;
    }
    createProjectMutation.mutate(formData);
  };

  // Filtrer et chercher les projets
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Statistiques
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-16 mx-auto mb-4" />}
            <h1 className="text-4xl font-bold text-white mb-2">{APP_TITLE}</h1>
            <p className="text-slate-400 text-lg">Outil professionnel de pré-production vidéo</p>
          </div>
          <p className="text-slate-300 mb-8">
            Créez des documents de pré-production complets et professionnels à envoyer à vos clients.
          </p>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header - Sticky, Responsive */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 flex-shrink-0" />}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{APP_TITLE}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <span className="hidden sm:inline text-sm text-slate-600">
                Bienvenue, <strong>{user?.name}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section Header avec Stats - Bento Style */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Mes Projets</h2>
              <p className="text-slate-600 mt-2">Gérez vos projets de pré-production vidéo</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Projet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau projet</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations de base de votre projet de pré-production
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Titre du projet *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Campagne publicitaire 2024"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientName">Nom du client</Label>
                    <Input
                      id="clientName"
                      placeholder="Ex: Acme Corp"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectObjective">Objectif du projet</Label>
                    <Textarea
                      id="projectObjective"
                      placeholder="Décrivez l'objectif principal du projet..."
                      value={formData.projectObjective}
                      onChange={(e) => setFormData({ ...formData, projectObjective: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetAudience">Public cible</Label>
                    <Input
                      id="targetAudience"
                      placeholder="Ex: Femmes 25-45 ans, urbaines"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedDuration">Durée estimée</Label>
                      <Input
                        id="estimatedDuration"
                        placeholder="Ex: 30 secondes"
                        value={formData.estimatedDuration}
                        onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="diffusionFormat">Format de diffusion</Label>
                      <Input
                        id="diffusionFormat"
                        placeholder="Ex: Web, TV, Réseaux sociaux"
                        value={formData.diffusionFormat}
                        onChange={(e) => setFormData({ ...formData, diffusionFormat: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={createProjectMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createProjectMutation.isPending ? "Création..." : "Créer le projet"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards - Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Projets</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Film className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">En Cours</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.inProgress}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Complétés</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.completed}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Bar - Mobile Responsive */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "planning", "in_progress", "completed"] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="text-xs sm:text-sm"
              >
                {status === "all" && "Tous"}
                {status === "planning" && "Planification"}
                {status === "in_progress" && "En cours"}
                {status === "completed" && "Complétés"}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid - Responsive Bento Layout */}
        {projectsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement de vos projets...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Film className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchQuery || filterStatus !== "all" ? "Aucun projet trouvé" : "Aucun projet"}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || filterStatus !== "all"
                  ? "Essayez de modifier votre recherche ou vos filtres"
                  : "Commencez par créer votre premier projet de pré-production"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un projet
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const statusConfig = {
                planning: { icon: AlertCircle, color: "text-slate-500", bg: "bg-slate-100" },
                in_progress: { icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
                completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
              };
              const config = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.planning;
              const StatusIcon = config.icon;

              return (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300 bg-white/60 backdrop-blur-sm"
                  onClick={() => setLocation(`/project/${project.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        {project.clientName && (
                          <CardDescription className="mt-1">{project.clientName}</CardDescription>
                        )}
                      </div>
                      <div className={`p-2 rounded-lg flex-shrink-0 ${config.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.projectObjective && (
                        <p className="line-clamp-2 text-sm text-slate-600">
                          {project.projectObjective}
                        </p>
                      )}

                      {/* Progress Bar */}
                      {project.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-600">Avancement</span>
                            <span className="text-xs font-semibold text-slate-900">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                        {project.estimatedDuration && (
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                            {project.estimatedDuration}
                          </span>
                        )}
                        {project.diffusionFormat && (
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                            {project.diffusionFormat}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        {project.createdAt && (
                          <p className="text-xs text-slate-500">
                            Créé le {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

