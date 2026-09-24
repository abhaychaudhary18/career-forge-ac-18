import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/skills")({
  head: () => ({
    meta: [
      { title: "Skill Verification — CareerForge AI" },
      { name: "description", content: "Skill Verification in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Skill Verification" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
