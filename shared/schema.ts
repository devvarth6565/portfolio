import { z } from "zod";

export const insertProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  icon: z.string().default("folder").optional().nullable(),
  date: z.string(),
});

export const projectSchema = insertProjectSchema.extend({
  id: z.number(),
});

export type Project = z.infer<typeof projectSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
