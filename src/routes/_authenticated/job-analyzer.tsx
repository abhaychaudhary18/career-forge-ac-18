import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { analyzeJob } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { notify, useIntelligence, useProfile } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { StageLoader } from "@/components/app/StageLoader";
import { Section, Bullets, Chips, errMsg } from "@/components/app/kit";
import { ScoreRing } from "@/components/ui/score-ring";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/job-analyzer")({
  head: () => ({ meta: [{ title: "Job Analyzer — CareerForge AI" }, { name: "description", content: "Compare your profile against any job description." }] }),
  component: JobAnalyzerPage,
});

type Result = Awaited<ReturnType<typeof analyzeJob>>;

function JobAnalyzerPage() {
  const run = useServerFn(analyzeJob);
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const { data: intel } = useIntelligence();
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const shown = result ?? ((intel?.jobs[0]?.["analysis"] as Result | undefined) ?? null);

  async function analyze() {
    setBusy(true);
    try {
      const { data: res } = await supabase.from("resumes").select("raw_text").order("created_at", { ascending: false }).limit(1);
      const r = await run({ data: { description: desc, resumeText: res?.[0]?.raw_text ?? "", skills: profile?.skills ?? [] } });
      await supabase.from("job_analyses").insert({ title: r.jobTitle, company: r.company, description: desc, match_score: r.matchScore, analysis: r as never });
      await supabase.from("tasks").insert(r.missingSkills.slice(0, 4).map((s) => ({ title: `Learn ${s}`, description: `Gap for ${r.jobTitle}`, category: "skill", source: "job-analyzer" })));
      await notify(`${r.matchScore}% match for ${r.jobTitle}`, "Gap tasks were added to your tracker.");
      setResult(r);
      qc.invalidateQueries();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Job Readiness Gap Engine" description="Paste a job description. We compare it with your latest resume and skills." />
      <div className="surface-card space-y-3 p-5">
        <Textarea rows={9} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Paste the job description…" />
        <Button onClick={analyze} disabled={busy || desc.trim().length < 40}>{busy ? "Analyzing…" : "Analyze job"}</Button>
        <StageLoader active={busy} stages={["Parsing requirements", "Matching your skills", "Finding gaps", "Building a plan"]} />
      </div>
      {shown && (
        <>
          <div className="surface-card flex flex-wrap items-center gap-6 p-5">
            <ScoreRing value={shown.matchScore} size={120} label="Match" />
            <div><p className="font-display text-xl">{shown.jobTitle}</p><p className="text-sm text-muted-foreground">{[shown.company, shown.seniority, shown.domain].filter(Boolean).join(" · ")}</p></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Matched skills"><Chips items={shown.matchedSkills} tone="good" /></Section>
            <Section title="Missing skills"><Chips items={shown.missingSkills} tone="bad" /></Section>
            <Section title="Required skills"><Chips items={shown.requiredSkills} /></Section>
            <Section title="Missing keywords"><Chips items={shown.missingKeywords} /></Section>
            <Section title="Experience gaps"><Bullets items={shown.experienceGaps} /></Section>
            <Section title="Project gaps"><Bullets items={shown.projectGaps} /></Section>
          </div>
          <Section title="Preparation plan"><Bullets items={shown.preparationPlan} /></Section>
        </>
      )}
    </div>
  );
}
