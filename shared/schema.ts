import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumeAnalyses = pgTable("resume_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  originalText: text("original_text").notNull(),
  fileName: text("file_name"),
  analysisData: jsonb("analysis_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resume analysis schema
export const contactSchema = z.object({
  email: z.string().nullable(),
  phone: z.string().nullable(),
  linkedin: z.string().nullable(),
});

export const experienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  start: z.string().nullable(),
  end: z.string().nullable(),
  bullets: z.array(z.string()),
});

export const educationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  year: z.string().nullable(),
});

export const projectSchema = z.object({
  name: z.string(),
  desc: z.string(),
});

export const parsedResumeSchema = z.object({
  name: z.string().nullable(),
  title: z.string().nullable(),
  contact: contactSchema,
  summary: z.string().nullable(),
  skills: z.array(z.string()),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  certifications: z.array(z.string()),
});

export const lineItemSuggestionSchema = z.object({
  location: z.object({
    section: z.string(),
    index: z.number(),
  }),
  suggested_bullets: z.array(z.string()),
});

export const jobFitSchema = z.object({
  jd_title: z.string().nullable(),
  match_score: z.number(),
  gaps: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export const resumeAnalysisSchema = z.object({
  parsed: parsedResumeSchema,
  score: z.number().min(0).max(100),
  high_level_advice: z.array(z.string()),
  line_item_suggestions: z.array(lineItemSuggestionSchema),
  fit_for_job: jobFitSchema,
});

export const analyzeRequestSchema = z.object({
  resumeText: z.string().min(1),
  jobDescription: z.string().optional(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;
export type ParsedResume = z.infer<typeof parsedResumeSchema>;
export type ResumeAnalysisResult = z.infer<typeof resumeAnalysisSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
