import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Target } from "lucide-react";
import { PageCta, PageIntro, SiteChrome } from "@/components/site/SiteChrome";

const t = "Career Intelligence Engine — CareerForge AI";
const d = "How CareerForge AI turns interview mistakes, skill tests and GitHub analysis into an adaptive roadmap and readiness score.";
export const Route = createFileRoute("/intelligence")({
  head: () => ({ meta: [
    { title: t }, { name: "description", content: d },
    { property: "og:title", content: t }, { property: "og:description", content: d },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: IntelligencePage,
});

const nodes = ["Resume", "Skills", "GitHub", "Verified skills", "Job requirements", "Skill gap", "Roadmap", "Tasks", "Coding", "Interview", "Project defense", "Readiness score"];

function IntelligencePage() {
  return (
    <SiteChrome>
      <PageIntro eyebrow="Intelligence" title="The feedback loop is the product" body="Fail a few database questions and CareerForge raises your DBMS weakness, schedules revision, reshapes your roadmap and targets future interview questions until the gap is closed." />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
        <div className="grid content-start gap-2 sm:grid-cols-2">
          {nodes.map((n) => (
            <div key={n} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
              <Target className="size-3.5 text-accent" /> {n}
            </div>
          ))}
        </div>
        <div className="surface-card p-6">
          <h2 className="font-display text-lg font-semibold">Project defense, in practice</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-xs text-muted-foreground">Interviewer</p>
              <p className="mt-1">Your API writes to the database inside the request handler. What happens under a burst of 500 concurrent writes?</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/60 p-3">
              <p className="text-xs text-muted-foreground">You</p>
              <p className="mt-1 text-muted-foreground">I'd add a queue…</p>
            </div>
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
              <p className="text-xs text-muted-foreground">Adaptive follow-up</p>
              <p className="mt-1">Good instinct — which consistency guarantee do you lose, and how would the client know its write succeeded?</p>
            </div>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="size-3.5" /> Questions are generated from your repository, not a question bank.
          </p>
        </div>
      </section>
      <PageCta />
    </SiteChrome>
  );
}
