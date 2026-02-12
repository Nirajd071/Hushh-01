import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { parseWithLogging, readJson, parseErrorMessage } from "@/hooks/use-api";

export function useMySessions() {
  return useQuery({
    queryKey: [api.sessions.listMine.path],
    queryFn: async () => {
      const res = await fetch(api.sessions.listMine.path, { credentials: "include" });
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const data = await readJson(res);
      return parseWithLogging(
        api.sessions.listMine.responses[200],
        data,
        "sessions.listMine",
      );
    },
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: unknown) => {
      const validated = api.sessions.create.input.parse(input);
      const res = await fetch(api.sessions.create.path, {
        method: api.sessions.create.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.sessions.create.responses[400],
            data,
            "sessions.create.400",
          );
          throw new Error(parsed.message);
        }
        if (res.status === 404) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.sessions.create.responses[404],
            data,
            "sessions.create.404",
          );
          throw new Error(parsed.message);
        }
        throw new Error(await parseErrorMessage(res));
      }

      const data = await readJson(res);
      return parseWithLogging(api.sessions.create.responses[201], data, "sessions.create");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.sessions.listMine.path] });
    },
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      ...updates
    }: { sessionId: string } & Record<string, unknown>) => {
      const validated = api.sessions.update.input.parse(updates);
      const url = buildUrl(api.sessions.update.path, { sessionId });
      const res = await fetch(url, {
        method: api.sessions.update.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.sessions.update.responses[400],
            data,
            "sessions.update.400",
          );
          throw new Error(parsed.message);
        }
        if (res.status === 404) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.sessions.update.responses[404],
            data,
            "sessions.update.404",
          );
          throw new Error(parsed.message);
        }
        throw new Error(await parseErrorMessage(res));
      }

      const data = await readJson(res);
      return parseWithLogging(api.sessions.update.responses[200], data, "sessions.update");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.sessions.listMine.path] });
    },
  });
}
