import { db } from "./db";
import {
  tutorAvailability,
  tutorProfiles,
  tutorSubjects,
  tuteeProfiles,
  users,
} from "@shared/schema";

export async function seedDatabase(): Promise<void> {
  const [{ count }]: Array<{ count: number }> = await db.execute(
    // drizzle returns unknown for raw queries; safe scalar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await import("drizzle-orm")).sql`select count(*)::int as count from users`,
  ) as any;

  if (count > 0) return;

  // Seed a few realistic campus users + tutor data
  const [alice, ben, carla] = await db
    .insert(users)
    .values([
      {
        email: "alice.chen@campus.edu",
        firstName: "Alice",
        lastName: "Chen",
        profileImageUrl: null,
      },
      {
        email: "ben.williams@campus.edu",
        firstName: "Ben",
        lastName: "Williams",
        profileImageUrl: null,
      },
      {
        email: "carla.gomez@campus.edu",
        firstName: "Carla",
        lastName: "Gomez",
        profileImageUrl: null,
      },
    ])
    .returning();

  await db.insert(tutorProfiles).values([
    {
      userId: alice.id,
      university: "Example University",
      yearOfStudy: 3,
      major: "Computer Science",
      bio: "Algorithms and data structures tutor. I focus on helping you build intuition and pass your next exam with confidence.",
      isActive: true,
      timezone: "America/New_York",
    },
    {
      userId: ben.id,
      university: "Example University",
      yearOfStudy: 2,
      major: "Mathematics",
      bio: "Calculus and linear algebra support. Happy to work through homework sets step-by-step.",
      isActive: true,
      timezone: "America/New_York",
    },
  ]);

  await db.insert(tuteeProfiles).values([
    {
      userId: carla.id,
      university: "Example University",
      yearOfStudy: 1,
      major: "Biology",
      subjects: ["Calculus I", "Chemistry"],
      timezone: "America/New_York",
    },
  ]);

  await db.insert(tutorSubjects).values([
    {
      tutorId: alice.id,
      subject: "Data Structures",
      proficiency: "expert",
      hourlyRateCents: 1800,
      description: "Trees, graphs, heaps, and big-O analysis. Interview-style practice available.",
    },
    {
      tutorId: alice.id,
      subject: "Intro to Python",
      proficiency: "intermediate",
      hourlyRateCents: 1500,
      description: "Variables, functions, loops, debugging, and working with files.",
    },
    {
      tutorId: ben.id,
      subject: "Calculus I",
      proficiency: "expert",
      hourlyRateCents: 1600,
      description: "Limits, derivatives, chain rule, and applications. Practice problems included.",
    },
    {
      tutorId: ben.id,
      subject: "Linear Algebra",
      proficiency: "intermediate",
      hourlyRateCents: 1700,
      description: "Vectors, matrices, eigenvalues, and intuition for solving systems.",
    },
  ]);

  await db.insert(tutorAvailability).values([
    {
      tutorId: alice.id,
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "12:00",
    },
    {
      tutorId: alice.id,
      dayOfWeek: 3,
      startTime: "14:00",
      endTime: "17:00",
    },
    {
      tutorId: ben.id,
      dayOfWeek: 2,
      startTime: "10:00",
      endTime: "15:00",
    },
    {
      tutorId: ben.id,
      dayOfWeek: 4,
      startTime: "13:00",
      endTime: "18:00",
    },
  ]);
}
