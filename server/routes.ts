import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api } from "@shared/routes";
import { storage } from "./storage";
import { registerAuthRoutes, setupAuth, isAuthenticated } from "./replit_integrations/auth";

function getUserId(req: any): string | undefined {
  return req?.user?.claims?.sub;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.auth.me.path, async (req: any, res) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.json(null);
    }
    const user = await storage.getCurrentUser(userId);
    return res.json(user ?? null);
  });

  // Tutor search/public detail
  app.get(api.tutors.search.path, async (req, res) => {
    const input = api.tutors.search.input?.parse(req.query);
    const tutors = await storage.searchTutors(input);
    res.json(tutors);
  });

  app.get(api.tutors.get.path, async (req, res) => {
    const tutor = await storage.getTutor(String(req.params.tutorId));
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    res.json(tutor);
  });

  // Tutor self
  app.get(api.tutors.me.getProfile.path, isAuthenticated, async (req: any, res) => {
    const userId = getUserId(req);
    const profile = await storage.getTutorProfile(userId);
    res.json(profile ?? null);
  });

  app.put(api.tutors.me.upsertProfile.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const input = api.tutors.me.upsertProfile.input.parse(req.body);
      const profile = await storage.upsertTutorProfile(userId, input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.get(api.tutors.me.listSubjects.path, isAuthenticated, async (req: any, res) => {
    const userId = getUserId(req);
    const subjects = await storage.listTutorSubjects(userId);
    res.json(subjects);
  });

  app.post(api.tutors.me.addSubject.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const input = api.tutors.me.addSubject.input.parse(req.body);
      const created = await storage.addTutorSubject(userId, input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.patch(
    api.tutors.me.updateSubject.path,
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = getUserId(req);
        const input = api.tutors.me.updateSubject.input.parse(req.body);
        const updated = await storage.updateTutorSubject(
          userId,
          String(req.params.subjectId),
          input,
        );
        if (!updated) {
          return res.status(404).json({ message: "Subject not found" });
        }
        res.json(updated);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0]?.message ?? "Invalid input",
            field: err.errors[0]?.path?.join("."),
          });
        }
        throw err;
      }
    },
  );

  app.delete(
    api.tutors.me.deleteSubject.path,
    isAuthenticated,
    async (req: any, res) => {
      const userId = getUserId(req);
      const ok = await storage.deleteTutorSubject(userId, String(req.params.subjectId));
      if (!ok) {
        return res.status(404).json({ message: "Subject not found" });
      }
      res.status(204).send();
    },
  );

  app.get(
    api.tutors.me.listAvailability.path,
    isAuthenticated,
    async (req: any, res) => {
      const userId = getUserId(req);
      const availability = await storage.listTutorAvailability(userId);
      res.json(availability);
    },
  );

  app.post(
    api.tutors.me.addAvailability.path,
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = getUserId(req);
        const input = api.tutors.me.addAvailability.input.parse(req.body);
        const created = await storage.addTutorAvailability(userId, input);
        res.status(201).json(created);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0]?.message ?? "Invalid input",
            field: err.errors[0]?.path?.join("."),
          });
        }
        throw err;
      }
    },
  );

  app.delete(
    api.tutors.me.deleteAvailability.path,
    isAuthenticated,
    async (req: any, res) => {
      const userId = getUserId(req);
      const ok = await storage.deleteTutorAvailability(
        userId,
        String(req.params.availabilityId),
      );
      if (!ok) {
        return res.status(404).json({ message: "Availability not found" });
      }
      res.status(204).send();
    },
  );

  // Tutee self
  app.get(api.tutees.me.getProfile.path, isAuthenticated, async (req: any, res) => {
    const userId = getUserId(req);
    const profile = await storage.getTuteeProfile(userId);
    res.json(profile ?? null);
  });

  app.put(api.tutees.me.upsertProfile.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const input = api.tutees.me.upsertProfile.input.parse(req.body);
      const profile = await storage.upsertTuteeProfile(userId, input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  // Sessions
  app.get(api.sessions.listMine.path, isAuthenticated, async (req: any, res) => {
    const userId = getUserId(req);
    const sessions = await storage.listMySessions(userId);
    res.json(sessions);
  });

  app.post(api.sessions.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const input = api.sessions.create.input.parse(req.body);

      const tutor = await storage.getTutor(String(input.tutorId));
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found" });
      }

      const created = await storage.createSession(userId, {
        ...input,
        tuteeId: userId,
      } as any);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.patch(api.sessions.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const input = api.sessions.update.input.parse(req.body);
      const updated = await storage.updateSession(
        String(req.params.sessionId),
        userId,
        input,
      );
      if (!updated) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
