import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Plus, Trash2, Edit2, Mail, Phone, Users, User } from "lucide-react";

interface TeamTabProps {
  projectId: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export default function TeamTabImproved({ projectId }: TeamTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    notes: "",
  });

  const { data: team = [] } = trpc.teamMember.list.useQuery({ projectId });
  const createTeamMemberMutation = trpc.teamMember.create.useMutation({
    onSuccess: () => {
      setFormData({ name: "", role: "", email: "", phone: "", notes: "" });
      setIsAdding(false);
    },
  });

  const updateTeamMemberMutation = trpc.teamMember.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
      setFormData({ name: "", role: "", email: "", phone: "", notes: "" });
    },
  });

  const deleteTeamMemberMutation = trpc.teamMember.delete.useMutation();

  // Grouper les membres par rôle
  const groupedTeam = useMemo(() => {
    const groups: Record<string, TeamMember[]> = {};
    team.forEach((member) => {
      const role = member.role || "Autre";
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(member);
    });
    return groups;
  }, [team]);

  const handleAddMember = () => {
    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Le nom et le rôle sont requis");
      return;
    }
    createTeamMemberMutation.mutate({ projectId, ...formData });
  };

  const handleUpdateMember = () => {
    if (editingId) {
      updateTeamMemberMutation.mutate({ id: editingId, ...formData });
    }
  };

  const handleEditClick = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email || "",
      phone: member.phone || "",
      notes: member.notes || "",
    });
    setEditingId(member.id);
  };

  // Générer les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Couleurs pour les avatars
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-green-100 text-green-700",
      "bg-orange-100 text-orange-700",
      "bg-red-100 text-red-700",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Équipe du Projet</h2>
          <p className="text-slate-600 mt-1">
            {team.length} membre{team.length !== 1 ? "s" : ""} dans l'équipe
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ajouter un membre</span>
          </Button>
        )}
      </div>

      {/* Formulaire d'ajout/édition */}
      {(isAdding || editingId) && (
        <Card className="border-blue-200/60 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {editingId ? "Modifier le membre" : "Nouveau membre"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rôle *</Label>
                  <Input
                    id="role"
                    placeholder="Ex: Directeur de la photographie"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes supplémentaires, spécialités, disponibilité, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ name: "", role: "", email: "", phone: "", notes: "" });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingId ? handleUpdateMember : handleAddMember}
                  disabled={
                    createTeamMemberMutation.isPending ||
                    updateTeamMemberMutation.isPending ||
                    !formData.name.trim() ||
                    !formData.role.trim()
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending
                    ? "Sauvegarde..."
                    : editingId
                    ? "Mettre à jour"
                    : "Ajouter"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <div className="space-y-6">
        {team.length === 0 && !isAdding ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-sm italic">
                Aucun membre pour le moment
              </p>
              {!isAdding && !editingId && (
                <Button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter le premier membre
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedTeam).map(([role, members]) => (
            <div key={role} className="space-y-3">
              {/* Role Header */}
              <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  {role}
                </h3>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-white/60 backdrop-blur-sm border-slate-200/60 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Avatar */}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm ${getAvatarColor(
                              member.name
                            )}`}
                          >
                            {getInitials(member.name)}
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-base">{member.name}</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                              {member.role}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(member)}
                            className="hover:bg-blue-100"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTeamMemberMutation.mutate({ id: member.id })}
                            className="hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 flex-1">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </a>
                      )}
                      {member.notes && (
                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {member.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

