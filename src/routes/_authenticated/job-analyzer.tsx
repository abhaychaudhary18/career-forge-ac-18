import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/job-analyzer")({
  head: () => ({
    meta: [
      { title: "Job Analyzer — CareerForge AI" },
      { name: "description", content: "Job Analyzer in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: JobAnalyzerPage,
});

function JobAnalyzerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Job Analyzer" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
