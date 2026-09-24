import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({
    meta: [
      { title: "Career Roadmap — CareerForge AI" },
      { name: "description", content: "Career Roadmap in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Career Roadmap" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
