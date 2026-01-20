import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"), // For detailed text or HTML content
  videoUrl: text("video_url"), // For the media player
  icon: text("icon").default("folder"), // 'folder' or 'file'
  date: text("date").notNull(), // Display date like "Oct 2023"
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
