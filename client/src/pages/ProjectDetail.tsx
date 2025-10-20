import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLocalProjects } from "../hooks/useLocalProjects";
import { 
  ArrowLeft, Download, FileText, Palette, Video, Music2, 
  Scroll, Clapperboard, MapPin, Users, Camera, UsersRound,
  DollarSign, Calendar, ListChecks, StickyNote, ChevronRight,
  CheckCircle2, Circle, BarChart3
} from "lucide-react";

// Import des tabs
import CreativeConceptTab from "@/components/ProjectTabs/CreativeConceptTab";
import VideoInspirationsTab from "@/components/ProjectTabs/VideoInspirationsTab";
import ScenesTab from "@/components/ProjectTabs/ScenesTab";
import LocationsTab from "@/components/ProjectTabs/LocationsTab";
import TalentsTab from "@/components/ProjectTabs/TalentsTab";
import EquipmentTab from "@/components/ProjectTabs/EquipmentTab";
import TimelineTab from "@/components/ProjectTabs/TimelineTab";
import TeamTab from "@/components/ProjectTabs/TeamTab";
import NotesTab from "@/components/ProjectTabs/NotesTab";
import BudgetTab from "@/components/ProjectTabs/BudgetTab";
import ShootingScheduleTab from "@/components/ProjectTabs/ShootingScheduleTab";
import ChecklistTab from "@/components/ProjectTabs/ChecklistTab";
import BriefTab from "@/components/ProjectTabs/BriefTab";
import MusicTab from "@/components/ProjectTabs/MusicTab";
import ScriptTab from "@/components/ProjectTabs/ScriptTab";
import ColorPaletteTab from "@/components/ProjectTabs/ColorPaletteTab";

// Import des nouveaux composants
import AdvancedOptionsMenu from "@/components/Navigation/AdvancedOptionsMenu";
import ProjectDashboard from "@/components/Dashboard/ProjectDashboard";

interface ProjectDetailProps {
  params: {
    id: string;
  };
}

type Section = 'overview' | 'brief' | 'budget' | 'moodboard' | 'videos' | 'colors' | 'music' | 'script' | 'shortlist' | 'locations' | 'talents' | 'equipment' | 'team' | 'shooting' | 'timeline' | 'checklist' | 'status' | 'notes';

// Configuration des onglets visibles par défaut
const DEFAULT_TAB_VISIBILITY = {
  overview: true,
  brief: true,
  shortlist: true,
  locations: true,
  team: true,
  checklist: true,
  // Onglets avancés (masqués par défaut)
  budget: false,
  moodboard: false,
  videos: false,
  colors: false,
  music: false,
  script: false,
  talents: false,
  equipment: false,
  shooting: false,
  timeline: false,
  status: false,
  notes: false,
};

