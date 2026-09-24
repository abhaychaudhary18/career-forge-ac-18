import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CareerForge AI" },
      { name: "description", content: "Profile in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
