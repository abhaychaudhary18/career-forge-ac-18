import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CareerForge AI" },
      { name: "description", content: "Admin in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
