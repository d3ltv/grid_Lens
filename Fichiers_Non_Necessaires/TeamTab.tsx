Text file: TeamTab.tsx
Latest content with line numbers:
1	import { Button } from "@/components/ui/button";
2	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
3	import { Input } from "@/components/ui/input";
4	import { Label } from "@/components/ui/label";
5	import { Textarea } from "@/components/ui/textarea";
6	import { trpc } from "@/lib/trpc";
7	import { useState } from "react";
8	import { Plus, Trash2, Edit2 } from "lucide-react";
9	
10	interface TeamTabProps {
11	  projectId: string;
12	}
13	
14	export default function TeamTab({ projectId }: TeamTabProps) {
15	  const [isAdding, setIsAdding] = useState(false);
16	  const [editingId, setEditingId] = useState<string | null>(null);
17	  const [formData, setFormData] = useState({
18	    name: "",
19	    role: "",
20	    email: "",
21	    phone: "",
22	    notes: "",
23	  });
24	
25	  const { data: team = [] } = trpc.teamMember.list.useQuery({ projectId });
26	  const createTeamMemberMutation = trpc.teamMember.create.useMutation({
27	    onSuccess: () => {
28	      setFormData({ name: "", role: "", email: "", phone: "", notes: "" });
29	      setIsAdding(false);
30	    },
31	  });
32	
33	  const updateTeamMemberMutation = trpc.teamMember.update.useMutation({
34	    onSuccess: () => {
35	      setEditingId(null);
36	    },
37	  });
38	
39	  const deleteTeamMemberMutation = trpc.teamMember.delete.useMutation();
40	
41	  const handleAddMember = () => {
42	    if (!formData.name.trim() || !formData.role.trim()) {
43	      alert("Le nom et le rôle sont requis");
44	      return;
45	    }
46	    createTeamMemberMutation.mutate({ projectId, ...formData });
47	  };
48	
49	  const handleUpdateMember = () => {
50	    if (editingId) {
51	      updateTeamMemberMutation.mutate({ id: editingId, ...formData });
52	    }
53	  };
54	
55	  return (
56	    <div className="space-y-6">
57	      {!isAdding && !editingId && (
58	        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
59	          <Plus className="w-4 h-4 mr-2" />
60	          Ajouter un membre
61	        </Button>
62	      )}
63	
64	      {(isAdding || editingId) && (
65	        <Card>
66	          <CardHeader>
67	            <CardTitle>{editingId ? "Modifier le membre" : "Nouveau membre"}</CardTitle>
68	          </CardHeader>
69	          <CardContent>
70	            <div className="space-y-4">
71	              <div>
72	                <Label htmlFor="name">Nom *</Label>
73	                <Input
74	                  id="name"
75	                  placeholder="Ex: Jean Dupont"
76	                  value={formData.name}
77	                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
78	                />
79	              </div>
80	              <div>
81	                <Label htmlFor="role">Rôle *</Label>
82	                <Input
83	                  id="role"
84	                  placeholder="Ex: Directeur de la photographie"
85	                  value={formData.role}
86	                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
87	                />
88	              </div>
89	              <div className="grid grid-cols-2 gap-4">
90	                <div>
91	                  <Label htmlFor="email">Email</Label>
92	                  <Input
93	                    id="email"
94	                    type="email"
95	                    placeholder="jean@example.com"
96	                    value={formData.email}
97	                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
98	                  />
99	                </div>
100	                <div>
101	                  <Label htmlFor="phone">Téléphone</Label>
102	                  <Input
103	                    id="phone"
104	                    placeholder="+33 6 12 34 56 78"
105	                    value={formData.phone}
106	                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
107	                  />
108	                </div>
109	              </div>
110	              <div>
111	                <Label htmlFor="notes">Notes</Label>
112	                <Textarea
113	                  id="notes"
114	                  placeholder="Notes supplémentaires..."
115	                  value={formData.notes}
116	                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
117	                />
118	              </div>
119	              <div className="flex gap-2 justify-end">
120	                <Button
121	                  variant="outline"
122	                  onClick={() => {
123	                    setIsAdding(false);
124	                    setEditingId(null);
125	                  }}
126	                >
127	                  Annuler
128	                </Button>
129	                <Button
130	                  onClick={editingId ? handleUpdateMember : handleAddMember}
131	                  disabled={createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending}
132	                  className="bg-blue-600 hover:bg-blue-700"
133	                >
134	                  {createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending
135	                    ? "Sauvegarde..."
136	                    : editingId
137	                    ? "Mettre à jour"
138	                    : "Ajouter"}
139	                </Button>
140	              </div>
141	            </div>
142	          </CardContent>
143	        </Card>
144	      )}
145	
146	      <div className="space-y-4">
147	        {team.map((member) => (
148	          <Card key={member.id}>
149	            <CardHeader className="pb-3">
150	              <div className="flex items-start justify-between">
151	                <div>
152	                  <CardTitle className="text-lg">{member.name}</CardTitle>
153	                  <CardDescription>{member.role}</CardDescription>
154	                </div>
155	                <div className="flex gap-2">
156	                  <Button
157	                    variant="outline"
158	                    size="sm"
159	                    onClick={() => {
160	                      setFormData({
161	                        name: member.name,
162	                        role: member.role,
163	                        email: member.email || "",
164	                        phone: member.phone || "",
165	                        notes: member.notes || "",
166	                      });
167	                      setEditingId(member.id);
168	                    }}
169	                  >
170	                    <Edit2 className="w-4 h-4" />
171	                  </Button>
172	                  <Button
173	                    variant="destructive"
174	                    size="sm"
175	                    onClick={() => deleteTeamMemberMutation.mutate({ id: member.id })}
176	                  >
177	                    <Trash2 className="w-4 h-4" />
178	                  </Button>
179	                </div>
180	              </div>
181	            </CardHeader>
182	            <CardContent className="space-y-2 text-sm">
183	              {member.email && (
184	                <p><strong>Email:</strong> <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a></p>
185	              )}
186	              {member.phone && (
187	                <p><strong>Téléphone:</strong> <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">{member.phone}</a></p>
188	              )}
189	              {member.notes && (
190	                <p><strong>Notes:</strong> {member.notes}</p>
191	              )}
192	            </CardContent>
193	          </Card>
194	        ))}
195	        {team.length === 0 && !isAdding && (
196	          <p className="text-slate-500 text-sm italic text-center py-8">
197	            Aucun membre pour le moment
198	          </p>
199	        )}
200	      </div>
201	    </div>
202	  );
203	}
204	