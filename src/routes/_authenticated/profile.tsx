import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { Chips, errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CareerForge AI" },
      { name: "description", content: "Your target role, skills and links used across CareerForge AI." },
    ],
  }),
  component: ProfilePage,
});

const FIELDS = [
  ["name", "Full name"],
  ["target_role", "Target role (used for job matching)"],
  ["experience_level", "Experience level"],
  ["location", "Location"],
  ["phone", "Phone"],
  ["github_username", "GitHub username"],
  ["linkedin_url", "LinkedIn URL"],
  ["portfolio_url", "Portfolio URL"],
] as const;

type Form = Record<(typeof FIELDS)[number][0], string> & { skills: string };

function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const qc = useQueryClient();
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile && !form) {
      const f = Object.fromEntries(FIELDS.map(([k]) => [k, String(profile[k] ?? "")])) as Form;
      f.skills = (profile.skills ?? []).join(", ");
      setForm(f);
    }
  }, [profile, form]);

  async function save() {
    if (!form || !profile) return;
    setSaving(true);
    const { skills, ...rest } = form;
    const { error } = await supabase
      .from("profiles")
      .update({ ...rest, skills: skills.split(",").map((s) => s.trim()).filter(Boolean) })
      .eq("id", profile.id);
    setSaving(false);
    if (error) return toast.error(errMsg(error));
    toast.success("Profile saved");
    qc.invalidateQueries();
  }

  if (isLoading || !form) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="This information drives job matching, interviews and your roadmap." />
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        {FIELDS.map(([k, label]) => (
          <div key={k} className="space-y-1.5">
            <Label htmlFor={k}>{label}</Label>
            <Input id={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="skills">Skills (comma separated — auto-filled from your resume)</Label>
          <Input id="skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <div className="pt-2"><Chips items={form.skills.split(",").map((s) => s.trim()).filter(Boolean)} /></div>
        </div>
        <div className="sm:col-span-2"><Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button></div>
      </div>
    </div>
  );
}
