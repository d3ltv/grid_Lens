import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Moon, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface TabVisibility {
  [key: string]: boolean;
}

interface AdvancedOptionsMenuProps {
  onTabVisibilityChange?: (visibility: TabVisibility) => void;
  currentVisibility?: TabVisibility;
}

const DEFAULT_VISIBLE_TABS = {
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

const TAB_LABELS = {
  brief: "Brief & Appel",
  budget: "Budget",
  moodboard: "Moodboard",
  videos: "Inspirations Vidéo",
  colors: "Palette Couleurs",
  music: "Musiques",
  script: "Script",
  shortlist: "Shortlist / Scènes",
  locations: "Lieux",
  talents: "Talents",
  equipment: "Équipement",
  team: "Équipe",
  shooting: "Plan de Tournage",
  timeline: "Timeline",
  status: "Avancée Projet",
  notes: "Notes",
};

export default function AdvancedOptionsMenu({
  onTabVisibilityChange,
  currentVisibility = DEFAULT_VISIBLE_TABS,
}: AdvancedOptionsMenuProps) {
  const [visibility, setVisibility] = useState<TabVisibility>(currentVisibility);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { theme, setTheme } = useTheme();

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tabVisibility");
    if (saved) {
      setVisibility(JSON.parse(saved));
    }
    setDarkMode(theme === "dark");
  }, [theme]);

  // Sauvegarder les préférences
  const handleTabVisibilityChange = (tabId: string, visible: boolean) => {
    const newVisibility = { ...visibility, [tabId]: visible };
    setVisibility(newVisibility);
    localStorage.setItem("tabVisibility", JSON.stringify(newVisibility));
    onTabVisibilityChange?.(newVisibility);
  };

  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled);
    setTheme(enabled ? "dark" : "light");
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem("notificationsEnabled", JSON.stringify(enabled));
  };

  // Compter les onglets visibles
  const visibleCount = Object.values(visibility).filter(Boolean).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-slate-100"
          title="Options avancées"
        >
          <Settings className="w-4 h-4" />
          {visibleCount < Object.keys(DEFAULT_VISIBLE_TABS).length && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* Section Affichage */}
        <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Affichage des Onglets
        </DropdownMenuLabel>

        {/* Onglets Essentiels */}
        <div className="px-2 py-1">
          <p className="text-xs font-medium text-slate-600 mb-2 px-2">Essentiels</p>
          {Object.entries(DEFAULT_VISIBLE_TABS)
            .filter(([_, isDefault]) => isDefault === true)
            .map(([tabId, _]) => (
              <DropdownMenuCheckboxItem
                key={tabId}
                checked={visibility[tabId] ?? DEFAULT_VISIBLE_TABS[tabId as keyof typeof DEFAULT_VISIBLE_TABS]}
                onCheckedChange={(checked) => handleTabVisibilityChange(tabId, checked)}
                disabled
                className="text-sm"
              >
                {TAB_LABELS[tabId as keyof typeof TAB_LABELS]}
              </DropdownMenuCheckboxItem>
            ))}
        </div>

        <DropdownMenuSeparator />

        {/* Onglets Avancés */}
        <div className="px-2 py-1">
          <p className="text-xs font-medium text-slate-600 mb-2 px-2">Avancés</p>
          {Object.entries(DEFAULT_VISIBLE_TABS)
            .filter(([_, isDefault]) => isDefault === false)
            .map(([tabId, _]) => (
              <DropdownMenuCheckboxItem
                key={tabId}
                checked={visibility[tabId] ?? false}
                onCheckedChange={(checked) => handleTabVisibilityChange(tabId, checked)}
                className="text-sm"
              >
                {TAB_LABELS[tabId as keyof typeof TAB_LABELS]}
              </DropdownMenuCheckboxItem>
            ))}
        </div>

        <DropdownMenuSeparator />

        {/* Section Apparence */}
        <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Apparence
        </DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={darkMode}
          onCheckedChange={handleDarkModeChange}
          className="text-sm"
        >
          <Moon className="w-4 h-4 mr-2" />
          Mode sombre
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {/* Section Notifications */}
        <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Notifications
        </DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={notifications}
          onCheckedChange={handleNotificationsChange}
          className="text-sm"
        >
          <Bell className="w-4 h-4 mr-2" />
          Rappels de deadline
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {/* Info */}
        <div className="px-3 py-2 text-xs text-slate-500">
          <p>{visibleCount} onglet(s) visible(s)</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

