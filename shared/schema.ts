import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const appAnalyses = pgTable("app_analyses", {
  id: serial("id").primaryKey(),
  appName: text("app_name").notNull(),
  packageName: text("package_name").notNull(),
  developerName: text("developer_name"),
  appIcon: text("app_icon"),
  appRating: text("app_rating"),
  reviewCount: integer("review_count").notNull(),
  averageSentiment: integer("average_sentiment").notNull(),
  positivePercentage: integer("positive_percentage").notNull(),
  negativePercentage: integer("negative_percentage").notNull(),
  neutralPercentage: integer("neutral_percentage").notNull(),
  sampleReviews: json("sample_reviews"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppAnalysisSchema = createInsertSchema(appAnalyses).omit({
  id: true,
  createdAt: true,
});

export const reviewSchema = z.object({
  id: z.string(),
  userName: z.string().nullable(),
  userImage: z.string().nullable(),
  content: z.string(),
  score: z.number().min(1).max(5),
  thumbsUpCount: z.number().optional(),
  reviewCreatedVersion: z.string().nullable(),
  at: z.string(),
  replyContent: z.string().nullable(),
  replyAt: z.string().nullable(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).nullable(),
  sentimentScore: z.number().optional(),
});

export const appInfoSchema = z.object({
  name: z.string(),
  packageName: z.string(),
  developer: z.string().nullable(),
  icon: z.string().nullable(),
  rating: z.string().nullable(),
});

export const sentimentAnalysisSchema = z.object({
  averageScore: z.number(),
  reviewCount: z.number(),
  date: z.string(),
  positivePercentage: z.number(),
  negativePercentage: z.number(),
  neutralPercentage: z.number(),
});

export const analysisResultSchema = z.object({
  appInfo: appInfoSchema,
  sentimentData: sentimentAnalysisSchema,
  reviewSamples: z.array(reviewSchema),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AppAnalysis = typeof appAnalyses.$inferSelect;
export type InsertAppAnalysis = z.infer<typeof insertAppAnalysisSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type AppInfo = z.infer<typeof appInfoSchema>;
export type SentimentAnalysis = z.infer<typeof sentimentAnalysisSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
