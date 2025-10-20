Text file: 🗺️Roadmap-OutildePré-ProductionVidéo.md
Latest content with line numbers:
1	Text file: 🗺️ Roadmap - Outil de Pré-Production Vidéo.md
2	Latest content with line numbers:
3	1	# 🗺️ Roadmap - Outil de Pré-Production Vidéo
4	2	
5	3	## ✅ Fonctionnalités Implémentées (V1 - Actuelle)
6	4	
7	5	### 🏗️ Infrastructure
8	6	- [x] Architecture full-stack (React + Node.js + TypeScript)
9	7	- [x] Base de données MySQL/TiDB Cloud
10	8	- [x] API tRPC type-safe
11	9	- [x] Système de routing (Wouter)
12	10	- [x] Build system (Vite)
13	11	- [x] ORM (Drizzle)
14	12	
15	13	### 🎨 Interface Utilisateur
16	14	- [x] Navigation Apple-like avec sidebar fixe
17	15	- [x] 5 sections organisées logiquement
18	16	- [x] 17 onglets/modules
19	17	- [x] Design responsive (mobile, tablette, desktop)
20	18	- [x] Composants UI shadcn/ui
21	19	- [x] États visuels clairs (actif/inactif)
22	20	- [x] Transitions smooth
23	21	
24	22	### 📋 Modules Fonctionnels
25	23	
26	24	**INFORMATIONS**
27	25	- [x] Brief Client & Notes d'Appel
28	26	  - Zone de texte pour coller le brief
29	27	  - Liste de notes d'appels avec dates
30	28	- [x] Budget
31	29	  - Postes budgétaires avec catégories
32	30	  - Calcul automatique du total
33	31	  - Quantité, coût unitaire, coût total
34	32	
35	33	**PRÉ-PRODUCTION**
36	34	- [x] Moodboard
37	35	  - Grille d'images éditable
38	36	  - Ajout/suppression d'images
39	37	  - Responsive (2/3/4 colonnes)
40	38	- [x] Palette de Couleurs
41	39	  - Sélecteur de couleurs (color picker)
42	40	  - 3-5 couleurs recommandées
43	41	  - Affichage en grille avec hex codes
44	42	- [x] Musiques & Références Audio
45	43	  - Titre, artiste, lien (YouTube/Spotify)
46	44	  - Description/notes
47	45	  - Icône musique
48	46	- [x] Script & Brainstorming
49	47	  - Grande zone de texte
50	48	  - Compteur de mots et caractères
51	49	  - Conseils d'écriture
52	50	- [x] Shortlist / Scènes
53	51	  - Liste de scènes avec numéros
54	52	  - Description, durée, notes
55	53	  - Images multiples par scène
56	54	
57	55	**RESSOURCES**
58	56	- [x] Lieux
59	57	  - Nom, adresse, type
60	58	  - Images multiples
61	59	  - Notes
62	60	- [x] Talents / Casting
63	61	  - Nom, rôle, contact
64	62	  - Images multiples
65	63	  - Notes
66	64	- [x] Équipement
67	65	  - Nom, catégorie, quantité
68	66	  - Propriétaire (interne/location)
69	67	  - Notes
70	68	- [x] Équipe Technique
71	69	  - Nom, rôle, contact
72	70	  - Disponibilité
73	71	  - Notes
74	72	
75	73	**TOURNAGE**
76	74	- [x] Plan de Tournage
77	75	  - Jours de tournage
78	76	  - Date, horaires, lieu
79	77	  - Scènes associées
80	78	- [x] Timeline
81	79	  - Étapes du projet
82	80	  - Dates de début/fin
83	81	  - Description
84	82	- [x] Checklist Matériel
85	83	  - Liste de tâches
86	84	  - Statut (à faire/en cours/fait)
87	85	  - Priorité
88	86	  - Progression visuelle
89	87	
90	88	**SUIVI**
91	89	- [x] Notes Additionnelles
92	90	  - Zone de texte libre
93	91	  - Notes générales
94	92	
95	93	### 📄 Génération PDF
96	94	- [x] PDF professionnel avec Puppeteer
97	95	- [x] Page de couverture
98	96	- [x] Table des matières
99	97	- [x] Toutes les sections incluses
100	98	- [x] Images intégrées
101	99	- [x] Design moderne et lisible
102	100	
103	101	---
104	102	
105	103	## 🚧 Fonctionnalités à Implémenter (V2)
106	104	
107	105	### 🔴 Priorité 1 - Essentiel
108	106	
109	107	#### 1. Inspirations Vidéo (Module manquant)
110	108	**Objectif :** Permettre d'ajouter des liens vidéo YouTube/Vimeo comme références
111	109	
112	110	**Spécifications :**
113	111	- Table `videoInspirations` existe déjà dans le schéma
114	112	- Créer les routes tRPC (list, create, delete)
115	113	- Créer le composant `VideoInspirationsTab.tsx`
116	114	- Champs :
117	115	  - Titre de la vidéo
118	116	  - URL (YouTube/Vimeo)
119	117	  - Timestamp (optionnel, ex: "2:34")
120	118	  - Description/notes (pourquoi cette référence)
121	119	- Affichage :
122	120	  - Embed YouTube/Vimeo si possible
123	121	  - Sinon lien externe avec icône
124	122	  - Thumbnail de la vidéo
125	123	
126	124	**Fichiers à modifier :**
127	125	- `server/db.ts` - Ajouter fonctions CRUD
128	126	- `server/routers.ts` - Ajouter routes tRPC
129	127	- `client/src/components/ProjectTabs/VideoInspirationsTab.tsx` - Créer composant
130	128	- `client/src/pages/ProjectDetail.tsx` - Ajouter dans la navigation
131	129	
132	130	**Estimation :** 2-3 heures
133	131	
134	132	---
135	133	
136	134	#### 2. Shortlist Améliorée (Amélioration)
137	135	**Objectif :** Ajouter des champs manquants identifiés dans la transcription Milanote
138	136	
139	137	**Spécifications :**
140	138	- Modifier la table `scenes` pour ajouter :
141	139	  - `rig` : varchar (Trépied / Main / Gimbal / Drone / Slider)
142	140	  - `cameraMovement` : varchar (Fixe / Panoramique / Travelling / Zoom / etc.)
143	141	  - `lens` : varchar (Grand angle / 50mm / Téléobjectif / etc.)
144	142	  - `lighting` : text (Description de l'éclairage)
145	143	- Modifier `ScenesTab.tsx` pour ajouter ces champs
146	144	- Ajouter des selects pour Rig et Mouvement (valeurs prédéfinies)
147	145	
148	146	**Fichiers à modifier :**
149	147	- `drizzle/schema.ts` - Modifier table `scenes`
150	148	- `server/db.ts` - Mettre à jour fonctions
151	149	- `client/src/components/ProjectTabs/ScenesTab.tsx` - Ajouter champs
152	150	
153	151	**Estimation :** 2 heures
154	152	
155	153	---
156	154	
157	155	#### 3. Checklist Matériel Améliorée (Amélioration)
158	156	**Objectif :** Transformer en vraies checkboxes avec catégories
159	157	
160	158	**Spécifications :**
161	159	- Modifier la table `checklist` pour ajouter :
162	160	  - `category` : varchar (Caméra / Son / Lumière / Accessoires / etc.)
163	161	  - `isChecked` : boolean (au lieu de status texte)
164	162	- Modifier `ChecklistTab.tsx` :
165	163	  - Grouper par catégorie
166	164	  - Checkbox cliquable pour cocher/décocher
167	165	  - Barre de progression par catégorie
168	166	  - Affichage visuel (✓ vert pour fait)
169	167	
170	168	**Fichiers à modifier :**
171	169	- `drizzle/schema.ts` - Modifier table `checklist`
172	170	- `server/db.ts` - Mettre à jour fonctions
173	171	- `client/src/components/ProjectTabs/ChecklistTab.tsx` - Refaire UI
174	172	
175	173	**Estimation :** 3 heures
176	174	
177	175	---
178	176	
179	177	#### 4. Avancée Projet (Module manquant)
180	178	**Objectif :** Checklist globale de l'avancement du projet
181	179	
182	180	**Spécifications :**
183	181	- Table `projectStatus` existe déjà
184	182	- Créer les routes tRPC
185	183	- Créer le composant `ProjectStatusTab.tsx`
186	184	- Afficher :
187	185	  - Liste de tâches globales (Brief reçu, Moodboard validé, etc.)
188	186	  - Checkboxes cliquables
189	187	  - Barre de progression globale (%)
190	188	  - Statistiques visuelles
191	189	- Suggestions de tâches par défaut :
192	190	  - ☐ Brief client reçu
193	191	  - ☐ Moodboard validé
194	192	  - ☐ Budget approuvé
195	193	  - ☐ Équipe confirmée
196	194	  - ☐ Lieux repérés
197	195	  - ☐ Matériel réservé
198	196	  - ☐ Planning finalisé
199	197	
200	198	**Fichiers à créer/modifier :**
201	199	- `server/db.ts` - Ajouter fonctions CRUD
202	200	- `server/routers.ts` - Ajouter routes
203	201	- `client/src/components/ProjectTabs/ProjectStatusTab.tsx` - Créer composant
204	202	- `client/src/pages/ProjectDetail.tsx` - Ajouter navigation
205	203	
206	204	**Estimation :** 3 heures
207	205	
208	206	---
209	207	
210	208	### 🟠 Priorité 2 - Important
211	209	
212	210	#### 5. Questions Client (Sous-module Brief)
213	211	**Objectif :** Liste de questions à poser au client avec checkboxes
214	212	
215	213	**Spécifications :**
216	214	- Table `clientQuestions` existe déjà
217	215	- Intégrer dans `BriefTab.tsx` (pas d'onglet séparé)
218	216	- Affichage :
219	217	  - Liste de questions avec checkbox
220	218	  - Possibilité d'ajouter des questions custom
221	219	  - Questions par défaut suggérées :
222	220	    - ☐ Quel est le message principal ?
223	221	    - ☐ Qui est le public cible ?
224	222	    - ☐ Quel ton/style souhaitez-vous ?
225	223	    - ☐ Y a-t-il des références visuelles ?
226	224	    - ☐ Quelles sont les contraintes de budget ?
227	225	    - ☐ Quelle est la deadline ?
228	226	
229	227	**Fichiers à modifier :**
230	228	- `server/db.ts` - Ajouter fonctions CRUD
231	229	- `server/routers.ts` - Ajouter routes
232	230	- `client/src/components/ProjectTabs/BriefTab.tsx` - Ajouter section
233	231	
234	232	**Estimation :** 2 heures
235	233	
236	234	---
237	235	
238	236	#### 6. Timeline Détaillée (Amélioration)
239	237	**Objectif :** Ajouter horaires précis et améliorer la visualisation
240	238	
241	239	**Spécifications :**
242	240	- Modifier table `timeline` pour ajouter :
243	241	  - `startTime` : varchar (ex: "9h00")
244	242	  - `endTime` : varchar (ex: "12h00")
245	243	  - `location` : varchar (optionnel)
246	244	  - `responsible` : varchar (qui est responsable)
247	245	- Modifier `TimelineTab.tsx` :
248	246	  - Affichage type planning avec horaires
249	247	  - Vue calendrier (optionnel, peut utiliser une lib)
250	248	  - Couleurs par type d'étape
251	249	
252	250	**Fichiers à modifier :**
253	251	- `drizzle/schema.ts` - Modifier table `timeline`
254	252	- `server/db.ts` - Mettre à jour fonctions
255	253	- `client/src/components/ProjectTabs/TimelineTab.tsx` - Améliorer UI
256	254	
257	255	**Estimation :** 4 heures
258	256	
259	257	---
260	258	
261	259	#### 7. Amélioration du PDF (Amélioration continue)
262	260	**Objectif :** Rendre le PDF encore plus professionnel
263	261	
264	262	**Spécifications :**
265	263	- Ajouter les nouvelles sections (Inspirations Vidéo, Questions Client, etc.)
266	264	- Améliorer la mise en page :
267	265	  - Moodboard en grille 3x3
268	266	  - Palette de couleurs avec carrés colorés
269	267	  - Timeline visuelle
270	268	  - Checklist avec checkboxes
271	269	- Ajouter un sommaire cliquable (liens internes PDF)
272	270	- Option d'export en plusieurs formats :
273	271	  - PDF complet
274	272	  - PDF résumé (sans images)
275	273	  - PDF client (sans budget détaillé)
276	274	
277	275	**Fichiers à modifier :**
278	276	- `server/pdfGeneratorNew.ts` - Améliorer template HTML
279	277	
280	278	**Estimation :** 6 heures
281	279	
282	280	---
283	281	
284	282	### 🟡 Priorité 3 - Nice to Have
285	283	
286	284	#### 8. Mode Collaboratif
287	285	**Objectif :** Permettre à plusieurs personnes de travailler sur un projet
288	286	
289	287	**Spécifications :**
290	288	- Ajouter table `projectCollaborators`
291	289	- Inviter des collaborateurs par email
292	290	- Permissions (lecture seule / édition)
293	291	- Commentaires sur les sections
294	292	
295	293	**Estimation :** 10+ heures
296	294	
297	295	---
298	296	
299	297	#### 9. Templates de Projet
300	298	**Objectif :** Créer des templates pré-remplis (Pub, Clip, Documentaire, etc.)
301	299	
302	300	**Spécifications :**
303	301	- Table `projectTemplates`
304	302	- Bibliothèque de templates
305	303	- Dupliquer un projet existant
306	304	- Templates par défaut :
307	305	  - Publicité 30s
308	306	  - Clip musical
309	307	  - Interview/Documentaire
310	308	  - Vidéo corporate
311	309	
312	310	**Estimation :** 8 heures
313	311	
314	312	---
315	313	
316	314	#### 10. Export Multiple Formats
317	315	**Objectif :** Exporter en Word, PowerPoint, etc.
318	316	
319	317	**Spécifications :**
320	318	- Export Word (.docx) avec docx.js
321	319	- Export PowerPoint (.pptx) avec pptxgen.js
322	320	- Export JSON (pour backup)
323	321	
324	322	**Estimation :** 6 heures
325	323	
326	324	---
327	325	
328	326	#### 11. Intégration Calendrier
329	327	**Objectif :** Synchroniser le planning avec Google Calendar / Outlook
330	328	
331	329	**Spécifications :**
332	330	- API Google Calendar
333	331	- Export .ics (iCalendar)
334	332	- Sync bidirectionnelle
335	333	
336	334	**Estimation :** 12+ heures
337	335	
338	336	---
339	337	
340	338	#### 12. Mode Hors Ligne (PWA)
341	339	**Objectif :** Utiliser l'app sans connexion sur le tournage
342	340	
343	341	**Spécifications :**
344	342	- Service Worker
345	343	- Cache des données
346	344	- Sync quand connexion retrouvée
347	345	
348	346	**Estimation :** 10+ heures
349	347	
350	348	---
351	349	
352	350	## 📊 Résumé
353	351	
354	352	| Priorité | Tâche | Estimation | Statut |
355	353	|----------|-------|------------|--------|
356	354	| 🔴 P1 | Inspirations Vidéo | 2-3h | ⏳ À faire |
357	355	| 🔴 P1 | Shortlist Améliorée | 2h | ⏳ À faire |
358	356	| 🔴 P1 | Checklist Matériel Améliorée | 3h | ⏳ À faire |
359	357	| 🔴 P1 | Avancée Projet | 3h | ⏳ À faire |
360	358	| 🟠 P2 | Questions Client | 2h | ⏳ À faire |
361	359	| 🟠 P2 | Timeline Détaillée | 4h | ⏳ À faire |
362	360	| 🟠 P2 | Amélioration PDF | 6h | ⏳ À faire |
363	361	| 🟡 P3 | Mode Collaboratif | 10h+ | 💡 Idée |
364	362	| 🟡 P3 | Templates de Projet | 8h | 💡 Idée |
365	363	| 🟡 P3 | Export Multiple Formats | 6h | 💡 Idée |
366	364	| 🟡 P3 | Intégration Calendrier | 12h+ | 💡 Idée |
367	365	| 🟡 P3 | Mode Hors Ligne (PWA) | 10h+ | 💡 Idée |
368	366	
369	367	**Total Priorité 1 :** ~10-11 heures
370	368	**Total Priorité 2 :** ~12 heures
371	369	**Total Priorité 3 :** ~56+ heures
372	370	
373	371	---
374	372	
375	373	## 🎯 Recommandation
376	374	
377	375	Pour la **V2**, se concentrer sur :
378	376	1. ✅ Inspirations Vidéo
379	377	2. ✅ Shortlist Améliorée
380	378	3. ✅ Checklist Matériel Améliorée
381	379	4. ✅ Avancée Projet
382	380	
383	381	Cela représente environ **2 jours de développement** et apportera une vraie valeur ajoutée à l'outil.
384	382	
385	383	Les fonctionnalités P2 et P3 peuvent être implémentées dans les versions suivantes selon les besoins.
386	384	
387	385	