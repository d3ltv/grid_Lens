Text file: LocationsTab.tsx
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
10	interface LocationsTabProps {
11	  projectId: string;
12	}
13	
14	export default function LocationsTab({ projectId }: LocationsTabProps) {
15	  const [isAdding, setIsAdding] = useState(false);
16	  const [editingId, setEditingId] = useState<string | null>(null);
17	  const [formData, setFormData] = useState({
18	    name: "",
19	    address: "",
20	    description: "",
21	    notes: "",
22	  });
23	
24	  const { data: locations = [] } = trpc.location.list.useQuery({ projectId });
25	  const createLocationMutation = trpc.location.create.useMutation({
26	    onSuccess: () => {
27	      setFormData({ name: "", address: "", description: "", notes: "" });
28	      setIsAdding(false);
29	    },
30	  });
31	
32	  const updateLocationMutation = trpc.location.update.useMutation({
33	    onSuccess: () => {
34	      setEditingId(null);
35	    },
36	  });
37	
38	  const deleteLocationMutation = trpc.location.delete.useMutation();
39	
40	  const handleAddLocation = () => {
41	    if (!formData.name.trim()) {
42	      alert("Le nom du lieu est requis");
43	      return;
44	    }
45	    createLocationMutation.mutate({ projectId, ...formData });
46	  };
47	
48	  const handleUpdateLocation = () => {
49	    if (editingId) {
50	      updateLocationMutation.mutate({ id: editingId, ...formData });
51	    }
52	  };
53	
54	  return (
55	    <div className="space-y-6">
56	      {!isAdding && !editingId && (
57	        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
58	          <Plus className="w-4 h-4 mr-2" />
59	          Ajouter un lieu
60	        </Button>
61	      )}
62	
63	      {(isAdding || editingId) && (
64	        <Card>
65	          <CardHeader>
66	            <CardTitle>{editingId ? "Modifier le lieu" : "Nouveau lieu"}</CardTitle>
67	          </CardHeader>
68	          <CardContent>
69	            <div className="space-y-4">
70	              <div>
71	                <Label htmlFor="name">Nom du lieu *</Label>
72	                <Input
73	                  id="name"
74	                  placeholder="Ex: Studio de cinéma"
75	                  value={formData.name}
76	                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
77	                />
78	              </div>
79	              <div>
80	                <Label htmlFor="address">Adresse</Label>
81	                <Textarea
82	                  id="address"
83	                  placeholder="Adresse complète du lieu..."
84	                  value={formData.address}
85	                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
86	                />
87	              </div>
88	              <div>
89	                <Label htmlFor="description">Description</Label>
90	                <Textarea
91	                  id="description"
92	                  placeholder="Décrivez le lieu, son ambiance, ses caractéristiques..."
93	                  value={formData.description}
94	                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
95	                />
96	              </div>
97	              <div>
98	                <Label htmlFor="notes">Notes</Label>
99	                <Textarea
100	                  id="notes"
101	                  placeholder="Notes supplémentaires (accès, parking, permis, etc.)"
102	                  value={formData.notes}
103	                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
104	                />
105	              </div>
106	              <div className="flex gap-2 justify-end">
107	                <Button
108	                  variant="outline"
109	                  onClick={() => {
110	                    setIsAdding(false);
111	                    setEditingId(null);
112	                  }}
113	                >
114	                  Annuler
115	                </Button>
116	                <Button
117	                  onClick={editingId ? handleUpdateLocation : handleAddLocation}
118	                  disabled={createLocationMutation.isPending || updateLocationMutation.isPending}
119	                  className="bg-blue-600 hover:bg-blue-700"
120	                >
121	                  {createLocationMutation.isPending || updateLocationMutation.isPending
122	                    ? "Sauvegarde..."
123	                    : editingId
124	                    ? "Mettre à jour"
125	                    : "Ajouter"}
126	                </Button>
127	              </div>
128	            </div>
129	          </CardContent>
130	        </Card>
131	      )}
132	
133	      <div className="space-y-4">
134	        {locations.map((location) => (
135	          <Card key={location.id}>
136	            <CardHeader className="pb-3">
137	              <div className="flex items-start justify-between">
138	                <div>
139	                  <CardTitle className="text-lg">{location.name}</CardTitle>
140	                  {location.address && (
141	                    <CardDescription className="mt-1">{location.address}</CardDescription>
142	                  )}
143	                </div>
144	                <div className="flex gap-2">
145	                  <Button
146	                    variant="outline"
147	                    size="sm"
148	                    onClick={() => {
149	                      setFormData({
150	                        name: location.name,
151	                        address: location.address || "",
152	                        description: location.description || "",
153	                        notes: location.notes || "",
154	                      });
155	                      setEditingId(location.id);
156	                    }}
157	                  >
158	                    <Edit2 className="w-4 h-4" />
159	                  </Button>
160	                  <Button
161	                    variant="destructive"
162	                    size="sm"
163	                    onClick={() => deleteLocationMutation.mutate({ id: location.id })}
164	                  >
165	                    <Trash2 className="w-4 h-4" />
166	                  </Button>
167	                </div>
168	              </div>
169	            </CardHeader>
170	            <CardContent className="space-y-3 text-sm">
171	              {location.description && (
172	                <div>
173	                  <strong className="text-slate-900">Description:</strong>
174	                  <p className="text-slate-600 mt-1">{location.description}</p>
175	                </div>
176	              )}
177	              {location.notes && (
178	                <div>
179	                  <strong className="text-slate-900">Notes:</strong>
180	                  <p className="text-slate-600 mt-1">{location.notes}</p>
181	                </div>
182	              )}
183	            </CardContent>
184	          </Card>
185	        ))}
186	        {locations.length === 0 && !isAdding && (
187	          <p className="text-slate-500 text-sm italic text-center py-8">
188	            Aucun lieu pour le moment
189	          </p>
190	        )}
191	      </div>
192	    </div>
193	  );
194	}
195	
196	