import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/github")({
  head: () => ({
    meta: [
      { title: "GitHub Analyzer — CareerForge AI" },
      { name: "description", content: "GitHub Analyzer in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: GithubPage,
});

function GithubPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="GitHub Analyzer" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