export default function ProjectDetail({ params }: ProjectDetailProps) {
  // Désactiver l'authentification pour usage interne
  const user = { id: "demo-user", name: "Utilisateur", email: "demo@preprod.local" };
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [tabVisibility, setTabVisibility] = useState<Record<string, boolean>>(DEFAULT_TAB_VISIBILITY);
  const [editData, setEditData] = useState({
    title: "",
    clientName: "",
    projectObjective: "",
    targetAudience: "",
    estimatedDuration: "",
    diffusionFormat: "",
  });

  // Charger les préférences de visibilité des onglets
  useEffect(() => {
    const saved = localStorage.getItem("tabVisibility");
    if (saved) {
      setTabVisibility(JSON.parse(saved));
    }
  }, []);

  const { getProject, updateProject, deleteProject, loading: projectsLoading } = useLocalProjects();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le projet
  useEffect(() => {
    const loadProject = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        const projectData = await getProject(params.id);
        setProject(projectData);
      } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [params.id, getProject]);

  const handleUpdateProject = async (data: any) => {
    if (!project) return;
    
    try {
      await updateProject(project.id, data);
      setIsEditing(false);
      // Recharger le projet
      const updatedProject = await getProject(project.id);
      setProject(updatedProject);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    
    try {
      await deleteProject(project.id);
      setLocation("/");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleGeneratePDF = () => {
    // Pour l'instant, on génère un simple export JSON
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project?.title || 'projet'}_export.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleEditClick = () => {
    if (project) {
      setEditData({
        title: project.title || "",
        clientName: project.clientName || "",
        projectObjective: project.projectObjective || "",
        targetAudience: project.targetAudience || "",
        estimatedDuration: project.estimatedDuration || "",
        diffusionFormat: project.diffusionFormat || "",
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    handleUpdateProject(editData);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
      handleDeleteProject();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Projet non trouvé</p>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const navigationSections = [
    {
      title: "APERÇU",
      items: [
        { id: 'overview' as Section, label: 'Aperçu', icon: BarChart3 },
      ]
    },
    {
      title: "INFORMATIONS",
      items: [
        { id: 'brief' as Section, label: 'Brief & Appel', icon: FileText },
        ...(tabVisibility.budget !== false ? [{ id: 'budget' as Section, label: 'Budget', icon: DollarSign }] : []),
      ]
    },
    {
      title: "PRÉ-PRODUCTION",
      items: [
        ...(tabVisibility.moodboard !== false ? [{ id: 'moodboard' as Section, label: 'Moodboard', icon: Palette }] : []),
        ...(tabVisibility.videos !== false ? [{ id: 'videos' as Section, label: 'Inspirations Vidéo', icon: Video }] : []),
        ...(tabVisibility.colors !== false ? [{ id: 'colors' as Section, label: 'Palette Couleurs', icon: Palette }] : []),
        ...(tabVisibility.music !== false ? [{ id: 'music' as Section, label: 'Musiques', icon: Music2 }] : []),
        ...(tabVisibility.script !== false ? [{ id: 'script' as Section, label: 'Script', icon: Scroll }] : []),
        { id: 'shortlist' as Section, label: 'Shortlist / Scènes', icon: Clapperboard },
      ]
    },
    {
      title: "RESSOURCES",
      items: [
        { id: 'locations' as Section, label: 'Lieux', icon: MapPin },
        ...(tabVisibility.talents !== false ? [{ id: 'talents' as Section, label: 'Talents', icon: Users }] : []),
        ...(tabVisibility.equipment !== false ? [{ id: 'equipment' as Section, label: 'Équipement', icon: Camera }] : []),
        { id: 'team' as Section, label: 'Équipe', icon: UsersRound },
      ]
    },
    {
      title: "TOURNAGE",
      items: [
        ...(tabVisibility.shooting !== false ? [{ id: 'shooting' as Section, label: 'Plan de Tournage', icon: Calendar }] : []),
        ...(tabVisibility.timeline !== false ? [{ id: 'timeline' as Section, label: 'Timeline', icon: Calendar }] : []),
        { id: 'checklist' as Section, label: 'Checklist', icon: ListChecks },
      ]
    },
    {
      title: "SUIVI",
      items: [
        ...(tabVisibility.status !== false ? [{ id: 'status' as Section, label: 'Avancée Projet', icon: CheckCircle2 }] : []),
        ...(tabVisibility.notes !== false ? [{ id: 'notes' as Section, label: 'Notes', icon: StickyNote }] : []),
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="hover:bg-slate-100 -ml-2 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Projets</span>
              </Button>
              <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">{project.title}</h1>
                {project.clientName && (
                  <p className="text-xs sm:text-sm text-slate-500 truncate">{project.clientName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <AdvancedOptionsMenu 
                currentVisibility={tabVisibility}
                onTabVisibilityChange={setTabVisibility}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePDF}
                disabled={projectsLoading}
                className="border-slate-300 hover:bg-slate-100 hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                {projectsLoading ? "..." : "Export"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row">
        {/* Sidebar Navigation - Apple Style - Hidden on mobile, visible on lg */}
        <div className="hidden lg:block w-64 bg-white/60 backdrop-blur-xl border-r border-slate-200/60 min-h-[calc(100vh-73px)] max-h-[calc(100vh-73px)] sticky top-[73px] p-4 overflow-y-auto">
          <div className="space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                          transition-all duration-200 group
                          ${isActive 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-700 hover:bg-slate-100/80'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-white/60" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden border-b border-slate-200/60 bg-white/60 backdrop-blur-xl sticky top-[73px] z-40 overflow-x-auto">
          <div className="flex gap-2 px-4 py-2 min-w-min">
            {navigationSections.flatMap(section => section.items).slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-700 hover:bg-slate-100/80'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Render content based on active section */}
            {activeSection === 'overview' && (
              <ProjectDashboard 
                projectId={params.id}
                projectTitle={project.title}
                clientName={project.clientName}
                progress={project.progress}
                budget={project.budget}
                team={project.team}
                status={project.status}
              />
            )}
            {activeSection === 'brief' && <BriefTab projectId={params.id} />}
            {activeSection === 'budget' && <BudgetTab projectId={params.id} />}
            {activeSection === 'moodboard' && <CreativeConceptTab projectId={params.id} />}
            {activeSection === 'videos' && <VideoInspirationsTab projectId={params.id} />}
            {activeSection === 'colors' && <ColorPaletteTab projectId={params.id} />}
            {activeSection === 'music' && <MusicTab projectId={params.id} />}
            {activeSection === 'script' && <ScriptTab projectId={params.id} />}
            {activeSection === 'shortlist' && <ScenesTab projectId={params.id} />}
            {activeSection === 'locations' && <LocationsTab projectId={params.id} />}
            {activeSection === 'talents' && <TalentsTab projectId={params.id} />}
            {activeSection === 'equipment' && <EquipmentTab projectId={params.id} />}
            {activeSection === 'team' && <TeamTab projectId={params.id} />}
            {activeSection === 'shooting' && <ShootingScheduleTab projectId={params.id} />}
            {activeSection === 'timeline' && <TimelineTab projectId={params.id} />}
            {activeSection === 'checklist' && <ChecklistTab projectId={params.id} />}
            {activeSection === 'status' && <div>Avancée Projet (À venir)</div>}
            {activeSection === 'notes' && <NotesTab projectId={params.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}

