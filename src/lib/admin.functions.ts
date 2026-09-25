import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (!roles?.some((r) => r.role === "admin")) return { isAdmin: false as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tables = ["profiles", "resume_analyses", "job_analyses", "github_analyses", "interviews", "skill_results", "coding_submissions", "roadmaps", "reports"] as const;
    const counts: Record<string, number> = {};
    for (const t of tables) {
      const { count } = await supabaseAdmin.from(t).select("*", { count: "exact", head: true });
      counts[t] = count ?? 0;
    }
    const { data: users } = await supabaseAdmin.from("profiles").select("id, name, email, target_role, xp, created_at").order("created_at", { ascending: false }).limit(50);
    return { isAdmin: true as const, counts, users: users ?? [] };
  });
