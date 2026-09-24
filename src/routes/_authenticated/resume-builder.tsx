import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/resume-builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — CareerForge AI" },
      { name: "description", content: "Resume Builder in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: ResumeBuilderPage,
});

function ResumeBuilderPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Resume Builder" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
