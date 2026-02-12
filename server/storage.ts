import { and, eq, ilike, or } from "drizzle-orm";
import {
  tutorAvailability,
  tutorProfiles,
  tutorSubjects,
  tuteeProfiles,
  sessionsTable,
  users,
  type CreateAvailabilityRequest,
  type CreateSessionRequest,
  type CreateTutorProfileRequest,
  type CreateTutorSubjectRequest,
  type CreateTuteeProfileRequest,
  type MarketplaceSession,
  type TutorAvailability,
  type TutorProfile,
  type TutorSearchQueryParams,
  type TutorSubject,
  type TuteeProfile,
  type UpdateSessionRequest,
  type UpdateTutorProfileRequest,
  type UpdateTutorSubjectRequest,
  type UpdateTuteeProfileRequest,
  type User,
} from "@shared/schema";
import { db } from "./db";

export interface TutorSearchResult {
  user: User;
  tutorProfile: TutorProfile;
  subjects: TutorSubject[];
  availability: TutorAvailability[];
}

export interface TutorDetailResult extends TutorSearchResult {}

export interface IStorage {
  getCurrentUser(userId: string): Promise<User | undefined>;

  getTutorProfile(userId: string): Promise<TutorProfile | undefined>;
  upsertTutorProfile(
    userId: string,
    input: CreateTutorProfileRequest,
  ): Promise<TutorProfile>;
  updateTutorProfile(
    userId: string,
    updates: UpdateTutorProfileRequest,
  ): Promise<TutorProfile>;

  getTuteeProfile(userId: string): Promise<TuteeProfile | undefined>;
  upsertTuteeProfile(
    userId: string,
    input: CreateTuteeProfileRequest,
  ): Promise<TuteeProfile>;
  updateTuteeProfile(
    userId: string,
    updates: UpdateTuteeProfileRequest,
  ): Promise<TuteeProfile>;

  searchTutors(params?: TutorSearchQueryParams): Promise<TutorSearchResult[]>;
  getTutor(tutorId: string): Promise<TutorDetailResult | undefined>;

  listTutorSubjects(tutorId: string): Promise<TutorSubject[]>;
  addTutorSubject(
    tutorId: string,
    input: CreateTutorSubjectRequest,
  ): Promise<TutorSubject>;
  updateTutorSubject(
    tutorId: string,
    subjectId: string,
    updates: UpdateTutorSubjectRequest,
  ): Promise<TutorSubject | undefined>;
  deleteTutorSubject(tutorId: string, subjectId: string): Promise<boolean>;

  listTutorAvailability(tutorId: string): Promise<TutorAvailability[]>;
  addTutorAvailability(
    tutorId: string,
    input: CreateAvailabilityRequest,
  ): Promise<TutorAvailability>;
  deleteTutorAvailability(
    tutorId: string,
    availabilityId: string,
  ): Promise<boolean>;

  listMySessions(userId: string): Promise<MarketplaceSession[]>;
  createSession(
    tuteeId: string,
    input: CreateSessionRequest,
  ): Promise<MarketplaceSession>;
  updateSession(
    sessionId: string,
    userId: string,
    updates: UpdateSessionRequest,
  ): Promise<MarketplaceSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getCurrentUser(userId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  async getTutorProfile(userId: string): Promise<TutorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(tutorProfiles)
      .where(eq(tutorProfiles.userId, userId));
    return profile;
  }

  async upsertTutorProfile(
    userId: string,
    input: CreateTutorProfileRequest,
  ): Promise<TutorProfile> {
    const [profile] = await db
      .insert(tutorProfiles)
      .values({ ...input, userId })
      .onConflictDoUpdate({
        target: tutorProfiles.userId,
        set: { ...input },
      })
      .returning();
    return profile;
  }

  async updateTutorProfile(
    userId: string,
    updates: UpdateTutorProfileRequest,
  ): Promise<TutorProfile> {
    const [updated] = await db
      .update(tutorProfiles)
      .set({ ...updates })
      .where(eq(tutorProfiles.userId, userId))
      .returning();
    return updated;
  }

