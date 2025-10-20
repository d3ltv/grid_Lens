import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  Project, InsertProject, projects,
  CreativeConcept, InsertCreativeConcept, creativeConcepts,
  MoodboardImage, InsertMoodboardImage, moodboardImages,
  Scene, InsertScene, scenes,
  SceneImage, InsertSceneImage, sceneImages,
  Location, InsertLocation, locations,
  LocationImage, InsertLocationImage, locationImages,
  Talent, InsertTalent, talents,
  TalentImage, InsertTalentImage, talentImages,
  Equipment, InsertEquipment, equipment,
  TimelineEntry, InsertTimelineEntry, timeline,
  TeamMember, InsertTeamMember, teamMembers,
  ProjectNote, InsertProjectNote, projectNotes,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== PROJECT QUERIES ==========

export async function createProject(project: InsertProject): Promise<Project> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(projects).values(project);
  const result = await db.select().from(projects).where(eq(projects.id, project.id)).limit(1);
  return result[0];
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects).where(eq(projects.userId, userId));
}

export async function updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id));
  return getProject(id);
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(projects).where(eq(projects.id, id));
}

// ========== CREATIVE CONCEPT QUERIES ==========

export async function createCreativeConcept(concept: InsertCreativeConcept): Promise<CreativeConcept> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(creativeConcepts).values(concept);
  const result = await db.select().from(creativeConcepts).where(eq(creativeConcepts.id, concept.id)).limit(1);
  return result[0];
}

export async function getCreativeConcept(projectId: string): Promise<CreativeConcept | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(creativeConcepts).where(eq(creativeConcepts.projectId, projectId)).limit(1);
  return result[0];
}

export async function updateCreativeConcept(projectId: string, data: Partial<InsertCreativeConcept>): Promise<CreativeConcept | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const existing = await getCreativeConcept(projectId);
  if (!existing) return undefined;
  
  await db.update(creativeConcepts).set({ ...data, updatedAt: new Date() }).where(eq(creativeConcepts.id, existing.id));
  return getCreativeConcept(projectId);
}

// ========== MOODBOARD IMAGES QUERIES ==========

export async function createMoodboardImage(image: InsertMoodboardImage): Promise<MoodboardImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(moodboardImages).values(image);
  const result = await db.select().from(moodboardImages).where(eq(moodboardImages.id, image.id)).limit(1);
  return result[0];
}

export async function getProjectMoodboardImages(projectId: string): Promise<MoodboardImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(moodboardImages).where(eq(moodboardImages.projectId, projectId));
}

export async function deleteMoodboardImage(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(moodboardImages).where(eq(moodboardImages.id, id));
}

// ========== SCENES QUERIES ==========

export async function createScene(scene: InsertScene): Promise<Scene> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(scenes).values(scene);
  const result = await db.select().from(scenes).where(eq(scenes.id, scene.id)).limit(1);
  return result[0];
}

export async function getProjectScenes(projectId: string): Promise<Scene[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(scenes).where(eq(scenes.projectId, projectId));
}

export async function updateScene(id: string, data: Partial<InsertScene>): Promise<Scene | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(scenes).set({ ...data, updatedAt: new Date() }).where(eq(scenes.id, id));
  const result = await db.select().from(scenes).where(eq(scenes.id, id)).limit(1);
  return result[0];
}

export async function deleteScene(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(scenes).where(eq(scenes.id, id));
}

// ========== SCENE IMAGES QUERIES ==========

export async function createSceneImage(image: InsertSceneImage): Promise<SceneImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(sceneImages).values(image);
  const result = await db.select().from(sceneImages).where(eq(sceneImages.id, image.id)).limit(1);
  return result[0];
}

export async function getSceneImages(sceneId: string): Promise<SceneImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(sceneImages).where(eq(sceneImages.sceneId, sceneId));
}

export async function deleteSceneImage(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(sceneImages).where(eq(sceneImages.id, id));
}

// ========== LOCATIONS QUERIES ==========

export async function createLocation(location: InsertLocation): Promise<Location> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(locations).values(location);
  const result = await db.select().from(locations).where(eq(locations.id, location.id)).limit(1);
  return result[0];
}

export async function getProjectLocations(projectId: string): Promise<Location[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(locations).where(eq(locations.projectId, projectId));
}

export async function updateLocation(id: string, data: Partial<InsertLocation>): Promise<Location | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(locations).set({ ...data, updatedAt: new Date() }).where(eq(locations.id, id));
  const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
  return result[0];
}

export async function deleteLocation(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(locations).where(eq(locations.id, id));
}

// ========== LOCATION IMAGES QUERIES ==========

