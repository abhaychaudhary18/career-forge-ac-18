import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Printer } from "lucide-react";
import { generateCareerReport } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { useIntelligence, useProfile } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { StageLoader } from "@/components/app/StageLoader";
import { Section, Bullets, errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Career Reports — CareerForge AI" },
      { name: "description", content: "Generate and download a full career readiness report." },
    ],
  }),
  component: ReportsPage,
});

type Report = Awaited<ReturnType<typeof generateCareerReport>>;
const PARTS: [keyof Report, string][] = [
  ["candidateOverview", "Overview"], ["resumeAnalysis", "Resume"], ["skillAnalysis", "Skills"], ["githubAnalysis", "GitHub projects"],
  ["interviewPerformance", "Interviews"], ["codingPerformance", "Coding"], ["weaknessSummary", "Weak areas"], ["jobMatchAnalysis", "Job fit"], ["roadmapSummary", "Roadmap"],
];

function ReportsPage() {
  const run = useServerFn(generateCareerReport);
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const { data: intel } = useIntelligence();
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const { data: saved } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => (await supabase.from("reports").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const shown = selected ?? ((saved?.[0]?.content as Report | undefined) ?? null);

  async function generate() {
    setBusy(true);
    try {
      const summary = JSON.stringify({
        profile: { role: profile?.target_role, level: profile?.experience_level, skills: profile?.skills },
        readiness: intel?.readiness,
        signals: intel?.signals,
        resume: intel?.resumes[0]?.["analysis"],
        latestJob: intel?.jobs[0]?.["analysis"],
        github: intel?.github.slice(0, 3).map((g) => g["analysis"]),
        weakTopics: intel?.weakness.slice(0, 10),
      });
      const r = await run({ data: { profileSummary: summary } });
      await supabase.from("reports").insert({ title: r.headline, content: r as never });
      setSelected(r);
      qc.invalidateQueries({ queryKey: ["reports"] });
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Career Reports" description="A full readiness report built from everything you've done in CareerForge." />
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button onClick={generate} disabled={busy}><FileText className="size-4" /> {busy ? "Generating…" : "Generate new report"}</Button>
        {shown && <Button variant="outline" onClick={() => window.print()}><Printer className="size-4" /> Download PDF</Button>}
      </div>
      <StageLoader active={busy} stages={["Collecting your results", "Analyzing strengths and gaps", "Writing the report"]} />
      {saved && saved.length > 1 && (
        <div className="flex flex-wrap gap-2 print:hidden">
          {saved.map((r) => (
            <Button key={r.id} size="sm" variant="outline" onClick={() => setSelected(r.content as Report)}>{new Date(r.created_at).toLocaleDateString()}</Button>
          ))}
        </div>
      )}
      {shown ? (
        <div className="space-y-4">
          <h2 className="font-display text-2xl">{shown.headline}</h2>
          {PARTS.filter(([k]) => shown[k]).map(([k, l]) => (
            <Section key={k} title={l}><p className="text-sm leading-relaxed">{String(shown[k])}</p></Section>
          ))}
          <Section title="Recommended actions"><Bullets items={shown.recommendedActions} /></Section>
        </div>
      ) : (
        !busy && <p className="text-sm text-muted-foreground">No reports yet. Analyze your resume first, then generate a report.</p>
      )}
    </div>
  );
}
