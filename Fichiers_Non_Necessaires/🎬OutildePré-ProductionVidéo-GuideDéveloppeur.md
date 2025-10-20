Text file: 🎬OutildePré-ProductionVidéo-GuideDéveloppeur.md
Latest content with line numbers:
1	Text file: 🎬 Outil de Pré-Production Vidéo - Guide Développeur.md
2	Latest content with line numbers:
3	1	# 🎬 Outil de Pré-Production Vidéo - Guide Développeur
4	2	
5	3	## 📋 Vue d'Ensemble
6	4	
7	5	Cet outil est une application web full-stack permettant aux vidéastes de créer des documents de pré-production professionnels. L'application génère un PDF complet à envoyer aux clients.
8	6	
9	7	**Contexte métier :** Les vidéastes ont besoin d'un outil pour organiser leurs projets (moodboard, budget, planning, équipe, etc.) et générer un document professionnel pour le client.
10	8	
11	9	---
12	10	
13	11	## 🏗️ Architecture Technique
14	12	
15	13	### Stack Technologique
16	14	
17	15	**Frontend :**
18	16	- React 18 avec TypeScript
19	17	- Vite (build tool)
20	18	- TailwindCSS (styling)
21	19	- shadcn/ui (composants UI)
22	20	- tRPC (communication type-safe avec le backend)
23	21	- Wouter (routing)
24	22	
25	23	**Backend :**
26	24	- Node.js avec Express
27	25	- TypeScript
28	26	- tRPC (API type-safe)
29	27	- Drizzle ORM (base de données)
30	28	- Puppeteer (génération PDF)
31	29	
32	30	**Base de données :**
33	31	- MySQL (TiDB Cloud en production)
34	32	- 25+ tables pour gérer tous les aspects d'un projet
35	33	
36	34	**Déploiement actuel :**
37	35	- Serveur : https://5000-i5eltoobolgbqfbrh6ndj-c99a09c2.manus.computer
38	36	- Base de données : TiDB Cloud (gateway02.us-east-1.prod.aws.tidbcloud.com)
39	37	
40	38	---
41	39	
42	40	## 📁 Structure du Projet
43	41	
44	42	```
45	43	preprod-tool/
46	44	├── client/                    # Frontend React
47	45	│   ├── src/
48	46	│   │   ├── components/        # Composants réutilisables
49	47	│   │   │   ├── ui/           # Composants shadcn/ui
50	48	│   │   │   └── ProjectTabs/  # Onglets du projet (17 modules)
51	49	│   │   ├── pages/            # Pages principales
52	50	│   │   │   ├── Home.tsx      # Liste des projets
53	51	│   │   │   └── ProjectDetail.tsx  # Détail d'un projet (navigation Apple-like)
54	52	│   │   ├── lib/              # Utilitaires
55	53	│   │   │   └── trpc.ts       # Client tRPC
56	54	│   │   └── main.tsx          # Point d'entrée
57	55	│   └── index.html
58	56	├── server/                    # Backend Node.js
59	57	│   ├── _core/                # Configuration serveur
60	58	│   │   ├── index.ts          # Serveur Express
61	59	│   │   ├── context.ts        # Context tRPC (auth désactivée)
62	60	│   │   └── vite.ts           # Intégration Vite
63	61	│   ├── routers.ts            # Routes tRPC (API)
64	62	│   ├── db.ts                 # Fonctions base de données
65	63	│   ├── pdfGeneratorNew.ts    # Génération PDF avec Puppeteer
66	64	│   └── index.ts              # Point d'entrée
67	65	├── drizzle/                   # Migrations base de données
68	66	│   └── schema.ts             # Schéma complet (25+ tables)
69	67	├── package.json
70	68	├── drizzle.config.ts
71	69	└── .env                      # Variables d'environnement
72	70	```
73	71	
74	72	---
75	73	
76	74	## 🗄️ Schéma de Base de Données
77	75	
78	76	### Tables Principales
79	77	
80	78	**Projet :**
81	79	- `projects` - Informations générales du projet
82	80	
83	81	**Pré-production :**
84	82	- `clientBriefs` - Brief client
85	83	- `callNotes` - Notes d'appels
86	84	- `moodboardImages` - Images du moodboard
87	85	- `videoInspirations` - Liens vidéo YouTube/Vimeo
88	86	- `colorPalettes` - Palette de couleurs (3-5 couleurs)
89	87	- `musicReferences` - Références musicales
90	88	- `scripts` - Script/Brainstorming
91	89	- `scenes` - Scènes/Storyboard avec images
92	90	- `sceneImages` - Images des scènes
93	91	
94	92	**Ressources :**
95	93	- `locations` - Lieux de tournage avec images
96	94	- `locationImages` - Images des lieux
97	95	- `talents` - Casting/Talents avec images
98	96	- `talentImages` - Images des talents
99	97	- `equipment` - Matériel
100	98	- `teamMembers` - Équipe technique
101	99	
102	100	**Tournage :**
103	101	- `shootingDays` - Jours de tournage
104	102	- `shootingDayScenes` - Relation jours ↔ scènes
105	103	- `timeline` - Timeline du projet
106	104	- `checklist` - Checklist matériel
107	105	
108	106	**Gestion :**
109	107	- `budget` - Postes budgétaires
110	108	- `projectNotes` - Notes additionnelles
111	109	- `projectStatus` - Avancée du projet
112	110	
113	111	---
114	112	
115	113	## 🎨 Interface Utilisateur
116	114	
117	115	### Navigation Apple-like
118	116	
119	117	L'interface utilise une **sidebar fixe** avec 5 sections :
120	118	
121	119	1. **INFORMATIONS** - Brief & Appel, Budget
122	120	2. **PRÉ-PRODUCTION** - Moodboard, Vidéos, Couleurs, Musique, Script, Shortlist
123	121	3. **RESSOURCES** - Lieux, Talents, Équipement, Équipe
124	122	4. **TOURNAGE** - Plan, Timeline, Checklist
125	123	5. **SUIVI** - Avancée, Notes
126	124	
127	125	**Design :**
128	126	- Sidebar avec backdrop blur (effet verre dépoli)
129	127	- Boutons avec états visuels clairs (actif = bleu)
130	128	- Icônes colorées pour chaque section
131	129	- Transitions smooth
132	130	- Responsive (mobile-first)
133	131	
134	132	---
135	133	
136	134	## 🚀 Installation & Démarrage
137	135	
138	136	### Prérequis
139	137	
140	138	- Node.js 22+
141	139	- pnpm (package manager)
142	140	- Accès à une base MySQL/TiDB
143	141	
144	142	### Installation
145	143	
146	144	```bash
147	145	# Cloner le projet
148	146	cd preprod-tool
149	147	
150	148	# Installer les dépendances
151	149	pnpm install
152	150	
153	151	# Configurer les variables d'environnement
154	152	cp .env.example .env
155	153	# Éditer .env avec vos credentials
156	154	```
157	155	
158	156	### Configuration .env
159	157	
160	158	```env
161	159	# Base de données TiDB Cloud
162	160	DATABASE_URL="mysql://roE8AzJV39tMZ8B.root:VOTRE_MOT_DE_PASSE@gateway02.us-east-1.prod.aws.tidbcloud.com:4000/preprod_db?ssl={"rejectUnauthorized":true}"
163	161	
164	162	# OAuth (désactivé pour usage interne)
165	163	OAUTH_CLIENT_ID="demo"
166	164	OAUTH_CLIENT_SECRET="demo"
167	165	OAUTH_REDIRECT_URI="http://localhost:5000/api/oauth/callback"
168	166	```
169	167	
170	168	### Démarrage
171	169	
172	170	```bash
173	171	# Pousser le schéma vers la base de données
174	172	pnpm db:push
175	173	
176	174	# Mode développement
177	175	pnpm dev
178	176	
179	177	# Build production
180	178	pnpm build
181	179	
182	180	# Démarrer en production
183	181	pnpm start
184	182	```
185	183	
186	184	L'application sera accessible sur `http://localhost:5000`
187	185	
188	186	---
189	187	
190	188	## 🔧 Comment Ajouter une Nouvelle Fonctionnalité
191	189	
192	190	### Exemple : Ajouter un nouveau module "Storyboard Détaillé"
193	191	
194	192	#### 1. Créer la table dans `drizzle/schema.ts`
195	193	
196	194	```typescript
197	195	export const detailedStoryboard = mysqlTable("detailedStoryboard", {
198	196	  id: varchar("id", { length: 255 }).primaryKey(),
199	197	  projectId: varchar("projectId", { length: 255 }).notNull(),
200	198	  sceneNumber: int("sceneNumber"),
201	199	  shotNumber: int("shotNumber"),
202	200	  description: text("description"),
203	201	  cameraAngle: varchar("cameraAngle", { length: 100 }),
204	202	  movement: varchar("movement", { length: 100 }),
205	203	  duration: varchar("duration", { length: 50 }),
206	204	  notes: text("notes"),
207	205	  createdAt: timestamp("createdAt").defaultNow(),
208	206	});
209	207	```
210	208	
211	209	#### 2. Ajouter les fonctions CRUD dans `server/db.ts`
212	210	
213	211	```typescript
214	212	// Import
215	213	import { detailedStoryboard } from "../drizzle/schema";
216	214	
217	215	// Fonctions
218	216	export async function getDetailedStoryboard(projectId: string) {
219	217	  return await db.select().from(detailedStoryboard)
220	218	    .where(eq(detailedStoryboard.projectId, projectId));
221	219	}
222	220	
223	221	export async function createDetailedStoryboardItem(data: any) {
224	222	  const id = crypto.randomUUID();
225	223	  await db.insert(detailedStoryboard).values({ id, ...data });
226	224	  return { id, ...data };
227	225	}
228	226	
229	227	export async function deleteDetailedStoryboardItem(id: string) {
230	228	  await db.delete(detailedStoryboard).where(eq(detailedStoryboard.id, id));
231	229	}
232	230	```
233	231	
234	232	#### 3. Créer les routes tRPC dans `server/routers.ts`
235	233	
236	234	```typescript
237	235	detailedStoryboard: {
238	236	  list: publicProcedure
239	237	    .input(z.object({ projectId: z.string() }))
240	238	    .query(async ({ input }) => {
241	239	      return await getDetailedStoryboard(input.projectId);
242	240	    }),
243	241	  create: publicProcedure
244	242	    .input(z.object({
245	243	      projectId: z.string(),
246	244	      sceneNumber: z.number().optional(),
247	245	      shotNumber: z.number().optional(),
248	246	      description: z.string().optional(),
249	247	      // ... autres champs
250	248	    }))
251	249	    .mutation(async ({ input }) => {
252	250	      return await createDetailedStoryboardItem(input);
253	251	    }),
254	252	  delete: publicProcedure
255	253	    .input(z.object({ id: z.string() }))
256	254	    .mutation(async ({ input }) => {
257	255	      await deleteDetailedStoryboardItem(input.id);
258	256	    }),
259	257	},
260	258	```
261	259	
262	260	#### 4. Créer le composant React dans `client/src/components/ProjectTabs/`
263	261	
264	262	```typescript
265	263	// DetailedStoryboardTab.tsx
266	264	import { useState } from "react";
267	265	import { trpc } from "@/lib/trpc";
268	266	import { Button } from "@/components/ui/button";
269	267	// ... imports
270	268	
271	269	export default function DetailedStoryboardTab({ projectId }: { projectId: string }) {
272	270	  const { data: items = [] } = trpc.detailedStoryboard.list.useQuery({ projectId });
273	271	  const createMutation = trpc.detailedStoryboard.create.useMutation();
274	272	  
275	273	  // ... logique du composant
276	274	  
277	275	  return (
278	276	    <div className="space-y-6">
279	277	      {/* UI ici */}
280	278	    </div>
281	279	  );
282	280	}
283	281	```
284	282	
285	283	#### 5. Ajouter l'onglet dans `client/src/pages/ProjectDetail.tsx`
286	284	
287	285	```typescript
288	286	// Import
289	287	import DetailedStoryboardTab from "@/components/ProjectTabs/DetailedStoryboardTab";
290	288	
291	289	// Dans la sidebar
292	290	<button
293	291	  onClick={() => setActiveSection('detailed-storyboard')}
294	292	  className={/* ... */}
295	293	>
296	294	  <Film className="w-5 h-5" />
297	295	  <span>Storyboard Détaillé</span>
298	296	</button>
299	297	
300	298	// Dans le contenu
301	299	{activeSection === 'detailed-storyboard' && <DetailedStoryboardTab projectId={params.id} />}
302	300	```
303	301	
304	302	#### 6. Pousser les changements
305	303	
306	304	```bash
307	305	pnpm db:push  # Créer la table
308	306	pnpm build    # Rebuild
309	307	pnpm start    # Redémarrer
310	308	```
311	309	
312	310	---
313	311	
314	312	## 📝 Conventions de Code
315	313	
316	314	### Naming
317	315	
318	316	- **Composants React** : PascalCase (`BriefTab.tsx`)
319	317	- **Fonctions** : camelCase (`getDetailedStoryboard`)
320	318	- **Tables DB** : camelCase (`detailedStoryboard`)
321	319	- **Routes tRPC** : camelCase (`detailedStoryboard.list`)
322	320	
323	321	### Structure des Composants
324	322	
325	323	```typescript
326	324	// 1. Imports
327	325	import { useState } from "react";
328	326	import { trpc } from "@/lib/trpc";
329	327	
330	328	// 2. Interface Props
331	329	interface MyTabProps {
332	330	  projectId: string;
333	331	}
334	332	
335	333	// 3. Composant
336	334	export default function MyTab({ projectId }: MyTabProps) {
337	335	  // 3.1 States
338	336	  const [isAdding, setIsAdding] = useState(false);
339	337	  
340	(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)