Text file: LISEZ-MOI-DEVELOPPEUR.md
Latest content with line numbers:
1	# 📦 Package Développeur - Outil de Pré-Production Vidéo
2	
3	## 👋 Bienvenue !
4	
5	Ce package contient le code source complet de l'outil de pré-production vidéo, ainsi que toute la documentation nécessaire pour comprendre et développer le projet.
6	
7	---
8	
9	## 📁 Contenu du Package
10	
11	### 1. Code Source Complet
12	
13	Le dossier `preprod-tool/` contient :
14	- Frontend React + TypeScript
15	- Backend Node.js + tRPC
16	- Schéma de base de données (Drizzle ORM)
17	- Configuration complète
18	
19	### 2. Documentation
20	
21	**📘 README-DEV.md** - Guide développeur complet
22	- Architecture technique détaillée
23	- Stack technologique
24	- Structure du projet
25	- Installation et démarrage
26	- Comment ajouter une fonctionnalité (avec exemple complet)
27	- Conventions de code
28	- Debugging
29	- Déploiement
30	
31	**🗺️ ROADMAP.md** - Feuille de route
32	- ✅ Fonctionnalités implémentées (V1 actuelle)
33	- 🚧 Fonctionnalités à implémenter (V2)
34	- Priorités (P1, P2, P3)
35	- Estimations de temps
36	- Résumé avec tableau
37	
38	**📋 BACKLOG.md** - Tâches détaillées
39	- Spécifications techniques complètes pour chaque tâche
40	- Code prêt à copier-coller
41	- Tests à effectuer
42	- Critères d'acceptation
43	- Actuellement : 4 tâches P1 détaillées (10-11h de dev)
44	
45	---
46	
47	## 🚀 Démarrage Rapide
48	
49	### Prérequis
50	
51	- Node.js 22+
52	- pnpm (installer avec `npm install -g pnpm`)
53	- Accès à la base de données TiDB Cloud (credentials fournis)
54	
55	### Installation
56	
57	```bash
58	# Extraire l'archive
59	tar -xzf preprod-tool-pour-developpeur.tar.gz
60	cd preprod-tool
61	
62	# Installer les dépendances
63	pnpm install
64	
65	# Le fichier .env est déjà configuré avec les credentials TiDB Cloud
66	
67	# Pousser le schéma vers la base de données
68	pnpm db:push
69	
70	# Démarrer en mode développement
71	pnpm dev
72	```
73	
74	L'application sera accessible sur `http://localhost:5000`
75	
76	---
77	
78	## 📚 Par Où Commencer ?
79	
80	### 1. Comprendre le Projet (30 min)
81	
82	1. Lire **README-DEV.md** - Sections :
83	   - Vue d'ensemble
84	   - Architecture technique
85	   - Structure du projet
86	   - Schéma de base de données
87	
88	2. Lancer l'application et explorer l'interface :
89	   - Créer un projet de test
90	   - Explorer les 17 modules
91	   - Tester la génération PDF
92	
93	### 2. Comprendre le Code (1h)
94	
95	1. Regarder la structure :
96	   ```
97	   client/src/
98	   ├── components/ProjectTabs/  ← Les 17 modules
99	   ├── pages/
100	   │   ├── Home.tsx             ← Liste des projets
101	   │   └── ProjectDetail.tsx    ← Navigation Apple-like
102	   └── lib/trpc.ts              ← Client API
103	   
104	   server/
105	   ├── routers.ts               ← Routes API (tRPC)
106	   ├── db.ts                    ← Fonctions base de données
107	   └── pdfGeneratorNew.ts       ← Génération PDF
108	   
109	   drizzle/
110	   └── schema.ts                ← Schéma BDD (25+ tables)
111	   ```
112	
113	2. Lire un exemple complet dans **README-DEV.md** :
114	   - Section "Comment Ajouter une Nouvelle Fonctionnalité"
115	   - Exemple : "Storyboard Détaillé"
116	
117	### 3. Implémenter la Première Tâche (2-3h)
118	
119	1. Ouvrir **BACKLOG.md**
120	2. Commencer par **TÂCHE #1 : Inspirations Vidéo**
121	3. Suivre les étapes :
122	   - Vérifier la table (déjà créée)
123	   - Copier-coller le code backend
124	   - Copier-coller le code frontend
125	   - Tester
126	
127	---
128	
129	## 🎯 Objectif Immédiat (V2)
130	
131	Implémenter les **4 tâches Priorité 1** du BACKLOG :
132	
133	1. ✅ Inspirations Vidéo (2-3h)
134	2. ✅ Shortlist Améliorée (2h)
135	3. ✅ Checklist Matériel Améliorée (3h)
136	4. ✅ Avancée Projet (3h)
137	
138	**Total : 10-11 heures de développement**
139	
140	Ces tâches sont détaillées dans **BACKLOG.md** avec le code complet à copier-coller.
141	
142	---
143	
144	## 🔧 Commandes Utiles
145	
146	```bash
147	# Développement
148	pnpm dev                 # Démarrer en mode dev (hot reload)
149	
150	# Base de données
151	pnpm db:push             # Pousser le schéma vers la BDD
152	pnpm db:studio           # Interface graphique pour la BDD
153	
154	# Build
155	pnpm build               # Builder pour production
156	pnpm start               # Démarrer en production
157	
158	# Logs
159	tail -f server.log       # Voir les logs du serveur
160	```
161	
162	---
163	
164	## 🐛 En Cas de Problème
165	
166	### Erreur de connexion à la base de données
167	
168	```bash
169	# Vérifier que le .env est correct
170	cat .env
171	
172	# Tester la connexion
173	pnpm db:push
174	```
175	
176	### Module tRPC non trouvé
177	
178	```bash
179	# Rebuild complet
180	pnpm build
181	
182	# Redémarrer le serveur
183	pnpm dev
184	```
185	
186	### Composant ne s'affiche pas
187	
188	1. Vérifier l'import dans `ProjectDetail.tsx`
189	2. Vérifier la condition `{activeSection === '...' && <Component />}`
190	3. Vérifier la console du navigateur (F12)
191	
192	---
193	
194	## 📞 Support
195	
196	- **Documentation complète** : README-DEV.md
197	- **Tâches détaillées** : BACKLOG.md
198	- **Feuille de route** : ROADMAP.md
199	
200	Tous les fichiers sont dans le dossier `preprod-tool/`
201	
202	---
203	
204	## ✅ Checklist de Démarrage
205	
206	- [ ] Extraire l'archive
207	- [ ] Installer les dépendances (`pnpm install`)
208	- [ ] Lancer l'application (`pnpm dev`)
209	- [ ] Créer un projet de test
210	- [ ] Explorer les modules existants
211	- [ ] Lire README-DEV.md (au moins les sections principales)
212	- [ ] Lire ROADMAP.md pour comprendre ce qui est fait et à faire
213	- [ ] Ouvrir BACKLOG.md et choisir une tâche
214	- [ ] Commencer à coder ! 🚀
215	
216	---
217	
218	## 🎬 Contexte Métier
219	
220	**Qui utilise cet outil ?**
221	Des vidéastes professionnels qui ont besoin de créer des documents de pré-production pour leurs clients.
222	
223	**Workflow typique :**
224	1. Le vidéaste reçoit un brief client
225	2. Il crée un projet dans l'outil
226	3. Il remplit les différents modules (moodboard, budget, planning, etc.)
227	4. Il génère un PDF professionnel
228	5. Il envoie le PDF au client pour validation
229	
230	**Objectif final :**
231	Un PDF complet, professionnel, avec toutes les informations nécessaires pour le tournage.
232	
233	---
234	
235	Bon développement ! 💻
236	
237	