import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { analyzeResume } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { notify, useIntelligence, useProfile } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { StageLoader } from "@/components/app/StageLoader";
import { Section, Bullets, Chips, errMsg } from "@/components/app/kit";
import { ScoreRing } from "@/components/ui/score-ring";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({ meta: [{ title: "Resume & ATS — CareerForge AI" }, { name: "description", content: "ATS score and AI feedback for your resume." }] }),
  component: ResumePage,
});

type Result = Awaited<ReturnType<typeof analyzeResume>>;

function ResumePage() {
  const run = useServerFn(analyzeResume);
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const { data: intel } = useIntelligence();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const shown = result ?? ((intel?.resumes[0]?.["analysis"] as Result | undefined) ?? null);

  async function onFile(f: File) {
    if (!/\.(txt|md)$/i.test(f.name)) {
      toast.error("Please upload a .txt file, or paste your resume text below.");
      return;
    }
    setFileName(f.name);
    setText(await f.text());
  }

  async function analyze() {
    setBusy(true);
    try {
      const r = await run({ data: { text, targetRole: profile?.target_role ?? "Software Engineer" } });
      const { data: row } = await supabase.from("resumes").insert({ raw_text: text, file_name: fileName, parsed: r.extracted as never }).select("id").single();
      await supabase.from("resume_analyses").insert({ resume_id: row?.id ?? null, ats_score: r.atsScore, analysis: r as never });
      await notify(`Resume scored ${r.atsScore}/100`, "Your readiness profile was updated.");
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
      <PageHeader title="Resume & ATS Analyzer" description="Paste your resume or upload a text file to get an ATS score and concrete fixes." />
      <div className="surface-card space-y-3 p-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <Upload className="size-4" /> {fileName ?? "Upload .txt resume"}
          <input type="file" accept=".txt,.md" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste your full resume text here (at least 50 characters)…" />
        <Button onClick={analyze} disabled={busy || text.trim().length < 50}>{busy ? "Analyzing…" : "Analyze resume"}</Button>
        <StageLoader active={busy} stages={["Reading resume", "Extracting sections", "Scoring for ATS", "Writing suggestions"]} />
      </div>
      {shown && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {([["ATS score", shown.atsScore], ["Keywords", shown.keywordMatch], ["Action verbs", shown.actionVerbQuality], ["Projects", shown.projectQuality], ["Relevance", shown.experienceRelevance]] as const).map(([l, v]) => (
              <div key={l} className="surface-card flex flex-col items-center p-4"><ScoreRing value={v} size={96} stroke={8} /><span className="mt-2 text-xs text-muted-foreground">{l}</span></div>
            ))}
          </div>
          {shown.summary && <Section title="Summary"><p className="text-sm">{shown.summary}</p></Section>}
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Strengths"><Bullets items={shown.strengths} /></Section>
            <Section title="AI suggestions"><Bullets items={shown.suggestions} /></Section>
            <Section title="Formatting issues"><Bullets items={shown.formattingIssues} /></Section>
            <Section title="Missing sections"><Bullets items={shown.sectionsMissing} /></Section>
            <Section title="Missing keywords"><Chips items={shown.missingKeywords} tone="bad" /></Section>
            <Section title="Missing skills"><Chips items={shown.missingSkills} tone="bad" /></Section>
          </div>
        </>
      )}
    </div>
  );
}
