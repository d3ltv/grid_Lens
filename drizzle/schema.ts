import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table - stores pre-production project metadata
 */
export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 255 }),
  projectObjective: text("projectObjective"),
  targetAudience: varchar("targetAudience", { length: 255 }),
  estimatedDuration: varchar("estimatedDuration", { length: 100 }),
  diffusionFormat: varchar("diffusionFormat", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Creative concepts - stores creative direction and mood
 */
export const creativeConcepts = mysqlTable("creativeConcepts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  synopsis: text("synopsis"),
  keyMessage: text("keyMessage"),
  tone: varchar("tone", { length: 255 }),
  style: varchar("style", { length: 255 }),
  musicType: varchar("musicType", { length: 255 }),
  musicDescription: text("musicDescription"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type CreativeConcept = typeof creativeConcepts.$inferSelect;
export type InsertCreativeConcept = typeof creativeConcepts.$inferInsert;

/**
 * Mood board images - stores references to uploaded mood board images
 */
export const moodboardImages = mysqlTable("moodboardImages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  s3Key: varchar("s3Key", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type MoodboardImage = typeof moodboardImages.$inferSelect;
export type InsertMoodboardImage = typeof moodboardImages.$inferInsert;

/**
 * Scenes - stores scene/shot breakdown
 */
export const scenes = mysqlTable("scenes", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Scene = typeof scenes.$inferSelect;
export type InsertScene = typeof scenes.$inferInsert;

/**
 * Scene images - stores storyboard images for scenes
 */
export const sceneImages = mysqlTable("sceneImages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sceneId: varchar("sceneId", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  s3Key: varchar("s3Key", { length: 500 }),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type SceneImage = typeof sceneImages.$inferSelect;
export type InsertSceneImage = typeof sceneImages.$inferInsert;

/**
 * Locations - stores filming locations
 */
export const locations = mysqlTable("locations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

/**
 * Location images - stores photos of filming locations
 */
export const locationImages = mysqlTable("locationImages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  locationId: varchar("locationId", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  s3Key: varchar("s3Key", { length: 500 }),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type LocationImage = typeof locationImages.$inferSelect;
export type InsertLocationImage = typeof locationImages.$inferInsert;

/**
 * Talents/Actors - stores talent information
 */
export const talents = mysqlTable("talents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Talent = typeof talents.$inferSelect;
export type InsertTalent = typeof talents.$inferInsert;

/**
 * Talent images - stores photos of talents
 */
export const talentImages = mysqlTable("talentImages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  talentId: varchar("talentId", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  s3Key: varchar("s3Key", { length: 500 }),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type TalentImage = typeof talentImages.$inferSelect;
export type InsertTalentImage = typeof talentImages.$inferInsert;

/**
 * Production equipment - stores equipment needed for production
 */
export const equipment = mysqlTable("equipment", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;

/**
 * Timeline/Schedule - stores key dates and phases
 */
export const timeline = mysqlTable("timeline", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  phaseName: varchar("phaseName", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type TimelineEntry = typeof timeline.$inferSelect;
export type InsertTimelineEntry = typeof timeline.$inferInsert;

/**
 * Team members - stores production team information
 */
export const teamMembers = mysqlTable("teamMembers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Project notes - stores general notes and comments
 */
export const projectNotes = mysqlTable("projectNotes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type ProjectNote = typeof projectNotes.$inferSelect;
export type InsertProjectNote = typeof projectNotes.$inferInsert;

