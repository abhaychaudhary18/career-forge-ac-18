import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/jobs")({
  head: () => ({
    meta: [
      { title: "Job Matcher — CareerForge AI" },
      { name: "description", content: "Job Matcher in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Job Matcher" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
