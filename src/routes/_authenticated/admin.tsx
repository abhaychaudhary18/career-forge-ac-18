import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldAlert } from "lucide-react";
import { getAdminStats } from "@/lib/admin.functions";
import { PageHeader } from "@/components/app/PageHeader";
import { Section, errMsg } from "@/components/app/kit";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CareerForge AI" },
      { name: "description", content: "Platform statistics, users and AI usage." },
    ],
  }),
  component: AdminPage,
});

const LABELS: Record<string, string> = {
  profiles: "Users", resume_analyses: "Resume analyses", job_analyses: "Job analyses", github_analyses: "GitHub analyses",
  interviews: "Interviews", skill_results: "Skill tests", coding_submissions: "Code submissions", roadmaps: "Roadmaps", reports: "Reports",
};

function AdminPage() {
  const run = useServerFn(getAdminStats);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin"], queryFn: () => run() });

  if (isLoading) return <Skeleton className="h-96" />;
  if (error) return <p className="text-sm text-destructive">{errMsg(error)}</p>;
  if (!data?.isAdmin)
    return (
      <div className="space-y-6">
        <PageHeader title="Admin" />
        <div className="surface-card flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground">
          <ShieldAlert className="size-8" /> Admin access is required to view this page.
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Admin" description="Platform usage across all users." />
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(data.counts).map(([k, v]) => (
          <div key={k} className="surface-card p-4"><p className="font-display text-2xl">{v}</p><p className="text-xs text-muted-foreground">{LABELS[k] ?? k}</p></div>
        ))}
      </div>
      <Section title="Recent users">
        <div className="divide-y divide-border text-sm">
          {data.users.map((u) => (
            <div key={u.id} className="flex justify-between py-2"><span>{u.name || u.email}</span><span className="text-muted-foreground">{u.target_role} · {u.xp} XP</span></div>
          ))}
        </div>
      </Section>
    </div>
  );
}