  async getTuteeProfile(userId: string): Promise<TuteeProfile | undefined> {
    const [profile] = await db
      .select()
      .from(tuteeProfiles)
      .where(eq(tuteeProfiles.userId, userId));
    return profile;
  }

  async upsertTuteeProfile(
    userId: string,
    input: CreateTuteeProfileRequest,
  ): Promise<TuteeProfile> {
    const [profile] = await db
      .insert(tuteeProfiles)
      .values({ ...input, userId })
      .onConflictDoUpdate({
        target: tuteeProfiles.userId,
        set: { ...input },
      })
      .returning();
    return profile;
  }

  async updateTuteeProfile(
    userId: string,
    updates: UpdateTuteeProfileRequest,
  ): Promise<TuteeProfile> {
    const [updated] = await db
      .update(tuteeProfiles)
      .set({ ...updates })
      .where(eq(tuteeProfiles.userId, userId))
      .returning();
    return updated;
  }

  async listTutorSubjects(tutorId: string): Promise<TutorSubject[]> {
    return await db
      .select()
      .from(tutorSubjects)
      .where(eq(tutorSubjects.tutorId, tutorId));
  }

  async addTutorSubject(
    tutorId: string,
    input: CreateTutorSubjectRequest,
  ): Promise<TutorSubject> {
    const [created] = await db
      .insert(tutorSubjects)
      .values({ ...input, tutorId })
      .returning();
    return created;
  }

  async updateTutorSubject(
    tutorId: string,
    subjectId: string,
    updates: UpdateTutorSubjectRequest,
  ): Promise<TutorSubject | undefined> {
    const [updated] = await db
      .update(tutorSubjects)
      .set({ ...updates })
      .where(and(eq(tutorSubjects.id, subjectId), eq(tutorSubjects.tutorId, tutorId)))
      .returning();
    return updated;
  }

  async deleteTutorSubject(tutorId: string, subjectId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(tutorSubjects)
      .where(and(eq(tutorSubjects.id, subjectId), eq(tutorSubjects.tutorId, tutorId)))
      .returning();
    return !!deleted;
  }

  async listTutorAvailability(tutorId: string): Promise<TutorAvailability[]> {
    return await db
      .select()
      .from(tutorAvailability)
      .where(eq(tutorAvailability.tutorId, tutorId));
  }

  async addTutorAvailability(
    tutorId: string,
    input: CreateAvailabilityRequest,
  ): Promise<TutorAvailability> {
    const [created] = await db
      .insert(tutorAvailability)
      .values({ ...input, tutorId })
      .returning();
    return created;
  }

  async deleteTutorAvailability(
    tutorId: string,
    availabilityId: string,
  ): Promise<boolean> {
    const [deleted] = await db
      .delete(tutorAvailability)
      .where(
        and(
          eq(tutorAvailability.id, availabilityId),
          eq(tutorAvailability.tutorId, tutorId),
        ),
      )
      .returning();
    return !!deleted;
  }

