import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Github } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { InterviewRunner } from "@/components/app/InterviewRunner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntelligence } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/project-defense")({
  head: () => ({ meta: [{ title: "Project Defense — CareerForge AI" }, { name: "description", content: "Defend your own projects against an AI interviewer." }] }),
  component: ProjectDefensePage,
});

function ProjectDefensePage() {
  const { data, isLoading } = useIntelligence();
  const [picked, setPicked] = useState<string | null>(null);
  if (isLoading) return <Skeleton className="h-60" />;
  const repos = data?.github ?? [];
  const current = repos.find((r) => r["id"] === picked);
  const a = (current?.["analysis"] ?? {}) as Record<string, unknown>;
  const context = current
    ? `Repository ${a["repoName"]}\nOverview: ${a["overview"]}\nArchitecture: ${a["architectureExplanation"]}\nStack: ${(a["techStack"] as string[] | undefined)?.join(", ")}\nWeaknesses: ${(a["weaknesses"] as string[] | undefined)?.join("; ")}\nSeed questions: ${(a["interviewQuestions"] as string[] | undefined)?.join(" | ")}`
    : "";

  return (
    <div className="space-y-6">
      <PageHeader title="AI Project Defense Simulator" description="Pick an analyzed repository. The interviewer grills you on your architecture, decisions, security and scaling." />
      {!repos.length ? (
        <EmptyState icon={Github} title="No analyzed projects yet" description="Analyze a repository first so the interviewer knows your code." action={<Button asChild><Link to="/github">Analyze a repo</Link></Button>} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {repos.map((r) => (
              <button key={String(r["id"])} onClick={() => setPicked(String(r["id"]))} className={cn("rounded-lg border px-3 py-2 text-sm", picked === r["id"] ? "border-primary bg-primary/10" : "border-border hover:bg-card")}>
                {String(r["repo_name"])} · {String(r["score"])}
              </button>
            ))}
          </div>
          {current ? <InterviewRunner key={picked} mode="project-defense" topic={String(current["repo_name"])} context={context} maxQuestions={8} /> : <p className="text-sm text-muted-foreground">Choose a project above to begin.</p>}
        </>
      )}
    </div>
  );
}
