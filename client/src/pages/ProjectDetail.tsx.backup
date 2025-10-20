Text file: ProjectDetail.tsx
Latest content with line numbers:
1	import { useAuth } from "@/_core/hooks/useAuth";
2	import { Button } from "@/components/ui/button";
3	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
4	import { Input } from "@/components/ui/input";
5	import { Label } from "@/components/ui/label";
6	import { Textarea } from "@/components/ui/textarea";
7	import { trpc } from "@/lib/trpc";
8	import { useLocation } from "wouter";
9	import { useState } from "react";
10	import { 
11	  ArrowLeft, Download, FileText, Palette, Video, Music2, 
12	  Scroll, Clapperboard, MapPin, Users, Camera, UsersRound,
13	  DollarSign, Calendar, ListChecks, StickyNote, ChevronRight,
14	  CheckCircle2, Circle
15	} from "lucide-react";
16	
17	// Import des tabs
18	import CreativeConceptTab from "@/components/ProjectTabs/CreativeConceptTab";
19	import VideoInspirationsTab from "@/components/ProjectTabs/VideoInspirationsTab";
20	import ScenesTab from "@/components/ProjectTabs/ScenesTab";
21	import LocationsTab from "@/components/ProjectTabs/LocationsTab";
22	import TalentsTab from "@/components/ProjectTabs/TalentsTab";
23	import EquipmentTab from "@/components/ProjectTabs/EquipmentTab";
24	import TimelineTab from "@/components/ProjectTabs/TimelineTab";
25	import TeamTab from "@/components/ProjectTabs/TeamTab";
26	import NotesTab from "@/components/ProjectTabs/NotesTab";
27	import BudgetTab from "@/components/ProjectTabs/BudgetTab";
28	import ShootingScheduleTab from "@/components/ProjectTabs/ShootingScheduleTab";
29	import ChecklistTab from "@/components/ProjectTabs/ChecklistTab";
30	import BriefTab from "@/components/ProjectTabs/BriefTab";
31	import MusicTab from "@/components/ProjectTabs/MusicTab";
32	import ScriptTab from "@/components/ProjectTabs/ScriptTab";
33	import ColorPaletteTab from "@/components/ProjectTabs/ColorPaletteTab";
34	
35	interface ProjectDetailProps {
36	  params: {
37	    id: string;
38	  };
39	}
40	
41	type Section = 'brief' | 'budget' | 'moodboard' | 'videos' | 'colors' | 'music' | 'script' | 'shortlist' | 'locations' | 'talents' | 'equipment' | 'team' | 'shooting' | 'timeline' | 'checklist' | 'status' | 'notes';
42	
43	export default function ProjectDetail({ params }: ProjectDetailProps) {
44	  // Désactiver l'authentification pour usage interne
45	  const user = { id: "demo-user", name: "Utilisateur", email: "demo@preprod.local" };
46	  const [, setLocation] = useLocation();
47	  const [activeSection, setActiveSection] = useState<Section>('brief');
48	  const [isEditing, setIsEditing] = useState(false);
49	  const [editData, setEditData] = useState({
50	    title: "",
51	    clientName: "",
52	    projectObjective: "",
53	    targetAudience: "",
54	    estimatedDuration: "",
55	    diffusionFormat: "",
56	  });
57	
58	  const { data: project, isLoading } = trpc.project.get.useQuery(
59	    { id: params.id },
60	    { enabled: !!params.id }
61	  );
62	
63	  const updateProjectMutation = trpc.project.update.useMutation({
64	    onSuccess: () => {
65	      setIsEditing(false);
66	    },
67	  });
68	
69	  const deleteProjectMutation = trpc.project.delete.useMutation({
70	    onSuccess: () => {
71	      setLocation("/");
72	    },
73	  });
74	
75	  const generatePDFMutation = trpc.pdf.generateProjectPDF.useMutation({
76	    onSuccess: (data) => {
77	      const link = document.createElement("a");
78	      link.href = data.url;
79	      link.download = data.fileName;
80	      link.click();
81	    },
82	  });
83	
84	  const handleEditClick = () => {
85	    if (project) {
86	      setEditData({
87	        title: project.title || "",
88	        clientName: project.clientName || "",
89	        projectObjective: project.projectObjective || "",
90	        targetAudience: project.targetAudience || "",
91	        estimatedDuration: project.estimatedDuration || "",
92	        diffusionFormat: project.diffusionFormat || "",
93	      });
94	      setIsEditing(true);
95	    }
96	  };
97	
98	  const handleSaveEdit = () => {
99	    updateProjectMutation.mutate({
100	      id: params.id,
101	      ...editData,
102	    });
103	  };
104	
105	  const handleDelete = () => {
106	    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
107	      deleteProjectMutation.mutate({ id: params.id });
108	    }
109	  };
110	
111	  if (isLoading) {
112	    return (
113	      <div className="min-h-screen flex items-center justify-center bg-slate-50">
114	        <div className="text-center">
115	          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
116	          <p className="text-slate-600">Chargement du projet...</p>
117	        </div>
118	      </div>
119	    );
120	  }
121	
122	  if (!project) {
123	    return (
124	      <div className="min-h-screen flex items-center justify-center bg-slate-50">
125	        <div className="text-center">
126	          <p className="text-slate-600 mb-4">Projet non trouvé</p>
127	          <Button onClick={() => setLocation("/")}>
128	            <ArrowLeft className="w-4 h-4 mr-2" />
129	            Retour à l'accueil
130	          </Button>
131	        </div>
132	      </div>
133	    );
134	  }
135	
136	  const navigationSections = [
137	    {
138	      title: "INFORMATIONS",
139	      items: [
140	        { id: 'brief' as Section, label: 'Brief & Appel', icon: FileText },
141	        { id: 'budget' as Section, label: 'Budget', icon: DollarSign },
142	      ]
143	    },
144	    {
145	      title: "PRÉ-PRODUCTION",
146	      items: [
147	        { id: 'moodboard' as Section, label: 'Moodboard', icon: Palette },
148	        { id: 'videos' as Section, label: 'Inspirations Vidéo', icon: Video },
149	        { id: 'colors' as Section, label: 'Palette Couleurs', icon: Palette },
150	        { id: 'music' as Section, label: 'Musiques', icon: Music2 },
151	        { id: 'script' as Section, label: 'Script', icon: Scroll },
152	        { id: 'shortlist' as Section, label: 'Shortlist / Scènes', icon: Clapperboard },
153	      ]
154	    },
155	    {
156	      title: "RESSOURCES",
157	      items: [
158	        { id: 'locations' as Section, label: 'Lieux', icon: MapPin },
159	        { id: 'talents' as Section, label: 'Talents', icon: Users },
160	        { id: 'equipment' as Section, label: 'Équipement', icon: Camera },
161	        { id: 'team' as Section, label: 'Équipe', icon: UsersRound },
162	      ]
163	    },
164	    {
165	      title: "TOURNAGE",
166	      items: [
167	        { id: 'shooting' as Section, label: 'Plan de Tournage', icon: Calendar },
168	        { id: 'timeline' as Section, label: 'Timeline', icon: Calendar },
169	        { id: 'checklist' as Section, label: 'Checklist', icon: ListChecks },
170	      ]
171	    },
172	    {
173	      title: "SUIVI",
174	      items: [
175	        { id: 'status' as Section, label: 'Avancée Projet', icon: CheckCircle2 },
176	        { id: 'notes' as Section, label: 'Notes', icon: StickyNote },
177	      ]
178	    }
179	  ];
180	
181	  return (
182	    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
183	      {/* Header */}
184	      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
185	        <div className="max-w-[1800px] mx-auto px-6 py-4">
186	          <div className="flex items-center justify-between">
187	            <div className="flex items-center gap-4">
188	              <Button
189	                variant="ghost"
190	                size="sm"
191	                onClick={() => setLocation("/")}
192	                className="hover:bg-slate-100 -ml-2"
193	              >
194	                <ArrowLeft className="w-4 h-4 mr-2" />
195	                Projets
196	              </Button>
197	              <div className="h-6 w-px bg-slate-300"></div>
198	              <div>
199	                <h1 className="text-xl font-semibold text-slate-900">{project.title}</h1>
200	                {project.clientName && (
201	                  <p className="text-sm text-slate-500">{project.clientName}</p>
202	                )}
203	              </div>
204	            </div>
205	            <div className="flex items-center gap-3">
206	              <Button
207	                variant="outline"
208	                size="sm"
209	                onClick={() => generatePDFMutation.mutate({ projectId: params.id })}
210	                disabled={generatePDFMutation.isPending}
211	                className="border-slate-300 hover:bg-slate-100"
212	              >
213	                <Download className="w-4 h-4 mr-2" />
214	                {generatePDFMutation.isPending ? "Génération..." : "Télécharger PDF"}
215	              </Button>
216	            </div>
217	          </div>
218	        </div>
219	      </div>
220	
221	      {/* Main Layout */}
222	      <div className="max-w-[1800px] mx-auto flex">
223	        {/* Sidebar Navigation - Apple Style */}
224	        <div className="w-64 bg-white/60 backdrop-blur-xl border-r border-slate-200/60 min-h-[calc(100vh-73px)] max-h-[calc(100vh-73px)] sticky top-[73px] p-4 overflow-y-auto">
225	          <div className="space-y-6">
226	            {navigationSections.map((section) => (
227	              <div key={section.title}>
228	                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
229	                  {section.title}
230	                </h3>
231	                <div className="space-y-1">
232	                  {section.items.map((item) => {
233	                    const Icon = item.icon;
234	                    const isActive = activeSection === item.id;
235	                    return (
236	                      <button
237	                        key={item.id}
238	                        onClick={() => setActiveSection(item.id)}
239	                        className={`
240	                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
241	                          transition-all duration-200 group
242	                          ${isActive 
243	                            ? 'bg-blue-600 text-white shadow-sm' 
244	                            : 'text-slate-700 hover:bg-slate-100/80'
245	                          }
246	                        `}
247	                      >
248	                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
249	                        <span className="flex-1 text-left">{item.label}</span>
250	                        {isActive && (
251	                          <ChevronRight className="w-4 h-4 text-white/60" />
252	                        )}
253	                      </button>
254	                    );
255	                  })}
256	                </div>
257	              </div>
258	            ))}
259	          </div>
260	        </div>
261	
262	        {/* Content Area */}
263	        <div className="flex-1 p-8">
264	          <div className="max-w-5xl">
265	            {/* Render content based on active section */}
266	            {activeSection === 'brief' && <BriefTab projectId={params.id} />}
267	            {activeSection === 'budget' && <BudgetTab projectId={params.id} />}
268	            {activeSection === 'moodboard' && <CreativeConceptTab projectId={params.id} />}
269	            {activeSection === 'videos' && <VideoInspirationsTab projectId={params.id} />}
270	            {activeSection === 'colors' && <ColorPaletteTab projectId={params.id} />}
271	            {activeSection === 'music' && <MusicTab projectId={params.id} />}
272	            {activeSection === 'script' && <ScriptTab projectId={params.id} />}
273	            {activeSection === 'shortlist' && <ScenesTab projectId={params.id} />}
274	            {activeSection === 'locations' && <LocationsTab projectId={params.id} />}
275	            {activeSection === 'talents' && <TalentsTab projectId={params.id} />}
276	            {activeSection === 'equipment' && <EquipmentTab projectId={params.id} />}
277	            {activeSection === 'team' && <TeamTab projectId={params.id} />}
278	            {activeSection === 'shooting' && <ShootingScheduleTab projectId={params.id} />}
279	            {activeSection === 'timeline' && <TimelineTab projectId={params.id} />}
280	            {activeSection === 'checklist' && <ChecklistTab projectId={params.id} />}
281	            {activeSection === 'status' && <div>Avancée Projet (À venir)</div>}
282	            {activeSection === 'notes' && <NotesTab projectId={params.id} />}
283	          </div>
284	        </div>
285	      </div>
286	    </div>
287	  );
288	}
289	
290	