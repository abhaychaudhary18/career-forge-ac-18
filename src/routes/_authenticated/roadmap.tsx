import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateRoadmap } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { notify, useIntelligence, useProfile } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { StageLoader } from "@/components/app/StageLoader";
import { Section, Bullets, errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({ meta: [{ title: "Career Roadmap — CareerForge AI" }, { name: "description", content: "Personal 30/60/90-day preparation roadmap." }] }),
  component: RoadmapPage,
});

type Plan = Awaited<ReturnType<typeof generateRoadmap>>;

function RoadmapPage() {
  const run = useServerFn(generateRoadmap);
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const { data: intel } = useIntelligence();
  const [busy, setBusy] = useState(false);
  const { data: saved } = useQuery({
    queryKey: ["roadmap"],
    queryFn: async () => (await supabase.from("roadmaps").select("*").order("created_at", { ascending: false }).limit(1)).data?.[0] ?? null,
  });
  const plan = (saved?.plan ?? null) as Plan | null;

  async function build() {
    setBusy(true);
    try {
      const role = profile?.target_role ?? "Software Engineer";
      const s = intel?.signals;
      const summary = s ? Object.entries(s).map(([k, v]) => `${k}: ${v ?? "not measured"}`).join("\n") : "";
      const weakTopics = (intel?.weakness ?? []).filter((w) => Number(w["weight"]) >= 50).map((w) => String(w["topic"]));
      const missingSkills = ((intel?.jobs[0]?.["analysis"] as { missingSkills?: string[] } | undefined)?.missingSkills) ?? [];
      const r = await run({ data: { targetRole: role, profileSummary: `Skills: ${(profile?.skills ?? []).join(", ")}\n${summary}`, weakTopics, missingSkills } });
      await supabase.from("roadmaps").insert({ target_role: role, plan: r as never });
      if (r.immediateTasks.length) await supabase.from("tasks").insert(r.immediateTasks.map((t) => ({ title: t.title, description: t.description, category: t.category, source: "roadmap" })));
      await notify("New roadmap ready", `${r.immediateTasks.length} tasks added to your tracker.`);
      qc.invalidateQueries();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="30 / 60 / 90-Day Roadmap" description="Generated from your weak topics, missing skills and readiness signals." actions={<Button onClick={build} disabled={busy}>{busy ? "Generating…" : plan ? "Regenerate" : "Generate roadmap"}</Button>} />
      <StageLoader active={busy} stages={["Reading your profile", "Prioritizing gaps", "Planning phases", "Creating tasks"]} />
      {!plan && !busy && <p className="text-sm text-muted-foreground">No roadmap yet. Generate one — it works best after a resume or job analysis.</p>}
      {plan && (
        <div className="grid gap-4 lg:grid-cols-3">
          {plan.phases.map((p) => (
            <Section key={p.horizon} title={`Day ${p.horizon}`}>
              <p className="mb-3 font-display">{p.focus}</p>
              {([["Topics", p.topics], ["Projects", p.projects], ["Coding practice", p.codingPractice], ["CS subjects", p.csSubjects], ["Interview prep", p.interviewPrep], ["Milestones", p.milestones]] as const).map(([l, items]) => items.length ? <div key={l} className="mb-3"><p className="mb-1 text-xs text-muted-foreground">{l}</p><Bullets items={items} /></div> : null)}
            </Section>
          ))}
        </div>
      )}
    </div>
  );
}
