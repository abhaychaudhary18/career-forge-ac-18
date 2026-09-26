import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Trash2, KeyRound, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { Section, errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CareerForge AI" },
      { name: "description", content: "Account security, data export and privacy controls." },
    ],
  }),
  component: SettingsPage,
});

const TABLES = [
  "resumes", "resume_analyses", "job_analyses", "github_analyses", "skill_results", "interviews",
  "interview_answers", "coding_submissions", "roadmaps", "tasks", "weakness_topics", "career_scores",
  "notifications", "saved_jobs", "reports",
] as const;

function SettingsPage() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function exportData() {
    const out: Record<string, unknown> = {};
    for (const t of TABLES) out[t] = (await supabase.from(t).select("*")).data ?? [];
    out["profile"] = (await supabase.from("profiles").select("*")).data ?? [];
    const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "careerforge-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function wipe() {
    if (!confirm("Delete all your analyses, interviews, tasks and history? This cannot be undone.")) return;
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    for (const t of TABLES) await supabase.from(t).delete().eq("user_id", u.user!.id);
    setBusy(false);
    toast.success("All your career data was deleted");
    qc.invalidateQueries();
  }

  async function changePw() {
    if (pw.length < 8) { toast.error("Use at least 8 characters."); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error(errMsg(error)); return; }
    setPw("");
    toast.success("Password updated");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Security and privacy for your account." />
      <Section title="Password">
        <div className="flex max-w-md gap-2">
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" />
          <Button onClick={changePw}><KeyRound className="size-4" /> Update</Button>
        </div>
      </Section>
      <Section title="Your data">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportData}><Download className="size-4" /> Export my data</Button>
          <Button variant="destructive" onClick={wipe} disabled={busy}><Trash2 className="size-4" /> {busy ? "Deleting…" : "Delete my career data"}</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">GitHub repositories you analyze are only visible to you.</p>
      </Section>
      <Section title="Session">
        <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/" }); }}><LogOut className="size-4" /> Sign out</Button>
      </Section>
    </div>
  );
}
