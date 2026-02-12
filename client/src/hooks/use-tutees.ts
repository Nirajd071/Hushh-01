import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { parseWithLogging, readJson, parseErrorMessage } from "@/hooks/use-api";

export function useMyTuteeProfile() {
  return useQuery({
    queryKey: [api.tutees.me.getProfile.path],
    queryFn: async () => {
      const res = await fetch(api.tutees.me.getProfile.path, { credentials: "include" });
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const data = await readJson(res);
      return parseWithLogging(
        api.tutees.me.getProfile.responses[200],
        data,
        "tutees.me.getProfile",
      );
    },
  });
}

export function useUpsertMyTuteeProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: unknown) => {
      const validated = api.tutees.me.upsertProfile.input.parse(input);
      const res = await fetch(api.tutees.me.upsertProfile.path, {
        method: api.tutees.me.upsertProfile.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await readJson(res);
          const parsed = parseWithLogging(
            api.tutees.me.upsertProfile.responses[400],
            data,
            "tutees.me.upsertProfile.400",
          );
          throw new Error(parsed.message);
        }
        throw new Error(await parseErrorMessage(res));
      }

      const data = await readJson(res);
      return parseWithLogging(
        api.tutees.me.upsertProfile.responses[200],
        data,
        "tutees.me.upsertProfile",
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.tutees.me.getProfile.path] });
    },
  });
}
