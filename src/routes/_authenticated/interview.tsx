import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({
    meta: [
      { title: "Mock Interview — CareerForge AI" },
      { name: "description", content: "Mock Interview in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: InterviewPage,
});

function InterviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Mock Interview" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