  async searchTutors(params?: TutorSearchQueryParams): Promise<TutorSearchResult[]> {
    const p = params ?? {};

    const whereParts = [eq(tutorProfiles.isActive, p.isActive ?? true)];

    if (p.university) {
      whereParts.push(eq(tutorProfiles.university, p.university));
    }

    const rows = await db
      .select({
        user: users,
        tutorProfile: tutorProfiles,
      })
      .from(tutorProfiles)
      .innerJoin(users, eq(users.id, tutorProfiles.userId))
      .where(and(...whereParts));

    let tutorIds = rows.map((r) => r.user.id);

    if (p.subject || p.minRateCents !== undefined || p.maxRateCents !== undefined) {
      const subjectWhere: any[] = [];
      if (p.subject) {
        subjectWhere.push(ilike(tutorSubjects.subject, `%${p.subject}%`));
      }
      if (p.minRateCents !== undefined) {
        subjectWhere.push(sql`${tutorSubjects.hourlyRateCents} >= ${p.minRateCents}`);
      }
      if (p.maxRateCents !== undefined) {
        subjectWhere.push(sql`${tutorSubjects.hourlyRateCents} <= ${p.maxRateCents}`);
      }

      const subjectMatches = await db
        .select({ tutorId: tutorSubjects.tutorId })
        .from(tutorSubjects)
        .where(and(eq(tutorSubjects.tutorId, tutorSubjects.tutorId), ...subjectWhere));

      const matchIds = new Set(subjectMatches.map((m) => m.tutorId));
      tutorIds = tutorIds.filter((id) => matchIds.has(id));
    }

    const subjects = await db
      .select()
      .from(tutorSubjects)
      .where(or(...tutorIds.map((id) => eq(tutorSubjects.tutorId, id))));

    const availability = await db
      .select()
      .from(tutorAvailability)
      .where(or(...tutorIds.map((id) => eq(tutorAvailability.tutorId, id))));

    const byTutorSubjects = new Map<string, TutorSubject[]>();
    for (const s of subjects) {
      const list = byTutorSubjects.get(s.tutorId) ?? [];
      list.push(s);
      byTutorSubjects.set(s.tutorId, list);
    }

    const byTutorAvail = new Map<string, TutorAvailability[]>();
    for (const a of availability) {
      const list = byTutorAvail.get(a.tutorId) ?? [];
      list.push(a);
      byTutorAvail.set(a.tutorId, list);
    }

    return rows
      .filter((r) => tutorIds.includes(r.user.id))
      .map((r) => ({
        user: r.user,
        tutorProfile: r.tutorProfile,
        subjects: byTutorSubjects.get(r.user.id) ?? [],
        availability: byTutorAvail.get(r.user.id) ?? [],
      }));
  }

  async getTutor(tutorId: string): Promise<TutorDetailResult | undefined> {
    const [row] = await db
      .select({ user: users, tutorProfile: tutorProfiles })
      .from(tutorProfiles)
      .innerJoin(users, eq(users.id, tutorProfiles.userId))
      .where(eq(users.id, tutorId));

    if (!row) return undefined;

    const subjects = await this.listTutorSubjects(tutorId);
    const availability = await this.listTutorAvailability(tutorId);

    return {
      user: row.user,
      tutorProfile: row.tutorProfile,
      subjects,
      availability,
    };
  }

  async listMySessions(userId: string): Promise<MarketplaceSession[]> {
    return await db
      .select()
      .from(sessionsTable)
      .where(or(eq(sessionsTable.tutorId, userId), eq(sessionsTable.tuteeId, userId)));
  }

  async createSession(
    tuteeId: string,
    input: CreateSessionRequest,
  ): Promise<MarketplaceSession> {
    const platformFeeRate = 0.15;

    const totalAmountCents =
      input.totalAmountCents ??
      Math.round((input.hourlyRateCents * input.durationMinutes) / 60);

    const platformFeeCents =
      input.platformFeeCents ?? Math.round(totalAmountCents * platformFeeRate);

    const tutorEarningsCents =
      input.tutorEarningsCents ?? totalAmountCents - platformFeeCents;

    const values: CreateSessionRequest = {
      ...input,
      tuteeId,
      status: input.status ?? "pending",
      paymentStatus: input.paymentStatus ?? "pending",
      totalAmountCents,
      platformFeeCents,
      tutorEarningsCents,
    };

    const [created] = await db
      .insert(sessionsTable)
      .values({ ...values, updatedAt: new Date() })
      .returning();
    return created;
  }

  async updateSession(
    sessionId: string,
    userId: string,
    updates: UpdateSessionRequest,
  ): Promise<MarketplaceSession | undefined> {
    const [existing] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId));

    if (!existing) return undefined;

    if (existing.tutorId !== userId && existing.tuteeId !== userId) {
      return undefined;
    }

    const [updated] = await db
      .update(sessionsTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(sessionsTable.id, sessionId))
      .returning();

    return updated;
  }
}

export const storage = new DatabaseStorage();
