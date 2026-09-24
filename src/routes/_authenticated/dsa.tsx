import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/_authenticated/dsa")({
  head: () => ({
    meta: [
      { title: "DSA & CS — CareerForge AI" },
      { name: "description", content: "DSA & CS in your CareerForge AI career readiness workspace." },
    ],
  }),
  component: DsaPage,
});

function DsaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="DSA & CS" />
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">Coming soon.</div>
    </div>
  );
}
