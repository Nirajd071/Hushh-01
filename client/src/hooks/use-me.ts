import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { parseWithLogging, readJson } from "@/hooks/use-api";

export function useMe() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (!res.ok) {
        // backend may return 401; treat as logged out for /me
        if (res.status === 401) return null;
        throw new Error(`Failed to fetch me (${res.status})`);
      }
      const data = await readJson(res);
      return parseWithLogging(api.auth.me.responses[200], data, "auth.me");
    },
    retry: false,
    staleTime: 1000 * 30,
  });
}
