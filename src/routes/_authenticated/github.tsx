import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, GitFork } from "lucide-react";
import { analyzeGithubRepo, listGithubRepos } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { notify, useIntelligence } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { StageLoader } from "@/components/app/StageLoader";
import { Section, Bullets, Chips, errMsg } from "@/components/app/kit";
import { ScoreRing } from "@/components/ui/score-ring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/github")({
  head: () => ({ meta: [{ title: "GitHub Analyzer — CareerForge AI" }, { name: "description", content: "Analyze your GitHub repositories like a staff engineer." }] }),
  component: GithubPage,
});

type Result = Awaited<ReturnType<typeof analyzeGithubRepo>>;
type Repo = Awaited<ReturnType<typeof listGithubRepos>>[number];

const LAYERS = ["client", "frontend", "api", "service", "backend", "data", "database", "infra"];

export function ArchitectureDiagram({ components }: { components: Result["components"] }) {
  const [zoom, setZoom] = useState(1);
  if (!components.length) return <p className="text-sm text-muted-foreground">No components identified.</p>;
  const groups = new Map<string, Result["components"]>();
  for (const c of components) {
    const key = c.layer.toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  const ordered = [...groups.entries()].sort((a, b) => (LAYERS.indexOf(a[0]) + 99) % 108 - (LAYERS.indexOf(b[0]) + 99) % 108);
  return (
    <div>
      <div className="mb-2 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}>Zoom in</Button>
        <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}>Zoom out</Button>
      </div>
      <div className="grid-backdrop overflow-auto rounded-xl border border-border p-4">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }} className="space-y-3">
          {ordered.map(([layer, items], i) => (
            <div key={layer}>
              <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">{layer}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((c) => (
                  <div key={c.name} title={c.description} className="w-48 rounded-lg border border-primary/40 bg-card p-2">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                  </div>
                ))}
              </div>
              {i < ordered.length - 1 && <div className="ml-6 h-4 w-px bg-accent" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GithubPage() {
  const list = useServerFn(listGithubRepos);
  const run = useServerFn(analyzeGithubRepo);
  const qc = useQueryClient();
  const { data: intel } = useIntelligence();
  const [input, setInput] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const shown = result ?? ((intel?.github[0]?.["analysis"] as Result | undefined) ?? null);

  async function go(target = input.trim()) {
    setBusy(true);
    try {
      if (!target.includes("/") || /github\.com\/[^/]+\/?$/.test(target)) {
        const user = target.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
        setRepos(await list({ data: { username: user } }));
      } else {
        const r = await run({ data: { repo: target } });
        await supabase.from("github_analyses").insert({ repo_name: r.repoName, repo_url: r.repoUrl, score: r.score, analysis: r as never });
        await notify(`${r.repoName} scored ${r.score}/100`, "Try the Project Defense interview on it.");
        setResult(r);
        qc.invalidateQueries();
      }
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="GitHub Project Analyzer" description="Enter a GitHub username to list repos, or owner/repo (or a repo URL) to analyze it." />
      <div className="surface-card space-y-3 p-5">
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="octocat  or  octocat/Hello-World" onKeyDown={(e) => e.key === "Enter" && go()} />
          <Button onClick={() => go()} disabled={busy || !input.trim()}>{busy ? "Working…" : "Go"}</Button>
        </div>
        <StageLoader active={busy} stages={["Fetching from GitHub", "Reading structure", "Reviewing architecture", "Writing questions"]} />
        {repos.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {repos.slice(0, 20).map((r) => (
              <button key={r.fullName} onClick={() => go(r.fullName)} disabled={busy} className="rounded-lg border border-border p-3 text-left hover:border-primary/50">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{r.description ?? "No description"}</p>
                <p className="mt-1 flex gap-3 text-xs text-muted-foreground">{r.language}<span className="flex items-center gap-1"><Star className="size-3" />{r.stars}</span><span className="flex items-center gap-1"><GitFork className="size-3" />{r.forks}</span></p>
              </button>
            ))}
          </div>
        )}
      </div>
      {shown && (
        <>
          <div className="surface-card flex flex-wrap items-center gap-6 p-5">
            <ScoreRing value={shown.score} size={120} label="Project" />
            <div className="flex-1">
              <a href={shown.repoUrl} target="_blank" rel="noreferrer" className="font-display text-xl hover:underline">{shown.repoName}</a>
              <p className="mt-1 text-sm text-muted-foreground">{shown.overview}</p>
              <div className="mt-2"><Chips items={[shown.hasTests ? "Tests" : "No tests", shown.hasCI ? "CI/CD" : "No CI", shown.hasDocker ? "Docker" : "No Docker", shown.hasAuth ? "Auth" : "No auth"]} /></div>
            </div>
            <Button asChild><Link to="/project-defense">Defend this project</Link></Button>
          </div>
          <Section title="Architecture"><p className="mb-3 text-sm">{shown.architectureExplanation}</p><ArchitectureDiagram components={shown.components} /></Section>
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Tech stack"><Chips items={shown.techStack} /></Section>
            <Section title="Engineering practices"><Bullets items={shown.engineeringPractices} /></Section>
            <Section title="Strengths"><Bullets items={shown.strengths} /></Section>
            <Section title="Weaknesses"><Bullets items={shown.weaknesses} /></Section>
            <Section title="Likely interview questions"><Bullets items={shown.interviewQuestions} /></Section>
            <Section title="Resume bullets"><Bullets items={shown.resumeBullets} /></Section>
          </div>
        </>
      )}
    </div>
  );
}
