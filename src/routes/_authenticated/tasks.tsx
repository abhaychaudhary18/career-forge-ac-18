import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { generateStudyPlan } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { useIntelligence, useProfile, useTasks } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { Section, errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [{ title: "Tasks — CareerForge AI" }, { name: "description", content: "Preparation tasks and an AI study planner." }] }),
  component: TasksPage,
});

function TasksPage() {
  const { data: tasks } = useTasks();
  const { data: profile } = useProfile();
  const { data: intel } = useIntelligence();
  const qc = useQueryClient();
  const plan = useServerFn(generateStudyPlan);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(120);
  const [busy, setBusy] = useState(false);
  const [study, setStudy] = useState<Awaited<ReturnType<typeof plan>> | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["tasks"] });

  async function add() {
    if (!title.trim()) return;
    const { error } = await supabase.from("tasks").insert({ title: title.trim(), source: "manual" });
    if (error) return void toast.error(errMsg(error));
    setTitle(""); refresh();
  }
  async function toggle(id: string, done: boolean) {
    await supabase.from("tasks").update({ done }).eq("id", id);
    if (done && profile) await supabase.from("profiles").update({ xp: (profile.xp ?? 0) + 10 }).eq("id", profile.id);
    refresh(); qc.invalidateQueries({ queryKey: ["profile"] });
  }
  async function remove(id: string) { await supabase.from("tasks").delete().eq("id", id); refresh(); }
  async function makePlan() {
    setBusy(true);
    try {
      const weak = (intel?.weakness ?? []).sort((a, b) => Number(b["weight"]) - Number(a["weight"])).slice(0, 6).map((w) => String(w["topic"]));
      setStudy(await plan({ data: { minutes, weakTopics: weak, targetRole: profile?.target_role ?? "Software Engineer" } }));
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  }
  async function addBlocks() {
    if (!study) return;
    await supabase.from("tasks").insert(study.blocks.map((b) => ({ title: `${b.title} (${b.minutes} min)`, description: b.detail, category: b.category, source: "study-plan" })));
    toast.success("Plan added to tasks"); refresh();
  }

  const list = tasks ?? [];
  return (
    <div className="space-y-6">
      <PageHeader title="Tasks & Study Planner" description={`${list.filter((t) => t.done).length}/${list.length} done · ${profile?.xp ?? 0} XP`} />
      <div className="grid gap-4 lg:grid-cols-5">
        <Section title="Your tasks" className="lg:col-span-3">
          <div className="mb-3 flex gap-2"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task…" onKeyDown={(e) => e.key === "Enter" && add()} /><Button onClick={add}>Add</Button></div>
          {!list.length && <p className="text-sm text-muted-foreground">No tasks yet. Analyses and roadmaps add tasks automatically.</p>}
          <div className="divide-y divide-border">
            {list.map((t) => (
              <div key={t.id} className="flex items-start gap-3 py-2">
                <Checkbox checked={t.done} onCheckedChange={(v) => toggle(t.id, !!v)} className="mt-0.5" />
                <div className="flex-1"><p className={t.done ? "text-sm text-muted-foreground line-through" : "text-sm"}>{t.title}</p>{t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}</div>
                {t.source && <Badge variant="outline" className="text-[10px]">{t.source}</Badge>}
                <button onClick={() => remove(t.id)} aria-label="Delete task"><Trash2 className="size-4 text-muted-foreground hover:text-destructive" /></button>
              </div>
            ))}
          </div>
        </Section>
        <Section title="AI study planner" className="lg:col-span-2">
          <p className="mb-2 text-sm text-muted-foreground">How much time do you have today?</p>
          <div className="mb-3 flex gap-2">
            {[30, 60, 120, 240].map((m) => <Button key={m} size="sm" variant={minutes === m ? "default" : "outline"} onClick={() => setMinutes(m)}>{m >= 60 ? `${m / 60}h` : `${m}m`}</Button>)}
          </div>
          <Button onClick={makePlan} disabled={busy}>{busy ? "Planning…" : "Plan my session"}</Button>
          {study && (
            <div className="mt-4 space-y-2">
              <p className="text-sm">{study.summary}</p>
              {study.blocks.map((b, i) => <div key={i} className="rounded-lg border border-border p-2 text-sm"><span className="text-accent">{b.minutes}m</span> · {b.title}<p className="text-xs text-muted-foreground">{b.detail}</p></div>)}
              <Button size="sm" variant="outline" onClick={addBlocks}>Add to tasks</Button>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
