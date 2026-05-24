import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  description: text("description").notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  prerequisites: text("prerequisites", { mode: "json" }).$type<string[]>().notNull(),
  exercises: text("exercises", { mode: "json" }).$type<string[]>().notNull(),
  resources: text("resources", { mode: "json" }).$type<string[]>().notNull(),
  certifications: text("certifications", { mode: "json" }).$type<string[]>().notNull(),
  cloudMappings: text("cloud_mappings", { mode: "json" }).notNull(),
  nextSkills: text("next_skills", { mode: "json" }).$type<string[]>().notNull(),
});

export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  url: text("url").notNull(),
  recommendedFor: text("recommended_for", { mode: "json" }).$type<string[]>().notNull(),
  relatedSkills: text("related_skills", { mode: "json" }).$type<string[]>().notNull(),
});

export const resources = sqliteTable("resources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", { enum: ["docs", "course", "repo", "paper", "video", "blog"] }).notNull(),
  url: text("url").notNull(),
  provider: text("provider").notNull(),
  relatedSkills: text("related_skills", { mode: "json" }).$type<string[]>().notNull(),
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
});
