import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/assessments")({
  head: () => ({
    meta: [
      { title: "Assessments — CareerForge AI" },
      { name: "description", content: "Assessments in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Assessments" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
