import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({
    meta: [
      { title: "Resume & ATS — CareerForge AI" },
      { name: "description", content: "Resume & ATS in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Resume & ATS" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
