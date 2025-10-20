var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      ownerId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// drizzle/schema.ts
import { mysqlEnum, mysqlTable, text, timestamp, varchar, int } from "drizzle-orm/mysql-core";
var users, projects, creativeConcepts, moodboardImages, scenes, sceneImages, locations, locationImages, talents, talentImages, equipment, timeline, teamMembers, projectNotes;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: varchar("id", { length: 64 }).primaryKey(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow()
    });
    projects = mysqlTable("projects", {
      id: varchar("id", { length: 64 }).primaryKey(),
      userId: varchar("userId", { length: 64 }).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      clientName: varchar("clientName", { length: 255 }),
      projectObjective: text("projectObjective"),
      targetAudience: varchar("targetAudience", { length: 255 }),
      estimatedDuration: varchar("estimatedDuration", { length: 100 }),
      diffusionFormat: varchar("diffusionFormat", { length: 255 }),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    creativeConcepts = mysqlTable("creativeConcepts", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      synopsis: text("synopsis"),
      keyMessage: text("keyMessage"),
      tone: varchar("tone", { length: 255 }),
      style: varchar("style", { length: 255 }),
      musicType: varchar("musicType", { length: 255 }),
      musicDescription: text("musicDescription"),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    moodboardImages = mysqlTable("moodboardImages", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      imageUrl: text("imageUrl").notNull(),
      s3Key: varchar("s3Key", { length: 500 }),
      description: text("description"),
      createdAt: timestamp("createdAt").defaultNow()
    });
    scenes = mysqlTable("scenes", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      sceneNumber: int("sceneNumber").notNull(),
      title: varchar("title", { length: 255 }),
      description: text("description"),
      actions: text("actions"),
      dialogue: text("dialogue"),
      voiceOver: text("voiceOver"),
      duration: varchar("duration", { length: 50 }),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    sceneImages = mysqlTable("sceneImages", {
      id: varchar("id", { length: 64 }).primaryKey(),
      sceneId: varchar("sceneId", { length: 64 }).notNull(),
      imageUrl: text("imageUrl").notNull(),
      s3Key: varchar("s3Key", { length: 500 }),
      caption: text("caption"),
      createdAt: timestamp("createdAt").defaultNow()
    });
    locations = mysqlTable("locations", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      address: text("address"),
      description: text("description"),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    locationImages = mysqlTable("locationImages", {
      id: varchar("id", { length: 64 }).primaryKey(),
      locationId: varchar("locationId", { length: 64 }).notNull(),
      imageUrl: text("imageUrl").notNull(),
      s3Key: varchar("s3Key", { length: 500 }),
      caption: text("caption"),
      createdAt: timestamp("createdAt").defaultNow()
    });
    talents = mysqlTable("talents", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      role: varchar("role", { length: 255 }),
      description: text("description"),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    talentImages = mysqlTable("talentImages", {
      id: varchar("id", { length: 64 }).primaryKey(),
      talentId: varchar("talentId", { length: 64 }).notNull(),
      imageUrl: text("imageUrl").notNull(),
      s3Key: varchar("s3Key", { length: 500 }),
      caption: text("caption"),
      createdAt: timestamp("createdAt").defaultNow()
    });
    equipment = mysqlTable("equipment", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      category: varchar("category", { length: 100 }),
      description: text("description"),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    timeline = mysqlTable("timeline", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      phaseName: varchar("phaseName", { length: 255 }).notNull(),
      description: text("description"),
      startDate: timestamp("startDate"),
      endDate: timestamp("endDate"),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    teamMembers = mysqlTable("teamMembers", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      role: varchar("role", { length: 255 }).notNull(),
      email: varchar("email", { length: 255 }),
      phone: varchar("phone", { length: 20 }),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    projectNotes = mysqlTable("projectNotes", {
      id: varchar("id", { length: 64 }).primaryKey(),
      projectId: varchar("projectId", { length: 64 }).notNull(),
      title: varchar("title", { length: 255 }),
      content: text("content"),
      category: varchar("category", { length: 100 }),
      createdAt: timestamp("createdAt").defaultNow(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
  }
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
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
async function upsertUser(user) {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      id: user.id
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === void 0) {
      if (user.id === ENV.ownerId) {
        user.role = "admin";
        values.role = "admin";
        updateSet.role = "admin";
      }
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUser(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createProject(project) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(projects).values(project);
  const result = await db.select().from(projects).where(eq(projects.id, project.id)).limit(1);
  return result[0];
}
async function getProject(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}
async function getUserProjects(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.userId, userId));
}
async function updateProject(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(projects).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(projects.id, id));
  return getProject(id);
}
async function deleteProject(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(projects).where(eq(projects.id, id));
}
async function createCreativeConcept(concept) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(creativeConcepts).values(concept);
  const result = await db.select().from(creativeConcepts).where(eq(creativeConcepts.id, concept.id)).limit(1);
  return result[0];
}
async function getCreativeConcept(projectId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(creativeConcepts).where(eq(creativeConcepts.projectId, projectId)).limit(1);
  return result[0];
}
async function updateCreativeConcept(projectId, data) {
  const db = await getDb();
  if (!db) return void 0;
  const existing = await getCreativeConcept(projectId);
  if (!existing) return void 0;
  await db.update(creativeConcepts).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(creativeConcepts.id, existing.id));
  return getCreativeConcept(projectId);
}
async function createMoodboardImage(image) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(moodboardImages).values(image);
  const result = await db.select().from(moodboardImages).where(eq(moodboardImages.id, image.id)).limit(1);
  return result[0];
}
async function getProjectMoodboardImages(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(moodboardImages).where(eq(moodboardImages.projectId, projectId));
}
async function deleteMoodboardImage(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(moodboardImages).where(eq(moodboardImages.id, id));
}
async function createScene(scene) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(scenes).values(scene);
  const result = await db.select().from(scenes).where(eq(scenes.id, scene.id)).limit(1);
  return result[0];
}
async function getProjectScenes(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scenes).where(eq(scenes.projectId, projectId));
}
async function updateScene(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(scenes).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(scenes.id, id));
  const result = await db.select().from(scenes).where(eq(scenes.id, id)).limit(1);
  return result[0];
}
async function deleteScene(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(scenes).where(eq(scenes.id, id));
}
async function createSceneImage(image) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(sceneImages).values(image);
  const result = await db.select().from(sceneImages).where(eq(sceneImages.id, image.id)).limit(1);
  return result[0];
}
async function getSceneImages(sceneId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sceneImages).where(eq(sceneImages.sceneId, sceneId));
}
async function deleteSceneImage(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(sceneImages).where(eq(sceneImages.id, id));
}
async function createLocation(location) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(locations).values(location);
  const result = await db.select().from(locations).where(eq(locations.id, location.id)).limit(1);
  return result[0];
}
async function getProjectLocations(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(locations).where(eq(locations.projectId, projectId));
}
async function updateLocation(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(locations).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(locations.id, id));
  const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
  return result[0];
}
async function deleteLocation(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(locations).where(eq(locations.id, id));
}
async function createLocationImage(image) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(locationImages).values(image);
  const result = await db.select().from(locationImages).where(eq(locationImages.id, image.id)).limit(1);
  return result[0];
}
async function getLocationImages(locationId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(locationImages).where(eq(locationImages.locationId, locationId));
}
async function deleteLocationImage(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(locationImages).where(eq(locationImages.id, id));
}
async function createTalent(talent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(talents).values(talent);
  const result = await db.select().from(talents).where(eq(talents.id, talent.id)).limit(1);
  return result[0];
}
async function getProjectTalents(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(talents).where(eq(talents.projectId, projectId));
}
async function updateTalent(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(talents).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(talents.id, id));
  const result = await db.select().from(talents).where(eq(talents.id, id)).limit(1);
  return result[0];
}
async function deleteTalent(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(talents).where(eq(talents.id, id));
}
async function createTalentImage(image) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(talentImages).values(image);
  const result = await db.select().from(talentImages).where(eq(talentImages.id, image.id)).limit(1);
  return result[0];
}
async function getTalentImages(talentId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(talentImages).where(eq(talentImages.talentId, talentId));
}
async function deleteTalentImage(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(talentImages).where(eq(talentImages.id, id));
}
async function createEquipment(equip) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(equipment).values(equip);
  const result = await db.select().from(equipment).where(eq(equipment.id, equip.id)).limit(1);
  return result[0];
}
async function getProjectEquipment(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(equipment).where(eq(equipment.projectId, projectId));
}
async function updateEquipment(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(equipment).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(equipment.id, id));
  const result = await db.select().from(equipment).where(eq(equipment.id, id)).limit(1);
  return result[0];
}
async function deleteEquipment(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(equipment).where(eq(equipment.id, id));
}
async function createTimelineEntry(entry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(timeline).values(entry);
  const result = await db.select().from(timeline).where(eq(timeline.id, entry.id)).limit(1);
  return result[0];
}
async function getProjectTimeline(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timeline).where(eq(timeline.projectId, projectId));
}
async function updateTimelineEntry(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(timeline).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(timeline.id, id));
  const result = await db.select().from(timeline).where(eq(timeline.id, id)).limit(1);
  return result[0];
}
async function deleteTimelineEntry(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(timeline).where(eq(timeline.id, id));
}
async function createTeamMember(member) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(teamMembers).values(member);
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, member.id)).limit(1);
  return result[0];
}
async function getProjectTeamMembers(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).where(eq(teamMembers.projectId, projectId));
}
async function updateTeamMember(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(teamMembers).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(teamMembers.id, id));
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0];
}
async function deleteTeamMember(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}
async function createProjectNote(note) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(projectNotes).values(note);
  const result = await db.select().from(projectNotes).where(eq(projectNotes.id, note.id)).limit(1);
  return result[0];
}
async function getProjectNotes(projectId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectNotes).where(eq(projectNotes.projectId, projectId));
}
async function updateProjectNote(id, data) {
  const db = await getDb();
  if (!db) return void 0;
  await db.update(projectNotes).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(projectNotes.id, id));
  const result = await db.select().from(projectNotes).where(eq(projectNotes.id, id)).limit(1);
  return result[0];
}
async function deleteProjectNote(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete(projectNotes).where(eq(projectNotes.id, id));
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/pdfGenerator.ts
var pdfGenerator_exports = {};
__export(pdfGenerator_exports, {
  generateProjectPDF: () => generateProjectPDF
});
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun, PageBreak, HeadingLevel } from "docx";
import { eq as eq2 } from "drizzle-orm";
async function generateProjectPDF(projectId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const project = await db.select().from(projects).where(eq2(projects.id, projectId)).limit(1);
  if (!project.length) throw new Error("Project not found");
  const projectData = project[0];
  const concept = await db.select().from(creativeConcepts).where(eq2(creativeConcepts.projectId, projectId)).limit(1);
  const projectScenes = await db.select().from(scenes).where(eq2(scenes.projectId, projectId));
  const projectLocations = await db.select().from(locations).where(eq2(locations.projectId, projectId));
  const projectTalents = await db.select().from(talents).where(eq2(talents.projectId, projectId));
  const projectEquipment = await db.select().from(equipment).where(eq2(equipment.projectId, projectId));
  const projectTimeline = await db.select().from(timeline).where(eq2(timeline.projectId, projectId));
  const projectTeam = await db.select().from(teamMembers).where(eq2(teamMembers.projectId, projectId));
  const projectNotesData = await db.select().from(projectNotes).where(eq2(projectNotes.projectId, projectId));
  const sections = [];
  sections.push({
    children: [
      new Paragraph({
        text: "DOCUMENT DE PR\xC9-PRODUCTION",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "DOCUMENT DE PR\xC9-PRODUCTION", bold: true, size: 32 })]
      }),
      new Paragraph({
        text: projectData.title,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: projectData.title, size: 28 })]
      }),
      new Paragraph({
        text: projectData.clientName ? `Client: ${projectData.clientName}` : "",
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: `Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 }
      }),
      new PageBreak()
    ]
  });
  sections.push({
    children: [
      new Paragraph({
        text: "TABLE DES MATI\xC8RES",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "1. Informations G\xE9n\xE9rales",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "2. Direction Cr\xE9ative",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "3. Sc\xE8nes et Storyboard",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "4. Lieux de Tournage",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "5. Talents et Acteurs",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "6. \xC9quipement",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "7. Calendrier de Production",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "8. \xC9quipe de Production",
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "9. Notes et Remarques",
        spacing: { after: 400 }
      }),
      new PageBreak()
    ]
  });
  sections.push({
    children: [
      new Paragraph({
        text: "1. INFORMATIONS G\xC9N\xC9RALES",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Titre du Projet", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.title })]
              })
            ]
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Client", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.clientName || "N/A" })]
              })
            ]
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Objectif", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.projectObjective || "N/A" })]
              })
            ]
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Public Cible", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.targetAudience || "N/A" })]
              })
            ]
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Dur\xE9e Estim\xE9e", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.estimatedDuration || "N/A" })]
              })
            ]
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Format de Diffusion", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.diffusionFormat || "N/A" })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ text: "", spacing: { after: 400 } }),
      new PageBreak()
    ]
  });
  if (concept.length > 0) {
    const conceptData = concept[0];
    sections.push({
      children: [
        new Paragraph({
          text: "2. DIRECTION CR\xC9ATIVE",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        }),
        ...conceptData.synopsis ? [
          new Paragraph({
            text: "Synopsis",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: conceptData.synopsis,
            spacing: { after: 200 }
          })
        ] : [],
        ...conceptData.keyMessage ? [
          new Paragraph({
            text: "Message Cl\xE9",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: conceptData.keyMessage,
            spacing: { after: 200 }
          })
        ] : [],
        ...conceptData.tone ? [
          new Paragraph({
            text: `Ton: ${conceptData.tone}`,
            spacing: { after: 100 }
          })
        ] : [],
        ...conceptData.style ? [
          new Paragraph({
            text: `Style: ${conceptData.style}`,
            spacing: { after: 200 }
          })
        ] : [],
        ...conceptData.musicType ? [
          new Paragraph({
            text: "Musique",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Type: ${conceptData.musicType}`,
            spacing: { after: 100 }
          }),
          ...conceptData.musicDescription ? [
            new Paragraph({
              text: conceptData.musicDescription,
              spacing: { after: 200 }
            })
          ] : []
        ] : [],
        new PageBreak()
      ]
    });
  }
  if (projectScenes.length > 0) {
    const sceneChildren = [
      new Paragraph({
        text: "3. SC\xC8NES ET STORYBOARD",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];
    for (const scene of projectScenes) {
      sceneChildren.push(
        new Paragraph({
          text: `Sc\xE8ne ${scene.sceneNumber}: ${scene.title || "(Sans titre)"}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 }
        }),
        ...scene.duration ? [
          new Paragraph({
            text: `Dur\xE9e: ${scene.duration}`,
            spacing: { after: 100 },
            children: [new TextRun({ text: `Dur\xE9e: ${scene.duration}`, italics: true })]
          })
        ] : [],
        ...scene.description ? [
          new Paragraph({
            text: "Description:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Description:", bold: true })]
          }),
          new Paragraph({
            text: scene.description,
            spacing: { after: 100 }
          })
        ] : [],
        ...scene.actions ? [
          new Paragraph({
            text: "Actions:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Actions:", bold: true })]
          }),
          new Paragraph({
            text: scene.actions,
            spacing: { after: 100 }
          })
        ] : [],
        ...scene.dialogue ? [
          new Paragraph({
            text: "Dialogues:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Dialogues:", bold: true })]
          }),
          new Paragraph({
            text: scene.dialogue,
            spacing: { after: 100 }
          })
        ] : [],
        ...scene.voiceOver ? [
          new Paragraph({
            text: "Voix off:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Voix off:", bold: true })]
          }),
          new Paragraph({
            text: scene.voiceOver,
            spacing: { after: 200 }
          })
        ] : []
      );
    }
    sceneChildren.push(new PageBreak());
    sections.push({ children: sceneChildren });
  }
  if (projectLocations.length > 0) {
    const locationChildren = [
      new Paragraph({
        text: "4. LIEUX DE TOURNAGE",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];
    for (const location of projectLocations) {
      locationChildren.push(
        new Paragraph({
          text: location.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 }
        }),
        ...location.address ? [
          new Paragraph({
            text: `Adresse: ${location.address}`,
            spacing: { after: 100 }
          })
        ] : [],
        ...location.description ? [
          new Paragraph({
            text: location.description,
            spacing: { after: 100 }
          })
        ] : [],
        ...location.notes ? [
          new Paragraph({
            text: `Notes: ${location.notes}`,
            spacing: { after: 200 }
          })
        ] : []
      );
    }
    locationChildren.push(new PageBreak());
    sections.push({ children: locationChildren });
  }
  if (projectTalents.length > 0) {
    const talentChildren = [
      new Paragraph({
        text: "5. TALENTS ET ACTEURS",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];
    for (const talent of projectTalents) {
      talentChildren.push(
        new Paragraph({
          text: talent.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 }
        }),
        ...talent.role ? [
          new Paragraph({
            text: `R\xF4le: ${talent.role}`,
            spacing: { after: 100 }
          })
        ] : [],
        ...talent.description ? [
          new Paragraph({
            text: talent.description,
            spacing: { after: 100 }
          })
        ] : [],
        ...talent.notes ? [
          new Paragraph({
            text: `Notes: ${talent.notes}`,
            spacing: { after: 200 }
          })
        ] : []
      );
    }
    talentChildren.push(new PageBreak());
    sections.push({ children: talentChildren });
  }
  if (projectEquipment.length > 0) {
    const equipmentChildren = [
      new Paragraph({
        text: "6. \xC9QUIPEMENT",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];
    for (const item of projectEquipment) {
      equipmentChildren.push(
        new Paragraph({
          text: item.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 }
        }),
        ...item.category ? [
          new Paragraph({
            text: `Cat\xE9gorie: ${item.category}`,
            spacing: { after: 100 }
          })
        ] : [],
        ...item.description ? [
          new Paragraph({
            text: item.description,
            spacing: { after: 100 }
          })
        ] : [],
        ...item.notes ? [
          new Paragraph({
            text: `Notes: ${item.notes}`,
            spacing: { after: 200 }
          })
        ] : []
      );
    }
    equipmentChildren.push(new PageBreak());
    sections.push({ children: equipmentChildren });
  }
  if (projectTimeline.length > 0) {
    const timelineChildren = [
      new Paragraph({
        text: "7. CALENDRIER DE PRODUCTION",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];
    for (const entry of projectTimeline) {
      timelineChildren.push(
        new Paragraph({
          text: entry.phaseName,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 }
        }),
        ...entry.startDate && entry.endDate ? [
          new Paragraph({
            text: `${new Date(entry.startDate).toLocaleDateString("fr-FR")} - ${new Date(entry.endDate).toLocaleDateString("fr-FR")}`,
            spacing: { after: 100 },
            children: [new TextRun({
              text: `${new Date(entry.startDate).toLocaleDateString("fr-FR")} - ${new Date(entry.endDate).toLocaleDateString("fr-FR")}`,
              italics: true
            })]
          })
        ] : [],
        ...entry.description ? [
          new Paragraph({
            text: entry.description,
            spacing: { after: 200 }
          })
        ] : []
      );
    }
    timelineChildren.push(new PageBreak());
    sections.push({ children: timelineChildren });
  }
  if (projectTeam.length > 0) {
    const teamChildren = [
      new Paragraph({
        text: "8. \xC9QUIPE DE PRODUCTION",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];
    const teamTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          height: { value: 400, rule: "auto" },
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Nom", bold: true })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "R\xF4le", bold: true })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Contact", bold: true })]
              })]
            })
          ]
        }),
        ...projectTeam.map(
          (member) => new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({ text: member.name })]
              }),
              new TableCell({
                children: [new Paragraph({ text: member.role })]
              }),
              new TableCell({
                children: [new Paragraph({ text: `${member.email || ""} ${member.phone || ""}`.trim() })]
              })
            ]
          })
        )
      ]
    });
    teamChildren.push(teamTable);
    teamChildren.push(new PageBreak());
    sections.push({ children: teamChildren });
  }
  if (projectNotesData.length > 0) {
    const notesChildren = [
      new Paragraph({
        text: "9. NOTES ET REMARQUES",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];
    for (const note of projectNotesData) {
      notesChildren.push(
        ...note.title ? [
          new Paragraph({
            text: note.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          })
        ] : [],
        ...note.category ? [
          new Paragraph({
            text: `[${note.category}]`,
            spacing: { after: 50 },
            children: [new TextRun({
              text: `[${note.category}]`,
              italics: true
            })]
          })
        ] : [],
        ...note.content ? [
          new Paragraph({
            text: note.content,
            spacing: { after: 200 }
          })
        ] : []
      );
    }
    sections.push({ children: notesChildren });
  }
  const doc = new Document({
    sections
  });
  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
var init_pdfGenerator = __esm({
  "server/pdfGenerator.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/routers.ts
import { z as z2 } from "zod";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db();

// server/storage.ts
init_env();
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
import { v4 as uuidv4 } from "uuid";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // ========== PROJECT PROCEDURES ==========
  project: router({
    create: protectedProcedure.input(z2.object({
      title: z2.string().min(1),
      clientName: z2.string().optional(),
      projectObjective: z2.string().optional(),
      targetAudience: z2.string().optional(),
      estimatedDuration: z2.string().optional(),
      diffusionFormat: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      const projectId = uuidv4();
      return createProject({
        id: projectId,
        userId: ctx.user.id,
        ...input
      });
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserProjects(ctx.user.id);
    }),
    get: protectedProcedure.input(z2.object({ id: z2.string() })).query(async ({ input }) => {
      return getProject(input.id);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      title: z2.string().optional(),
      clientName: z2.string().optional(),
      projectObjective: z2.string().optional(),
      targetAudience: z2.string().optional(),
      estimatedDuration: z2.string().optional(),
      diffusionFormat: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateProject(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteProject(input.id);
      return { success: true };
    })
  }),
  // ========== CREATIVE CONCEPT PROCEDURES ==========
  creativeConcept: router({
    getOrCreate: protectedProcedure.input(z2.object({ projectId: z2.string() })).mutation(async ({ input }) => {
      let concept = await getCreativeConcept(input.projectId);
      if (!concept) {
        concept = await createCreativeConcept({
          id: uuidv4(),
          projectId: input.projectId
        });
      }
      return concept;
    }),
    update: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      synopsis: z2.string().optional(),
      keyMessage: z2.string().optional(),
      tone: z2.string().optional(),
      style: z2.string().optional(),
      musicType: z2.string().optional(),
      musicDescription: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { projectId, ...data } = input;
      return updateCreativeConcept(projectId, data);
    })
  }),
  // ========== MOODBOARD IMAGES PROCEDURES ==========
  moodboardImage: router({
    upload: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      fileBuffer: z2.instanceof(Buffer),
      fileName: z2.string(),
      description: z2.string().optional()
    })).mutation(async ({ input }) => {
      const s3Key = `moodboard/${input.projectId}/${uuidv4()}-${input.fileName}`;
      const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
      return createMoodboardImage({
        id: uuidv4(),
        projectId: input.projectId,
        imageUrl: url,
        s3Key,
        description: input.description
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectMoodboardImages(input.projectId);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteMoodboardImage(input.id);
      return { success: true };
    })
  }),
  // ========== SCENES PROCEDURES ==========
  scene: router({
    create: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      sceneNumber: z2.number(),
      title: z2.string().optional(),
      description: z2.string().optional(),
      actions: z2.string().optional(),
      dialogue: z2.string().optional(),
      voiceOver: z2.string().optional(),
      duration: z2.string().optional()
    })).mutation(async ({ input }) => {
      return createScene({
        id: uuidv4(),
        ...input
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectScenes(input.projectId);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      sceneNumber: z2.number().optional(),
      title: z2.string().optional(),
      description: z2.string().optional(),
      actions: z2.string().optional(),
      dialogue: z2.string().optional(),
      voiceOver: z2.string().optional(),
      duration: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateScene(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteScene(input.id);
      return { success: true };
    })
  }),
  // ========== SCENE IMAGES PROCEDURES ==========
  sceneImage: router({
    upload: protectedProcedure.input(z2.object({
      sceneId: z2.string(),
      fileBuffer: z2.instanceof(Buffer),
      fileName: z2.string(),
      caption: z2.string().optional()
    })).mutation(async ({ input }) => {
      const s3Key = `scenes/${input.sceneId}/${uuidv4()}-${input.fileName}`;
      const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
      return createSceneImage({
        id: uuidv4(),
        sceneId: input.sceneId,
        imageUrl: url,
        s3Key,
        caption: input.caption
      });
    }),
    list: protectedProcedure.input(z2.object({ sceneId: z2.string() })).query(async ({ input }) => {
      return getSceneImages(input.sceneId);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteSceneImage(input.id);
      return { success: true };
    })
  }),
  // ========== LOCATIONS PROCEDURES ==========
  location: router({
    create: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      name: z2.string().min(1),
      address: z2.string().optional(),
      description: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      return createLocation({
        id: uuidv4(),
        ...input
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectLocations(input.projectId);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      name: z2.string().optional(),
      address: z2.string().optional(),
      description: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateLocation(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteLocation(input.id);
      return { success: true };
    })
  }),
  // ========== LOCATION IMAGES PROCEDURES ==========
  locationImage: router({
    upload: protectedProcedure.input(z2.object({
      locationId: z2.string(),
      fileBuffer: z2.instanceof(Buffer),
      fileName: z2.string(),
      caption: z2.string().optional()
    })).mutation(async ({ input }) => {
      const s3Key = `locations/${input.locationId}/${uuidv4()}-${input.fileName}`;
      const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
      return createLocationImage({
        id: uuidv4(),
        locationId: input.locationId,
        imageUrl: url,
        s3Key,
        caption: input.caption
      });
    }),
    list: protectedProcedure.input(z2.object({ locationId: z2.string() })).query(async ({ input }) => {
      return getLocationImages(input.locationId);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteLocationImage(input.id);
      return { success: true };
    })
  }),
  // ========== TALENTS PROCEDURES ==========
  talent: router({
    create: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      name: z2.string().min(1),
      role: z2.string().optional(),
      description: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      return createTalent({
        id: uuidv4(),
        ...input
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectTalents(input.projectId);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      name: z2.string().optional(),
      role: z2.string().optional(),
      description: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateTalent(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteTalent(input.id);
      return { success: true };
    })
  }),
  // ========== TALENT IMAGES PROCEDURES ==========
  talentImage: router({
    upload: protectedProcedure.input(z2.object({
      talentId: z2.string(),
      fileBuffer: z2.instanceof(Buffer),
      fileName: z2.string(),
      caption: z2.string().optional()
    })).mutation(async ({ input }) => {
      const s3Key = `talents/${input.talentId}/${uuidv4()}-${input.fileName}`;
      const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
      return createTalentImage({
        id: uuidv4(),
        talentId: input.talentId,
        imageUrl: url,
        s3Key,
        caption: input.caption
      });
    }),
    list: protectedProcedure.input(z2.object({ talentId: z2.string() })).query(async ({ input }) => {
      return getTalentImages(input.talentId);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteTalentImage(input.id);
      return { success: true };
    })
  }),
  // ========== EQUIPMENT PROCEDURES ==========
  equipment: router({
    create: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      name: z2.string().min(1),
      category: z2.string().optional(),
      description: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      return createEquipment({
        id: uuidv4(),
        ...input
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectEquipment(input.projectId);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      name: z2.string().optional(),
      category: z2.string().optional(),
      description: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateEquipment(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteEquipment(input.id);
      return { success: true };
    })
  }),
  // ========== TIMELINE PROCEDURES ==========
  timeline: router({
    create: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      phaseName: z2.string().min(1),
      description: z2.string().optional(),
      startDate: z2.date().optional(),
      endDate: z2.date().optional()
    })).mutation(async ({ input }) => {
      return createTimelineEntry({
        id: uuidv4(),
        ...input
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectTimeline(input.projectId);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      phaseName: z2.string().optional(),
      description: z2.string().optional(),
      startDate: z2.date().optional(),
      endDate: z2.date().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateTimelineEntry(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteTimelineEntry(input.id);
      return { success: true };
    })
  }),
  // ========== TEAM MEMBERS PROCEDURES ==========
  teamMember: router({
    create: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      name: z2.string().min(1),
      role: z2.string().min(1),
      email: z2.string().optional(),
      phone: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      return createTeamMember({
        id: uuidv4(),
        ...input
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectTeamMembers(input.projectId);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      name: z2.string().optional(),
      role: z2.string().optional(),
      email: z2.string().optional(),
      phone: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateTeamMember(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteTeamMember(input.id);
      return { success: true };
    })
  }),
  // ========== PDF GENERATION PROCEDURES ==========
  pdf: router({
    generateProjectPDF: protectedProcedure.input(z2.object({ projectId: z2.string() })).mutation(async ({ input }) => {
      const { generateProjectPDF: generateProjectPDF2 } = await Promise.resolve().then(() => (init_pdfGenerator(), pdfGenerator_exports));
      const buffer = await generateProjectPDF2(input.projectId);
      const project = await getProject(input.projectId);
      const fileName = `${project?.title || "projet"}_preproduction.docx`;
      const { url } = await storagePut(
        `pdfs/${input.projectId}/${Date.now()}-${fileName}`,
        buffer,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      return { url, fileName };
    })
  }),
  // ========== PROJECT NOTES PROCEDURES ==========
  projectNote: router({
    create: protectedProcedure.input(z2.object({
      projectId: z2.string(),
      title: z2.string().optional(),
      content: z2.string().optional(),
      category: z2.string().optional()
    })).mutation(async ({ input }) => {
      return createProjectNote({
        id: uuidv4(),
        ...input
      });
    }),
    list: protectedProcedure.input(z2.object({ projectId: z2.string() })).query(async ({ input }) => {
      return getProjectNotes(input.projectId);
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.string(),
      title: z2.string().optional(),
      content: z2.string().optional(),
      category: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateProjectNote(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.string() })).mutation(async ({ input }) => {
      await deleteProjectNote(input.id);
      return { success: true };
    })
  })
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var SDKServer = class {
  constructor() {
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  // OAuth methods removed - using local storage only
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a user ID
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.id);
   */
  async createSessionToken(userId, options = {}) {
    return this.signSession(
      {
        openId: userId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  // getUserInfoWithJwt removed - using local storage only
  async authenticateRequest(req) {
    const defaultUserId = "local-user";
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUser(defaultUserId);
    if (!user) {
      await upsertUser({
        id: defaultUserId,
        name: "Utilisateur Local",
        email: null,
        loginMethod: "local",
        lastSignedIn: signedInAt
      });
      user = await getUser(defaultUserId);
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      id: user.id,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tabs"]
        }
      }
    }
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
