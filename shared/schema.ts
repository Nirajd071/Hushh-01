import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =========================
// Replit Auth (MANDATORY)
// =========================
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// =========================
// StudyBuddy core tables
// =========================

export const tutorProfiles = pgTable(
  "tutor_profiles",
  {
    userId: varchar("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    university: text("university").notNull(),
    yearOfStudy: integer("year_of_study"),
    major: text("major"),
    bio: text("bio"),
    isActive: boolean("is_active").notNull().default(true),
    timezone: text("timezone").notNull().default("America/New_York"),
  },
  (table) => [index("IDX_tutor_profiles_active").on(table.isActive)],
);

export const tuteeProfiles = pgTable(
  "tutee_profiles",
  {
    userId: varchar("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    university: text("university").notNull(),
    yearOfStudy: integer("year_of_study"),
    major: text("major"),
    subjects: text("subjects").array().notNull().default(sql`ARRAY[]::text[]`),
    timezone: text("timezone").notNull().default("America/New_York"),
  },
  (table) => [index("IDX_tutee_profiles_university").on(table.university)],
);

export const tutorSubjects = pgTable(
  "tutor_subjects",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    tutorId: varchar("tutor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    proficiency: text("proficiency").notNull(), // beginner | intermediate | expert
    hourlyRateCents: integer("hourly_rate_cents").notNull(),
    description: text("description"),
  },
  (table) => [
    index("IDX_tutor_subjects_tutor").on(table.tutorId),
    index("IDX_tutor_subjects_subject").on(table.subject),
    uniqueIndex("UQ_tutor_subjects_tutor_subject").on(
      table.tutorId,
      table.subject,
    ),
  ],
);

export const tutorAvailability = pgTable(
  "tutor_availability",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    tutorId: varchar("tutor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(), // 0..6
    startTime: text("start_time").notNull(), // HH:MM
    endTime: text("end_time").notNull(), // HH:MM
  },
  (table) => [
    index("IDX_tutor_availability_tutor").on(table.tutorId),
    index("IDX_tutor_availability_day").on(table.dayOfWeek),
  ],
);

export const sessionsTable = pgTable(
  "sessions_marketplace",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    tutorId: varchar("tutor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    tuteeId: varchar("tutee_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    subject: text("subject").notNull(),
    status: text("status").notNull(), // pending | confirmed | completed | cancelled
    scheduledAt: timestamp("scheduled_at").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    hourlyRateCents: integer("hourly_rate_cents").notNull(),
    totalAmountCents: integer("total_amount_cents").notNull(),
    platformFeeCents: integer("platform_fee_cents").notNull(),
    tutorEarningsCents: integer("tutor_earnings_cents").notNull(),
    paymentStatus: text("payment_status").notNull(), // pending | paid | refunded
    meetingLink: text("meeting_link"),
    tuteeNotes: text("tutee_notes"),
    tutorNotes: text("tutor_notes"),
    ratingScore: integer("rating_score"),
    ratingReview: text("rating_review"),
    cancellationBy: text("cancellation_by"),
    cancellationReason: text("cancellation_reason"),
    cancellationRefundCents: integer("cancellation_refund_cents"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("IDX_sessions_tutor").on(table.tutorId),
    index("IDX_sessions_tutee").on(table.tuteeId),
    index("IDX_sessions_status").on(table.status),
    index("IDX_sessions_scheduled_at").on(table.scheduledAt),
  ],
);

// =========================
// Zod schemas
// =========================

export const upsertUserSchema = createInsertSchema(users);

export const insertTutorProfileSchema = createInsertSchema(tutorProfiles).omit({
  userId: true,
});

export const insertTuteeProfileSchema = createInsertSchema(tuteeProfiles).omit({
  userId: true,
});

export const insertTutorSubjectSchema = createInsertSchema(tutorSubjects).omit({
  id: true,
});

export const insertTutorAvailabilitySchema = createInsertSchema(
  tutorAvailability,
).omit({ id: true });

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// =========================
// Explicit API contract types
// =========================

export type TutorProfile = typeof tutorProfiles.$inferSelect;
export type InsertTutorProfile = z.infer<typeof insertTutorProfileSchema>;

export type TuteeProfile = typeof tuteeProfiles.$inferSelect;
export type InsertTuteeProfile = z.infer<typeof insertTuteeProfileSchema>;

export type TutorSubject = typeof tutorSubjects.$inferSelect;
export type InsertTutorSubject = z.infer<typeof insertTutorSubjectSchema>;

export type TutorAvailability = typeof tutorAvailability.$inferSelect;
export type InsertTutorAvailability = z.infer<typeof insertTutorAvailabilitySchema>;

export type MarketplaceSession = typeof sessionsTable.$inferSelect;
export type InsertMarketplaceSession = z.infer<typeof insertSessionSchema>;

export type CreateTutorProfileRequest = InsertTutorProfile;
export type UpdateTutorProfileRequest = Partial<InsertTutorProfile>;

export type CreateTuteeProfileRequest = InsertTuteeProfile;
export type UpdateTuteeProfileRequest = Partial<InsertTuteeProfile>;

export type CreateTutorSubjectRequest = InsertTutorSubject;
export type UpdateTutorSubjectRequest = Partial<InsertTutorSubject>;

export type CreateAvailabilityRequest = InsertTutorAvailability;
export type UpdateAvailabilityRequest = Partial<InsertTutorAvailability>;

export type CreateSessionRequest = InsertMarketplaceSession;
export type UpdateSessionRequest = Partial<InsertMarketplaceSession>;

export type CurrentUserResponse = User | null;

export interface TutorSearchQueryParams {
  subject?: string;
  university?: string;
  minRateCents?: number;
  maxRateCents?: number;
  isActive?: boolean;
}
