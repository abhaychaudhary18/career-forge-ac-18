import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/project-defense")({
  head: () => ({
    meta: [
      { title: "Project Defense — CareerForge AI" },
      { name: "description", content: "Project Defense in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: ProjectDefensePage,
});

function ProjectDefensePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Project Defense" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
