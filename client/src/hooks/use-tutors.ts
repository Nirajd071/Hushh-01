import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { parseWithLogging, readJson, parseErrorMessage } from "@/hooks/use-api";

function toSearchParams(input?: Record<string, unknown>) {
  const sp = new URLSearchParams();
  if (!input) return sp;
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  return sp;
}

export function useTutorSearch(params?: {
  subject?: string;
  university?: string;
  minRateCents?: number;
  maxRateCents?: number;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: [api.tutors.search.path, params ?? {}],
    queryFn: async () => {
      const validated = api.tutors.search.input?.parse(params) as any;
      const sp = toSearchParams(
        validated
          ? {
              ...validated,
              isActive:
                typeof validated.isActive === "boolean"
                  ? String(validated.isActive)
                  : undefined,
            }
          : undefined,
      );
      const url = sp.toString()
        ? `${api.tutors.search.path}?${sp.toString()}`
        : api.tutors.search.path;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const data = await readJson(res);
      return parseWithLogging(api.tutors.search.responses[200], data, "tutors.search");
    },
  });
}

export function useTutorDetail(tutorId?: string) {
  return useQuery({
    enabled: !!tutorId,
    queryKey: [api.tutors.get.path, tutorId],
    queryFn: async () => {
      const url = buildUrl(api.tutors.get.path, { tutorId: tutorId! });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const data = await readJson(res);
      return parseWithLogging(api.tutors.get.responses[200], data, "tutors.get");
    },
  });
}

export function useMyTutorProfile() {
  return useQuery({
    queryKey: [api.tutors.me.getProfile.path],
    queryFn: async () => {
      const res = await fetch(api.tutors.me.getProfile.path, { credentials: "include" });
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const data = await readJson(res);
      return parseWithLogging(
        api.tutors.me.getProfile.responses[200],
        data,
        "tutors.me.getProfile",
      );
    },
  });
}

export function useUpsertMyTutorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: unknown) => {
      const validated = api.tutors.me.upsertProfile.input.parse(input);
      const res = await fetch(api.tutors.me.upsertProfile.path, {
        method: api.tutors.me.upsertProfile.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.tutors.me.upsertProfile.responses[400],
            data,
            "tutors.me.upsertProfile.400",
          );
          throw new Error(parsed.message);
        }
        throw new Error(await parseErrorMessage(res));
      }

      const data = await readJson(res);
      return parseWithLogging(
        api.tutors.me.upsertProfile.responses[200],
        data,
        "tutors.me.upsertProfile",
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.tutors.me.getProfile.path] });
      await qc.invalidateQueries({ queryKey: [api.tutors.search.path] });
    },
  });
}

export function useMyTutorSubjects() {
  return useQuery({
    queryKey: [api.tutors.me.listSubjects.path],
    queryFn: async () => {
      const res = await fetch(api.tutors.me.listSubjects.path, { credentials: "include" });
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const data = await readJson(res);
      return parseWithLogging(
        api.tutors.me.listSubjects.responses[200],
        data,
        "tutors.me.listSubjects",
      );
    },
  });
}

export function useAddTutorSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: unknown) => {
      const validated = api.tutors.me.addSubject.input.parse(input);
      const res = await fetch(api.tutors.me.addSubject.path, {
        method: api.tutors.me.addSubject.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.tutors.me.addSubject.responses[400],
            data,
            "tutors.me.addSubject.400",
          );
          throw new Error(parsed.message);
        }
        throw new Error(await parseErrorMessage(res));
      }

      const data = await readJson(res);
      return parseWithLogging(
        api.tutors.me.addSubject.responses[201],
        data,
        "tutors.me.addSubject",
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.tutors.me.listSubjects.path] });
      await qc.invalidateQueries({ queryKey: [api.tutors.search.path] });
    },
  });
}

export function useUpdateTutorSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectId,
      ...updates
    }: { subjectId: string } & Record<string, unknown>) => {
      const validated = api.tutors.me.updateSubject.input.parse(updates);
      const url = buildUrl(api.tutors.me.updateSubject.path, { subjectId });

      const res = await fetch(url, {
        method: api.tutors.me.updateSubject.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.tutors.me.updateSubject.responses[400],
            data,
            "tutors.me.updateSubject.400",
          );
          throw new Error(parsed.message);
        }
        if (res.status === 404) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.tutors.me.updateSubject.responses[404],
            data,
            "tutors.me.updateSubject.404",
          );
          throw new Error(parsed.message);
        }
        throw new Error(await parseErrorMessage(res));
      }

      const data = await readJson(res);
      return parseWithLogging(
        api.tutors.me.updateSubject.responses[200],
        data,
        "tutors.me.updateSubject",
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.tutors.me.listSubjects.path] });
      await qc.invalidateQueries({ queryKey: [api.tutors.search.path] });
    },
  });
}

export function useDeleteTutorSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subjectId: string) => {
      const url = buildUrl(api.tutors.me.deleteSubject.path, { subjectId });
      const res = await fetch(url, {
        method: api.tutors.me.deleteSubject.method,
        credentials: "include",
      });
      if (res.status === 404) {
        const data = await readJson(res);
        const parsed = parseWithLogging(
          api.tutors.me.deleteSubject.responses[404],
          data,
          "tutors.me.deleteSubject.404",
        );
        throw new Error(parsed.message);
      }
      if (!res.ok) throw new Error(await parseErrorMessage(res));
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.tutors.me.listSubjects.path] });
      await qc.invalidateQueries({ queryKey: [api.tutors.search.path] });
    },
  });
}

export function useMyTutorAvailability() {
  return useQuery({
    queryKey: [api.tutors.me.listAvailability.path],
    queryFn: async () => {
      const res = await fetch(api.tutors.me.listAvailability.path, { credentials: "include" });
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const data = await readJson(res);
      return parseWithLogging(
        api.tutors.me.listAvailability.responses[200],
        data,
        "tutors.me.listAvailability",
      );
    },
  });
}

export function useAddTutorAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: unknown) => {
      const validated = api.tutors.me.addAvailability.input.parse(input);
      const res = await fetch(api.tutors.me.addAvailability.path, {
        method: api.tutors.me.addAvailability.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.tutors.me.addAvailability.responses[400],
            data,
            "tutors.me.addAvailability.400",
          );
          throw new Error(parsed.message);
        }
        throw new Error(await parseErrorMessage(res));
      }

      const data = await readJson(res);
      return parseWithLogging(
        api.tutors.me.addAvailability.responses[201],
        data,
        "tutors.me.addAvailability",
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.tutors.me.listAvailability.path] });
      await qc.invalidateQueries({ queryKey: [api.tutors.search.path] });
    },
  });
}

export function useDeleteTutorAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (availabilityId: string) => {
      const url = buildUrl(api.tutors.me.deleteAvailability.path, { availabilityId });
      const res = await fetch(url, {
        method: api.tutors.me.deleteAvailability.method,
        credentials: "include",
      });

      if (res.status === 404) {
        const data = await readJson(res);
        const parsed = parseWithLogging(
          api.tutors.me.deleteAvailability.responses[404],
          data,
          "tutors.me.deleteAvailability.404",
        );
        throw new Error(parsed.message);
      }
      if (!res.ok) throw new Error(await parseErrorMessage(res));
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.tutors.me.listAvailability.path] });
      await qc.invalidateQueries({ queryKey: [api.tutors.search.path] });
    },
  });
}