export async function createLocationImage(image: InsertLocationImage): Promise<LocationImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(locationImages).values(image);
  const result = await db.select().from(locationImages).where(eq(locationImages.id, image.id)).limit(1);
  return result[0];
}

export async function getLocationImages(locationId: string): Promise<LocationImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(locationImages).where(eq(locationImages.locationId, locationId));
}

export async function deleteLocationImage(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(locationImages).where(eq(locationImages.id, id));
}

// ========== TALENTS QUERIES ==========

export async function createTalent(talent: InsertTalent): Promise<Talent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(talents).values(talent);
  const result = await db.select().from(talents).where(eq(talents.id, talent.id)).limit(1);
  return result[0];
}

export async function getProjectTalents(projectId: string): Promise<Talent[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(talents).where(eq(talents.projectId, projectId));
}

export async function updateTalent(id: string, data: Partial<InsertTalent>): Promise<Talent | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(talents).set({ ...data, updatedAt: new Date() }).where(eq(talents.id, id));
  const result = await db.select().from(talents).where(eq(talents.id, id)).limit(1);
  return result[0];
}

export async function deleteTalent(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(talents).where(eq(talents.id, id));
}

// ========== TALENT IMAGES QUERIES ==========

export async function createTalentImage(image: InsertTalentImage): Promise<TalentImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(talentImages).values(image);
  const result = await db.select().from(talentImages).where(eq(talentImages.id, image.id)).limit(1);
  return result[0];
}

export async function getTalentImages(talentId: string): Promise<TalentImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(talentImages).where(eq(talentImages.talentId, talentId));
}

export async function deleteTalentImage(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(talentImages).where(eq(talentImages.id, id));
}

// ========== EQUIPMENT QUERIES ==========

export async function createEquipment(equip: InsertEquipment): Promise<Equipment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(equipment).values(equip);
  const result = await db.select().from(equipment).where(eq(equipment.id, equip.id)).limit(1);
  return result[0];
}

export async function getProjectEquipment(projectId: string): Promise<Equipment[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(equipment).where(eq(equipment.projectId, projectId));
}

export async function updateEquipment(id: string, data: Partial<InsertEquipment>): Promise<Equipment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(equipment).set({ ...data, updatedAt: new Date() }).where(eq(equipment.id, id));
  const result = await db.select().from(equipment).where(eq(equipment.id, id)).limit(1);
  return result[0];
}

export async function deleteEquipment(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(equipment).where(eq(equipment.id, id));
}

// ========== TIMELINE QUERIES ==========

export async function createTimelineEntry(entry: InsertTimelineEntry): Promise<TimelineEntry> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(timeline).values(entry);
  const result = await db.select().from(timeline).where(eq(timeline.id, entry.id)).limit(1);
  return result[0];
}

export async function getProjectTimeline(projectId: string): Promise<TimelineEntry[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(timeline).where(eq(timeline.projectId, projectId));
}

export async function updateTimelineEntry(id: string, data: Partial<InsertTimelineEntry>): Promise<TimelineEntry | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(timeline).set({ ...data, updatedAt: new Date() }).where(eq(timeline.id, id));
  const result = await db.select().from(timeline).where(eq(timeline.id, id)).limit(1);
  return result[0];
}

export async function deleteTimelineEntry(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(timeline).where(eq(timeline.id, id));
}

// ========== TEAM MEMBERS QUERIES ==========

export async function createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(teamMembers).values(member);
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, member.id)).limit(1);
  return result[0];
}

export async function getProjectTeamMembers(projectId: string): Promise<TeamMember[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(teamMembers).where(eq(teamMembers.projectId, projectId));
}

export async function updateTeamMember(id: string, data: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(teamMembers).set({ ...data, updatedAt: new Date() }).where(eq(teamMembers.id, id));
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0];
}

export async function deleteTeamMember(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}

// ========== PROJECT NOTES QUERIES ==========

export async function createProjectNote(note: InsertProjectNote): Promise<ProjectNote> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(projectNotes).values(note);
  const result = await db.select().from(projectNotes).where(eq(projectNotes.id, note.id)).limit(1);
  return result[0];
}

export async function getProjectNotes(projectId: string): Promise<ProjectNote[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projectNotes).where(eq(projectNotes.projectId, projectId));
}

export async function updateProjectNote(id: string, data: Partial<InsertProjectNote>): Promise<ProjectNote | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(projectNotes).set({ ...data, updatedAt: new Date() }).where(eq(projectNotes.id, id));
  const result = await db.select().from(projectNotes).where(eq(projectNotes.id, id)).limit(1);
  return result[0];
}

export async function deleteProjectNote(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(projectNotes).where(eq(projectNotes.id, id));
}

