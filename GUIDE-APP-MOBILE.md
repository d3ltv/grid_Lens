# 📱 Guide Application Mobile - GridLens

## 🎯 Objectif
Créer une application mobile qui sauvegarde en local sans base de données externe.

## 🛠️ Stack Technologique Recommandée

### **Expo + React Native**
- ✅ Code partagé avec l'app web
- ✅ Stockage local natif
- ✅ Performance optimale
- ✅ Déploiement simple

## 📋 Architecture Mobile

```
📱 App Mobile (Expo)
├── 🎨 UI Components (partagés)
│   ├── ProjectTabs/
│   ├── Dashboard/
│   └── ui/ (composants de base)
├── 💾 Stockage Local
│   ├── SQLite (données complexes)
│   ├── AsyncStorage (préférences)
│   └── FileSystem (fichiers)
├── 🔄 État Global
│   ├── Zustand (état simple)
│   └── React Query (cache)
└── 📤 Export/Import
    ├── JSON (sauvegarde)
    ├── PDF (rapports)
    └── Partage (fichiers)
```

## 🚀 Étapes de Développement

### Étape 1 : Setup Expo
```bash
# Installer Expo CLI
npm install -g @expo/cli

# Créer le projet mobile
npx create-expo-app GridLensMobile --template

# Installer les dépendances
cd GridLensMobile
npx expo install @react-native-async-storage/async-storage
npx expo install expo-sqlite
npx expo install expo-file-system
```

### Étape 2 : Partager les Composants
```bash
# Copier les composants existants
cp -r client/src/components GridLensMobile/src/
cp -r client/src/ui GridLensMobile/src/
```

### Étape 3 : Configuration Stockage Local
```javascript
// src/storage/database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gridlens.db');

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
    );
  });
};

export const saveProject = (project) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO projects (id, name, data) VALUES (?, ?, ?)',
        [project.id, project.name, JSON.stringify(project)],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getProjects = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM projects ORDER BY created_at DESC',
        [],
        (_, result) => {
          const projects = result.rows._array.map(row => ({
            ...JSON.parse(row.data),
            id: row.id,
            name: row.name
          }));
          resolve(projects);
        },
        (_, error) => reject(error)
      );
    });
  });
};
```

### Étape 4 : État Global
```javascript
// src/store/projectStore.js
import { create } from 'zustand';
import { saveProject, getProjects } from '../storage/database';

export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  
  loadProjects: async () => {
    try {
      const projects = await getProjects();
      set({ projects });
    } catch (error) {
      console.error('Erreur chargement projets:', error);
    }
  },
  
  saveProject: async (project) => {
    try {
      await saveProject(project);
      await get().loadProjects();
    } catch (error) {
      console.error('Erreur sauvegarde projet:', error);
    }
  },
  
  setCurrentProject: (project) => {
    set({ currentProject: project });
  }
}));
```

### Étape 5 : Composants Adaptés
```javascript
// src/components/ProjectList.jsx
import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useProjectStore } from '../store/projectStore';

export const ProjectList = () => {
  const { projects, loadProjects } = useProjectStore();
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  return (
    <View>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};
```

## 💾 Options de Stockage Local

### 1. **SQLite (Recommandé)**
```javascript
// Pour données complexes et relations
import * as SQLite from 'expo-sqlite';
```

### 2. **AsyncStorage**
```javascript
// Pour préférences et cache
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### 3. **FileSystem**
```javascript
// Pour fichiers et exports
import * as FileSystem from 'expo-file-system';
```

## 📤 Export/Import de Données

### Export JSON
```javascript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportProject = async (project) => {
  const fileName = `${project.name}.json`;
  const fileUri = FileSystem.documentDirectory + fileName;
  
  await FileSystem.writeAsStringAsync(
    fileUri,
    JSON.stringify(project, null, 2)
  );
  
  await Sharing.shareAsync(fileUri);
};
```

### Import JSON
```javascript
import * as DocumentPicker from 'expo-document-picker';

export const importProject = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json'
  });
  
  if (!result.canceled) {
    const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const project = JSON.parse(content);
    return project;
  }
};
```

## 🎨 Adaptation UI Mobile

### Navigation
```javascript
// src/navigation/AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Projects" component={ProjectList} />
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
```

### Composants Responsive
```javascript
// src/components/ResponsiveCard.jsx
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const ResponsiveCard = ({ children }) => {
  return (
    <View style={[
      styles.card,
      { width: width * 0.9 }
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});
```

## 🚀 Déploiement

### Développement
```bash
# Démarrer Expo Go
npx expo start

# Scanner le QR code avec l'app Expo Go
```

### Production
```bash
# Build pour iOS/Android
npx eas build --platform all

# Publier sur les stores
npx eas submit --platform all
```

## 📊 Avantages de cette Approche

### ✅ **Stockage Local**
- Pas de serveur requis
- Données toujours disponibles
- Pas de coûts d'infrastructure

### ✅ **Performance**
- Accès instantané aux données
- Pas de latence réseau
- Fonctionne hors ligne

### ✅ **Sécurité**
- Données stockées localement
- Pas de transmission réseau
- Contrôle total des données

### ✅ **Simplicité**
- Pas de base de données externe
- Pas de configuration serveur
- Déploiement direct

## 🎯 Prochaines Étapes

1. **Créer le projet Expo**
2. **Migrer les composants existants**
3. **Implémenter le stockage local**
4. **Adapter l'UI pour mobile**
5. **Tester et déployer**

---

**Résultat** : Application mobile complètement autonome avec stockage local ! 📱
